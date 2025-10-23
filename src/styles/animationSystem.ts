import { Platform } from 'react-native';

// Профессиональная система анимаций с веб-совместимостью
export const ANIMATION_CONFIG = {
  // Базовые настройки
  durations: {
    fast: 120,
    normal: 240,
    slow: 360,
    extraSlow: 500,
  },
  
  // Easing функции
  easing: {
    standard: Platform.OS === 'web' ? 'ease-out' : 'ease-out',
    deceleration: Platform.OS === 'web' ? 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'ease-out',
    spring: Platform.OS === 'web' ? 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' : 'ease-out',
    bounce: Platform.OS === 'web' ? 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' : 'ease-out',
  },
  
  // Анимации для разных платформ
  platformAnimations: {
    web: {
      // CSS transitions для веба
      fadeIn: {
        opacity: '0 → 1',
        duration: 240,
        easing: 'ease-out',
      },
      slideUp: {
        transform: 'translateY(30px) → translateY(0)',
        opacity: '0 → 1',
        duration: 300,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      scaleIn: {
        transform: 'scale(0.9) → scale(1)',
        opacity: '0 → 1',
        duration: 200,
        easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      pulse: {
        transform: 'scale(1) → scale(1.05) → scale(1)',
        duration: 1000,
        easing: 'ease-in-out',
        iterationCount: 'infinite',
      },
    },
    native: {
      // React Native Animated для мобильных
      fadeIn: {
        opacity: { from: 0, to: 1 },
        duration: 240,
        easing: 'ease-out',
      },
      slideUp: {
        translateY: { from: 30, to: 0 },
        opacity: { from: 0, to: 1 },
        duration: 300,
        easing: 'ease-out',
      },
      scaleIn: {
        scale: { from: 0.9, to: 1 },
        opacity: { from: 0, to: 1 },
        duration: 200,
        easing: 'ease-out',
      },
    },
  },
};

// Адаптивные размеры для всех экранов
export const RESPONSIVE_BREAKPOINTS = {
  // Точки перелома
  breakpoints: {
    xs: 320,   // iPhone SE
    sm: 375,   // iPhone стандарт
    md: 414,   // iPhone Plus
    lg: 768,   // iPad portrait
    xl: 1024,  // iPad landscape
    xxl: 1200, // Desktop
  },
  
  // Адаптивные размеры
  getResponsiveSize: (baseSize: number, screenWidth: number) => {
    if (screenWidth <= 320) return baseSize * 0.85;  // Маленькие экраны
    if (screenWidth <= 375) return baseSize * 0.95;  // Стандартные
    if (screenWidth <= 414) return baseSize * 1.0;  // Большие телефоны
    if (screenWidth <= 768) return baseSize * 1.2;  // Планшеты
    if (screenWidth <= 1024) return baseSize * 1.4; // Большие планшеты
    return baseSize * 1.6; // Desktop
  },
  
  // Адаптивные отступы
  getResponsivePadding: (basePadding: number, screenWidth: number) => {
    if (screenWidth <= 320) return basePadding * 0.8;
    if (screenWidth <= 375) return basePadding * 0.9;
    if (screenWidth <= 414) return basePadding * 1.0;
    if (screenWidth <= 768) return basePadding * 1.3;
    if (screenWidth <= 1024) return basePadding * 1.6;
    return basePadding * 2.0;
  },
  
  // Адаптивные шрифты
  getResponsiveFontSize: (baseFontSize: number, screenWidth: number) => {
    if (screenWidth <= 320) return Math.max(baseFontSize * 0.9, 12);
    if (screenWidth <= 375) return Math.max(baseFontSize * 0.95, 14);
    if (screenWidth <= 414) return Math.max(baseFontSize * 1.0, 16);
    if (screenWidth <= 768) return Math.max(baseFontSize * 1.2, 18);
    if (screenWidth <= 1024) return Math.max(baseFontSize * 1.4, 20);
    return Math.max(baseFontSize * 1.6, 22);
  },
};

// Профессиональные стили с анимациями
export const PROFESSIONAL_STYLES = {
  // Анимированные контейнеры
  animatedContainer: {
    opacity: 0,
    transform: [{ translateY: 30 }],
    ...Platform.select({
      web: {
        transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
    }),
  },
  
  // Анимированные карточки
  animatedCard: {
    opacity: 0,
    transform: [{ scale: 0.95 }],
    ...Platform.select({
      web: {
        transition: 'all 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: '0 8px 25px rgba(10, 132, 255, 0.15)',
        },
      },
    }),
  },
  
  // Пульсирующие элементы
  pulsingElement: {
    ...Platform.select({
      web: {
        animation: 'pulse 2s ease-in-out infinite',
        '@keyframes pulse': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    }),
  },
  
  // Плавные переходы
  smoothTransition: {
    ...Platform.select({
      web: {
        transition: 'all 0.2s ease-out',
      },
    }),
  },
};

// CSS для веб-анимаций
export const WEB_ANIMATIONS_CSS = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  }
  
  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  .animate-fadeInUp {
    animation: fadeInUp 0.3s ease-out;
  }
  
  .animate-scaleIn {
    animation: scaleIn 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }
  
  .animate-pulse {
    animation: pulse 2s ease-in-out infinite;
  }
  
  .animate-slideInLeft {
    animation: slideInLeft 0.3s ease-out;
  }
  
  .animate-slideInRight {
    animation: slideInRight 0.3s ease-out;
  }
  
  .hover-scale:hover {
    transform: scale(1.02);
    transition: transform 0.2s ease-out;
  }
  
  .hover-glow:hover {
    box-shadow: 0 8px 25px rgba(10, 132, 255, 0.15);
    transition: box-shadow 0.2s ease-out;
  }
`;

export default ANIMATION_CONFIG;

