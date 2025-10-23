# REBA Design System - Библиотека компонентов

## Основные компоненты

### 1. Button (Кнопка)

#### Варианты:
- **Primary**: Основная кнопка для главных действий
- **Secondary**: Вторичная кнопка для дополнительных действий  
- **Outline**: Контурная кнопка для альтернативных действий
- **Text**: Текстовая кнопка для ссылок и второстепенных действий

#### Размеры:
- **Small**: 32px высота, 12px padding
- **Medium**: 44px высота, 16px padding (рекомендуемый)
- **Large**: 56px высота, 20px padding

#### Состояния:
- **Default**: Обычное состояние
- **Hover**: При наведении
- **Active**: При нажатии
- **Disabled**: Отключенное состояние
- **Loading**: Состояние загрузки

#### Спецификации:

**Primary Button:**
```
Background: #0A84FF
Text: #FFFFFF
Border: none
Font: Inter Semibold, 16px
Padding: 16px 24px
Border-radius: 12px
Shadow: 0 2px 8px rgba(10, 132, 255, 0.3)
Min-height: 44px
```

**Secondary Button:**
```
Background: #FFFFFF
Text: #0A84FF
Border: 1px solid #E0E0E0
Font: Inter Semibold, 16px
Padding: 16px 24px
Border-radius: 12px
Shadow: 0 1px 3px rgba(0, 0, 0, 0.1)
Min-height: 44px
```

**Outline Button:**
```
Background: transparent
Text: #0A84FF
Border: 2px solid #0A84FF
Font: Inter Semibold, 16px
Padding: 14px 24px
Border-radius: 12px
Min-height: 44px
```

### 2. Input (Поле ввода)

#### Варианты:
- **Text**: Обычное текстовое поле
- **Search**: Поле поиска с иконкой
- **Password**: Поле для пароля
- **Email**: Поле для email
- **Number**: Поле для чисел
- **Textarea**: Многострочное поле

#### Состояния:
- **Default**: Обычное состояние
- **Focused**: При фокусе
- **Error**: Состояние ошибки
- **Success**: Успешное состояние
- **Disabled**: Отключенное состояние

#### Спецификации:

**Default Input:**
```
Background: #FFFFFF
Border: 1px solid #E0E0E0
Text: #0B0B0B
Placeholder: #757575
Font: Inter Regular, 16px
Padding: 12px 16px
Border-radius: 12px
Min-height: 44px
```

**Focused Input:**
```
Background: #FFFFFF
Border: 2px solid #0A84FF
Text: #0B0B0B
Font: Inter Regular, 16px
Padding: 11px 15px
Border-radius: 12px
Min-height: 44px
```

**Error Input:**
```
Background: #FFFFFF
Border: 2px solid #F44336
Text: #0B0B0B
Font: Inter Regular, 16px
Padding: 11px 15px
Border-radius: 12px
Min-height: 44px
```

### 3. Card (Карточка)

#### Варианты:
- **Default**: Обычная карточка
- **Elevated**: Карточка с тенью
- **Outlined**: Карточка с рамкой
- **Interactive**: Интерактивная карточка

#### Спецификации:

**Default Card:**
```
Background: #FFFFFF
Border: none
Border-radius: 16px
Padding: 16px
Shadow: 0 2px 8px rgba(0, 0, 0, 0.1)
```

**Elevated Card:**
```
Background: #FFFFFF
Border: none
Border-radius: 16px
Padding: 20px
Shadow: 0 8px 32px rgba(0, 0, 0, 0.15)
```

**Outlined Card:**
```
Background: #FFFFFF
Border: 1px solid #E0E0E0
Border-radius: 16px
Padding: 16px
Shadow: none
```

### 4. Tag (Тег)

#### Варианты:
- **Default**: Обычный тег
- **Primary**: Основной тег
- **Secondary**: Вторичный тег
- **Success**: Тег успеха
- **Warning**: Предупреждающий тег
- **Error**: Тег ошибки

#### Спецификации:

**Default Tag:**
```
Background: #F5F5F5
Text: #424242
Font: Inter Medium, 12px
Padding: 6px 12px
Border-radius: 12px
```

