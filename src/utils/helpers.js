import { Platform, Linking, Alert } from 'react-native';
import { CENTER_NAMES, CITIES, DEP_TYPES, FALLBACK_IMAGE } from './constants';

export const parsePrice = (priceStr) => {
  const match = priceStr.match(/\d+/g);
  return match ? parseInt(match.join('')) : 0;
};

export const openMap = (lat, lon, name) => {
  const url = Platform.OS === 'ios' 
    ? `maps://maps.google.com/maps?daddr=${lat},${lon}&amp;ll=`
    : `geo:${lat},${lon}?q=${lat},${lon}(${name})`;
  
  Linking.openURL(url).catch(() => {
    // В production можно логировать ошибки в сервис аналитики
    // console.error('Error opening map:', err);
    Alert.alert('Ошибка', 'Не удалось открыть карту');
  });
};

export const generateCenters = () => {
  const centers = [];
  for (let i = 1; i <= 20; i++) {
    const city = CITIES[Math.floor(Math.random() * CITIES.length)];
    const name = CENTER_NAMES[Math.floor(Math.random() * CENTER_NAMES.length)];
    const types = DEP_TYPES.slice(0, Math.floor(Math.random() * 3) + 1);
    
    centers.push({
      id: i.toString(),
      name: `${name} ${i}`,
      city,
      address: `ул. Примерная, ${Math.floor(Math.random() * 100) + 1}`,
      phone: `+7 (${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 90) + 10}-${Math.floor(Math.random() * 90) + 10}`,
      email: `info@center${i}.ru`,
      rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
      reviewsCount: Math.floor(Math.random() * 50) + 5,
      verified: Math.random() > 0.3,
      photos: [FALLBACK_IMAGE],
      services: types,
      description: `Профессиональная помощь в борьбе с ${types.join(', ').toLowerCase()}. Современные методы лечения и индивидуальный подход.`,
      price: `${Math.floor(Math.random() * 50000) + 20000} ₽/месяц`,
      duration: `${Math.floor(Math.random() * 30) + 7} дней`,
      coordinates: {
        latitude: 55.7558 + (Math.random() - 0.5) * 0.1,
        longitude: 37.6176 + (Math.random() - 0.5) * 0.1
      },
      workingHours: "Пн-Вс: 9:00-21:00",
      capacity: Math.floor(Math.random() * 50) + 20,
      yearFounded: 2010 + Math.floor(Math.random() * 14),
      license: `ЛО-77-01-${Math.floor(Math.random() * 900000) + 100000}`,
      descriptionFull: `Наш центр предлагает комплексные программы реабилитации, включающие детоксикацию, психотерапию, групповые занятия и поддержку после выписки. Мы используем современные методики и гарантируем конфиденциальность.`,
      methods: ["12 шагов", "Когнитивно-поведенческая терапия", "Арт-терапия"],
      reviews: [
        {
          id: `${i}_1`,
          userName: "Анна К.",
          rating: 5,
          text: "Отличный центр! Очень помогли в борьбе с зависимостью. Рекомендую всем!",
          date: "2024-01-15"
        }
      ]
    });
  }
  return centers;
};

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Радиус Земли в км
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};