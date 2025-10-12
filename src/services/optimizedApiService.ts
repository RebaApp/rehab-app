import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiResponse, PaginatedResponse, Center, Article, User, Booking, CacheItem } from '../types';

interface CacheConfig {
  ttl: number; // Time to live в миллисекундах
  maxSize: number; // Максимальный размер кэша
  strategy: 'memory' | 'disk' | 'hybrid';
}

interface RequestConfig {
  timeout: number;
  retries: number;
  retryDelay: number;
  cacheEnabled: boolean;
}

class OptimizedApiService {
  private baseURL: string;
  private cache: Map<string, CacheItem<unknown>>;
  private cacheConfig: CacheConfig;
  private requestConfig: RequestConfig;
  private requestQueue: Map<string, Promise<ApiResponse<unknown>>>;

  constructor() {
    this.baseURL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001/api';
    this.cache = new Map();
    this.requestQueue = new Map();
    
    this.cacheConfig = {
      ttl: 5 * 60 * 1000, // 5 минут
      maxSize: 100, // Максимум 100 элементов в кэше
      strategy: 'hybrid'
    };
    
    this.requestConfig = {
      timeout: 10000, // 10 секунд
      retries: 3,
      retryDelay: 1000, // 1 секунда
      cacheEnabled: true
    };
  }

  // === CACHE MANAGEMENT ===
  private setCache<T>(key: string, data: T, ttl: number = this.cacheConfig.ttl): void {
    // Проверяем размер кэша
    if (this.cache.size >= this.cacheConfig.maxSize) {
      this.evictOldestCache();
    }

    const cacheData: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl
    };
    
    this.cache.set(key, cacheData);
    