**Primary Tag:**
```
Background: #E6F3FF
Text: #0A84FF
Font: Inter Medium, 12px
Padding: 6px 12px
Border-radius: 12px
```

### 5. Badge (Значок)

#### Варианты:
- **Default**: Обычный значок
- **Dot**: Точечный значок
- **Number**: Числовой значок
- **Status**: Статусный значок

#### Спецификации:

**Default Badge:**
```
Background: #0A84FF
Text: #FFFFFF
Font: Inter Medium, 10px
Padding: 4px 8px
Border-radius: 8px
Min-width: 16px
Min-height: 16px
```

**Dot Badge:**
```
Background: #F44336
Border-radius: 50%
Width: 8px
Height: 8px
```

### 6. Avatar (Аватар)

#### Варианты:
- **Image**: С изображением
- **Initials**: С инициалами
- **Icon**: С иконкой
- **Placeholder**: Заглушка

#### Размеры:
- **Small**: 32px
- **Medium**: 48px
- **Large**: 64px
- **XLarge**: 80px

#### Спецификации:

**Medium Avatar:**
```
Width: 48px
Height: 48px
Border-radius: 50%
Background: #F5F5F5
Border: 2px solid #E0E0E0
```

### 7. Rating (Рейтинг)

#### Варианты:
- **Stars**: Звездочный рейтинг
- **Numbers**: Числовой рейтинг
- **Readonly**: Только для чтения
- **Interactive**: Интерактивный

#### Спецификации:

**Star Rating:**
```
Star color: #FFD700
Star size: 16px
Spacing: 2px
Font: Inter Medium, 14px
```

### 8. Tab (Вкладка)

#### Варианты:
- **Default**: Обычная вкладка
- **Underline**: С подчеркиванием
- **Pills**: В виде таблеток

#### Состояния:
- **Default**: Неактивная вкладка
- **Active**: Активная вкладка
- **Disabled**: Отключенная вкладка

#### Спецификации:

**Default Tab:**
```
Background: transparent
Text: #757575
Font: Inter Medium, 16px
Padding: 12px 16px
Border-radius: 8px
```

**Active Tab:**
```
Background: transparent
Text: #0A84FF
Font: Inter Semibold, 16px
Padding: 12px 16px
Border-radius: 8px
Border-bottom: 2px solid #0A84FF
```

### 9. Modal (Модальное окно)

#### Варианты:
- **Default**: Обычное модальное окно
- **Fullscreen**: Полноэкранное
- **Bottom Sheet**: Нижняя панель
- **Dialog**: Диалоговое окно

#### Спецификации:

**Default Modal:**
```
Background: #FFFFFF
Border-radius: 16px
Padding: 24px
Shadow: 0 20px 40px rgba(0, 0, 0, 0.3)
Max-width: 400px
Max-height: 80vh
```

**Overlay:**
```
Background: rgba(0, 0, 0, 0.5)
Backdrop-filter: blur(4px)
```

### 10. Bottom Navigation (Нижняя навигация)

#### Спецификации:

**Bottom Navigation:**
```
Background: #FFFFFF
Border-top: 1px solid #E0E0E0
Height: 80px
Padding: 8px 0
Shadow: 0 -2px 8px rgba(0, 0, 0, 0.1)
```

**Tab Item:**
```
Icon size: 24px
Text size: 12px
Font: Inter Medium
Active color: #0A84FF
Inactive color: #757575
Min-height: 44px
```

### 11. Search Input (Поле поиска)

#### Спецификации:

**Search Input:**
```
Background: #FFFFFF
Border: 1px solid #E0E0E0
Border-radius: 12px
Padding: 12px 16px 12px 44px
Icon: 20px, #757575
Placeholder: #757575
Font: Inter Regular, 16px
Min-height: 44px
```

### 12. Filter Button (Кнопка фильтра)

#### Спецификации:

**Filter Button:**
```
Background: rgba(10, 132, 255, 0.1)
Border: none
Border-radius: 8px
Padding: 8px
Icon: 20px, #0A84FF
Min-width: 44px
Min-height: 44px
```

