# 🏦 Развертывание РЕБА на Сбербанк Облако

## 📋 ЧТО НУЖНО СДЕЛАТЬ:

### 1. 🖥️ ПОДКЛЮЧЕНИЕ К СЕРВЕРУ

**1.1. Получите данные для подключения:**
- IP адрес сервера: `ваш-ip-адрес`
- Логин: `root` или `ubuntu`
- Пароль: `ваш-пароль`

**1.2. Подключитесь к серверу:**
```bash
# На Mac/Linux
ssh root@ваш-ip-адрес

# На Windows (используйте PuTTY или Windows Terminal)
ssh root@ваш-ip-адрес
```

### 2. 📁 ЗАГРУЗКА ФАЙЛОВ

**2.1. Создайте папку на сервере:**
```bash
mkdir -p /home/root/reba-server
cd /home/root/reba-server
```

**2.2. Загрузите файлы проекта:**
Есть несколько способов:

**Способ А: Через SCP (рекомендуется)**
```bash
# На вашем компьютере выполните:
scp -r /Users/a1/Downloads/rehab/server/* root@ваш-ip-адрес:/home/root/reba-server/
```

**Способ Б: Через Git (если есть репозиторий)**
```bash
# На сервере
git clone https://github.com/ваш-username/reba.git
cd reba/server
```

**Способ В: Через веб-интерфейс Сбербанк Облако**
- Загрузите файлы через веб-интерфейс
- Распакуйте архив на сервере

### 3. 🚀 АВТОМАТИЧЕСКОЕ РАЗВЕРТЫВАНИЕ

**3.1. Запустите скрипт развертывания:**
```bash
cd /home/root/reba-server
chmod +x deploy.sh
./deploy.sh
```

**3.2. Настройте переменные окружения:**
```bash
nano .env
```

Отредактируйте файл `.env`:
```env
DATABASE_URL="postgresql://reba_user:reba_password_2024@postgres:5432/reba_db?schema=public"
JWT_SECRET="ваш-супер-секретный-ключ-измените-в-продакшене"
JWT_EXPIRES_IN="7d"
PORT=3001
NODE_ENV="production"
CORS_ORIGIN="*"
```

### 4. 🔧 РУЧНОЕ РАЗВЕРТЫВАНИЕ (если автоматическое не сработало)

**4.1. Установите Docker:**
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

**4.2. Установите Docker Compose:**
```bash
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

**4.3. Запустите сервисы:**
```bash
docker-compose up -d
```

**4.4. Инициализируйте базу данных:**
```bash
# Ждем запуска базы данных
sleep 30

# Применяем миграции
docker-compose exec api npx prisma migrate dev

# Заполняем тестовыми данными
docker-compose exec api npm run seed
```

### 5. ✅ ПРОВЕРКА РАБОТЫ

**5.1. Проверьте статус сервисов:**
```bash
docker-compose ps
```

Должно показать:
```
NAME                IMAGE               STATUS
reba_postgres       postgres:15-alpine  Up
reba_api            reba-backend        Up
reba_nginx          nginx:alpine        Up
```

**5.2. Проверьте API:**
```bash
curl http://localhost:3001/health
```

Должно вернуть:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456
}
```

**5.3. Проверьте доступность извне:**
```bash
curl http://ваш-ip-адрес:3001/health
```

### 6. 🌐 НАСТРОЙКА ДОМЕНА (опционально)

**6.1. Купите домен** (например, reba-app.ru)

**6.2. Настройте DNS:**
- A запись: `reba-app.ru` → `ваш-ip-адрес`
- A запись: `api.reba-app.ru` → `ваш-ip-адрес`

**6.3. Настройте SSL сертификат:**
```bash
# Установите Certbot
sudo apt install certbot

# Получите сертификат
sudo certbot certonly --standalone -d reba-app.ru -d api.reba-app.ru
```

### 7. 📱 ИНТЕГРАЦИЯ С ПРИЛОЖЕНИЕМ

**7.1. Обновите URL API в приложении:**
Замените `http://localhost:3001` на `http://ваш-ip-адрес:3001`

**7.2. Протестируйте приложение:**
- Запустите Expo Go
- Проверьте регистрацию/вход
- Проверьте загрузку центров

## 🆘 РЕШЕНИЕ ПРОБЛЕМ

### Проблема: "Docker не установлен"
```bash
# Перезапустите сессию SSH
exit
ssh root@ваш-ip-адрес
# Или перезагрузите сервер
sudo reboot
```

### Проблема: "Порт 3001 недоступен"
```bash
# Проверьте, что сервисы запущены
docker-compose ps

# Проверьте логи
docker-compose logs api
```

### Проблема: "База данных не подключается"
```bash
# Перезапустите базу данных
docker-compose restart postgres

# Проверьте логи базы данных
docker-compose logs postgres
```

## 📞 ПОДДЕРЖКА

Если что-то не работает:
1. Проверьте логи: `docker-compose logs`
2. Проверьте статус: `docker-compose ps`
3. Перезапустите: `docker-compose restart`
4. Обратитесь за помощью с логами ошибок
