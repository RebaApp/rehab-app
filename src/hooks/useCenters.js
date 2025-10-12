import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Функция генерации центров (временно, пока нет API)
const generateCenters = () => {
  const cities = ["Москва", "Санкт-Петербург", "Екатеринбург", "Новосибирск", "Казань", "Нижний Новгород", "Челябинск", "Самара", "Омск", "Ростов-на-Дону"];
  const types = ["алкоголизм", "наркомания", "игровая зависимость", "пищевая зависимость", "интернет-зависимость"];
  const names = ["Центр Возрождение", "Клиника Надежда", "Реабилитационный центр Вера", "Центр Исцеление", "Клиника Новый Путь", "Центр Возвращение", "Реабилитационный центр Свет", "Клиника Второй Шанс", "Центр Обновление", "Реабилитационный центр Путь к Жизни"];
  
  const cityCoordinates = {
    "Москва": { latitude: 55.7558, longitude: 37.6176 },
    "Санкт-Петербург": { latitude: 59.9311, longitude: 30.3609 },
    "Екатеринбург": { latitude: 56.8431, longitude: 60.6454 },
    "Новосибирск": { latitude: 55.0084, longitude: 82.9357 },
    "Казань": { latitude: 55.8304, longitude: 49.0661 },
    "Нижний Новгород": { latitude: 56.2965, longitude: 43.9361 },
    "Челябинск": { latitude: 55.1644, longitude: 61.4368 },
    "Самара": { latitude: 53.2001, longitude: 50.1500 },
    "Омск": { latitude: 54.9885, longitude: 73.3242 },
    "Ростов-на-Дону": { latitude: 47.2357, longitude: 39.7015 }
  };
  
  return Array.from({ length: 20 }, (_, i) => {
    const city = cities[i % cities.length];
    const baseCoords = cityCoordinates[city];
    
    return {
      id: `center_${i}`,
      name: names[i % names.length],
      city: city,
      coordinates: {
        latitude: baseCoords.latitude + (Math.random() - 0.5) * 0.1,
        longitude: baseCoords.longitude + (Math.random() - 0.5) * 0.1
      },
      types: types.slice(0, Math.floor(Math.random() * 3) + 1),
      price: `${Math.floor(Math.random() * 50 + 10)} 000 ₽/месяц`,
      rating: Number((Math.random() * 2 + 3).toFixed(1)),
      descriptionShort: "Профессиональная помощь в борьбе с зависимостями. Индивидуальный подход к каждому пациенту.",
      description: "Наш центр предоставляет комплексную программу реабилитации, включающую медицинское лечение, психологическую поддержку и социальную адаптацию. Мы работаем с различными видами зависимостей и помогаем людям вернуться к полноценной жизни.",
      photos: Array.from({ length: 3 }, () => "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop&crop=center"),
      address: `ул. Примерная, д. ${Math.floor(Math.random() * 100) + 1}`,
      phone: `+7 (${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 90) + 10}-${Math.floor(Math.random() * 90) + 10}`,
      email: `info@center${i}.ru`,
      website: `https://center${i}.ru`,
      workingHours: "Пн-Вс: 9:00-21:00",
      capacity: Math.floor(Math.random() * 50) + 20,
      yearFounded: 2000 + Math.floor(Math.random() * 24),
      license: `ЛО-77-01-${Math.floor(Math.random() * 900000) + 100000}`,
      services: ["Консультация", "Детокс", "Реабилитация", "Ресоциализация", "Поддержка семьи"],
      methods: ["12 шагов", "Когнитивно-поведенческая терапия", "Арт-терапия", "Спортивная терапия"],
      staff: {
        doctors: Math.floor(Math.random() * 10) + 5,
        psychologists: Math.floor(Math.random() * 8) + 3,
        nurses: Math.floor(Math.random() * 15) + 10
      },
      successRate: Math.floor(Math.random() * 20) + 70,
      insurance: Math.random() > 0.5,
      paymentMethods: ["Наличные", "Карта", "Перевод"],
      specializations: types.slice(0, Math.floor(Math.random() * 3) + 1),
      reviews: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, j) => ({
        id: `review_${i}_${j}`,
        author: `Пользователь ${j + 1}`,
        rating: Math.floor(Math.random() * 2) + 4,
        text: "Отличный центр, профессиональные специалисты, рекомендую!",
        date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }))
    };
  });
};

const useCenters = () => {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadCenters = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // В реальном приложении здесь будет API вызов
      const generatedCenters = generateCenters();
      setCenters(generatedCenters);
      
      // Сохраняем в кэш
      await AsyncStorage.setItem('reba:centers', JSON.stringify(generatedCenters));
    } catch (err) {
      // В production можно логировать ошибки в сервис аналитики
      // console.error('Error loading centers:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshCenters = useCallback(async () => {
    try {
      setRefreshing(true);
      setError(null);
      
      // В реальном приложении здесь будет API вызов
      const generatedCenters = generateCenters();
      setCenters(generatedCenters);
      
      // Сохраняем в кэш
      await AsyncStorage.setItem('reba:centers', JSON.stringify(generatedCenters));
    } catch (err) {
      // В production можно логировать ошибки в сервис аналитики
      // console.error('Error refreshing centers:', err);
      setError(err.message);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const loadCachedCenters = useCallback(async () => {
    try {
      const cachedCenters = await AsyncStorage.getItem('reba:centers');
      if (cachedCenters) {
        setCenters(JSON.parse(cachedCenters));
      }
    } catch {
      // В production можно логировать ошибки в сервис аналитики
      // console.error('Error loading cached centers:', err);
    }
  }, []);

  useEffect(() => {
    const initializeCenters = async () => {
      // Сначала загружаем кэшированные данные
      await loadCachedCenters();
      // Затем обновляем свежими данными
      await loadCenters();
    };
    
    initializeCenters();
  }, [loadCenters, loadCachedCenters]);

  return {
    centers,
    loading,
    refreshing,
    error,
    refreshCenters,
    loadCenters
  };
};

export default useCenters;
