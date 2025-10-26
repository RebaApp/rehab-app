// === USER TYPES ===
export interface User {
  id: string;
  email: string;
  name: string;
  userType: 'USER' | 'ADMIN' | 'CENTER_OWNER';
  photo?: string;
  age?: number;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

// === CENTER TYPES ===
export interface Center {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  rating: number;
  reviewsCount: number;
  verified: boolean;
  photos: string[];
  services: string[];
  description: string;
  price: string;
  priceRange?: string; // Добавляем priceRange для фильтрации
  duration?: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  workingHours: string;
  capacity: number;
  yearFounded: number;
  license: string;
  descriptionFull: string;
  methods: string[];
  specializations?: string[]; // Добавляем specializations
  amenities?: string[]; // Добавляем amenities
  reviews: Review[];
  distance?: number;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

// === REHAB CENTER TYPES (для карточек поиска) ===
export interface RehabCenter {
  id: string;
  slug?: string;
  name: string;
  location: string; // "Москва, МО"
  image?: string; // hero image URL
  logo?: string;
  photos?: string[]; // галерея изображений
  shortDescription?: string;
  priceFrom?: number; // в рублях
  duration?: string; // "30 дней"
  license?: boolean;
  rating?: number; // 0-5
  reviewsCount?: number;
  tags?: string[]; // бейджи/тэги
  verification_status?: 'draft'|'pending'|'verified'|'rejected';
  phone?: string; // для кнопки "Позвонить"
  address?: string;
  services?: string[];
  methods?: string[];
  capacity?: number;
  yearFounded?: number;
  workingHours?: string;
  website?: string;
  email?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  distance?: number; // в км
  createdAt?: string;
  updatedAt?: string;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  text: string;
  date: string;
}

// === ARTICLE TYPES ===
export interface Article {
  id: string;
  title: string;
  content?: string;
  body: string;
  excerpt: string;
  category?: string;
  author?: string;
  authorName?: string;
  authorCredentials?: string;
  rubric?: string;
  articleType?: 'media' | 'integration';
  centerId?: string;
  image: any; // require() result for local images
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
  views?: number;
  likes?: number;
}

// === BOOKING TYPES ===
export interface Booking {
  id: string;
  userId: string;
  centerId: string;
  startDate: string;
  endDate: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  totalPrice: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// === FILTER TYPES ===
export interface Filters {
  cities: string[];
  types: string[];
  minPrice: string;
  maxPrice: string;
  minRating: number;
  sortBy: 'rating' | 'distance' | 'price' | 'name' | 'reviewsCount';
  sortOrder: 'asc' | 'desc';
}

// === API RESPONSE TYPES ===
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

// === UI STATE TYPES ===
export interface UIState {
  currentTab: 'home' | 'search' | 'journey' | 'favorites' | 'profile';
  searchQuery: string;
  articleQuery: string;
  filtersVisible: boolean;
  settingsVisible: boolean;
  selectedCenter: Center | null;
  articleOpen: Article | null;
  isOnline: boolean;
  refreshing: boolean;
  shimmer: any; // Animated value for shimmer effect
}

// === AUTH STATE TYPES ===
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  authLoading: boolean;
}

// === CENTERS STATE TYPES ===
export interface CentersState {
  centers: Center[];
  centersLoading: boolean;
  centersError: string | null;
  lastCentersUpdate: number | null;
}

// === FAVORITES STATE TYPES ===
export interface FavoritesState {
  favorites: Record<string, boolean>;
  favoritesLoading: boolean;
}

// === ARTICLES STATE TYPES ===
export interface ArticlesState {
  articles: Article[];
  articlesLoading: boolean;
  articlesError: string | null;
  lastArticlesUpdate: number | null;
}

// === STORE TYPES ===
export interface AppStore extends AuthState, CentersState, FavoritesState, ArticlesState, UIState {
  filters: Filters;
  
  // Auth actions
  setUser: (user: User | null) => void;
  setAuthLoading: (loading: boolean) => void;
  login: (email: string, password: string) => Promise<ApiResponse<User>>;
  register: (email: string, password: string, userData: Partial<User>) => Promise<ApiResponse<User>>;
  loginWithYandex: () => Promise<ApiResponse<User>>;
  logout: () => void;
  
