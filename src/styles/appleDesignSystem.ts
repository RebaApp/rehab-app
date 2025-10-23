import { Dimensions, Platform, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Базовые размеры для iPhone 15 Pro (393x852)
const BASE_WIDTH = 393;
const BASE_HEIGHT = 852;

// Функция для адаптивной ширины
const responsiveWidth = (size: number): number => {
  return (SCREEN_WIDTH * size) / BASE_WIDTH;
};

// Функция для адаптивной высоты
const responsiveHeight = (size: number): number => {
  return (SCREEN_HEIGHT * size) / BASE_HEIGHT;
};

// Функция для адаптивного размера шрифта
const responsiveFontSize = (size: number): number => {
  const scale = Math.min(SCREEN_WIDTH / BASE_WIDTH, SCREEN_HEIGHT / BASE_HEIGHT);
  const newSize = size * scale;
  return Math.max(12, PixelRatio.roundToNearestPixel(newSize));
};

// Функция для адаптивного padding/margin
const responsivePadding = (size: number): number => {
  return PixelRatio.roundToNearestPixel(responsiveWidth(size));
};

// Re-export responsive functions
export { responsiveWidth, responsiveHeight, responsiveFontSize, responsivePadding };

// Apple Design System Colors
export const AppleColors = {
  // Background Gradients
  background: {
    primary: '#F8FAFC', // Небесно-белый
    secondary: '#F1F5F9',
    tertiary: '#E2E8F0',
    glass: 'rgba(255, 255, 255, 0.8)',
    glassDark: 'rgba(0, 0, 0, 0.05)',
  },
  
  // Text Colors
  text: {
    primary: '#1E293B',
    secondary: '#64748B',
    tertiary: '#94A3B8',
    inverse: '#FFFFFF',
  },
  
  // Accent Colors
  accent: {
    blue: '#3B82F6',
    blueLight: '#60A5FA',
    blueDark: '#1D4ED8',
    green: '#10B981',
    orange: '#F59E0B',
    red: '#EF4444',
  },
  
  // Glass Effect Colors
  glass: {
    light: 'rgba(255, 255, 255, 0.25)',
    medium: 'rgba(255, 255, 255, 0.15)',
    dark: 'rgba(0, 0, 0, 0.1)',
    border: 'rgba(255, 255, 255, 0.2)',
  }
};

// Apple Typography System
export const AppleTypography = {
  // Headers
  largeTitle: {
    fontSize: responsiveFontSize(34),
    fontWeight: '700' as const,
    lineHeight: responsiveFontSize(41),
    letterSpacing: -0.5,
  },
  
  title1: {
    fontSize: responsiveFontSize(28),
    fontWeight: '600' as const,
    lineHeight: responsiveFontSize(34),
    letterSpacing: -0.3,
  },
  
  title2: {
    fontSize: responsiveFontSize(22),
    fontWeight: '600' as const,
    lineHeight: responsiveFontSize(28),
    letterSpacing: -0.2,
  },
  
  title3: {
    fontSize: responsiveFontSize(20),
    fontWeight: '600' as const,
    lineHeight: responsiveFontSize(25),
    letterSpacing: -0.1,
  },
  
  // Body Text
  headline: {
    fontSize: responsiveFontSize(17),
    fontWeight: '600' as const,
    lineHeight: responsiveFontSize(22),
    letterSpacing: -0.1,
  },
  
  body: {
    fontSize: responsiveFontSize(17),
    fontWeight: '400' as const,
    lineHeight: responsiveFontSize(22),
    letterSpacing: -0.1,
  },
  
  callout: {
    fontSize: responsiveFontSize(16),
    fontWeight: '400' as const,
    lineHeight: responsiveFontSize(21),
    letterSpacing: -0.1,
  },
  
  subhead: {
    fontSize: responsiveFontSize(15),
    fontWeight: '400' as const,
    lineHeight: responsiveFontSize(20),
    letterSpacing: -0.1,
  },
  
  footnote: {
    fontSize: responsiveFontSize(13),
    fontWeight: '400' as const,
    lineHeight: responsiveFontSize(18),
    letterSpacing: -0.1,
  },
  
  caption1: {
    fontSize: responsiveFontSize(12),
    fontWeight: '400' as const,
    lineHeight: responsiveFontSize(16),
    letterSpacing: 0,
  },
  
  caption2: {
    fontSize: responsiveFontSize(11),
    fontWeight: '400' as const,
    lineHeight: responsiveFontSize(13),
    letterSpacing: 0.1,
  },
};

// Apple Spacing System
export const AppleSpacing = {
  xs: responsivePadding(4),
  sm: responsivePadding(8),
  md: responsivePadding(12),
  lg: responsivePadding(16),
  xl: responsivePadding(20),
  xxl: responsivePadding(24),
  xxxl: responsivePadding(32),
  huge: responsivePadding(40),
};

// Apple Border Radius System
export const AppleRadius = {
  xs: responsiveWidth(4),
  sm: responsiveWidth(8),
  md: responsiveWidth(12),
  lg: responsiveWidth(16),
  xl: responsiveWidth(20),
  xxl: responsiveWidth(24),
  round: responsiveWidth(999),
};

// Apple Shadow System
export const AppleShadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  large: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  
  // Glass Effect Shadow
  glass: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
};

// Glass Effect Styles
export const GlassStyles = {
  card: {
    backgroundColor: AppleColors.glass.light,
    borderRadius: AppleRadius.lg,
    borderWidth: 1,
    borderColor: AppleColors.glass.border,
    ...AppleShadows.glass,
  },
  
  button: {
    backgroundColor: AppleColors.glass.medium,
    borderRadius: AppleRadius.md,
    borderWidth: 1,
    borderColor: AppleColors.glass.border,
    ...AppleShadows.small,
  },
  
  header: {
    backgroundColor: AppleColors.glass.light,
    borderBottomWidth: 1,
    borderBottomColor: AppleColors.glass.border,
    ...AppleShadows.small,
  },
};

// Animation Durations
export const AppleAnimations = {
  fast: 200,
  normal: 300,
  slow: 500,
  verySlow: 800,
};

// Screen Dimensions
export const AppleDimensions = {
  screenWidth: SCREEN_WIDTH,
  screenHeight: SCREEN_HEIGHT,
  safeAreaTop: Platform.OS === 'ios' ? 44 : 24,
  safeAreaBottom: Platform.OS === 'ios' ? 34 : 0,
  tabBarHeight: Platform.OS === 'ios' ? 83 : 60,
};
