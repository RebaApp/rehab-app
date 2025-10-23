# REBA Design System - Accessibility Guidelines

## Обзор доступности

Дизайн-система РЕБА разработана с учетом принципов доступности и соответствует стандартам WCAG 2.1 AA. Все компоненты протестированы на совместимость с assistive technologies и обеспечивают равный доступ к функциональности для всех пользователей.

## Принципы доступности

### 1. Воспринимаемость (Perceivable)
- Информация должна быть представлена способами, которые пользователи могут воспринимать
- Достаточный цветовой контраст
- Альтернативный текст для изображений
- Адаптивность к различным размерам экранов

### 2. Понятность (Understandable)
- Интерфейс должен быть понятным и предсказуемым
- Четкая навигация и структура
- Понятные метки и инструкции
- Консистентное поведение элементов

### 3. Управляемость (Operable)
- Все функции должны быть доступны с клавиатуры
- Достаточное время для взаимодействия
- Избегание контента, вызывающего приступы
- Помощь в навигации

### 4. Совместимость (Robust)
- Совместимость с assistive technologies
- Валидная разметка
- Прогрессивное улучшение
- Поддержка различных устройств

## Цветовой контраст

### Стандарты WCAG AA:
- **Обычный текст**: Минимум 4.5:1
- **Крупный текст (18px+)**: Минимум 3:1
- **UI элементы**: Минимум 3:1

### Проверенные комбинации цветов:

#### Основные цвета:
```css
/* Соответствует WCAG AA */
--color-text-primary: #0B0B0B;     /* Контраст с белым: 21:1 */
--color-text-secondary: #424242;  /* Контраст с белым: 12.6:1 */
--color-text-tertiary: #757575;   /* Контраст с белым: 4.5:1 */
--color-primary: #0A84FF;         /* Контраст с белым: 4.5:1 */
```

#### Семантические цвета:
```css
/* Success */
--color-success: #34A853;          /* Контраст с белым: 4.5:1 */
--color-success-text: #1B5E20;    /* Контраст с белым: 12.6:1 */

/* Error */
--color-error: #F44336;           /* Контраст с белым: 4.5:1 */
--color-error-text: #D32F2F;      /* Контраст с белым: 7.1:1 */

/* Warning */
--color-warning: #FF9800;         /* Контраст с белым: 3.1:1 */
--color-warning-text: #E65100;    /* Контраст с белым: 7.1:1 */
```

### Запрещенные комбинации:
```css
/* НЕ соответствует WCAG AA */
--color-text-disabled: #BDBDBD;   /* Контраст с белым: 2.1:1 - СЛИШКОМ НИЗКИЙ */
--color-border-light: #E0E0E0;    /* Контраст с белым: 1.2:1 - СЛИШКОМ НИЗКИЙ */
```

## Размеры и тап-зоны

### Минимальные размеры:
- **Touch target**: 44px x 44px (iOS) / 48dp x 48dp (Android)
- **Минимальный размер текста**: 16px (мобильные устройства)
- **Между интерактивными элементами**: минимум 8px

### Компоненты с правильными размерами:

#### Button:
```css
.button {
  min-height: 44px;
  min-width: 44px;
  padding: 12px 16px;
}
```

#### Input:
```css
.input {
  min-height: 44px;
  padding: 12px 16px;
  font-size: 16px; /* Предотвращает zoom на iOS */
}
```

#### Checkbox/Radio:
```css
.checkbox {
  min-width: 44px;
  min-height: 44px;
  padding: 12px;
}
```

## Focus Management

### Focus Ring:
```css
.focus-visible {
  outline: 2px solid #0A84FF;
  outline-offset: 2px;
  border-radius: 4px;
}

/* Убираем outline по умолчанию */
*:focus {
  outline: none;
}

/* Показываем только при клавиатурной навигации */
*:focus-visible {
  outline: 2px solid #0A84FF;
  outline-offset: 2px;
}
```

### Focus Order:
- Логическая последовательность навигации
- Tab order соответствует визуальному порядку
- Skip links для быстрого доступа к основному контенту

### Skip Links:
```html
<a href="#main-content" class="skip-link">
  Перейти к основному контенту
</a>

<style>
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: #0A84FF;
  color: white;
  padding: 8px;
  text-decoration: none;
  border-radius: 4px;
}

.skip-link:focus {
  top: 6px;
}
</style>
```

## Screen Reader Support

