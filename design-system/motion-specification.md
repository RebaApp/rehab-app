# REBA Design System - Motion & Animation Specification

## Основные принципы анимации

### Философия движения:
- **Естественность**: Анимации должны ощущаться естественно и органично
- **Целенаправленность**: Каждое движение должно иметь четкую цель
- **Производительность**: Плавные анимации без лагов и подтормаживаний
- **Доступность**: Уважение к пользователям с ограниченными возможностями

### Timing Functions (Easing):

#### 1. Standard Easing
```
cubic-bezier(0.4, 0.0, 0.2, 1)
```
**Применение**: Стандартные переходы, появление элементов
**Описание**: Начинается медленно, ускоряется в середине, замедляется в конце

#### 2. Deceleration Easing  
```
cubic-bezier(0.0, 0.0, 0.2, 1)
```
**Применение**: Появление модальных окон, всплывающих элементов
**Описание**: Быстрый старт, плавное замедление

#### 3. Acceleration Easing
```
cubic-bezier(0.4, 0.0, 1, 1)
```
**Применение**: Скрытие элементов, закрытие модальных окон
**Описание**: Медленный старт, быстрое завершение

#### 4. Spring Easing
```
cubic-bezier(0.175, 0.885, 0.32, 1.275)
```
**Применение**: Интерактивные элементы, кнопки, переключатели
**Описание**: Эластичный эффект с легким отскоком

## Длительности анимаций

### Базовые длительности:
- **Fast**: 120ms - Мгновенные реакции
- **Normal**: 240ms - Стандартные переходы  
- **Slow**: 360ms - Сложные анимации
- **Slower**: 480ms - Переходы между экранами

### Контекстные длительности:

#### Micro-interactions (120ms):
- Нажатие кнопки
- Hover эффекты
- Focus состояния
- Переключение переключателей

#### Component transitions (240ms):
- Появление/скрытие карточек
- Анимация модальных окон
- Переходы между табами
- Анимация форм

#### Page transitions (360ms):
- Переходы между экранами
- Анимация навигации
- Появление списков
- Сложные композиции

#### Complex animations (480ms):
- Onboarding анимации
- Success/Error состояния
- Загрузка данных
- Переходы между разделами

## Спецификация анимаций по компонентам

### 1. Button Animations

#### Primary Button Press:
```css
/* CSS */
.button:active {
  transform: scale(0.95);
  transition: transform 100ms cubic-bezier(0.4, 0.0, 0.2, 1);
}
```

```javascript
// React Native
const buttonPressAnimation = () => {
  Animated.sequence([
    Animated.timing(scaleAnim, {
      toValue: 0.95,
      duration: 100,
      useNativeDriver: true,
    }),
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }),
  ]).start();
};
```

#### Button Loading State:
```css
/* CSS */
.button-loading {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
```

### 2. Card Animations

#### Card Hover/Focus:
```css
/* CSS */
.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  transition: all 200ms cubic-bezier(0.4, 0.0, 0.2, 1);
}
```

#### Card Entrance:
```css
/* CSS */
.card-enter {
  opacity: 0;
  transform: translateY(20px);
  animation: cardEnter 300ms cubic-bezier(0.0, 0.0, 0.2, 1) forwards;
}

@keyframes cardEnter {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### 3. Input Animations

#### Input Focus:
```css
/* CSS */
.input:focus {
  border-color: #0A84FF;
  box-shadow: 0 0 0 3px rgba(10, 132, 255, 0.1);
  transition: all 150ms cubic-bezier(0.4, 0.0, 0.2, 1);
}
```

#### Input Error Shake:
```css
/* CSS */
.input-error {
  animation: shake 300ms cubic-bezier(0.4, 0.0, 0.2, 1);
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}
```

### 4. Modal Animations

#### Modal Entrance:
```css
/* CSS */
.modal-overlay {
  animation: fadeIn 200ms cubic-bezier(0.0, 0.0, 0.2, 1);
}