    // Сохраняем в AsyncStorage если стратегия hybrid или disk
    if (this.cacheConfig.strategy === 'hybrid' || this.cacheConfig.strategy === 'disk') {
      this.saveToDisk(key, cacheData);
    }
  }

  private async getCache<T>(key: string): Promise<T | null> {
    // Сначала проверяем память
    if (this.cacheConfig.strategy === 'memory' || this.cacheConfig.strategy === 'hybrid') {
      const cached = this.cache.get(key);
      if (cached && !this.isExpired(cached)) {
        return cached.data as T;
      }
    }
    
    // Если не найдено в памяти, проверяем диск
    if (this.cacheConfig.strategy === 'disk' || this.cacheConfig.strategy === 'hybrid') {
      const diskCached = await this.getFromDisk<T>(key);
      if (diskCached && !this.isExpired(diskCached)) {
        // Восстанавливаем в память
        this.cache.set(key, diskCached);
        return diskCached.data;
      }
    }
    
    return null;
  }

  private isExpired(cached: CacheItem<unknown>): boolean {
    return Date.now() - cached.timestamp > cached.ttl;
  }

  private evictOldestCache(): void {
    let oldestKey = '';
    let oldestTime = Date.now();
    
    for (const [key, value] of this.cache.entries()) {
      if (value.timestamp < oldestTime) {
        oldestTime = value.timestamp;
        oldestKey = key;
      }
    }
    
    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  private async saveToDisk<T>(key: string, data: CacheItem<T>): Promise<void> {
    try {
      await AsyncStorage.setItem(`api_cache_${key}`, JSON.stringify(data));
    } catch {
      // В production можно логировать ошибки в сервис аналитики
      // console.warn('Failed to save cache to disk:', error);
    }
  }

  private async getFromDisk<T>(key: string): Promise<CacheItem<T> | null> {
    try {
      const data = await AsyncStorage.getItem(`api_cache_${key}`);
      return data ? JSON.parse(data) : null;
    } catch {
      // В production можно логировать ошибки в сервис аналитики
      // console.warn('Failed to get cache from disk:', error);
      return null;
    }
  }

  private clearCache(pattern?: string): void {
    if (pattern) {
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
  }

  // === REQUEST QUEUE MANAGEMENT ===
  private getRequestKey(endpoint: string, options: RequestInit): string {
    return `${endpoint}_${JSON.stringify(options)}`;
  }

  private async queueRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const requestKey = this.getRequestKey(endpoint, options);
    
    // Если запрос уже выполняется, возвращаем существующий Promise
    if (this.requestQueue.has(requestKey)) {
      return this.requestQueue.get(requestKey) as Promise<ApiResponse<T>>;
    }
    
    // Создаем новый запрос
    const requestPromise = this.executeRequest<T>(endpoint, options);
    this.requestQueue.set(requestKey, requestPromise);
    
    try {
      const result = await requestPromise;
      return result;
    } finally {
      // Удаляем из очереди после завершения
      this.requestQueue.delete(requestKey);
    }
  }

  // === HTTP METHODS ===
  private async executeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    for (let attempt = 1; attempt <= this.requestConfig.retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.requestConfig.timeout);
        
        const response = await fetch(url, {
          ...config,
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return { success: true, data };
      } catch (error) {
        // В production можно логировать ошибки в сервис аналитики
        // console.error(`API request failed (attempt ${attempt}):`, error);
        
        if (attempt === this.requestConfig.retries) {
          return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          };
        }
        
        // Exponential backoff
        await new Promise(resolve => 
          setTimeout(resolve, this.requestConfig.retryDelay * Math.pow(2, attempt - 1))
        );
      }
    }

    return { success: false, error: 'Max retries exceeded' };
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    return this.queueRequest<T>(endpoint, options);
  }

  // === CENTERS API ===
  async getCenters(filters: Record<string, string | number | boolean> = {}): Promise<ApiResponse<PaginatedResponse<Center>>> {
    const cacheKey = `centers_${JSON.stringify(filters)}`;
    
    if (this.requestConfig.cacheEnabled) {
      const cached = await this.getCache<PaginatedResponse<Center>>(cacheKey);
      if (cached) {
        return { success: true, data: cached };
      }
    }

    const queryParams = new URLSearchParams(filters as Record<string, string>).toString();
    const endpoint = `/centers${queryParams ? `?${queryParams}` : ''}`;
    
    const result = await this.request<PaginatedResponse<Center>>(endpoint);
    
    if (result.success && result.data && this.requestConfig.cacheEnabled) {
      this.setCache(cacheKey, result.data);
    }

    return result;
  }

  async getCenterById(id: string): Promise<ApiResponse<Center>> {
    const cacheKey = `center_${id}`;
    
    if (this.requestConfig.cacheEnabled) {
      const cached = await this.getCache<Center>(cacheKey);
      if (cached) {
        return { success: true, data: cached };
      }
    }

    const result = await this.request<Center>(`/centers/${id}`);
    
    if (result.success && result.data && this.requestConfig.cacheEnabled) {
      this.setCache(cacheKey, result.data);
    }

    return result;
  }

  async createCenter(centerData: Partial<Center>): Promise<ApiResponse<Center>> {
    const result = await this.request<Center>('/centers', {
      method: 'POST',
      body: JSON.stringify(centerData),
    });

    if (result.success) {
      this.clearCache('centers');
    }

    return result;
  }

  async updateCenter(id: string, centerData: Partial<Center>): Promise<ApiResponse<Center>> {
    const result = await this.request<Center>(`/centers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(centerData),
    });

    if (result.success) {
      this.clearCache('centers');
      this.clearCache(`center_${id}`);
    }

    return result;
  }

  async deleteCenter(id: string): Promise<ApiResponse<void>> {
    const result = await this.request<void>(`/centers/${id}`, {
      method: 'DELETE',
    });

    if (result.success) {
      this.clearCache('centers');
      this.clearCache(`center_${id}`);
    }

    return result;
  }

  // === ARTICLES API ===
  async getArticles(filters: Record<string, string | number | boolean> = {}): Promise<ApiResponse<Article[]>> {
    const cacheKey = `articles_${JSON.stringify(filters)}`;
    
    if (this.requestConfig.cacheEnabled) {
      const cached = await this.getCache<Article[]>(cacheKey);
      if (cached) {
        return { success: true, data: cached };
      }
    }

    const queryParams = new URLSearchParams(filters as Record<string, string>).toString();
    const endpoint = `/articles${queryParams ? `?${queryParams}` : ''}`;
    
    const result = await this.request<Article[]>(endpoint);
    
    if (result.success && result.data && this.requestConfig.cacheEnabled) {
      this.setCache(cacheKey, result.data);
    }

    return result;
  }

  async getArticleById(id: string): Promise<ApiResponse<Article>> {
    const cacheKey = `article_${id}`;
    
    if (this.requestConfig.cacheEnabled) {
      const cached = await this.getCache<Article>(cacheKey);
      if (cached) {
        return { success: true, data: cached };
      }
    }

    const result = await this.request<Article>(`/articles/${id}`);
    
    if (result.success && result.data && this.requestConfig.cacheEnabled) {
      this.setCache(cacheKey, result.data);
    }

    return result;
  }

  // === AUTH API ===
  async login(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    const result = await this.request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (result.success && result.data) {
      await AsyncStorage.setItem('auth_token', result.data.token);
    }

    return result;
  }

  async register(userData: Partial<User>): Promise<ApiResponse<{ user: User; token: string }>> {
    const result = await this.request<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (result.success && result.data) {
      await AsyncStorage.setItem('auth_token', result.data.token);
    }

    return result;
  }

  async logout(): Promise<ApiResponse<void>> {
    await AsyncStorage.removeItem('auth_token');
    this.clearCache();
    return { success: true };
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    const token = await AsyncStorage.getItem('auth_token');
    if (!token) {
      return { success: false, error: 'No token found' };
    }

    const result = await this.request<User>('/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return result;
  }

  // === BOOKINGS API ===
  async getBookings(): Promise<ApiResponse<Booking[]>> {
    const token = await AsyncStorage.getItem('auth_token');
    if (!token) {
      return { success: false, error: 'No token found' };
    }

    const result = await this.request<Booking[]>('/bookings', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return result;
  }

  async createBooking(bookingData: Partial<Booking>): Promise<ApiResponse<Booking>> {
    const token = await AsyncStorage.getItem('auth_token');
    if (!token) {
      return { success: false, error: 'No token found' };
    }

    const result = await this.request<Booking>('/bookings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(bookingData),
    });

    return result;
  }

  // === UTILITY METHODS ===
  async isOnline(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`${this.baseURL}/health`, {
        method: 'HEAD',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      return response.ok;
    } catch {
      return false;
    }
  }

  async syncData(): Promise<void> {
    const promises = [
      this.getCenters(),
      this.getArticles(),
    ];

    await Promise.allSettled(promises);
  }

  // === CONFIGURATION METHODS ===
  setCacheConfig(config: Partial<CacheConfig>): void {
    this.cacheConfig = { ...this.cacheConfig, ...config };
  }

  setRequestConfig(config: Partial<RequestConfig>): void {
    this.requestConfig = { ...this.requestConfig, ...config };
  }

  getCacheStats(): { size: number; maxSize: number; hitRate: number } {
    return {
      size: this.cache.size,
      maxSize: this.cacheConfig.maxSize,
      hitRate: 0, // Можно добавить отслеживание hit rate
    };
  }

  clearAllCache(): void {
    this.clearCache();
  }
}

export const optimizedApiService = new OptimizedApiService();
export default optimizedApiService;
