-- Миграция: Добавление индексов для оптимизации запросов
-- Дата: 2024-11-07
-- Описание: Добавляет индексы для ускорения поиска и сортировки

-- Индексы для таблицы centers
CREATE INDEX IF NOT EXISTS "centers_city_idx" ON "centers"("city");
CREATE INDEX IF NOT EXISTS "centers_rating_idx" ON "centers"("rating");
CREATE INDEX IF NOT EXISTS "centers_verified_idx" ON "centers"("verified");
CREATE INDEX IF NOT EXISTS "centers_ownerId_idx" ON "centers"("ownerId");

-- Индексы для таблицы reviews
CREATE INDEX IF NOT EXISTS "reviews_centerId_idx" ON "reviews"("centerId");
CREATE INDEX IF NOT EXISTS "reviews_userId_idx" ON "reviews"("userId");

-- Комментарии к индексам
COMMENT ON INDEX "centers_city_idx" IS 'Ускоряет поиск центров по городу';
COMMENT ON INDEX "centers_rating_idx" IS 'Ускоряет сортировку по рейтингу';
COMMENT ON INDEX "centers_verified_idx" IS 'Ускоряет фильтрацию верифицированных центров';
COMMENT ON INDEX "centers_ownerId_idx" IS 'Ускоряет поиск центров владельца';
COMMENT ON INDEX "reviews_centerId_idx" IS 'Ускоряет поиск отзывов центра';
COMMENT ON INDEX "reviews_userId_idx" IS 'Ускоряет поиск отзывов пользователя';