**Filter Badge:**
```
Background: #F44336
Border-radius: 50%
Width: 8px
Height: 8px
Position: absolute, top: 4px, right: 4px
```

### 13. Center Card (Карточка центра)

#### Спецификации:

**Center Card:**
```
Background: #FFFFFF
Border-radius: 16px
Padding: 16px
Shadow: 0 2px 8px rgba(0, 0, 0, 0.1)
Margin: 0 12px 16px 12px
```

**Card Image:**
```
Width: 100%
Height: 200px
Border-radius: 12px
Object-fit: cover
```

**Card Content:**
```
Title: Inter Bold, 18px, #0B0B0B
Rating: Inter Medium, 14px, #FFD700
Location: Inter Regular, 14px, #757575
Description: Inter Regular, 14px, #424242
Price: Inter Semibold, 16px, #0A84FF
```

### 14. Article Card (Карточка статьи)

#### Спецификации:

**Article Card:**
```
Background: #FFFFFF
Border-radius: 16px
Padding: 16px
Shadow: 0 2px 8px rgba(0, 0, 0, 0.1)
Margin: 0 12px 16px 12px
```

**Article Image:**
```
Width: 100%
Height: 180px
Border-radius: 12px
Object-fit: cover
```

**Article Content:**
```
Title: Inter Bold, 16px, #0B0B0B
Excerpt: Inter Regular, 14px, #424242
Stats: Inter Medium, 12px, #757575
```

### 15. Loading States (Состояния загрузки)

#### Варианты:
- **Spinner**: Крутящийся индикатор
- **Skeleton**: Скелетон загрузки
- **Progress**: Прогресс-бар
- **Pulse**: Пульсирующий эффект

#### Спецификации:

**Spinner:**
```
Size: 24px
Color: #0A84FF
Stroke-width: 2px
Animation: rotate 1s linear infinite
```

**Skeleton:**
```
Background: #F5F5F5
Border-radius: 4px
Animation: pulse 1.5s ease-in-out infinite
```

### 16. Empty State (Пустое состояние)

#### Спецификации:

**Empty State:**
```
Icon: 64px, #757575
Title: Inter Semibold, 18px, #0B0B0B
Description: Inter Regular, 16px, #757575
Text-align: center
Padding: 40px
```

### 17. Error State (Состояние ошибки)

#### Спецификации:

**Error State:**
```
Icon: 64px, #F44336
Title: Inter Semibold, 18px, #0B0B0B
Description: Inter Regular, 16px, #757575
Button: Primary button
Text-align: center
Padding: 40px
```

### 18. Success State (Состояние успеха)

#### Спецификации:

**Success State:**
```
Icon: 64px, #34A853
Title: Inter Semibold, 18px, #0B0B0B
Description: Inter Regular, 16px, #757575
Button: Primary button
Text-align: center
Padding: 40px
```

## Анимации и переходы

### Длительности:
- **Fast**: 120ms
- **Normal**: 240ms
- **Slow**: 360ms

### Easing функции:
- **Standard**: cubic-bezier(0.4, 0.0, 0.2, 1)
- **Deceleration**: cubic-bezier(0.0, 0.0, 0.2, 1)
- **Spring**: cubic-bezier(0.175, 0.885, 0.32, 1.275)

### Micro-interactions:
- **Button press**: Scale 0.95, duration 100ms
- **Card hover**: Shadow increase, duration 200ms
- **Input focus**: Border color change, duration 150ms
- **Tab switch**: Underline animation, duration 200ms

## Accessibility (Доступность)

### Минимальные размеры:
- **Touch target**: 44px x 44px
- **Text size**: минимум 16px
- **Contrast ratio**: минимум 4.5:1

### Focus states:
- **Focus ring**: 2px solid #0A84FF
- **Focus offset**: 2px
- **Focus visible**: только при клавиатурной навигации

### Screen reader support:
- **Semantic HTML**: правильные теги
- **ARIA labels**: описательные метки
- **Alt text**: для изображений
- **Skip links**: для навигации

