# Миграция базы данных: Модерация и подписки

## Описание изменений

Добавлена система модерации центров и подписок для их размещения на платформе.

## Изменения в схеме Prisma

### Новые поля в модели Center:
- `moderationStatus` (ModerationStatus) - статус модерации (PENDING, APPROVED, REJECTED)
- `moderationComment` (String?) - комментарий модератора при отклонении
- `subscriptionStatus` (SubscriptionStatus) - статус подписки (INACTIVE, ACTIVE, EXPIRED)
- `subscriptionEndDate` (DateTime?) - дата окончания подписки
- `subscriptionPlan` (String?) - план подписки (1month, 6months, 12months)

### Новые enum:
- `ModerationStatus`: PENDING, APPROVED, REJECTED
- `SubscriptionStatus`: INACTIVE, ACTIVE, EXPIRED

### Новые индексы:
- `@@index([moderationStatus])` - для фильтрации по статусу модерации
- `@@index([subscriptionStatus])` - для фильтрации по статусу подписки

## Выполнение миграции

```bash
cd server
npx prisma migrate dev --name add_moderation_and_subscription
```

Или если нужно применить к существующей БД:

```bash
cd server
npx prisma db push
```

## Логика работы

1. **Создание центра:**
   - Статус модерации: `PENDING`
   - Статус подписки: `INACTIVE`
   - Центр НЕ отображается в поиске

2. **Модерация (админ панель):**
   - Админ проверяет центр, лицензию, документы
   - Устанавливает статус: `APPROVED` или `REJECTED`
   - Если `REJECTED` - добавляет комментарий

3. **Оплата подписки:**
   - Владелец центра видит, что центр одобрен
   - Выбирает план подписки (1, 6, 12 месяцев)
   - Оплачивает подписку
   - Статус подписки: `ACTIVE`
   - Устанавливается `subscriptionEndDate`

4. **Отображение в поиске:**
   - Центр отображается только если:
     - `moderationStatus === 'APPROVED'`
     - `subscriptionStatus === 'ACTIVE'`
     - `subscriptionEndDate >= сегодня`

## API Endpoints

### POST /api/centers/:id/subscribe
Активация подписки для центра.

**Требования:**
- Авторизация (JWT токен)
- Центр должен принадлежать пользователю
- Центр должен быть одобрен (`moderationStatus === 'APPROVED'`)

**Параметры:**
- `plan`: '1month' | '6months' | '12months'

**Ответ:**
```json
{
  "message": "Subscription activated successfully",
  "center": { ... }
}
```

## Цены подписки

- 1 месяц: 5,000 ₽
- 6 месяцев: 25,000 ₽ (экономия 17%)
- 12 месяцев: 45,000 ₽ (экономия 25%)

