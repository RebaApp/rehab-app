# REBA Design System - Lottie Animation Specifications

## Обзор Lottie анимаций

Lottie анимации используются для создания плавных, векторных анимаций, которые работают на всех платформах с одинаковой производительностью. Все анимации созданы в соответствии с принципами доступности и производительности.

## 1. Onboarding Animation

### Технические характеристики:
- **Файл**: `reba-onboarding.json`
- **Размер**: 200x200px (масштабируется)
- **Длительность**: 4000ms
- **Формат**: Lottie JSON
- **Версия**: Lottie 5.7.0+

### Описание анимации:
Анимация появления бренда РЕБА с плавным переходом к миссии приложения.

### Сценарий анимации:

#### Фаза 1: Появление логотипа (0-800ms)
```
- Логотип "РЕБА" появляется с эффектом fade-in
- Одновременно происходит масштабирование от 0.8 до 1.0
- Easing: cubic-bezier(0.175, 0.885, 0.32, 1.275) (spring)
- Цвет: #0A84FF с плавным появлением
```

#### Фаза 2: Пульсация (800-2000ms)
```
- Логотип слегка пульсирует (scale 1.0 → 1.05 → 1.0)
- Добавляется subtle glow эффект
- Длительность пульсации: 1200ms
- Повторения: 2 раза
```

#### Фаза 3: Появление текста (2000-3000ms)
```
- Текст "ПОМОЩЬ БЛИЖЕ ЧЕМ КАЖЕТСЯ" появляется снизу
- Анимация slide-up с fade-in
- Easing: cubic-bezier(0.0, 0.0, 0.2, 1) (deceleration)
- Цвет текста: #757575
```

#### Фаза 4: Финальная композиция (3000-4000ms)
```
- Все элементы стабилизируются
- Subtle breathing эффект для всей композиции
- Подготовка к переходу к основному интерфейсу
```

### Цветовая палитра:
```json
{
  "primary": "#0A84FF",
  "text": "#757575", 
  "background": "#FFFFFF",
  "accent": "#E6F3FF"
}
```

### Использование в коде:

#### React Native:
```javascript
import LottieView from 'lottie-react-native';

const OnboardingAnimation = () => (
  <LottieView
    source={require('./reba-onboarding.json')}
    autoPlay
    loop={false}
    style={{ width: 200, height: 200 }}
    resizeMode="contain"
  />
);
```

#### Flutter:
```dart
import 'package:lottie/lottie.dart';

Widget OnboardingAnimation() {
  return Lottie.asset(
    'assets/animations/reba-onboarding.json',
    width: 200,
    height: 200,
    fit: BoxFit.contain,
    repeat: false,
  );
}
```

#### Web (CSS):
```css
.onboarding-animation {
  width: 200px;
  height: 200px;
  background: url('reba-onboarding.json');
  animation: play 4s ease-in-out;
}

@keyframes play {
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
}
```

## 2. Empty State Animation

### Технические характеристики:
- **Файл**: `reba-empty-state.json`
- **Размер**: 150x150px
- **Длительность**: 3000ms
- **Формат**: Lottie JSON
- **Версия**: Lottie 5.7.0+

### Описание анимации:
Анимация для пустых состояний, показывающая поиск или отсутствие контента.

### Сценарий анимации:

#### Фаза 1: Появление иконки (0-500ms)
```
- Иконка документа/поиска появляется с fade-in
- Масштабирование от 0.9 до 1.0
- Easing: cubic-bezier(0.4, 0.0, 0.2, 1) (standard)
- Цвет: #757575
```

#### Фаза 2: Анимация поиска (500-2000ms)
```
- Иконка слегка покачивается (rotate -5° → +5° → -5°)
- Одновременно появляется эффект "волн поиска"
- Длительность: 1500ms
- Easing: cubic-bezier(0.4, 0.0, 0.2, 1)
```

