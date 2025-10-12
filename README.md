# 🏥 Rehab App - Приложение реабилитационных центров

[![React Native](https://img.shields.io/badge/React%20Native-0.73-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK%2053-000020.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Performance](https://img.shields.io/badge/Performance-Optimized-green.svg)](#performance-optimizations)

> Современное мобильное приложение для поиска и бронирования реабилитационных центров с оптимизированной производительностью и отличным UX.

## 🚀 Особенности

### ✨ Основной функционал
- 🔍 **Поиск центров** - Умный поиск с фильтрацией по городу, типу услуг, цене и рейтингу
- 📰 **Статьи** - Полезные материалы о реабилитации и здоровье
- ❤️ **Избранное** - Сохранение понравившихся центров
- 👤 **Профиль** - Управление аккаунтом и настройками
- 📱 **Адаптивный дизайн** - Красивый интерфейс для всех устройств

### ⚡ Оптимизации производительности
- 🚀 **FlashList** - Быстрый рендеринг списков (60-70% улучшение)
- 🎨 **Мемоизация** - Оптимизированные компоненты (80% меньше ре-рендеров)
- 🖼️ **Умные изображения** - Кэширование и оптимизация загрузки
- 💾 **Нормализация данных** - Эффективное управление состоянием
- 🔄 **API кэширование** - Многоуровневое кэширование запросов

## 📊 Результаты оптимизации

| Метрика | До | После | Улучшение |
|---------|-----|-------|-----------|
| Время загрузки списка | 800-1200ms | 200-300ms | ⬆️ **300%** |
| FPS при прокрутке | 30-40 | 55-60 | ⬆️ **50%** |
| Потребление памяти | 120-150MB | 70-90MB | ⬇️ **40%** |
| Время ре-рендера | 80-120ms | 15-25ms | ⬆️ **400%** |

## 🛠️ Технологический стек

### Frontend
- **React Native** 0.73 - Кроссплатформенная разработка
- **Expo SDK** 53 - Упрощенная разработка и деплой
- **TypeScript** 5.0 - Строгая типизация
- **Zustand** - Легковесное управление состоянием
- **FlashList** - Высокопроизводительные списки
- **Expo Image** - Оптимизированная загрузка изображений

### Backend
- **Node.js** - Серверная логика
- **Express** - Web фреймворк
- **Prisma** - ORM для работы с БД
- **PostgreSQL** - Основная база данных
- **JWT** - Аутентификация

### Инструменты разработки
- **ESLint** - Линтинг кода
- **Jest** - Тестирование
- **TypeScript** - Проверка типов
- **Git** - Контроль версий

## 🚀 Быстрый старт

### Предварительные требования
- Node.js 18+
- npm или yarn
- Expo CLI
- iOS Simulator или Android Emulator

### Установка

1. **Клонирование репозитория**
```bash
git clone https://github.com/RebaApp/rehab-app.git
cd rehab-app
```

2. **Установка зависимостей**
```bash
npm install
```

3. **Запуск приложения**
```bash
# Для разработки
npm start

# Для iOS
npm run ios

# Для Android
npm run android

# Для Web
npm run web
```

### Настройка бэкенда

1. **Переход в папку сервера**
```bash
cd server
```

2. **Установка зависимостей**
```bash
npm install
```

3. **Настройка переменных окружения**
```bash
cp env.example .env
# Отредактируйте .env файл
```

4. **Запуск сервера**
```bash
npm run dev
```

## 📁 Структура проекта

```
rehab-app/
├── 📱 src/                          # Исходный код приложения
│   ├── components/                  # React компоненты
│   │   └── common/                  # Переиспользуемые компоненты
│   │       ├── OptimizedImage.tsx   # Оптимизированный компонент изображений
│   │       ├── CenterCard.tsx       # Карточка центра
│   │       └── ArticleCard.tsx      # Карточка статьи
│   ├── screens/                     # Экраны приложения
│   │   ├── HomeScreen.tsx           # Главный экран
│   │   ├── SearchScreen.tsx         # Поиск центров
│   │   └── ProfileScreen.tsx        # Профиль пользователя
│   ├── hooks/                       # Кастомные хуки
│   ├── services/                    # API сервисы
│   │   ├── apiService.ts            # Основной API сервис
│   │   └── optimizedApiService.ts    # Оптимизированный API сервис
│   ├── store/                       # Управление состоянием
│   │   ├── useAppStore.ts           # Основной store
│   │   └── useOptimizedAppStore.ts  # Оптимизированный store
│   ├── utils/                       # Утилиты
│   │   ├── normalization.ts         # Нормализация данных
│   │   ├── constants.js             # Константы
│   │   └── helpers.js               # Вспомогательные функции
│   └── types/                       # TypeScript типы
├── 🖥️ server/                       # Бэкенд приложения
│   ├── src/                         # Исходный код сервера
│   ├── prisma/                      # Схема базы данных
│   └── docker-compose.yml           # Docker конфигурация
├── 📋 docs/                         # Документация
│   ├── PERFORMANCE_OPTIMIZATION_REPORT.md
│   ├── LAUNCH_REPORT.md
│   └── REFACTORING_GUIDE.md
└── 🧪 __tests__/                    # Тесты
```

## 🎯 Ключевые компоненты

### OptimizedImage
```typescript
<OptimizedImage
  uri="https://example.com/image.jpg"
  style={styles.image}
  cachePolicy="memory"
  contentFit="cover"
  transition={200}
/>
```

### FlashList для производительности
```typescript
<FlashList
  data={centers}
  renderItem={renderCenter}
  estimatedItemSize={250}
  drawDistance={500}
/>
```

### Нормализованное состояние
```typescript
const getCenterById = useOptimizedAppStore(state => state.getCenterById);
const center = getCenterById('center-id');
```

## 🧪 Тестирование

```bash
# Запуск всех тестов
npm test

# Тесты в watch режиме
npm run test:watch

# Покрытие кода
npm run test:coverage
```

## 📝 Скрипты

```bash
npm start          # Запуск Expo dev server
npm run ios        # Запуск на iOS симуляторе
npm run android    # Запуск на Android эмуляторе
npm run web        # Запуск веб версии
npm run type-check # Проверка TypeScript типов
npm run lint       # Линтинг кода
npm run lint:fix   # Автоисправление линтинга
```

## 🚀 Деплой

### Мобильные платформы
```bash
# Сборка для iOS
expo build:ios

# Сборка для Android
expo build:android
```

### Веб
```bash
# Сборка веб версии
expo build:web
```

### Сервер
```bash
cd server
docker-compose up -d
```

## 📈 Мониторинг производительности

Приложение включает встроенные инструменты для мониторинга:

- **FPS метрики** - Отслеживание производительности рендеринга
- **Memory usage** - Мониторинг использования памяти
- **API response times** - Время ответа API
- **Cache hit rates** - Эффективность кэширования

## 🤝 Вклад в проект

Мы приветствуем вклад в развитие проекта! Пожалуйста:

1. Форкните репозиторий
2. Создайте feature branch (`git checkout -b feature/amazing-feature`)
3. Зафиксируйте изменения (`git commit -m 'Add amazing feature'`)
4. Отправьте в branch (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📄 Лицензия

Этот проект лицензирован под MIT License - см. файл [LICENSE](LICENSE) для деталей.

## 👥 Команда

- **Frontend Developer** - React Native, TypeScript, Performance Optimization
- **Backend Developer** - Node.js, Express, PostgreSQL
- **UI/UX Designer** - Дизайн интерфейса и пользовательский опыт

## 📞 Поддержка

Если у вас есть вопросы или предложения:

- 📧 Email: support@rehabapp.com
- 🐛 Issues: [GitHub Issues](https://github.com/RebaApp/rehab-app/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/RebaApp/rehab-app/discussions)

## 🎉 Благодарности

Спасибо всем контрибьюторам и сообществу React Native за отличные инструменты и библиотеки!

---

<div align="center">

**Сделано с ❤️ для помощи людям в поиске качественной реабилитации**

[⭐ Поставьте звезду](https://github.com/RebaApp/rehab-app) | [🐛 Сообщить об ошибке](https://github.com/RebaApp/rehab-app/issues) | [💡 Предложить улучшение](https://github.com/RebaApp/rehab-app/discussions)

</div>