import { Dimensions, Platform } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Адаптивные размеры экранов
export const SCREEN_SIZES = {
  // iPhone размеры
  iPhoneSE: { width: 375, height: 667 },      // 4.7"
  iPhone: { width: 375, height: 812 },        // 6.1" 
  iPhonePlus: { width: 414, height: 896 },   // 6.7"
  
  // Android размеры
  AndroidSmall: { width: 360, height: 640 },  // small
  AndroidMedium: { width: 375, height: 812 }, // medium
  AndroidLarge: { width: 414, height: 896 },  // large
  
  // Tablet размеры
  iPad: { width: 768, height: 1024 },         // portrait
  iPadLandscape: { width: 1024, height: 768 }, // landscape
};

// Определяем тип экрана
export const getScreenType = () => {
  if (screenWidth <= 360) return 'small';
  if (screenWidth <= 414) return 'medium';
  if (screenWidth <= 768) return 'large';
  return 'tablet';
};

export const screenType = getScreenType();

// Адаптивные размеры
export const RESPONSIVE = {
  // Базовые размеры
  baseWidth: screenWidth,
  baseHeight: screenHeight,
  
  // Адаптивные отступы
  padding: {
    xs: screenWidth * 0.02,    // 2%
    sm: screenWidth * 0.03,    // 3%
    md: screenWidth * 0.04,    // 4%
    lg: screenWidth * 0.05,    // 5%
    xl: screenWidth * 0.06,    // 6%
  },
  
  // Адаптивные размеры карточек
  cardWidth: {
    small: screenWidth * 0.85,
    medium: screenWidth * 0.9,
    large: screenWidth * 0.9,
    tablet: Math.min(screenWidth * 0.7, 600),
  },
  
  // Адаптивные размеры элементов
  elementSize: {
    small: screenWidth * 0.08,   // 8%
    medium: screenWidth * 0.1,   // 10%
    large: screenWidth * 0.12,   // 12%
    tablet: screenWidth * 0.08,  // 8%
  },
  
  // Адаптивные радиусы
  radius: {
    small: screenWidth * 0.02,   // 2%
    medium: screenWidth * 0.03,  // 3%
    large: screenWidth * 0.04,   // 4%
    tablet: screenWidth * 0.025, // 2.5%
  },
  
  // Адаптивные шрифты
  fontSize: {
    xs: Math.max(screenWidth * 0.03, 12),     // 3%
    sm: Math.max(screenWidth * 0.035, 14),    // 3.5%
    base: Math.max(screenWidth * 0.04, 16),   // 4%
    lg: Math.max(screenWidth * 0.045, 18),    // 4.5%
    xl: Math.max(screenWidth * 0.05, 20),     // 5%
    '2xl': Math.max(screenWidth * 0.06, 24),  // 6%
    '3xl': Math.max(screenWidth * 0.07, 28),  // 7%
    '4xl': Math.max(screenWidth * 0.08, 32),  // 8%
  },
  
  // Адаптивные высоты
  height: {
    header: Platform.OS === 'ios' ? 60 : 56,
    tabBar: Platform.OS === 'ios' ? 80 : 60,
    button: screenHeight * 0.06,  // 6%
    input: screenHeight * 0.06,   // 6%
  },
  
  // Адаптивные размеры изображений
  imageSize: {
    small: screenWidth * 0.2,     // 20%
    medium: screenWidth * 0.3,    // 30%
    large: screenWidth * 0.4,     // 40%
    hero: screenWidth * 0.8,      // 80%
  },
};

