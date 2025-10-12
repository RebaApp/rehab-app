import { create } from 'zustand';
import { AppStore, Center, User, Article } from '../types';
import { ARTICLES } from '../utils/constants';

// Веб-совместимый store с оригинальными данными
const useAppStore = create<AppStore>((set, get) => ({
      // === AUTH STATE ===
      user: null,
      isAuthenticated: false,
      authLoading: false,

      // === CENTERS STATE ===
      centers: [],
      centersLoading: false,
      centersError: null,
      lastCentersUpdate: null,

      // === ARTICLES STATE ===
      articles: ARTICLES, // Начинаем с базовых статей
      articlesLoading: false,
      articlesError: null,
      lastArticlesUpdate: null,

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
  shimmer: new (require('react-native').Animated).Value(0),

      // === FILTERS STATE ===
      filters: {
        cities: [],
        types: [],
        minPrice: '',
        maxPrice: '',
        minRating: 0,
    sortBy: 'rating' as const,
    sortOrder: 'desc' as const,
      },

      // === AUTH ACTIONS ===
      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user 
      }),

      setAuthLoading: (loading) => set({ authLoading: loading }),

  login: async (email: string, _password: string) => {
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

  register: async (userData: Partial<User>) => {
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

  logout: () => {
    set({ 
        user: null, 
        isAuthenticated: false,
      favorites: {}
    });
  },

  loadUser: async () => {
    // Mock user loading
    return;
  },

      // === CENTERS ACTIONS ===
  setCenters: (centers) => set({ centers }),
      setCentersLoading: (loading) => set({ centersLoading: loading }),
      setCentersError: (error) => set({ centersError: error }),

      loadCenters: async () => {
        set({ centersLoading: true, centersError: null });
        try {
      // Mock API call with realistic delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Оригинальные данные центров с вашими изображениями
          const mockCenters: Center[] = [
            {
              id: '1',
          name: 'Центр "Новая Жизнь"',
              city: 'Москва',
          address: 'ул. Ленина, 10',
              phone: '+7 (495) 123-45-67',
          email: 'info@newlife.ru',
          description: 'Современный центр реабилитации с комплексным подходом к лечению зависимостей.',
          services: ['Детокс', 'Психотерапия', 'Групповая терапия'],
          photos: [require("../../assets/images/centers/center1.jpg")],
              rating: 4.5,
          reviewsCount: 120,
          price: 'от 50,000 ₽/месяц',
              verified: true,
              coordinates: { latitude: 55.7558, longitude: 37.6176 },
              capacity: 50,
              yearFounded: 2010,
          workingHours: '24/7',
          license: 'Лицензия №123456',
          descriptionFull: 'Полное описание центра реабилитации',
          methods: ['Когнитивно-поведенческая терапия', 'Групповая терапия'],
          reviews: [],
        },
        {
          id: '2',
          name: 'Клиника "Возрождение"',
          city: 'Санкт-Петербург',
          address: 'пр. Невский, 100',
          phone: '+7 (812) 987-65-43',
          email: 'info@vozrozhdenie.ru',
          description: 'Профессиональная помощь в преодолении зависимостей с индивидуальным подходом.',
          services: ['Медикаментозное лечение', 'Психотерапия', 'Семейная терапия'],
          photos: [require("../../assets/images/centers/center2.jpg")],
          rating: 4.8,
          reviewsCount: 89,
          price: 'от 45,000 ₽/месяц',
          verified: true,
          coordinates: { latitude: 59.9311, longitude: 30.3609 },
          capacity: 30,
          yearFounded: 2015,
          workingHours: '8:00 - 20:00',
          license: 'Лицензия №789012',
          descriptionFull: 'Полное описание клиники реабилитации',
          methods: ['Медикаментозное лечение', 'Семейная терапия'],
          reviews: [],
        },
        {
          id: '3',
          name: 'Центр "Путь к Свободе"',
          city: 'Казань',
          address: 'ул. Баумана, 25',
          phone: '+7 (843) 555-12-34',
          email: 'info@putksvobode.ru',
          description: 'Специализированный центр для лечения алкогольной зависимости.',
          services: ['Детокс', 'Психотерапия', 'Трудовая терапия'],
          photos: [require("../../assets/images/centers/center3.jpg")],
          rating: 4.3,
          reviewsCount: 67,
          price: 'от 40,000 ₽/месяц',
          verified: true,
          coordinates: { latitude: 55.8304, longitude: 49.0661 },
          capacity: 40,
          yearFounded: 2012,
          workingHours: 'Пн-Пт: 9:00-18:00',
          license: 'Лицензия №345678',
          descriptionFull: 'Полное описание центра',
          methods: ['12 шагов', 'Трудовая терапия'],
          reviews: [],
        },
        {
          id: '4',
          name: 'Клиника "Гармония"',
          city: 'Екатеринбург',
          address: 'ул. Малышева, 15',
          phone: '+7 (343) 777-88-99',
          email: 'info@garmoniya.ru',
          description: 'Комплексная реабилитация с использованием современных методов лечения.',
          services: ['Детокс', 'Психотерапия', 'Арт-терапия'],
          photos: [require("../../assets/images/centers/center4.jpg")],
          rating: 4.7,
          reviewsCount: 95,
          price: 'от 55,000 ₽/месяц',
          verified: true,
          coordinates: { latitude: 56.8431, longitude: 60.6454 },
          capacity: 35,
          yearFounded: 2018,
          workingHours: '24/7',
          license: 'Лицензия №901234',
          descriptionFull: 'Полное описание клиники',
          methods: ['Арт-терапия', 'КПТ'],
          reviews: [],
        },
        {
          id: '5',
          name: 'Центр "Спасение"',
          city: 'Новосибирск',
          address: 'пр. Красный, 50',
          phone: '+7 (383) 333-44-55',
          email: 'info@spasenie.ru',
          description: 'Профессиональная помощь в борьбе с наркозависимостью.',
          services: ['Детокс', 'Психотерапия', 'Семейная терапия'],
          photos: [require("../../assets/images/centers/center5.jpg")],
          rating: 4.6,
          reviewsCount: 78,
          price: 'от 48,000 ₽/месяц',
          verified: true,
          coordinates: { latitude: 55.0084, longitude: 82.9357 },
          capacity: 45,
          yearFounded: 2016,
          workingHours: 'Пн-Вс: 8:00-22:00',
          license: 'Лицензия №567890',
          descriptionFull: 'Полное описание центра',
          methods: ['Семейная терапия', '12 шагов'],
          reviews: [],
        },
        {
          id: '6',
          name: 'Клиника "Надежда"',
          city: 'Нижний Новгород',
          address: 'ул. Большая Покровская, 30',
          phone: '+7 (831) 222-33-44',
          email: 'info@nadezhda.ru',
          description: 'Современный подход к лечению зависимостей с индивидуальными программами.',
          services: ['Детокс', 'Психотерапия', 'Групповая терапия'],
          photos: ["https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop&crop=center"],
          rating: 4.4,
          reviewsCount: 56,
          price: 'от 42,000 ₽/месяц',
          verified: true,
          coordinates: { latitude: 56.2965, longitude: 43.9361 },
          capacity: 25,
          yearFounded: 2014,
          workingHours: 'Пн-Пт: 9:00-19:00',
          license: 'Лицензия №123789',
          descriptionFull: 'Полное описание клиники',
          methods: ['КПТ', 'Групповая терапия'],
          reviews: [],
        },
        {
          id: '7',
          name: 'Центр "Восстановление"',
          city: 'Самара',
          address: 'ул. Ленинградская, 20',
          phone: '+7 (846) 444-55-66',
          email: 'info@vosstanovlenie.ru',
          description: 'Комплексная реабилитация с использованием проверенных методов.',
          services: ['Детокс', 'Психотерапия', 'Трудовая терапия'],
          photos: ["https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop&crop=center"],
          rating: 4.2,
          reviewsCount: 43,
          price: 'от 38,000 ₽/месяц',
          verified: true,
          coordinates: { latitude: 53.2001, longitude: 50.1500 },
          capacity: 30,
          yearFounded: 2013,
          workingHours: 'Пн-Вс: 8:00-20:00',
          license: 'Лицензия №456123',
          descriptionFull: 'Полное описание центра',
          methods: ['Трудовая терапия', '12 шагов'],
          reviews: [],
        },
        {
          id: '8',
          name: 'Клиника "Исцеление"',
          city: 'Омск',
          address: 'ул. Ленина, 5',
          phone: '+7 (3812) 666-77-88',
          email: 'info@istselenie.ru',
          description: 'Специализированный центр для лечения различных видов зависимостей.',
          services: ['Детокс', 'Психотерапия', 'Арт-терапия'],
          photos: ["https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=300&fit=crop&crop=center"],
          rating: 4.5,
          reviewsCount: 72,
          price: 'от 46,000 ₽/месяц',
          verified: true,
          coordinates: { latitude: 54.9885, longitude: 73.3242 },
          capacity: 35,
          yearFounded: 2017,
          workingHours: '24/7',
          license: 'Лицензия №789456',
          descriptionFull: 'Полное описание клиники',
          methods: ['Арт-терапия', 'КПТ'],
          reviews: [],
        },
        {
          id: '9',
          name: 'Центр "Обновление"',
          city: 'Ростов-на-Дону',
          address: 'пр. Буденновский, 40',
          phone: '+7 (863) 888-99-00',
          email: 'info@obnovlenie.ru',
          description: 'Современные методы лечения зависимостей в комфортных условиях.',
          services: ['Детокс', 'Психотерапия', 'Семейная терапия'],
          photos: ["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center"],
          rating: 4.6,
          reviewsCount: 84,
          price: 'от 52,000 ₽/месяц',
          verified: true,
          coordinates: { latitude: 47.2225, longitude: 39.7187 },
          capacity: 40,
          yearFounded: 2019,
          workingHours: 'Пн-Вс: 9:00-21:00',
          license: 'Лицензия №012345',
              descriptionFull: 'Полное описание центра',
          methods: ['Семейная терапия', '12 шагов'],
          reviews: [],
        },
        {
          id: '10',
          name: 'Клиника "Здоровье"',
          city: 'Уфа',
          address: 'ул. Ленина, 15',
          phone: '+7 (347) 999-00-11',
          email: 'info@zdorovie.ru',
          description: 'Профессиональная помощь в преодолении зависимостей с индивидуальным подходом.',
          services: ['Детокс', 'Психотерапия', 'Групповая терапия'],
          photos: ["https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=300&fit=crop&crop=center"],
          rating: 4.3,
          reviewsCount: 61,
          price: 'от 44,000 ₽/месяц',
          verified: true,
          coordinates: { latitude: 54.7388, longitude: 55.9721 },
          capacity: 28,
          yearFounded: 2015,
          workingHours: 'Пн-Пт: 8:00-18:00',
          license: 'Лицензия №345012',
          descriptionFull: 'Полное описание клиники',
          methods: ['Групповая терапия', 'КПТ'],
          reviews: [],
        },
          ];
          
          set({ 
            centers: mockCenters, 
            centersLoading: false,
        centersError: null,
        lastCentersUpdate: Date.now(),
          });

      return;
        } catch (error) {
          set({ 
            centersLoading: false,
        centersError: 'Failed to load centers',
      });
      return;
    }
  },

  refreshCenters: async () => {
    return get().loadCenters();
  },

  // === ARTICLES ACTIONS ===
  setArticles: (articles: Article[]) => set({ articles }),
  setArticlesLoading: (loading: boolean) => set({ articlesLoading: loading }),
  setArticlesError: (error: string | null) => set({ articlesError: error }),

  loadArticles: async () => {
    set({ articlesLoading: true, articlesError: null });
    try {
      // Пока используем локальные статьи, позже заменим на API
      set({ 
        articles: ARTICLES, 
        articlesLoading: false,
        articlesError: null,
        lastArticlesUpdate: Date.now(),
      });
      return;
    } catch (error) {
      set({ 
        articlesLoading: false,
        articlesError: 'Failed to load articles',
      });
      return;
    }
  },

  refreshArticles: async () => {
    return get().loadArticles();
  },

  // Добавление новой статьи
  addArticle: (articleData: {
    title: string;
    excerpt: string;
    body: string;
    image: string;
    authorName: string;
    authorCredentials: string;
    rubric: string;
    articleType: 'media' | 'integration';
    centerId?: string;
  }) => {
    const { articles } = get();
    const newArticle: Article = {
      id: `article_${Date.now()}`,
      title: articleData.title,
      excerpt: articleData.excerpt,
      body: articleData.body,
      image: articleData.image,
      author: `${articleData.authorName} - ${articleData.authorCredentials}`,
      category: articleData.rubric,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    set({
      articles: [newArticle, ...articles], // Добавляем в начало списка
      lastArticlesUpdate: Date.now(),
    });

    return newArticle;
  },

  // Обновление статьи
  updateArticle: (id: string, updates: Partial<Article>) => {
    const { articles } = get();
    const updatedArticles = articles.map((article: Article) =>
      article.id === id 
        ? { ...article, ...updates, updatedAt: new Date().toISOString() }
        : article
    );

    set({
      articles: updatedArticles,
      lastArticlesUpdate: Date.now(),
    });
  },

  // Удаление статьи
  deleteArticle: (id: string) => {
    const { articles } = get();
    const filteredArticles = articles.filter((article: Article) => article.id !== id);

    set({
      articles: filteredArticles,
      lastArticlesUpdate: Date.now(),
    });
  },

      // === FAVORITES ACTIONS ===
      setFavorites: (favorites) => set({ favorites }),
  isFavorite: (centerId) => get().favorites[centerId] || false,
  toggleFavorite: (centerId) => {
        const { favorites } = get();
    set({
      favorites: {
        ...favorites,
        [centerId]: !favorites[centerId],
      },
    });
  },
  setFavoritesLoading: (loading: boolean) => set({ favoritesLoading: loading }),

      // === UI ACTIONS ===
      setCurrentTab: (tab) => set({ currentTab: tab }),
      setSelectedCenter: (center) => set({ selectedCenter: center }),
      setArticleOpen: (article) => set({ articleOpen: article }),
  setSettingsVisible: (visible) => set({ settingsVisible: visible }),
  setFiltersVisible: (visible) => set({ filtersVisible: visible }),
  setRefreshing: (refreshing) => set({ refreshing }),
  setSearchQuery: (query: string) => set({ searchQuery: query }),
  setArticleQuery: (query: string) => set({ articleQuery: query }),
  setSearchText: (_text: string) => set(state => ({ filters: { ...state.filters } })),
  setCityFilter: (_city: string) => set(state => ({ filters: { ...state.filters } })),
  setServicesFilter: (_services: string[]) => set(state => ({ filters: { ...state.filters } })),
  setRatingFilter: (rating: number) => set(state => ({ filters: { ...state.filters, minRating: rating } })),
  setIsOnline: (online: boolean) => set({ isOnline: online }),
  setFilters: (filters) => set(state => ({ filters: { ...state.filters, ...filters } })),
      resetFilters: () => set({
        filters: {
          cities: [],
          types: [],
          minPrice: '',
          maxPrice: '',
          minRating: 0,
      sortBy: 'rating' as const,
      sortOrder: 'desc' as const,
    }
  }),
  applyFilters: () => get().getFilteredCenters(),

  // === HELPER METHODS ===
  getFilteredCenters: () => {
    const { centers, filters } = get();
    return centers.filter(center => {
      const matchesCity = filters.cities.length === 0 || filters.cities.includes(center.city);
      const matchesRating = center.rating >= filters.minRating;
      return matchesCity && matchesRating;
    });
      },

      getFilteredArticles: () => {
        const { articleQuery } = get();
    if (!articleQuery) {
      return ARTICLES;
    }
        const query = articleQuery.toLowerCase();
        return ARTICLES.filter(article =>
          article.title.toLowerCase().includes(query) ||
          article.excerpt.toLowerCase().includes(query) ||
          (article.body || '').toLowerCase().includes(query)
        );
  },

  getFavoriteCenters: () => {
    const { centers, favorites } = get();
    return centers.filter(center => favorites[center.id]);
  },
}));

export default useAppStore;