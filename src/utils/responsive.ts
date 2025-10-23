import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Базовые размеры для iPhone 15 Pro (393x852)
const BASE_WIDTH = 393;
const BASE_HEIGHT = 852;

// Функция для адаптивной ширины
export const responsiveWidth = (size: number): number => {
  return (SCREEN_WIDTH * size) / BASE_WIDTH;
};

// Функция для адаптивной высоты
export const responsiveHeight = (size: number): number => {
  return (SCREEN_HEIGHT * size) / BASE_HEIGHT;
};

// Функция для адаптивного размера шрифта
export const responsiveFontSize = (size: number): number => {
  const scale = Math.min(SCREEN_WIDTH / BASE_WIDTH, SCREEN_HEIGHT / BASE_HEIGHT);
  const newSize = size * scale;
  return Math.max(12, PixelRatio.roundToNearestPixel(newSize));
};

// Функция для адаптивного padding/margin
export const responsivePadding = (size: number): number => {
  return PixelRatio.roundToNearestPixel(responsiveWidth(size));
};

// Функция для адаптивного border radius
export const responsiveBorderRadius = (size: number): number => {
  return PixelRatio.roundToNearestPixel(responsiveWidth(size));
};

// Определение типа устройства
export const getDeviceType = () => {
  if (SCREEN_WIDTH < 375) return 'small'; // iPhone SE, mini
  if (SCREEN_WIDTH < 414) return 'medium'; // iPhone 12, 13, 14
  if (SCREEN_WIDTH < 430) return 'large'; // iPhone 15 Pro, 15 Pro Max
  return 'xlarge'; // iPad, большие экраны
};

// Адаптивные размеры для разных типов устройств
export const responsiveSizes = {
  // Шрифты
  fontSize: {
    xs: responsiveFontSize(12),
    sm: responsiveFontSize(14),
    base: responsiveFontSize(16),
    lg: responsiveFontSize(18),
    xl: responsiveFontSize(20),
    '2xl': responsiveFontSize(24),
    '3xl': responsiveFontSize(30),
    '4xl': responsiveFontSize(36),
  },
  
  // Отступы
  spacing: {
    xs: responsivePadding(4),
    sm: responsivePadding(8),
    md: responsivePadding(12),
    lg: responsivePadding(16),
    xl: responsivePadding(20),
    '2xl': responsivePadding(24),
    '3xl': responsivePadding(32),
    '4xl': responsivePadding(40),
  },
  
  // Размеры компонентов
  component: {
    buttonHeight: responsiveHeight(48),
    cardPadding: responsivePadding(16),
    cardMargin: responsivePadding(12),
    borderRadius: responsiveBorderRadius(12),
    iconSize: responsiveWidth(24),
  },
  
  // Размеры экрана
  screen: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    deviceType: getDeviceType(),
  }
};

// Функция для получения адаптивного стиля
export const getResponsiveStyle = (baseStyle: any) => {
  return {
    ...baseStyle,
    fontSize: baseStyle.fontSize ? responsiveFontSize(baseStyle.fontSize) : undefined,
    padding: baseStyle.padding ? responsivePadding(baseStyle.padding) : undefined,
    margin: baseStyle.margin ? responsivePadding(baseStyle.margin) : undefined,
    borderRadius: baseStyle.borderRadius ? responsiveBorderRadius(baseStyle.borderRadius) : undefined,
    width: baseStyle.width ? responsiveWidth(baseStyle.width) : undefined,
    height: baseStyle.height ? responsiveHeight(baseStyle.height) : undefined,
  };
};

export default responsiveSizes;
