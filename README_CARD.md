# README_CARD.md

## Карточки реабилитационных центров для поиска

### Обзор

Компонент `CardRehabCenter` предназначен для отображения карточек реабилитационных центров в разделе поиска приложения РЕБА. Компонент использует эффект "жидкого стекла" (glassmorphism) и полностью интегрирован с существующей дизайн-системой проекта.

### Файлы

- `src/components/common/CardRehabCenter.tsx` - основной компонент карточки
- `src/screens/SearchScreen.tsx` - обновленный экран поиска с интеграцией карточек
- `src/screens/SearchPage.tsx` - отдельная страница для preview
- `src/data/mockCenters.ts` - мок-данные для тестирования
- `src/types/index.ts` - обновленные TypeScript типы

### Используемые CSS-переменные и токены

#### Цвета (из THEME)
```typescript
// Основные цвета
THEME.textPrimary: '#111827'        // Основной текст
THEME.textSecondary: '#374151'      // Вторичный текст
THEME.primary: '#0A84FF'            // Основной акцентный цвет
THEME.bgTop: '#ffffff'              // Верхний градиент фона
THEME.bgMid: '#ffffff'              // Средний градиент фона
THEME.bgBottom: '#ffffff'           // Нижний градиент фона

// Тени
THEME.shadowSmall: {                 // Маленькие тени
  shadowColor: '#000000',
  shadowOpacity: 0.08,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 4 },
  elevation: 4
}

THEME.shadowMedium: {                // Средние тени
  shadowColor: '#000000',
  shadowOpacity: 0.12,
  shadowRadius: 20,
  shadowOffset: { width: 0, height: 8 },
  elevation: 8
}
```

#### Адаптивные размеры (из responsive utils)
```typescript
// Адаптивные функции
responsiveWidth(size: number)        // Адаптивная ширина
responsiveHeight(size: number)       // Адаптивная высота
responsivePadding(size: number)      // Адаптивные отступы

// Примеры использования
responsiveWidth(20)                  // Адаптивная ширина 20px
responsiveHeight(200)               // Адаптивная высота 200px
responsivePadding(16)                // Адаптивные отступы 16px
```

#### Glassmorphism эффекты
```typescript
// BlurView с различной интенсивностью
<BlurView intensity={15} tint="light" />

// Градиенты для эффекта стекла
colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.8)']}  // Основной
colors={['rgba(10, 132, 255, 0.9)', 'rgba(10, 132, 255, 0.8)']}   // Акцентный
colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.3)']}                   // Темный
```

### Компоненты и их стили

#### CardRehabCenter
- **Размеры**: Адаптивная ширина с отступами 16px по бокам
- **Радиус**: 20px для основного контейнера
- **Тени**: THEME.shadowMedium для глубины
- **BlurView**: intensity={15} для эффекта стекла

#### Элементы карточки
- **Изображение**: 200px высота, cover режим
- **Кнопки**: 40x40px для избранного, 12px радиус для действий
- **Текст**: Адаптивные размеры шрифтов (14-18px)
- **Отступы**: 20px внутренние отступы контента

### API и интеграция

#### Пропсы компонента
```typescript
interface CardRehabCenterProps {
  center: RehabCenter;                    // Данные центра
  onOpen: (centerId: string) => void;     // Обработчик открытия
  onCall?: (phone: string) => void;      // Обработчик звонка
  onToggleFavorite?: (centerId: string) => void; // Избранное
  isFavorite?: boolean;                   // Статус избранного
  showDistance?: boolean;                // Показывать расстояние
}
```

#### Интерфейс RehabCenter
```typescript
interface RehabCenter {
  id: string;
  name: string;
  location: string;
  image?: string;
  shortDescription?: string;
  priceFrom?: number;
  duration?: string;
  license?: boolean;
  rating?: number;
  reviewsCount?: number;
  tags?: string[];
  verification_status?: 'draft'|'pending'|'verified'|'rejected';
  phone?: string;
  // ... другие поля
}
```

### Функциональность

#### Основные возможности
- ✅ Отображение hero изображения с placeholder
- ✅ Название, локация и описание центра
- ✅ Форматирование цены ("от 70 000 ₽" или "По запросу")
- ✅ Рейтинг со звездами (0-5)
- ✅ Количество отзывов
- ✅ Бейдж лицензии (если license === true)
- ✅ Теги/услуги (до 3 штук + счетчик)
- ✅ Статус верификации с цветовой индикацией

