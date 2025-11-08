import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiResponse, PaginatedResponse, Center, Article, User, Booking, CacheItem } from '../types';

class ApiService {
  private baseURL: string;
  private cache: Map<string, CacheItem<unknown>>;
  private cacheTimeout: number;
  private retries: number;

  constructor() {
    this.baseURL = process.env.EXPO_PUBLIC_API_URL || 'https://reba-api.loca.lt/api';
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
    options: RequestInit = {},
    requireAuth: boolean = false
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Получаем токен если требуется авторизация
    let token: string | null = null;
    if (requireAuth) {
      token = await AsyncStorage.getItem('auth_token');
      if (!token) {
        return { success: false, error: 'Authentication required' };
      }
    }

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    for (let attempt = 1; attempt <= this.retries; attempt++) {
      try {
        const response = await fetch(url, config);
        
        if (!response.ok) {
          // Если 401 - токен невалидный, удаляем его
          if (response.status === 401) {
            await AsyncStorage.removeItem('auth_token');
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return { success: true, data };
      } catch (error) {
        // Проверяем тип ошибки
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const isNetworkError = errorMessage.includes('Network request failed') || 
                              errorMessage.includes('Failed to fetch') ||
                              errorMessage.includes('fetch failed') ||
                              errorMessage.includes('NetworkError');
        
        // В development режиме не логируем сетевые ошибки как критические
        if (attempt === this.retries) {
          return {
            success: false,
            error: isNetworkError 
              ? 'Backend server is not available. Please start the server or check your network connection.'
              : errorMessage
          };
        }
        
        // Exponential backoff только для сетевых ошибок
        if (isNetworkError) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        } else {
          // Для других ошибок не повторяем
          return {
            success: false,
            error: errorMessage
          };
        }
      }
    }

    return { success: false, error: 'Max retries exceeded' };
  }

  // === CENTERS API ===
  async getCenters(filters: Record<string, string | number | boolean> = {}): Promise<ApiResponse<PaginatedResponse<Center> | { centers: Center[]; pagination: any }>> {
    const cacheKey = `centers_${JSON.stringify(filters)}`;
    const cached = this.getCache<PaginatedResponse<Center> | { centers: Center[]; pagination: any }>(cacheKey);
    
    if (cached) {
      return { success: true, data: cached };
    }

    const queryParams = new URLSearchParams(filters as Record<string, string>).toString();
    const endpoint = `/centers${queryParams ? `?${queryParams}` : ''}`;
    
    // Backend возвращает { centers: [...], pagination: {...} }
    const result = await this.request<{ centers: Center[]; pagination: any }>(endpoint);
    
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
    const result = await this.request<{ center: Center }>('/centers', {
      method: 'POST',
      body: JSON.stringify(centerData),
    }, true);

    if (result.success) {
      this.clearCache('centers');
      if (result.data) {
        return { success: true, data: result.data.center };
      }
    }

    return { success: false, error: result.error || 'Failed to create center' };
  }

  async updateCenter(id: string, centerData: Partial<Center>): Promise<ApiResponse<Center>> {
    const result = await this.request<{ center: Center }>(`/centers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(centerData),
    }, true);

    if (result.success) {
      this.clearCache('centers');
      this.clearCache(`center_${id}`);
      if (result.data) {
        return { success: true, data: result.data.center };
      }
    }

    return { success: false, error: result.error || 'Failed to update center' };
  }

  async deleteCenter(id: string): Promise<ApiResponse<void>> {
    const result = await this.request<{ message: string }>(`/centers/${id}`, {
      method: 'DELETE',
    }, true);

    if (result.success) {
      this.clearCache('centers');
      this.clearCache(`center_${id}`);
    }

    return result;
  }

  // Subscribe to center (pay for subscription)
  async subscribeToCenter(centerId: string, plan: '1month' | '6months' | '12months'): Promise<ApiResponse<Center>> {
    const result = await this.request<{ center: Center }>(`/centers/${centerId}/subscribe`, {
      method: 'POST',
      body: JSON.stringify({ plan }),
    }, true);

    if (result.success && result.data) {
      this.clearCache('centers');
      this.clearCache(`center_${centerId}`);
      return { success: true, data: result.data.center };
    }

    return { success: false, error: result.error || 'Failed to subscribe' };
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
    const result = await this.request<{ user: User }>('/auth/me', {}, true);
    
    if (result.success && result.data) {
      return { success: true, data: result.data.user };
    }
    
    return { success: false, error: result.error || 'Failed to get user' };
  }

  // Yandex OAuth sync
  async syncYandexUser(userData: {
    email: string;
    name: string;
    yandexId: string;
    avatar?: string;
    phone?: string;
  }): Promise<ApiResponse<{ user: User; token: string }>> {
    const result = await this.request<{ user: User; token: string }>('/auth/yandex', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (result.success && result.data) {
      // Сохраняем токен
      await AsyncStorage.setItem('auth_token', result.data.token);
    }

    return result;
  }

  // Get user profile
  async getUserProfile(): Promise<ApiResponse<User>> {
    const result = await this.request<User | { user: User }>('/users/profile', {}, true);
    
    if (result.success && result.data) {
      // Backend может вернуть { user: User } или просто User
      const userData = 'user' in result.data ? result.data.user : result.data;
      return { success: true, data: userData };
    }
    
    return { success: false, error: result.error || 'Failed to get profile' };
  }

  // Update user profile
  async updateProfile(profileData: {
    name?: string;
    phone?: string;
    age?: number;
    avatar?: string;
  }): Promise<ApiResponse<User>> {
    const result = await this.request<{ user: User }>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    }, true);

    if (result.success && result.data) {
      return { success: true, data: result.data.user };
    }

    return { success: false, error: result.error || 'Failed to update profile' };
  }

  // Get user's centers (for center owners)
  async getUserCenters(): Promise<ApiResponse<Center[]>> {
    const result = await this.request<{ centers: Center[] }>('/users/centers', {}, true);
    
    if (result.success && result.data) {
      // Преобразуем данные из backend формата
      const centersData = result.data.centers || [];
      const transformedCenters: Center[] = centersData.map((center: any) => {
        const photos = center.photos?.map((photo: any) => photo.url || photo) || [];
        const services = center.services?.map((service: any) => service.name || service) || [];
        const methods = center.methods?.map((method: any) => method.name || method) || [];
        
        return {
          id: center.id,
          name: center.name,
          city: center.city,
          address: center.address || '',
          phone: center.phone || '',
          email: center.email || '',
          website: center.website,
          rating: center.rating || 0,
          reviewsCount: center._count?.reviews || 0,
          verified: center.verified || false,
          moderationStatus: center.moderationStatus || 'PENDING',
          moderationComment: center.moderationComment,
          subscriptionStatus: center.subscriptionStatus || 'INACTIVE',
          subscriptionEndDate: center.subscriptionEndDate,
          subscriptionPlan: center.subscriptionPlan,
          photos: photos.length > 0 ? photos : (center.image ? [center.image] : []),
          services,
          description: center.description || '',
          descriptionFull: center.descriptionFull || center.description || '',
          price: center.price || '',
          coordinates: center.coordinates || (center.latitude && center.longitude ? {
            latitude: center.latitude,
            longitude: center.longitude
          } : { latitude: 0, longitude: 0 }),
          workingHours: center.workingHours || '',
          capacity: center.capacity || 0,
          yearFounded: center.yearFounded || 0,
          license: center.license || '',
          methods,
          reviews: [],
          createdAt: center.createdAt,
          updatedAt: center.updatedAt,
        } as Center;
      });
      
      return { success: true, data: transformedCenters };
    }
    
    return { success: false, error: result.error || 'Failed to get user centers' };
  }

  // === BOOKINGS API ===
  async getBookings(): Promise<ApiResponse<Booking[]>> {
    const result = await this.request<{ bookings: Booking[] }>('/users/bookings', {}, true);
    
    if (result.success && result.data) {
      return { success: true, data: result.data.bookings };
    }
    
    return { success: false, error: result.error || 'Failed to get bookings' };
  }

  async createBooking(bookingData: Partial<Booking>): Promise<ApiResponse<Booking>> {
    const result = await this.request<{ booking: Booking }>('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    }, true);

    if (result.success && result.data) {
      return { success: true, data: result.data.booking };
    }

    return { success: false, error: result.error || 'Failed to create booking' };
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