#### Фаза 3: Появление вопросительного знака (2000-2500ms)
```
- Вопросительный знак появляется рядом с иконкой
- Анимация bounce-in
- Easing: cubic-bezier(0.175, 0.885, 0.32, 1.275) (spring)
- Цвет: #0A84FF
```

#### Фаза 4: Затухание (2500-3000ms)
```
- Все элементы плавно исчезают
- Fade-out с легким масштабированием
- Easing: cubic-bezier(0.4, 0.0, 1, 1) (acceleration)
```

### Цветовая палитра:
```json
{
  "icon": "#757575",
  "accent": "#0A84FF",
  "background": "#FFFFFF",
  "highlight": "#E6F3FF"
}
```

### Использование в коде:

#### React Native:
```javascript
const EmptyStateAnimation = () => (
  <LottieView
    source={require('./reba-empty-state.json')}
    autoPlay
    loop={true}
    style={{ width: 150, height: 150 }}
    resizeMode="contain"
  />
);
```

#### Flutter:
```dart
Widget EmptyStateAnimation() {
  return Lottie.asset(
    'assets/animations/reba-empty-state.json',
    width: 150,
    height: 150,
    fit: BoxFit.contain,
    repeat: true,
  );
}
```

## 3. Success Animation

### Технические характеристики:
- **Файл**: `reba-success.json`
- **Размер**: 120x120px
- **Длительность**: 2000ms
- **Формат**: Lottie JSON
- **Версия**: Lottie 5.7.0+

### Описание анимации:
Анимация успешного выполнения действия с галочкой и эффектом успеха.

### Сценарий анимации:

#### Фаза 1: Появление круга (0-300ms)
```
- Круг появляется с эффектом scale-in
- Масштабирование от 0.0 до 1.0
- Easing: cubic-bezier(0.175, 0.885, 0.32, 1.275) (spring)
- Цвет: #34A853
```

#### Фаза 2: Анимация галочки (300-1200ms)
```
- Галочка рисуется по кругу
- Stroke-dasharray анимация
- Длительность: 900ms
- Easing: cubic-bezier(0.4, 0.0, 0.2, 1) (standard)
- Цвет: #FFFFFF
```

#### Фаза 3: Пульсация успеха (1200-2000ms)
```
- Круг пульсирует с эффектом glow
- Масштабирование 1.0 → 1.1 → 1.0
- Добавляется цветной ореол
- Easing: cubic-bezier(0.4, 0.0, 0.2, 1)
- Цвет ореола: #E8F5E8
```

### Цветовая палитра:
```json
{
  "circle": "#34A853",
  "checkmark": "#FFFFFF",
  "glow": "#E8F5E8",
  "background": "#FFFFFF"
}
```

### Использование в коде:

#### React Native:
```javascript
const SuccessAnimation = () => (
  <LottieView
    source={require('./reba-success.json')}
    autoPlay
    loop={false}
    style={{ width: 120, height: 120 }}
    resizeMode="contain"
  />
);
```

#### Flutter:
```dart
Widget SuccessAnimation() {
  return Lottie.asset(
    'assets/animations/reba-success.json',
    width: 120,
    height: 120,
    fit: BoxFit.contain,
    repeat: false,
  );
}
```

## 4. Loading Animation

### Технические характеристики:
- **Файл**: `reba-loading.json`
- **Размер**: 80x80px
- **Длительность**: 1500ms (loop)
- **Формат**: Lottie JSON
- **Версия**: Lottie 5.7.0+

### Описание анимации:
Плавная анимация загрузки с элементами бренда РЕБА.

### Сценарий анимации:

#### Фаза 1: Появление элементов (0-300ms)
```
- Три точки появляются по очереди
- Staggered animation с задержкой 100ms между точками
- Easing: cubic-bezier(0.4, 0.0, 0.2, 1)
- Цвет: #0A84FF
```