#### Интерактивность
- ✅ Primary CTA: "Подробнее" → onOpen(center.id)
- ✅ Secondary CTA: "Позвонить" → tel: (если есть телефон)
- ✅ Кнопка избранного с анимацией
- ✅ Кликабельная карточка целиком

#### Доступность (a11y)
- ✅ role="article" для карточки
- ✅ aria-labelledby для заголовка
- ✅ alt для изображений
- ✅ accessibilityLabel для кнопок
- ✅ accessibilityHint для действий

### Адаптивность

#### Мобильный вид
- Вертикальная карточка (hero сверху, контент под ним)
- Адаптивные размеры через responsiveWidth/Height
- Отступы 16px по бокам

#### Десктоп
- Карточка адаптируется под ширину экрана
- Использует существующую сетку проекта
- Сохраняет пропорции элементов

### Анимации

#### Встроенные анимации
- **Нажатие карточки**: scale 0.95 → 1.0 (200ms)
- **Кнопка избранного**: scale 1.0 → 1.3 → 1.0 (300ms)
- **Переходы**: плавные через useNativeDriver

### TODO для интеграции с API

#### Места для lazy-loading
```typescript
// В CardRehabCenter.tsx, строка ~100
<OptimizedImage
  uri={center.image || 'https://via.placeholder.com/300x200?text=Реабилитационный+центр'}
  // TODO: Добавить lazy loading для изображений
  // TODO: Добавить skeleton loader во время загрузки
/>
```

#### Интеграция с реальным API
```typescript
// В SearchScreen.tsx, строка ~74
const filteredCenters = useMemo(() => {
  // TODO: Заменить mockRehabCenters на реальный API вызов
  // TODO: Добавить состояние загрузки
  // TODO: Добавить обработку ошибок
  let centers = mockRehabCenters;
  // ...
}, [searchQuery, selectedFilter]);
```

#### Кэширование и оптимизация
```typescript
// TODO: Добавить кэширование изображений
// TODO: Реализовать виртуализацию для больших списков
// TODO: Добавить pull-to-refresh
// TODO: Реализовать infinite scroll
```

### Тестирование

#### Мок-данные
Файл `src/data/mockCenters.ts` содержит 6 тестовых центров с различными комбинациями:
- С лицензией/без лицензии
- С ценой/по запросу
- С фото/без фото
- Разный рейтинг (4.3 - 4.9)
- Разные статусы верификации
- Разные теги и услуги

#### Функции для тестирования
```typescript
getRandomCenter()                    // Случайный центр
getCentersByStatus(status)           // Фильтр по статусу
getLicensedCenters()                 // Только с лицензией
getCentersByPriceRange(min, max)     // Фильтр по цене
searchCenters(query)                 // Поиск по тексту
```

### Использование

#### Базовое использование
```typescript
import CardRehabCenter from '../components/common/CardRehabCenter';

<CardRehabCenter
  center={centerData}
  onOpen={(id) => console.log('Open center:', id)}
  onCall={(phone) => Linking.openURL(`tel:${phone}`)}
  onToggleFavorite={(id) => console.log('Toggle favorite:', id)}
  isFavorite={false}
  showDistance={true}
/>
```

#### В списке
```typescript
<FlatList
  data={centers}
  renderItem={({ item }) => (
    <CardRehabCenter
      center={item}
      onOpen={handleCenterOpen}
      onCall={handleCall}
      onToggleFavorite={handleToggleFavorite}
      isFavorite={favorites.has(item.id)}
      showDistance={true}
    />
  )}
  keyExtractor={(item) => item.id}
/>
```

### Совместимость

- ✅ React Native 0.72+
- ✅ Expo SDK 49+
- ✅ TypeScript 5.0+
- ✅ iOS 13+
- ✅ Android API 21+

### Производительность

- ✅ Использует React.memo для предотвращения лишних рендеров
- ✅ useCallback для стабильных ссылок на функции
- ✅ useMemo для вычисляемых значений
- ✅ OptimizedImage для эффективной загрузки изображений
- ✅ useNativeDriver для анимаций

### Безопасность

- ✅ Валидация входных данных
- ✅ Безопасная обработка URL изображений
- ✅ Защита от XSS через React Native
- ✅ Контроль доступа к функциям телефона

---

**Версия**: 1.0.0  
**Дата**: 2024  
**Автор**: REBA Development Team