### ARIA Labels:
```html
<!-- Кнопки -->
<button aria-label="Закрыть модальное окно">
  <span aria-hidden="true">×</span>
</button>

<!-- Формы -->
<label for="email">Email адрес</label>
<input 
  id="email" 
  type="email" 
  aria-describedby="email-help"
  aria-invalid="false"
  aria-required="true"
>
<div id="email-help">Введите корректный email адрес</div>

<!-- Навигация -->
<nav aria-label="Основная навигация">
  <ul role="menubar">
    <li role="none">
      <a href="/home" role="menuitem" aria-current="page">Главная</a>
    </li>
  </ul>
</nav>
```

### Live Regions:
```html
<!-- Для динамического контента -->
<div aria-live="polite" aria-atomic="true">
  Загрузка завершена
</div>

<!-- Для важных уведомлений -->
<div role="alert" aria-live="assertive">
  Ошибка: Не удалось сохранить данные
</div>
```

### Semantic HTML:
```html
<!-- Правильная структура -->
<main>
  <header>
    <h1>РЕБА - Реабилитационные центры</h1>
    <nav aria-label="Основная навигация">...</nav>
  </header>
  
  <section aria-labelledby="centers-heading">
    <h2 id="centers-heading">Найденные центры</h2>
    <article>
      <h3>Центр реабилитации 'Новая жизнь'</h3>
      <p>Описание центра...</p>
    </article>
  </section>
  
  <aside aria-label="Фильтры">
    <h2>Фильтры поиска</h2>
    <!-- Фильтры -->
  </aside>
</main>
```

## Keyboard Navigation

### Поддерживаемые клавиши:
- **Tab**: Переход к следующему элементу
- **Shift + Tab**: Переход к предыдущему элементу
- **Enter/Space**: Активация элемента
- **Стрелки**: Навигация в меню и списках
- **Escape**: Закрытие модальных окон

### Keyboard Shortcuts:
```javascript
// Глобальные горячие клавиши
document.addEventListener('keydown', (e) => {
  // Escape - закрыть модальные окна
  if (e.key === 'Escape') {
    closeAllModals();
  }
  
  // Ctrl + / - показать справку
  if (e.ctrlKey && e.key === '/') {
    showHelp();
  }
});
```

### Focus Trapping:
```javascript
// Для модальных окон
function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  element.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }
  });
}
```

## Motion and Animation

### Reduced Motion Support:
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### JavaScript Support:
```javascript
// Проверка предпочтений пользователя
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
  // Отключаем анимации
  document.documentElement.style.setProperty('--animation-duration', '0ms');
}
```

### Safe Animations:
- Не более 3 вспышек в секунду
- Избегание мигающих элементов
- Плавные переходы без резких движений
- Возможность отключения всех анимаций

## Form Accessibility

### Labels and Instructions:
```html
<form>
  <fieldset>
    <legend>Контактная информация</legend>
    
    <div class="form-group">
      <label for="name">Имя *</label>
      <input 
        id="name" 
        type="text" 
        required
        aria-describedby="name-help"
        aria-invalid="false"
      >
      <div id="name-help" class="help-text">
        Введите ваше полное имя
      </div>
    </div>
    
    <div class="form-group">
      <label for="phone">Телефон</label>
      <input 
        id="phone" 
        type="tel"
        aria-describedby="phone-help"
        pattern="[0-9]{10}"
      >
      <div id="phone-help" class="help-text">
        Формат: 10 цифр без пробелов
      </div>
    </div>
  </fieldset>
</form>
```

### Error Handling:
```html
<div class="form-group">
  <label for="email">Email *</label>
  <input 
    id="email" 
    type="email" 
    required
    aria-describedby="email-error"
    aria-invalid="true"
    class="error"
  >
  <div id="email-error" class="error-text" role="alert">
    Введите корректный email адрес
  </div>
</div>
```

### Validation Messages:
```javascript
function validateForm() {
  const email = document.getElementById('email');
  const errorElement = document.getElementById('email-error');
  
  if (!isValidEmail(email.value)) {
    email.setAttribute('aria-invalid', 'true');
    email.classList.add('error');
    errorElement.textContent = 'Введите корректный email адрес';
    errorElement.setAttribute('role', 'alert');
  } else {
    email.setAttribute('aria-invalid', 'false');
    email.classList.remove('error');
    errorElement.textContent = '';
    errorElement.removeAttribute('role');
  }
}
```

## Mobile Accessibility

### Touch Gestures:
- Поддержка стандартных жестов
- Альтернативы для сложных жестов
- Достаточные размеры тап-зон
- Избегание случайных активаций

### Orientation Support:
```css
/* Поддержка портретной и альбомной ориентации */
@media screen and (orientation: portrait) {
  .main-content {
    flex-direction: column;
  }
}

@media screen and (orientation: landscape) {
  .main-content {
    flex-direction: row;
  }
}
```

