import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppStore, Center, User, ApiResponse, Article } from '../types';
import { ARTICLES } from '../utils/constants';
import { 
  NormalizedState, 
  normalizeArray, 
  updateEntity, 
  addEntity, 
  removeEntity,
  selectEntityById,
  selectAllEntities,
  CacheState,
  createCacheState,
  isCacheStale
} from '../utils/normalization';

interface OptimizedAppStore extends Omit<AppStore, 'centers' | 'favorites'> {
  // Нормализованное состояние
  centers: NormalizedState<Center>;
  articles: NormalizedState<Article>;
  favorites: NormalizedState<{ id: string; centerId: string; userId: string; createdAt: string }>;
  
  // Кэш состояние
  centersCache: CacheState<Center>;
  articlesCache: CacheState<Article>;
  
  // Оптимизированные селекторы
  getCenterById: (id: string) => Center | undefined;
  getCentersByIds: (ids: string[]) => Center[];
  getAllCenters: () => Center[];
  getFavoriteCenters: () => Center[];
  getFilteredCenters: () => Center[];
  getFilteredArticles: () => Article[];
  
  // Оптимизированные действия
  setCenters: (centers: Center[]) => void;
  updateCenter: (id: string, updates: Partial<Center>) => void;
  addCenter: (center: Center) => void;
  removeCenter: (id: string) => void;
  
  setArticles: (articles: Article[]) => void;
  updateArticle: (id: string, updates: Partial<Article>) => void;
  
  addFavorite: (centerId: string) => void;
  removeFavorite: (centerId: string) => void;
  isFavorite: (centerId: string) => boolean;
  
  // Кэш действия
  invalidateCentersCache: () => void;
  invalidateArticlesCache: () => void;
  refreshCentersIfStale: () => Promise<void>;
  refreshArticlesIfStale: () => Promise<void>;
  
  // Совместимость с оригинальным store
  setFavorites: (favorites: Record<string, boolean>) => void;
  toggleFavorite: (centerId: string) => void;
}