  // Centers actions
  setCenters: (centers: Center[]) => void;
  setCentersLoading: (loading: boolean) => void;
  setCentersError: (error: string | null) => void;
  loadCenters: () => Promise<void>;
  
  // Articles actions
  setArticles: (articles: Article[]) => void;
  setArticlesLoading: (loading: boolean) => void;
  setArticlesError: (error: string | null) => void;
  loadArticles: () => Promise<void>;
  refreshArticles: () => Promise<void>;
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
  }) => Article;
  updateArticle: (id: string, updates: Partial<Article>) => void;
  deleteArticle: (id: string) => void;
  
  // Favorites actions
  setFavorites: (favorites: Record<string, boolean>) => void;
  toggleFavorite: (centerId: string) => void;
  isFavorite: (centerId: string) => boolean;
  
  // UI actions
  setCurrentTab: (tab: UIState['currentTab']) => void;
  setSearchQuery: (query: string) => void;
  setArticleQuery: (query: string) => void;
  setFiltersVisible: (visible: boolean) => void;
  setSettingsVisible: (visible: boolean) => void;
  setSelectedCenter: (center: Center | null) => void;
  setArticleOpen: (article: Article | null) => void;
  setIsOnline: (online: boolean) => void;
  setRefreshing: (refreshing: boolean) => void;
  
  // Filter actions
  setFilters: (filters: Partial<Filters>) => void;
  resetFilters: () => void;
  applyFilters: () => Center[];
  
  // Computed values
  getFilteredCenters: () => Center[];
  getFavoriteCenters: () => Center[];
  getFilteredArticles: () => Article[];
}

// === COMPONENT PROPS TYPES ===
export interface CenterCardProps {
  item: Center;
  onPress: (center: Center) => void;
  onToggleFavorite: (centerId: string) => void;
  isFavorite: boolean;
  showDistance?: boolean;
}

export interface CardRehabCenterProps {
  center: RehabCenter;
  onOpen: (centerId: string) => void;
  onCall?: (phone: string) => void;
  onToggleFavorite?: (centerId: string) => void;
  isFavorite?: boolean;
  showDistance?: boolean;
}

export interface ArticleCardProps {
  item: Article;
  onPress: (article: Article) => void;
}

export interface ScreenProps {
  navigation?: {
    navigate: (screen: string, params?: Record<string, unknown>) => void;
    goBack: () => void;
    reset: (state: unknown) => void;
  };
  route?: {
    params?: Record<string, unknown>;
    name: string;
    key: string;
  };
}

// === API SERVICE TYPES ===
export interface ApiServiceConfig {
  baseURL: string;
  timeout: number;
  retries: number;
}

export interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

// === ERROR TYPES ===
export interface AppError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: number;
}

// === THEME TYPES ===
// Journey Hub Types
export interface JourneyStage {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming';
  progress: number; // 0-100
  startDate?: string;
  endDate?: string;
  photo?: string;
  achievements?: string[];
}

export interface JourneyHubState {
  stages: JourneyStage[];
  currentStageId: string;
  totalProgress: number;
  achievements: Achievement[];
  emergencyContacts: EmergencyContact[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  date: string;
  photo?: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  type: 'center' | 'psychologist' | 'crisis_line';
  available: boolean;
}

export interface VideoTour {
  id: string;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
  url: string;
  centerId: string;
}

export interface QuickHelpItem {
  id: string;
  title: string;
  icon: string;
  action: 'crisis' | 'motivation' | 'contacts' | 'video';
}

export interface JourneyHubProps {
  onStagePress: (stage: JourneyStage) => void;
  onAchievementPress: (achievement: Achievement) => void;
  onEmergencyPress: () => void;
  onVideoPress: (video: VideoTour) => void;
  onSharePress: () => void;
}

export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    error: string;
    success: string;
    warning: string;
    info: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  typography: {
    h1: object;
    h2: object;
    h3: object;
    body: object;
    caption: object;
  };
  shadows: {
    small: object;
    medium: object;
    large: object;
  };
}
