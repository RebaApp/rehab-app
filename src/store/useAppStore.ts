import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppStore, Center, User, ApiResponse } from '../types';
import { ARTICLES } from '../utils/constants';

const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // === AUTH STATE ===
      user: null,
      isAuthenticated: false,
      authLoading: false,

      // === CENTERS STATE ===
      centers: [],
      centersLoading: false,
      centersError: null,
      lastCentersUpdate: null,

      // === FAVORITES STATE ===
      favorites: {},
      favoritesLoading: false,

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
          // Mock login - в реальном приложении здесь будет API вызов
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
        } catch (error) {
          set({ authLoading: false });
          return { 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown error' 
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
        } catch (error) {
          set({ authLoading: false });
          return { 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown error' 
          };
        }
      },

      logout: () => set({ 
        user: null, 
        isAuthenticated: false,
        favorites: {},
        selectedCenter: null,
        articleOpen: null
      }),

      // === CENTERS ACTIONS ===
      setCenters: (centers) => set({ 
        centers, 
        lastCentersUpdate: Date.now() 
      }),

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
          
          set({ 
            centers: mockCenters, 
            centersLoading: false,
            lastCentersUpdate: Date.now()
          });
        } catch (error) {
          set({ 
            centersLoading: false,
            centersError: error instanceof Error ? error.message : 'Failed to load centers'
          });
        }
      },

      // === FAVORITES ACTIONS ===
      setFavorites: (favorites) => set({ favorites }),

      toggleFavorite: (centerId: string) => {
        const { favorites } = get();
        const newFavorites = { ...favorites };
        if (newFavorites[centerId]) {
          delete newFavorites[centerId];
        } else {
          newFavorites[centerId] = true;
        }
        set({ favorites: newFavorites });
      },

      isFavorite: (centerId: string) => {
        const { favorites } = get();
        return !!favorites[centerId];
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
        let filtered = [...centers];

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

      // === COMPUTED VALUES ===
      getFilteredCenters: () => {
        return get().applyFilters();
      },

      getFavoriteCenters: () => {
        const { centers, favorites } = get();
        return centers.filter(center => favorites[center.id]);
      },

      getFilteredArticles: () => {
        const { articleQuery } = get();
        if (!articleQuery) return ARTICLES;
        
        const query = articleQuery.toLowerCase();
        return ARTICLES.filter(article =>
          article.title.toLowerCase().includes(query) ||
          article.excerpt.toLowerCase().includes(query) ||
          (article.body || '').toLowerCase().includes(query)
        );
      }
    }),
    {
      name: 'reba-app-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        favorites: state.favorites,
        filters: state.filters,
        centers: state.centers,
        lastCentersUpdate: state.lastCentersUpdate
      })
    }
  )
);

export default useAppStore;