const useOptimizedAppStore = create<OptimizedAppStore>()(
  persist(
    (set, get) => ({
      // === AUTH STATE ===
      user: null,
      isAuthenticated: false,
      authLoading: false,

      // === CENTERS STATE ===
      centers: { byId: {}, allIds: [] },
      centersLoading: false,
      centersError: null,
      lastCentersUpdate: null,

      // === ARTICLES STATE ===
      articles: { byId: {}, allIds: [] },
      articlesLoading: false,
      articlesError: null,
      lastArticlesUpdate: null,

      // === FAVORITES STATE ===
      favorites: { byId: {}, allIds: [] },
      favoritesLoading: false,

      // === CACHE STATE ===
      centersCache: createCacheState([]),
      articlesCache: createCacheState([]),

      // === UI STATE ===
      currentTab: 'home',
      searchQuery: '',
      articleQuery: '',
      filtersVisible: false,
      settingsVisible: false,
      selectedCenter: null,
      articleOpen: null,
      isOnline: true,
      refreshing: false,

      // === FILTERS STATE ===
      filters: {
        cities: [],
        types: [],
        minPrice: '',
        maxPrice: '',
        minRating: 0,
        sortBy: 'rating',
        sortOrder: 'desc'
      },

      // === AUTH ACTIONS ===
      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user 
      }),

      setAuthLoading: (loading) => set({ authLoading: loading }),

      login: async (email: string, _password: string): Promise<ApiResponse<User>> => {
        set({ authLoading: true });
        try {
          const mockUser: User = {
            id: `user_${Date.now()}`,
            email,
            name: email.split('@')[0],
            userType: 'USER',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          set({ 
            user: mockUser, 
            isAuthenticated: true, 
            authLoading: false 
          });
          
          return { success: true, data: mockUser };
        } catch {
          set({ authLoading: false });
          return { 
            success: false, 
            error: 'Login failed' 
          };
        }
      },

      register: async (userData: Partial<User>): Promise<ApiResponse<User>> => {
        set({ authLoading: true });
        try {
          const newUser: User = {
            id: `user_${Date.now()}`,
            email: userData.email || '',
            name: userData.name || '',
            userType: userData.userType || 'USER',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            ...userData
          };
          
          set({ 
            user: newUser, 
            isAuthenticated: true, 
            authLoading: false 
          });
          
          return { success: true, data: newUser };
        } catch {
          set({ authLoading: false });
          return { 
            success: false, 
            error: 'Registration failed' 
          };
        }
      },

      logout: () => set({ 
        user: null, 
        isAuthenticated: false,
        favorites: { byId: {}, allIds: [] },
        selectedCenter: null,
        articleOpen: null
      }),

      // === CENTERS ACTIONS ===
      setCenters: (centers) => {
        const normalized = normalizeArray(centers);
        const cache = createCacheState(centers);
        set({ 
          centers: normalized,
          centersCache: cache,
          lastCentersUpdate: Date.now() 
        });
      },

      updateCenter: (id, updates) => {
        const { centers } = get();
        const updated = updateEntity(centers, id, updates);
        set({ centers: updated });
      },

      addCenter: (center) => {
        const { centers } = get();
        const updated = addEntity(centers, center);
        set({ centers: updated });
      },

      removeCenter: (id) => {
        const { centers } = get();
        const updated = removeEntity(centers, id);
        set({ centers: updated });
      },

      setCentersLoading: (loading) => set({ centersLoading: loading }),

      setCentersError: (error) => set({ centersError: error }),

      loadCenters: async () => {
        set({ centersLoading: true, centersError: null });
        try {
          // Mock данные центров
          const mockCenters: Center[] = [
            {
              id: '1',
              name: 'Центр Возрождение',
              city: 'Москва',
              address: 'ул. Примерная, д. 1',
              phone: '+7 (495) 123-45-67',
              email: 'info@center1.ru',
              rating: 4.5,
              reviewsCount: 25,
              verified: true,
              photos: ['https://via.placeholder.com/300x200'],
              services: ['Консультация', 'Детокс', 'Реабилитация'],
              description: 'Профессиональная помощь в борьбе с зависимостями',
              price: '50 000 ₽/месяц',
              coordinates: { latitude: 55.7558, longitude: 37.6176 },
              workingHours: 'Пн-Вс: 9:00-21:00',
              capacity: 50,
              yearFounded: 2010,
              license: 'ЛО-77-01-123456',
              descriptionFull: 'Полное описание центра',
              methods: ['12 шагов', 'КПТ'],
              reviews: []
            }
          ];
          
          get().setCenters(mockCenters);
          set({ centersLoading: false });
        } catch {
          set({ 
            centersLoading: false,
            centersError: 'Failed to load centers'
          });
        }
      },

      // === ARTICLES ACTIONS ===
      setArticles: (articles) => {
        const normalized = normalizeArray(articles);
        const cache = createCacheState(articles);
        set({ 
          articles: normalized,
          articlesCache: cache 
        });
      },

      updateArticle: (id, updates) => {
        const { articles } = get();
        const updated = updateEntity(articles, id, updates);
        set({ articles: updated });
      },

      // === FAVORITES ACTIONS ===
      addFavorite: (centerId) => {
        const { favorites, user } = get();
        if (!user) return;
        
        const favorite = {
          id: `fav_${user.id}_${centerId}`,
          centerId,
          userId: user.id,
          createdAt: new Date().toISOString()
        };
        
        const updated = addEntity(favorites, favorite);
        set({ favorites: updated });
      },

      removeFavorite: (centerId) => {
        const { favorites, user } = get();
        if (!user) return;
        
        const favoriteId = `fav_${user.id}_${centerId}`;
        const updated = removeEntity(favorites, favoriteId);
        set({ favorites: updated });
      },

      isFavorite: (centerId) => {
        const { favorites, user } = get();
        if (!user) return false;
        
        const favoriteId = `fav_${user.id}_${centerId}`;
        return !!favorites.byId[favoriteId];
      },

      // === UI ACTIONS ===
      setCurrentTab: (tab) => set({ currentTab: tab }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setArticleQuery: (query) => set({ articleQuery: query }),
      setFiltersVisible: (visible) => set({ filtersVisible: visible }),
      setSettingsVisible: (visible) => set({ settingsVisible: visible }),
      setSelectedCenter: (center) => set({ selectedCenter: center }),
      setArticleOpen: (article) => set({ articleOpen: article }),
      setIsOnline: (online) => set({ isOnline: online }),
      setRefreshing: (refreshing) => set({ refreshing: refreshing }),

      // === FILTER ACTIONS ===
      setFilters: (newFilters) => {
        const { filters } = get();
        set({ filters: { ...filters, ...newFilters } });
      },

      resetFilters: () => set({
        filters: {
          cities: [],
          types: [],
          minPrice: '',
          maxPrice: '',
          minRating: 0,
          sortBy: 'rating',
          sortOrder: 'desc'
        }
      }),

      applyFilters: () => {
        const { centers, searchQuery, filters } = get();
        let filtered = selectAllEntities(centers);

        // Поиск по тексту
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filtered = filtered.filter(center =>
            center.name.toLowerCase().includes(query) ||
            center.city.toLowerCase().includes(query) ||
            center.description.toLowerCase().includes(query)
          );
        }

        // Фильтр по городам
        if (filters.cities.length > 0) {
          filtered = filtered.filter(center =>
            filters.cities.includes(center.city)
          );
        }

        // Фильтр по типам услуг
        if (filters.types.length > 0) {
          filtered = filtered.filter(center =>
            filters.types.some(type => center.services.includes(type))
          );
        }

        // Фильтр по цене
        if (filters.minPrice) {
          const minPrice = parseFloat(filters.minPrice);
          filtered = filtered.filter(center => {
            const price = parseFloat(center.price.replace(/\D/g, ''));
            return price >= minPrice;
          });
        }

        if (filters.maxPrice) {
          const maxPrice = parseFloat(filters.maxPrice);
          filtered = filtered.filter(center => {
            const price = parseFloat(center.price.replace(/\D/g, ''));
            return price <= maxPrice;
          });
        }

        // Фильтр по рейтингу
        if (filters.minRating > 0) {
          filtered = filtered.filter(center => center.rating >= filters.minRating);
        }

        // Сортировка
        filtered.sort((a, b) => {
          let comparison = 0;
          switch (filters.sortBy) {
            case 'rating':
              comparison = a.rating - b.rating;
              break;
            case 'price': {
              const priceA = parseFloat(a.price.replace(/\D/g, ''));
              const priceB = parseFloat(b.price.replace(/\D/g, ''));
              comparison = priceA - priceB;
              break;
            }
            case 'distance':
              comparison = (a.distance || 0) - (b.distance || 0);
              break;
          }
          return filters.sortOrder === 'desc' ? -comparison : comparison;
        });

        return filtered;
      },

      // === OPTIMIZED SELECTORS ===
      getCenterById: (id) => selectEntityById(get().centers, id),
      getCentersByIds: (ids) => selectAllEntities(get().centers).filter(center => ids.includes(center.id)),
      getAllCenters: () => selectAllEntities(get().centers),
      getFavoriteCenters: () => {
        const { favorites, centers, user } = get();
        if (!user) return [];
        
        const favoriteIds = Object.values(favorites.byId)
          .filter(fav => fav.userId === user.id)
          .map(fav => fav.centerId);
        
        return selectAllEntities(centers).filter(center => favoriteIds.includes(center.id));
      },
      getFilteredCenters: () => get().applyFilters(),
      getFilteredArticles: () => {
        const { articles, articleQuery } = get();
        const allArticles = selectAllEntities(articles);
        
        if (!articleQuery) return allArticles;
        
        const query = articleQuery.toLowerCase();
        return allArticles.filter(article =>
          article.title.toLowerCase().includes(query) ||
          article.excerpt.toLowerCase().includes(query) ||
          (article.body || '').toLowerCase().includes(query)
        );
      },

      // === CACHE ACTIONS ===
      invalidateCentersCache: () => {
        const { centersCache } = get();
        set({ 
          centersCache: { 
            ...centersCache, 
            isStale: true 
          } 
        });
      },

      invalidateArticlesCache: () => {
        const { articlesCache } = get();
        set({ 
          articlesCache: { 
            ...articlesCache, 
            isStale: true 
          } 
        });
      },

      refreshCentersIfStale: async () => {
        const { centersCache } = get();
        if (isCacheStale(centersCache)) {
          await get().loadCenters();
        }
      },

      refreshArticlesIfStale: async () => {
        const { articlesCache } = get();
        if (isCacheStale(articlesCache)) {
          // Здесь будет загрузка статей
          const normalized = normalizeArray(ARTICLES);
          const cache = createCacheState(ARTICLES);
          set({ 
            articles: normalized,
            articlesCache: cache 
          });
        }
      },
      
      // === COMPATIBILITY METHODS ===
      setFavorites: (favorites) => {
        const normalized = normalizeArray(
          Object.entries(favorites)
            .filter(([_, isFavorite]) => isFavorite)
            .map(([centerId, _]) => ({
              id: `fav_${centerId}`,
              centerId,
              userId: get().user?.id || '',
              createdAt: new Date().toISOString()
            }))
        );
        set({ favorites: normalized });
      },
      
      toggleFavorite: (centerId) => {
        const { isFavorite } = get();
        if (isFavorite(centerId)) {
          get().removeFavorite(centerId);
        } else {
          get().addFavorite(centerId);
        }
      }
    }),
    {
      name: 'reba-optimized-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        favorites: state.favorites,
        filters: state.filters,
        centers: state.centers,
        articles: state.articles,
        lastCentersUpdate: state.lastCentersUpdate
      })
    }
  )
);

export default useOptimizedAppStore;