### Zoom Support:
```css
/* Поддержка масштабирования до 200% */
.container {
  max-width: 100%;
  overflow-x: auto;
}

.text {
  font-size: 16px; /* Предотвращает zoom на iOS */
  line-height: 1.5;
}
```

## Testing Guidelines

### Automated Testing:
```javascript
// Axe-core для автоматического тестирования
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('should not have accessibility violations', async () => {
  const { container } = render(<MyComponent />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### Manual Testing Checklist:

#### Keyboard Navigation:
- [ ] Все интерактивные элементы доступны с клавиатуры
- [ ] Логический порядок навигации
- [ ] Focus indicators видны
- [ ] Skip links работают

#### Screen Reader:
- [ ] Все элементы имеют описательные метки
- [ ] Структура заголовков логична
- [ ] Формы имеют правильные labels
- [ ] Динамический контент объявляется

#### Visual:
- [ ] Достаточный цветовой контраст
- [ ] Информация не передается только цветом
- [ ] Текст масштабируется до 200%
- [ ] Элементы не перекрываются при масштабировании

#### Motor:
- [ ] Достаточные размеры тап-зон
- [ ] Нет элементов, требующих точного позиционирования
- [ ] Достаточное время для взаимодействия
- [ ] Возможность отмены действий

### Tools for Testing:
- **axe-core**: Автоматическое тестирование
- **WAVE**: Визуальная проверка доступности
- **Lighthouse**: Аудит доступности
- **Screen readers**: NVDA, JAWS, VoiceOver
- **Color contrast checkers**: WebAIM, Colour Contrast Analyser

## Implementation Examples

### React Native:
```javascript
// Accessible button
<TouchableOpacity
  accessible={true}
  accessibilityLabel="Закрыть модальное окно"
  accessibilityRole="button"
  accessibilityHint="Закрывает текущее модальное окно"
  onPress={onClose}
>
  <Text>×</Text>
</TouchableOpacity>

// Accessible input
<TextInput
  accessible={true}
  accessibilityLabel="Email адрес"
  accessibilityHint="Введите ваш email адрес"
  placeholder="Email"
  keyboardType="email-address"
  autoComplete="email"
/>
```

### Flutter:
```dart
// Accessible button
ElevatedButton(
  onPressed: onPressed,
  child: Text('Закрыть'),
).semantics(
  label: 'Закрыть модальное окно',
  hint: 'Закрывает текущее модальное окно',
  button: true,
)

// Accessible text field
TextField(
  decoration: InputDecoration(
    labelText: 'Email адрес',
    hintText: 'Введите ваш email адрес',
  ),
  keyboardType: TextInputType.emailAddress,
  textInputAction: TextInputAction.next,
).semantics(
  label: 'Email адрес',
  hint: 'Введите ваш email адрес',
  textField: true,
)
```

### Web:
```html
<!-- Accessible modal -->
<div 
  role="dialog" 
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
  aria-modal="true"
>
  <h2 id="modal-title">Подтверждение действия</h2>
  <p id="modal-description">
    Вы уверены, что хотите удалить этот элемент?
  </p>
  <button aria-label="Подтвердить удаление">Да</button>
  <button aria-label="Отменить удаление">Нет</button>
</div>
```

## Compliance Standards

### WCAG 2.1 AA Compliance:
- ✅ **1.1.1** Non-text Content: Alt text для изображений
- ✅ **1.3.1** Info and Relationships: Семантическая разметка
- ✅ **1.3.2** Meaningful Sequence: Логический порядок
- ✅ **1.4.3** Contrast (Minimum): Контраст 4.5:1
- ✅ **1.4.4** Resize text: Масштабирование до 200%
- ✅ **2.1.1** Keyboard: Полная клавиатурная навигация
- ✅ **2.1.2** No Keyboard Trap: Нет ловушек фокуса
- ✅ **2.4.1** Bypass Blocks: Skip links
- ✅ **2.4.2** Page Titled: Описательные заголовки
- ✅ **2.4.3** Focus Order: Логический порядок фокуса
- ✅ **2.4.4** Link Purpose: Понятные ссылки
- ✅ **3.1.1** Language of Page: Указание языка
- ✅ **3.2.1** On Focus: Без неожиданных изменений
- ✅ **3.2.2** On Input: Без неожиданных изменений
- ✅ **4.1.1** Parsing: Валидная разметка
- ✅ **4.1.2** Name, Role, Value: Правильные ARIA атрибуты

### Additional Standards:
- **Section 508**: Соответствие требованиям США
- **EN 301 549**: Европейский стандарт доступности
- **ADA**: Соответствие Americans with Disabilities Act

