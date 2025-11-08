# 📋 Применение миграции индексов локально

## 🎯 Цель

Применить индексы к локальной базе данных PostgreSQL для ускорения запросов.

---

## ✅ Способ 1: Через Prisma (РЕКОМЕНДУЕТСЯ)

### Шаг 1: Проверьте подключение к БД

Убедитесь, что:
- ✅ PostgreSQL запущен локально
- ✅ БД `reba_db` существует
- ✅ В `.env` правильный `DATABASE_URL`

### Шаг 2: Примените индексы

```bash
cd server

# Вариант А: Быстрое применение (db push)
npx prisma db push

# Вариант Б: Создать миграцию (рекомендуется для продакшена)
npx prisma migrate dev --name add_indexes
```

**Что произойдет:**
- Prisma сравнит `schema.prisma` с текущей БД
- Добавит недостающие индексы
- Обновит Prisma Client

---

## ✅ Способ 2: Через SQL напрямую

Если Prisma не работает, можно применить SQL напрямую:

### Шаг 1: Подключитесь к БД

```bash
# Если используете Docker
docker-compose exec postgres psql -U reba_user -d reba_db

# Если PostgreSQL установлен локально
psql -U username -d reba_db
```

### Шаг 2: Выполните SQL

```sql
-- Скопируйте содержимое файла:
-- server/prisma/migrations/add_indexes.sql

-- Или выполните команды:
CREATE INDEX IF NOT EXISTS "centers_city_idx" ON "centers"("city");
CREATE INDEX IF NOT EXISTS "centers_rating_idx" ON "centers"("rating");
CREATE INDEX IF NOT EXISTS "centers_verified_idx" ON "centers"("verified");
CREATE INDEX IF NOT EXISTS "centers_ownerId_idx" ON "centers"("ownerId");
CREATE INDEX IF NOT EXISTS "reviews_centerId_idx" ON "reviews"("centerId");
CREATE INDEX IF NOT EXISTS "reviews_userId_idx" ON "reviews"("userId");
```

---

## ✅ Способ 3: Через Node.js скрипт

Создайте файл `server/apply-indexes.js`:

```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');

async function applyIndexes() {
  try {
    const sql = fs.readFileSync(
      path.join(__dirname, 'prisma/migrations/add_indexes.sql'),
      'utf8'
    );
    
    // Разделяем SQL на отдельные команды
    const commands = sql
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd && !cmd.startsWith('--'));
    
    for (const command of commands) {
      if (command) {
        await prisma.$executeRawUnsafe(command);
        console.log('✅ Применено:', command.substring(0, 50) + '...');
      }
    }
    
    console.log('✅ Все индексы успешно применены!');
  } catch (error) {
    console.error('❌ Ошибка:', error);
  } finally {
    await prisma.$disconnect();
  }
}

applyIndexes();
```

Запустите:
```bash
cd server
node apply-indexes.js
```

---

## 🔍 Проверка результата

После применения проверьте индексы:

```sql
-- Подключитесь к БД
psql -U username -d reba_db

-- Проверьте индексы для centers
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'centers';

-- Проверьте индексы для reviews
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'reviews';
```

Должны быть видны:
- `centers_city_idx`
- `centers_rating_idx`
- `centers_verified_idx`
- `centers_ownerId_idx`
- `reviews_centerId_idx`
- `reviews_userId_idx`

---

## ⚠️ Важные замечания

1. **Резервная копия:** Перед применением сделайте бэкап БД (если есть важные данные)

2. **Время выполнения:** Индексы создаются быстро (1-5 секунд), даже на больших таблицах

3. **Безопасность:** `CREATE INDEX IF NOT EXISTS` безопасен - если индекс уже есть, ничего не произойдет

4. **Производительность:** После создания индексов запросы станут быстрее

---

## 🚀 Быстрая команда

Если все настроено, просто выполните:

```bash
cd server
npx prisma db push
```

Это применит все изменения из `schema.prisma`, включая индексы.

---

## ❓ Проблемы?

### Ошибка: "Cannot connect to database"
- Проверьте, что PostgreSQL запущен
- Проверьте `DATABASE_URL` в `.env`
- Проверьте права доступа

### Ошибка: "Database does not exist"
- Создайте БД: `CREATE DATABASE reba_db;`
- Или используйте существующую БД

### Ошибка: "Permission denied"
- Проверьте права пользователя БД
- Убедитесь, что пользователь может создавать индексы

---

**Готово! После применения индексов запросы станут быстрее.** ⚡


