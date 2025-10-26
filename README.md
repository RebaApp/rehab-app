# РЕБА - Реабилитационные центры России

[![React Native](https://img.shields.io/badge/React%20Native-0.72-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-49.0-black.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-orange.svg)](https://firebase.google.com/)
[![Yandex OAuth](https://img.shields.io/badge/Yandex-OAuth-red.svg)](https://oauth.yandex.ru/)

## О проекте

**РЕБА** — первый в России агрегатор реабилитационных центров, созданный с целью сделать доступ к профильной помощи простым, безопасным и измеримым. 

Платформа объединяет:
- **Витрину центров** с детальной информацией и отзывами
- **Административные инструменты** для управления центрами
- **Механизм доверия** через верификацию, отзывы и контент
- **ИИ-функции** для персонализации и рекомендаций

## Ключевые особенности

### Система авторизации
- **Яндекс OAuth** - быстрый вход через Яндекс ID
- **Email/пароль** - классическая регистрация через Firebase
- **Регистрация центров** - отдельный поток для медицинских учреждений
- **Безопасность** - полная верификация и защита данных

### Мобильное приложение
- **React Native + Expo** - кроссплатформенная разработка
- **TypeScript** - типобезопасность и масштабируемость
- **Zustand** - эффективное управление состоянием
- **Адаптивный дизайн** - поддержка всех размеров экранов

### Функционал платформы
- **Каталог центров** - поиск и фильтрация по параметрам
- **Детальная информация** - фото, услуги, цены, отзывы
- **Интерактивная карта** - геолокация и маршруты
- **Система отзывов** - честные оценки пациентов
- **Статьи и контент** - образовательные материалы

### Пользовательский интерфейс
- **Современный дизайн** - Material Design принципы
- **Анимации** - плавные переходы и микроинтерракции
- **Темная/светлая тема** - адаптация под предпочтения
- **Доступность** - поддержка скрин-ридеров

## Технический стек

### Frontend
- **React Native 0.72** - мобильная разработка
- **Expo SDK 49** - инструменты и сервисы
- **TypeScript 5.0** - типизация
- **Zustand** - управление состоянием
- **React Navigation** - навигация

### Backend & Services
- **Firebase Auth** - аутентификация
- **Yandex OAuth** - социальный вход
- **Firebase Firestore** - база данных
- **Firebase Storage** - файловое хранилище

### UI/UX
- **Expo Linear Gradient** - градиенты
- **Expo Blur** - эффекты размытия
- **React Native Reanimated** - анимации
- **Ionicons** - иконки

## Установка и запуск

### Предварительные требования
- Node.js 18+
- npm или yarn
- Expo CLI
- iOS Simulator или Android Emulator

### Быстрый старт

```bash
# Клонирование репозитория
git clone https://github.com/RebaApp/rehab-app.git
cd rehab-app

# Установка зависимостей
npm install

# Запуск в режиме разработки
npx expo start

# Запуск на iOS
npx expo start --ios

# Запуск на Android
npx expo start --android
```

### Настройка авторизации

1. **Firebase настройка:**
   ```bash
   # Создайте проект в Firebase Console
   # Скопируйте конфигурацию в src/config/firebase.ts
   ```

2. **Яндекс OAuth настройка:**
   ```bash
   # Зарегистрируйте приложение в Yandex OAuth
   # Обновите Client ID и Secret в src/services/authService.ts
   ```

## Архитектура проекта

```
src/
├── components/          # Переиспользуемые компоненты
│   ├── auth/           # Компоненты авторизации
│   └── common/         # Общие UI компоненты
├── screens/            # Экраны приложения
│   ├── HomeScreen.tsx  # Главная страница
│   ├── ProfileScreen.tsx # Профиль пользователя
│   └── ...
├── services/           # Бизнес-логика
│   └── authService.ts  # Сервис авторизации
├── store/             # Управление состоянием
│   └── useAppStore.ts # Zustand store
├── types/             # TypeScript типы
└── utils/             # Утилиты и константы
```

## Конфигурация

### Переменные окружения
```bash
# Firebase
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_domain
FIREBASE_PROJECT_ID=your_project_id

# Yandex OAuth
YANDEX_CLIENT_ID=your_client_id
YANDEX_CLIENT_SECRET=your_client_secret
```

## Производительность

- **Bundle size**: ~2.5MB (оптимизирован)
- **Startup time**: <3 секунд
- **Memory usage**: <100MB в активном состоянии
- **Battery optimization**: фоновые задачи оптимизированы

## Тестирование

```bash
# Запуск тестов
npm test

# Тестирование авторизации
npm run test:auth

# E2E тестирование
npm run test:e2e
```

## Roadmap

### Q1 2024
- [ ] ИИ-рекомендации центров
- [ ] Интеграция с медицинскими системами
- [ ] Расширенная аналитика

### Q2 2024
- [ ] Веб-версия платформы
- [ ] API для партнеров
- [ ] Многоязычность

### Q3 2024
- [ ] Телемедицина
- [ ] Чат-бот поддержка
- [ ] Мобильные уведомления

## Вклад в проект

Мы приветствуем вклад в развитие проекта! Пожалуйста, ознакомьтесь с [CONTRIBUTING.md](CONTRIBUTING.md) для получения подробной информации.

### Как помочь:
1. **Сообщения об ошибках** - создавайте Issues
2. **Предложения** - делитесь идеями в Discussions
3. **Pull Requests** - улучшайте код
4. **Документация** - помогайте с описаниями

## Лицензия

Этот проект лицензирован под MIT License - см. файл [LICENSE](LICENSE) для деталей.

## Команда

**Основатель и главный разработчик:** Вадим Давыдов

## Контакты

- **Telegram**: [@vadimsao](https://t.me/vadimsao)
- **Email**: info@reba-app.ru
- **Website**: https://reba-app.ru

## Благодарности

Спасибо всем участникам сообщества за вклад в развитие проекта!

---

<div align="center">
  <strong>РЕБА</strong> - делаем реабилитацию доступной для всех
</div>
