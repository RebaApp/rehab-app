import { RehabCenter } from '../types';

// Мок-данные для тестирования карточек реабилитационных центров
export const mockRehabCenters: RehabCenter[] = [
  {
    id: '1',
    slug: 'center-recovery-moscow',
    name: 'Центр "Восстановление"',
    location: 'Москва, ЦАО',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop',
    logo: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=100&h=100&fit=crop',
    shortDescription: 'Современный реабилитационный центр с комплексным подходом к лечению зависимостей. Используем проверенные методики и индивидуальный подход к каждому пациенту.',
    priceFrom: 70000,
    duration: '30 дней',
    license: true,
    rating: 4.8,
    reviewsCount: 127,
    tags: ['Алкоголизм', 'Наркомания', 'Игровая зависимость'],
    verification_status: 'verified',
    phone: '+7 (495) 123-45-67',
    address: 'ул. Тверская, д. 15, стр. 1',
    services: ['Детокс', 'Психотерапия', 'Групповая терапия', 'Семейная терапия'],
    methods: ['12 шагов', 'Когнитивно-поведенческая терапия', 'Арт-терапия'],
    capacity: 50,
    yearFounded: 2015,
    workingHours: 'Круглосуточно',
    website: 'https://center-recovery.ru',
    email: 'info@center-recovery.ru',
    coordinates: {
      latitude: 55.7558,
      longitude: 37.6176
    },
    distance: 2.5,
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    slug: 'hope-clinic-spb',
    name: 'Клиника "Надежда"',
    location: 'Санкт-Петербург, СПб',
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=300&fit=crop',
    logo: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=100&h=100&fit=crop',
    shortDescription: 'Специализированная клиника для лечения алкогольной зависимости. Опытные врачи, современное оборудование, комфортные условия проживания.',
    priceFrom: 85000,
    duration: '45 дней',
    license: true,
    rating: 4.6,
    reviewsCount: 89,
    tags: ['Алкоголизм', 'Детокс', 'Реабилитация'],
    verification_status: 'verified',
    phone: '+7 (812) 234-56-78',
    address: 'пр. Невский, д. 100',
    services: ['Медикаментозное лечение', 'Психотерапия', 'Физиотерапия'],
    methods: ['Миннесотская модель', 'Мотивационное интервью'],
    capacity: 30,
    yearFounded: 2010,
    workingHours: '8:00 - 22:00',
    website: 'https://hope-clinic.ru',
    email: 'contact@hope-clinic.ru',
    coordinates: {
      latitude: 59.9311,
      longitude: 30.3609
    },
    distance: 5.2,
    createdAt: '2023-02-20T10:00:00Z',
    updatedAt: '2024-02-20T10:00:00Z'
  },
  {
    id: '3',
    slug: 'new-life-center',
    name: 'Центр "Новая Жизнь"',
    location: 'Москва, МО',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
    logo: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=100&h=100&fit=crop',
    shortDescription: 'Частный реабилитационный центр в экологически чистом районе. Специализируемся на лечении наркотической зависимости у подростков и молодых людей.',
    priceFrom: 120000,
    duration: '60 дней',
    license: true,
    rating: 4.9,
    reviewsCount: 156,
    tags: ['Наркомания', 'Подростки', 'Семейная терапия'],
    verification_status: 'verified',
    phone: '+7 (495) 345-67-89',
    address: 'Московская область, г. Химки, ул. Лесная, д. 25',
    services: ['Детокс', 'Психотерапия', 'Образовательные программы', 'Спортивная реабилитация'],
    methods: ['Мультисистемная семейная терапия', 'Диалектическая поведенческая терапия'],
    capacity: 25,
    yearFounded: 2018,
    workingHours: 'Круглосуточно',
    website: 'https://new-life-center.ru',
    email: 'info@new-life-center.ru',
    coordinates: {
      latitude: 55.8967,
      longitude: 37.4297
    },
    distance: 15.8,
    createdAt: '2023-03-10T10:00:00Z',
    updatedAt: '2024-03-10T10:00:00Z'
  },
  {
    id: '4',
    slug: 'recovery-house',
    name: 'Дом "Восстановления"',
    location: 'Екатеринбург, Урал',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=300&fit=crop',
    logo: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=100&h=100&fit=crop',
    shortDescription: 'Небольшой семейный реабилитационный центр с домашней атмосферой. Фокус на долгосрочной реабилитации и социальной адаптации.',
    priceFrom: 55000,
    duration: '90 дней',
    license: false,
    rating: 4.3,
    reviewsCount: 43,
    tags: ['Алкоголизм', 'Социальная адаптация', 'Трудовая терапия'],
    verification_status: 'pending',
    phone: '+7 (343) 456-78-90',
    address: 'ул. Ленина, д. 50, кв. 12',
    services: ['Групповая терапия', 'Трудовая терапия', 'Социальная адаптация'],
    methods: ['12 шагов', 'Терапевтическое сообщество'],
    capacity: 12,
    yearFounded: 2020,
    workingHours: '9:00 - 21:00',
    website: 'https://recovery-house.ru',
    email: 'help@recovery-house.ru',
    coordinates: {
      latitude: 56.8431,
      longitude: 60.6454
    },
    distance: 8.7,
    createdAt: '2023-04-05T10:00:00Z',
    updatedAt: '2024-04-05T10:00:00Z'
  },
  {
    id: '5',
    slug: 'freedom-clinic',
    name: 'Клиника "Свобода"',
    location: 'Новосибирск, Сибирь',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop',
    logo: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=100&h=100&fit=crop',
    shortDescription: 'Крупный медицинский центр с отделением наркологии. Предоставляем полный спектр услуг от детоксикации до длительной реабилитации.',
    priceFrom: 95000,
    duration: '30 дней',
    license: true,
    rating: 4.7,
    reviewsCount: 203,
    tags: ['Алкоголизм', 'Наркомания', 'Игровая зависимость', 'Пищевая зависимость'],
    verification_status: 'verified',
    phone: '+7 (383) 567-89-01',
    address: 'ул. Красный проспект, д. 200',
    services: ['Детокс', 'Психотерапия', 'Медикаментозное лечение', 'Физиотерапия', 'ЛФК'],
    methods: ['Когнитивно-поведенческая терапия', 'Миннесотская модель', 'Мотивационное интервью'],
    capacity: 80,
    yearFounded: 2005,
    workingHours: 'Круглосуточно',
    website: 'https://freedom-clinic.ru',
    email: 'info@freedom-clinic.ru',
    coordinates: {
      latitude: 55.0084,
      longitude: 82.9357
    },
    distance: 12.3,
    createdAt: '2023-05-12T10:00:00Z',
    updatedAt: '2024-05-12T10:00:00Z'
  },
  {
    id: '6',
    slug: 'start-over-center',
    name: 'Центр "Начать Заново"',
    location: 'Казань, Татарстан',
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=300&fit=crop',
    logo: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=100&h=100&fit=crop',
    shortDescription: 'Современный реабилитационный центр с акцентом на психологическую помощь и духовное развитие. Работаем с различными видами зависимостей.',
    priceFrom: 65000,
    duration: '45 дней',
    license: true,
    rating: 4.5,
    reviewsCount: 78,
    tags: ['Алкоголизм', 'Наркомания', 'Духовное развитие'],
    verification_status: 'verified',
    phone: '+7 (843) 678-90-12',
    address: 'ул. Баумана, д. 75',
    services: ['Психотерапия', 'Духовное консультирование', 'Групповая терапия'],
    methods: ['12 шагов', 'Духовная терапия', 'Медитация'],
    capacity: 35,
    yearFounded: 2012,
    workingHours: '8:00 - 20:00',
    website: 'https://start-over-center.ru',
    email: 'contact@start-over-center.ru',
    coordinates: {
      latitude: 55.8304,
      longitude: 49.0661
    },
    distance: 6.9,
    createdAt: '2023-06-18T10:00:00Z',
    updatedAt: '2024-06-18T10:00:00Z'
  }
];

