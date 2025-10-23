// Конфигурация анимированного баннера
// Этот файл можно легко редактировать для изменения содержимого баннера

export const BANNER_CONFIG = {
  // Основной контент
  appTitle: 'РЕБА',
  appSlogan: 'помощь ближе чем кажется',
  
  // Стили текста
  titleStyle: {
    fontSize: 36,
    fontWeight: '900',
    color: '#1a1a1a',
    letterSpacing: -1,
  },
  sloganStyle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    letterSpacing: 0.5,
  },
  
  // Декоративные элементы
  decorativeElements: {
    enabled: true,
    circle1: {
      colors: ['#81D4FA', '#42A5F5'], // Градиент как у кнопок
      size: 40,
      position: { top: 10, right: 20 },
    },
    circle2: {
      colors: ['#81D4FA', '#42A5F5'], // Градиент как у кнопок
      size: 30,
      position: { bottom: 10, left: 20 },
    },
    // Дополнительные рандомные кружки
    randomCircles: {
      enabled: true,
      count: 2,
      colors: ['#81D4FA', '#42A5F5'], // Градиент как у кнопок
      sizeRange: { min: 15, max: 25 }, // Размеры от 15 до 25
      animationDuration: { min: 2000, max: 4000 }, // Длительность анимации 2-4 сек
      fadeDuration: { min: 500, max: 1000 }, // Длительность появления/исчезновения
    },
  },
  
  // Анимации
  animations: {
    rotationSpeed: 15000, // миллисекунды на полный оборот
    fadeInDuration: 1000,
    scaleTension: 50,
    scaleFriction: 7,
  },
  
  // Стили баннера
  bannerStyle: {
    borderRadius: 24,
    blurIntensity: 25,
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 12,
  },
  
  // Градиент
  gradientColors: [
    'rgba(255, 255, 255, 0.4)',
    'rgba(255, 255, 255, 0.2)',
    'rgba(255, 255, 255, 0.1)'
  ],
};

// Функция для обновления конфигурации
export const updateBannerConfig = (newConfig: Partial<typeof BANNER_CONFIG>) => {
  Object.assign(BANNER_CONFIG, newConfig);
};
