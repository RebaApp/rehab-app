import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiResponse, PaginatedResponse, Center, Article, User, Booking, CacheItem } from '../types';

class ApiService {
  private baseURL: string;
  private cache: Map<string, CacheItem<unknown>>;
  private cacheTimeout: number;
  private retries: number;

  constructor() {
    this.baseURL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001/api';
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 минут
    this.retries = 3;
  }

  // === CACHE MANAGEMENT ===
  private setCache<T>(key: string, data: T, ttl: number = this.cacheTimeout): void {
    const cacheData: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl
    };
    this.cache.set(key, cacheData);
  }

  private getCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > cached.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return cached.data as T;
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

  // === HTTP METHODS ===
  private async request<T>(
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

    for (let attempt = 1; attempt <= this.retries; attempt++) {
      try {
        const response = await fetch(url, config);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return { success: true, data };
      } catch (error) {
        // В production можно логировать ошибки в сервис аналитики
        // console.error(`API request failed (attempt ${attempt}):`, error);
        
        if (attempt === this.retries) {
          return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          };
        }
        
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }

    return { success: false, error: 'Max retries exceeded' };
  }

  // === CENTERS API ===
  async getCenters(filters: Record<string, string | number | boolean> = {}): Promise<ApiResponse<PaginatedResponse<Center>>> {
    const cacheKey = `centers_${JSON.stringify(filters)}`;
    const cached = this.getCache<PaginatedResponse<Center>>(cacheKey);
    
    if (cached) {
      return { success: true, data: cached };
    }

    const queryParams = new URLSearchParams(filters as Record<string, string>).toString();
    const endpoint = `/centers${queryParams ? `?${queryParams}` : ''}`;
    
    const result = await this.request<PaginatedResponse<Center>>(endpoint);
    
    if (result.success && result.data) {
      this.setCache(cacheKey, result.data);
    }

    return result;
  }

  async getCenterById(id: string): Promise<ApiResponse<Center>> {
    const cacheKey = `center_${id}`;
    const cached = this.getCache<Center>(cacheKey);
    
    if (cached) {
      return { success: true, data: cached };
    }

    const result = await this.request<Center>(`/centers/${id}`);
    
    if (result.success && result.data) {
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
    const cached = this.getCache<Article[]>(cacheKey);
    
    if (cached) {
      return { success: true, data: cached };
    }

    const queryParams = new URLSearchParams(filters as Record<string, string>).toString();
    const endpoint = `/articles${queryParams ? `?${queryParams}` : ''}`;
    
    const result = await this.request<Article[]>(endpoint);
    
    if (result.success && result.data) {
      this.setCache(cacheKey, result.data);
    }

    return result;
  }

  async getArticleById(id: string): Promise<ApiResponse<Article>> {
    const cacheKey = `article_${id}`;
    const cached = this.getCache<Article>(cacheKey);
    
    if (cached) {
      return { success: true, data: cached };
    }

    const result = await this.request<Article>(`/articles/${id}`);
    
    if (result.success && result.data) {
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
      // Store token
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
      // Store token
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
    // Sync all cached data
    const promises = [
      this.getCenters(),
      this.getArticles(),
    ];

    await Promise.allSettled(promises);
  }

  // === MOCK DATA FOR DEVELOPMENT ===
  async getMockCenters(): Promise<ApiResponse<Center[]>> {
    // This would return mock data when API is not available
    return { success: true, data: [] };
  }

  async getMockArticles(): Promise<ApiResponse<Article[]>> {
    // This would return mock data when API is not available
    return { success: true, data: [] };
  }
}

export const apiService = new ApiService();
export default apiService;