#### Фаза 2: Анимация загрузки (300-1200ms)
```
- Точки пульсируют в последовательности
- Создается эффект "волны"
- Длительность: 900ms
- Easing: cubic-bezier(0.4, 0.0, 0.2, 1)
```

#### Фаза 3: Затухание и повтор (1200-1500ms)
```
- Точки плавно исчезают
- Подготовка к следующему циклу
- Easing: cubic-bezier(0.4, 0.0, 1, 1)
```

### Цветовая палитра:
```json
{
  "dots": "#0A84FF",
  "background": "transparent",
  "accent": "#E6F3FF"
}
```

## 5. Error Animation

### Технические характеристики:
- **Файл**: `reba-error.json`
- **Размер**: 120x120px
- **Длительность**: 2500ms
- **Формат**: Lottie JSON
- **Версия**: Lottie 5.7.0+

### Описание анимации:
Анимация ошибки с крестиком и эффектом предупреждения.

### Сценарий анимации:

#### Фаза 1: Появление круга (0-400ms)
```
- Круг появляется с эффектом scale-in
- Масштабирование от 0.0 до 1.0
- Easing: cubic-bezier(0.175, 0.885, 0.32, 1.275) (spring)
- Цвет: #F44336
```

#### Фаза 2: Анимация крестика (400-1500ms)
```
- Крестик рисуется по кругу
- Stroke-dasharray анимация
- Длительность: 1100ms
- Easing: cubic-bezier(0.4, 0.0, 0.2, 1) (standard)
- Цвет: #FFFFFF
```

#### Фаза 3: Эффект предупреждения (1500-2500ms)
```
- Круг слегка трясется (shake effect)
- Добавляется красный ореол
- Easing: cubic-bezier(0.4, 0.0, 0.2, 1)
- Цвет ореола: #FFEBEE
```

### Цветовая палитра:
```json
{
  "circle": "#F44336",
  "cross": "#FFFFFF",
  "glow": "#FFEBEE",
  "background": "#FFFFFF"
}
```

## Технические требования

### Производительность:
- **FPS**: Стабильно 60fps на всех устройствах
- **Размер файла**: Не более 50KB для каждой анимации
- **Память**: Минимальное потребление RAM
- **Батарея**: Оптимизировано для мобильных устройств

### Доступность:
- **Reduced Motion**: Поддержка `prefers-reduced-motion`
- **Screen Reader**: Правильные ARIA метки
- **Контрастность**: Соответствие WCAG AA
- **Размер**: Масштабируемость для разных размеров экранов

### Кросс-платформенность:
- **iOS**: Нативная поддержка через Lottie-iOS
- **Android**: Нативная поддержка через Lottie-Android
- **Web**: Поддержка через Lottie-web
- **React Native**: Поддержка через lottie-react-native
- **Flutter**: Поддержка через lottie package

## Интеграция с дизайн-системой

### Токены анимации:
```json
{
  "duration": {
    "fast": "120ms",
    "normal": "240ms", 
    "slow": "360ms",
    "slower": "480ms"
  },
  "easing": {
    "standard": "cubic-bezier(0.4, 0.0, 0.2, 1)",
    "deceleration": "cubic-bezier(0.0, 0.0, 0.2, 1)",
    "spring": "cubic-bezier(0.175, 0.885, 0.32, 1.275)"
  }
}
```

### Цветовые токены:
```json
{
  "primary": "#0A84FF",
  "success": "#34A853",
  "error": "#F44336",
  "warning": "#FF9800",
  "text": {
    "primary": "#0B0B0B",
    "secondary": "#424242",
    "tertiary": "#757575"
  }
}
```

## Тестирование

### Автоматизированное тестирование:
- Проверка производительности на разных устройствах
- Тестирование с включенным `prefers-reduced-motion`
- Проверка доступности для screen readers
- Тестирование на разных размерах экранов

### Ручное тестирование:
- Проверка плавности анимаций
- Тестирование на слабых устройствах
- Проверка соответствия брендбуку
- Тестирование пользовательского опыта