// Единая система стилей
export const UNIFIED_STYLES = {
  // Контейнеры
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  
  // Заголовки
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: RESPONSIVE.padding.md,
    paddingVertical: RESPONSIVE.padding.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    height: RESPONSIVE.height.header,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  
  // Кнопки
  button: {
    primary: {
      backgroundColor: '#0A84FF',
      borderRadius: RESPONSIVE.radius.medium,
      paddingVertical: RESPONSIVE.padding.sm,
      paddingHorizontal: RESPONSIVE.padding.lg,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      minHeight: RESPONSIVE.height.button,
      ...Platform.select({
        ios: {
          shadowColor: '#0A84FF',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
        },
        android: {
          elevation: 6,
        },
      }),
    },
    secondary: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: '#0A84FF',
      borderRadius: RESPONSIVE.radius.medium,
      paddingVertical: RESPONSIVE.padding.sm,
      paddingHorizontal: RESPONSIVE.padding.lg,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      minHeight: RESPONSIVE.height.button,
    },
    back: {
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      borderRadius: RESPONSIVE.radius.small,
      padding: RESPONSIVE.padding.sm,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      width: RESPONSIVE.elementSize.medium,
      height: RESPONSIVE.elementSize.medium,
    },
  },
  
  // Карточки
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: RESPONSIVE.radius.large,
    padding: RESPONSIVE.padding.md,
    marginVertical: RESPONSIVE.padding.xs,
    marginHorizontal: RESPONSIVE.padding.sm,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  
  // Текст
  text: {
    title: {
      fontSize: RESPONSIVE.fontSize['2xl'],
      fontWeight: '800' as const,
      color: '#0F172A',
      lineHeight: RESPONSIVE.fontSize['2xl'] * 1.2,
      letterSpacing: -0.5,
    },
    subtitle: {
      fontSize: RESPONSIVE.fontSize.lg,
      fontWeight: '600' as const,
      color: '#475569',
      lineHeight: RESPONSIVE.fontSize.lg * 1.4,
    },
    body: {
      fontSize: RESPONSIVE.fontSize.base,
      fontWeight: '400' as const,
      color: '#0F172A',
      lineHeight: RESPONSIVE.fontSize.base * 1.5,
    },
    caption: {
      fontSize: RESPONSIVE.fontSize.sm,
      fontWeight: '500' as const,
      color: '#64748B',
      lineHeight: RESPONSIVE.fontSize.sm * 1.4,
    },
    button: {
      fontSize: RESPONSIVE.fontSize.base,
      fontWeight: '600' as const,
      color: '#FFFFFF',
    },
    buttonSecondary: {
      fontSize: RESPONSIVE.fontSize.base,
      fontWeight: '600' as const,
      color: '#0A84FF',
    },
  },
  
  // Отступы
  spacing: {
    xs: RESPONSIVE.padding.xs,
    sm: RESPONSIVE.padding.sm,
    md: RESPONSIVE.padding.md,
    lg: RESPONSIVE.padding.lg,
    xl: RESPONSIVE.padding.xl,
  },
  
  // Flex layouts
  flex: {
    row: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
    },
    column: {
      flexDirection: 'column' as const,
    },
    center: {
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    spaceBetween: {
      justifyContent: 'space-between' as const,
    },
    spaceAround: {
      justifyContent: 'space-around' as const,
    },
  },
  
  // Адаптивные размеры для разных экранов
  responsive: {
    cardWidth: RESPONSIVE.cardWidth[screenType],
    elementSize: RESPONSIVE.elementSize[screenType],
    radius: RESPONSIVE.radius[screenType],
    fontSize: RESPONSIVE.fontSize,
    padding: RESPONSIVE.padding,
  },
};

// Цветовая палитра
export const COLORS = {
  primary: '#0A84FF',
  primaryLight: '#E6F3FF',
  primaryDark: '#0056CC',
  secondary: '#6366F1',
  secondaryLight: '#E0E7FF',
  accent: '#10B981',
  accentLight: '#D1FAE5',
  
  text: '#0F172A',
  textSecondary: '#475569',
  textTertiary: '#94A3B8',
  muted: '#64748B',
  
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
  
  background: '#FFFFFF',
  backgroundSecondary: '#F8FAFC',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  
  // Градиенты
  gradients: {
    primary: ['#0A84FF', '#0056CC'],
    secondary: ['#6366F1', '#4F46E5'],
    success: ['#10B981', '#059669'],
    sunset: ['#F59E0B', '#EF4444'],
    ocean: ['#0EA5E9', '#0284C7'],
    purple: ['#8B5CF6', '#7C3AED'],
  },
};

export default UNIFIED_STYLES;

