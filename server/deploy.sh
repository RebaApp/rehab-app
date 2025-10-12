#!/bin/bash

# Скрипт для развертывания на Сбербанк Облако
echo "🚀 Начинаем развертывание РЕБА на Сбербанк Облако..."

# Обновляем систему
echo "📦 Обновляем систему..."
sudo apt update && sudo apt upgrade -y

# Устанавливаем Docker
echo "🐳 Устанавливаем Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Устанавливаем Docker Compose
echo "🔧 Устанавливаем Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Создаем директории
echo "📁 Создаем директории..."
mkdir -p /home/$USER/reba-server
cd /home/$USER/reba-server

# Копируем файлы проекта
echo "📋 Копируем файлы проекта..."
# Здесь вы скопируете файлы с вашего компьютера

# Настраиваем окружение
echo "⚙️ Настраиваем окружение..."
cp env.example .env
echo "Отредактируйте файл .env с вашими настройками!"

# Запускаем сервисы
echo "🚀 Запускаем сервисы..."
docker-compose up -d

# Ждем запуска базы данных
echo "⏳ Ждем запуска базы данных..."
sleep 30

# Инициализируем базу данных
echo "🗄️ Инициализируем базу данных..."
docker-compose exec api npx prisma migrate dev
docker-compose exec api npm run seed

echo "✅ Развертывание завершено!"
echo "🌐 API доступно по адресу: http://$(curl -s ifconfig.me):3001"
echo "📊 Health check: http://$(curl -s ifconfig.me):3001/health"
echo "🔍 Просмотр логов: docker-compose logs -f"
