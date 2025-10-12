# 🏥 Reba Backend API

Backend API для приложения центров реабилитации РЕБА.

## 🚀 Быстрый старт

### 1. Установка зависимостей

```bash
cd server
npm install
```

### 2. Настройка окружения

```bash
cp env.example .env
```

Отредактируйте `.env` файл:

```env
DATABASE_URL="postgresql://reba_user:reba_password_2024@localhost:5432/reba_db?schema=public"
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"
PORT=3001
NODE_ENV="development"
```

### 3. Запуск с Docker Compose

```bash
# Запуск всех сервисов
docker-compose up -d

# Просмотр логов
docker-compose logs -f

# Остановка
docker-compose down
```

### 4. Инициализация базы данных

```bash
# Генерация Prisma клиента
npx prisma generate

# Применение миграций
npx prisma migrate dev

# Заполнение тестовыми данными
npm run seed
```

## 🔧 Разработка

### Запуск в режиме разработки

```bash
# Установка зависимостей
npm install

# Запуск PostgreSQL (если не используете Docker)
# Установите PostgreSQL и создайте базу данных

# Применение миграций
npx prisma migrate dev

# Запуск сервера
npm run dev
```

### Полезные команды

```bash
# Просмотр базы данных
npx prisma studio

# Сброс базы данных
npx prisma migrate reset

# Генерация Prisma клиента
npx prisma generate
```

## 📡 API Endpoints

### Аутентификация
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход
- `GET /api/auth/me` - Получить текущего пользователя
- `PUT /api/auth/profile` - Обновить профиль

### Центры
- `GET /api/centers` - Список центров
- `GET /api/centers/:id` - Центр по ID
- `POST /api/centers` - Создать центр (требует авторизации)
- `PUT /api/centers/:id` - Обновить центр (владелец/админ)
- `DELETE /api/centers/:id` - Удалить центр (владелец/админ)

### Статьи
- `GET /api/articles` - Список статей
- `GET /api/articles/:id` - Статья по ID

### Пользователи
- `GET /api/users/profile` - Профиль пользователя
- `PUT /api/users/profile` - Обновить профиль
- `GET /api/users/centers` - Центры пользователя
- `GET /api/users/bookings` - Бронирования пользователя

### Бронирования
- `POST /api/bookings` - Создать бронирование
- `GET /api/bookings/my` - Мои бронирования
- `PUT /api/bookings/:id/status` - Обновить статус (владелец центра)

## 🗄️ База данных

### Основные таблицы:
- `users` - Пользователи
- `centers` - Центры реабилитации
- `photos` - Фотографии центров
- `articles` - Статьи
- `bookings` - Бронирования
- `reviews` - Отзывы

### Связующие таблицы:
- `center_types` - Типы зависимостей
- `services` - Услуги
- `methods` - Методы лечения

## 🔒 Безопасность

- JWT токены для аутентификации
- Хеширование паролей с bcrypt
- Rate limiting
- CORS настройки
- Валидация входных данных
- Helmet для безопасности заголовков

## 📁 Структура проекта

```
server/
├── src/
│   ├── controllers/     # Контроллеры
│   ├── middleware/      # Middleware
│   ├── models/         # Модели данных
│   ├── routes/         # Маршруты API
│   ├── utils/          # Утилиты
│   ├── index.js        # Главный файл сервера
│   └── seed.js         # Заполнение данными
├── prisma/
│   └── schema.prisma   # Схема базы данных
├── uploads/            # Загруженные файлы
├── logs/              # Логи
├── docker-compose.yml # Docker конфигурация
├── Dockerfile         # Docker образ
└── nginx.conf         # Nginx конфигурация
```

## 🌐 Развертывание на Сбербанк Облако

### 1. Подготовка сервера

```bash
# Установка Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Установка Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. Загрузка проекта

```bash
# Клонирование репозитория
git clone <your-repo-url>
cd reba/server

# Настройка окружения
cp env.example .env
# Отредактируйте .env файл
```

### 3. Запуск

```bash
# Запуск всех сервисов
docker-compose up -d

# Проверка статуса
docker-compose ps

# Просмотр логов
docker-compose logs -f
```

### 4. Настройка домена

Настройте DNS запись для вашего домена, указывающую на публичный IP сервера.

## 📊 Мониторинг

### Health Check
- `GET /health` - Проверка состояния сервера

### Логи
- API логи: `docker-compose logs api`
- Nginx логи: `docker-compose logs nginx`
- PostgreSQL логи: `docker-compose logs postgres`

## 🆘 Поддержка

При возникновении проблем:

1. Проверьте логи: `docker-compose logs`
2. Проверьте статус контейнеров: `docker-compose ps`
3. Перезапустите сервисы: `docker-compose restart`
4. Проверьте подключение к базе данных: `npx prisma studio`