// Функция для получения случайного центра (для демонстрации)
export const getRandomCenter = (): RehabCenter => {
  const randomIndex = Math.floor(Math.random() * mockRehabCenters.length);
  return mockRehabCenters[randomIndex];
};

// Функция для получения центров по статусу верификации
export const getCentersByStatus = (status: RehabCenter['verification_status']): RehabCenter[] => {
  return mockRehabCenters.filter(center => center.verification_status === status);
};

// Функция для получения центров с лицензией
export const getLicensedCenters = (): RehabCenter[] => {
  return mockRehabCenters.filter(center => center.license === true);
};

// Функция для получения центров по цене
export const getCentersByPriceRange = (minPrice: number, maxPrice: number): RehabCenter[] => {
  return mockRehabCenters.filter(center => 
    center.priceFrom && center.priceFrom >= minPrice && center.priceFrom <= maxPrice
  );
};

// Функция для поиска центров по названию или описанию
export const searchCenters = (query: string): RehabCenter[] => {
  const lowercaseQuery = query.toLowerCase();
  return mockRehabCenters.filter(center => 
    center.name.toLowerCase().includes(lowercaseQuery) ||
    center.shortDescription?.toLowerCase().includes(lowercaseQuery) ||
    center.location.toLowerCase().includes(lowercaseQuery) ||
    center.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};