.modal-content {
  animation: slideUp 300ms cubic-bezier(0.0, 0.0, 0.2, 1);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### 5. Tab Animations

#### Tab Switch:
```css
/* CSS */
.tab-indicator {
  transition: transform 200ms cubic-bezier(0.4, 0.0, 0.2, 1);
}
```

### 6. List Animations

#### Staggered List Items:
```css
/* CSS */
.list-item {
  animation: slideInUp 300ms cubic-bezier(0.0, 0.0, 0.2, 1) forwards;
  opacity: 0;
}

.list-item:nth-child(1) { animation-delay: 0ms; }
.list-item:nth-child(2) { animation-delay: 50ms; }
.list-item:nth-child(3) { animation-delay: 100ms; }
.list-item:nth-child(4) { animation-delay: 150ms; }

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

## Lottie Animation Specifications

### 1. Onboarding Animation
**Название**: `reba-onboarding.json`
**Длительность**: 3-4 секунды
**Размер**: 200x200px
**Описание**: Анимация появления логотипа РЕБА с плавным переходом к тексту "ПОМОЩЬ БЛИЖЕ ЧЕМ КАЖЕТСЯ"

**Сценарий**:
1. Появление логотипа (0-800ms)
2. Пульсация/свечение (800-2000ms)
3. Появление текста снизу (2000-3000ms)
4. Финальная композиция (3000-4000ms)

**Цвета**:
- Основной: #0A84FF
- Акцент: #FFFFFF
- Текст: #0B0B0B

### 2. Empty State Animation
**Название**: `reba-empty-state.json`
**Длительность**: 2-3 секунды
**Размер**: 150x150px
**Описание**: Анимация для пустых состояний (нет результатов поиска, пустое избранное)

**Сценарий**:
1. Появление иконки поиска/документа (0-500ms)
2. Анимация "поиска" или "пустоты" (500-2000ms)
3. Появление вопросительного знака (2000-2500ms)
4. Затухание (2500-3000ms)

**Цвета**:
- Иконка: #757575
- Акцент: #0A84FF

### 3. Success Animation
**Название**: `reba-success.json`
**Длительность**: 1.5-2 секунды
**Размер**: 120x120px
**Описание**: Анимация успешного действия (отправка формы, добавление в избранное)

**Сценарий**:
1. Появление круга (0-300ms)
2. Анимация галочки (300-1200ms)
3. Пульсация успеха (1200-2000ms)

**Цвета**:
- Круг: #34A853
- Галочка: #FFFFFF
- Акцент: #E8F5E8

## Scroll-driven Animations

### 1. Sticky Header Collapse
```css
/* CSS */
.header {
  position: sticky;
  top: 0;
  transition: all 200ms cubic-bezier(0.4, 0.0, 0.2, 1);
}

.header-collapsed {
  transform: translateY(-100%);
  opacity: 0;
}
```

### 2. Parallax Background
```css
/* CSS */
.parallax-bg {
  transform: translateY(var(--scroll-offset));
  transition: transform 0.1s ease-out;
}
```

### 3. Reveal on Scroll
```css
/* CSS */
.reveal-item {
  opacity: 0;
  transform: translateY(30px);
  transition: all 400ms cubic-bezier(0.0, 0.0, 0.2, 1);
}

.reveal-item.visible {
  opacity: 1;
  transform: translateY(0);
}
```

## Performance Guidelines

### 1. Hardware Acceleration
```css
/* CSS */
.animated-element {
  will-change: transform, opacity;
  transform: translateZ(0); /* Force hardware acceleration */
}
```

### 2. Reduce Motion Support
```css
/* CSS */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 3. JavaScript Performance
```javascript
// React Native
const useNativeDriver = true; // Always use native driver when possible
const shouldRasterizeIOS = true; // For complex animations on iOS
```

## Accessibility Considerations

### 1. Respect User Preferences
```css
/* CSS */
@media (prefers-reduced-motion: reduce) {
  .animated-element {
    animation: none;
    transition: none;
  }
}
```

### 2. Focus Management
```css
/* CSS */
.focus-visible {
  outline: 2px solid #0A84FF;
  outline-offset: 2px;
  transition: outline 150ms ease-in-out;
}
```

### 3. Screen Reader Support
```html
<!-- HTML -->
<div 
  role="status" 
  aria-live="polite"
  aria-label="Loading content"
>
  <div class="loading-animation"></div>
</div>
```

## Implementation Examples

### React Native Implementation
```javascript
// AnimatedButton.js
import React, { useRef } from 'react';
import { Animated, TouchableOpacity } from 'react-native';

const AnimatedButton = ({ children, onPress, style }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={style}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
};
```

### Flutter Implementation
```dart
// AnimatedButton.dart
import 'package:flutter/material.dart';

class AnimatedButton extends StatefulWidget {
  final Widget child;
  final VoidCallback? onPressed;
  final Duration duration;

  const AnimatedButton({
    Key? key,
    required this.child,
    this.onPressed,
    this.duration = const Duration(milliseconds: 150),
  }) : super(key: key);

  @override
  _AnimatedButtonState createState() => _AnimatedButtonState();
}

class _AnimatedButtonState extends State<AnimatedButton>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: widget.duration,
      vsync: this,
    );
    _scaleAnimation = Tween<double>(
      begin: 1.0,
      end: 0.95,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.easeInOut,
    ));
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: (_) => _controller.forward(),
      onTapUp: (_) => _controller.reverse(),
      onTapCancel: () => _controller.reverse(),
      onTap: widget.onPressed,
      child: AnimatedBuilder(
        animation: _scaleAnimation,
        builder: (context, child) {
          return Transform.scale(
            scale: _scaleAnimation.value,
            child: widget.child,
          );
        },
      ),
    );
  }
}
```

## Testing Guidelines

### 1. Animation Testing
- Проверка производительности на слабых устройствах
- Тестирование с включенным `prefers-reduced-motion`
- Проверка доступности для screen readers
- Тестирование на разных размерах экранов

### 2. Performance Metrics
- FPS должно быть стабильно 60fps
- Время анимации не должно превышать 500ms для UI элементов
- Память не должна увеличиваться во время анимаций
- Батарея не должна разряжаться быстрее обычного

### 3. Cross-platform Consistency
- Одинаковое поведение на iOS и Android
- Соответствие platform guidelines
- Адаптация под разные input методы (touch, mouse, keyboard)

