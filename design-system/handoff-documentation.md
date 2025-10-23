# REBA Design System - Handoff Documentation

## Обзор для разработчиков

Данная документация содержит всю необходимую информацию для реализации дизайн-системы РЕБА в мобильных приложениях. Все компоненты протестированы на совместимость с React Native, Flutter, iOS и Android.

## Быстрый старт

### 1. Установка зависимостей

#### React Native:
```bash
npm install lottie-react-native @expo/vector-icons
# или
yarn add lottie-react-native @expo/vector-icons
```

#### Flutter:
```yaml
dependencies:
  lottie: ^2.7.0
  google_fonts: ^4.0.4
```

### 2. Импорт темы

#### React Native:
```javascript
import { REBATheme, typographyStyles, componentStyles } from './design-system/react-native-theme';
```

#### Flutter:
```dart
import 'package:reba_design_system/flutter_theme.dart';
import 'package:reba_design_system/flutter_components.dart';
```

### 3. Применение темы

#### React Native:
```javascript
// В App.js
import { REBATheme } from './design-system/react-native-theme';

const App = () => {
  return (
    <View style={{ backgroundColor: REBATheme.colors.background.primary }}>
      {/* Ваш контент */}
    </View>
  );
};
```

#### Flutter:
```dart
// В main.dart
import 'package:flutter/material.dart';
import 'package:reba_design_system/flutter_theme.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'REBA',
      theme: REBATheme.lightTheme,
      home: MyHomePage(),
    );
  }
}
```

## Дизайн-токены

### Цвета

#### React Native:
```javascript
// Основные цвета
const primaryColor = REBATheme.colors.primary[500]; // #0A84FF
const backgroundColor = REBATheme.colors.background.primary; // #FFFFFF
const textColor = REBATheme.colors.text.primary; // #0B0B0B

// Семантические цвета
const successColor = REBATheme.colors.semantic.success[500]; // #34A853
const errorColor = REBATheme.colors.semantic.error[500]; // #F44336
const warningColor = REBATheme.colors.semantic.warning[500]; // #FF9800
```

#### Flutter:
```dart
// Основные цвета
final primaryColor = REBATheme.primary; // #0A84FF
final backgroundColor = REBATheme.backgroundPrimary; // #FFFFFF
final textColor = REBATheme.textPrimary; // #0B0B0B

// Семантические цвета
final successColor = REBATheme.success; // #34A853
final errorColor = REBATheme.error; // #F44336
final warningColor = REBATheme.warning; // #FF9800
```

### Типографика

#### React Native:
```javascript
// Использование готовых стилей
<Text style={typographyStyles.h1}>Заголовок</Text>
<Text style={typographyStyles.body}>Основной текст</Text>
<Text style={typographyStyles.caption}>Подпись</Text>

// Или создание собственных стилей
const customStyle = {
  fontSize: REBATheme.typography.fontSize.lg,
  fontWeight: REBATheme.typography.fontWeight.semibold,
  color: REBATheme.colors.text.primary,
  lineHeight: REBATheme.typography.fontSize.lg * REBATheme.typography.lineHeight.relaxed,
};
```

#### Flutter:
```dart
// Использование готовых стилей
Text(
  'Заголовок',
  style: Theme.of(context).textTheme.displayLarge,
)

Text(
  'Основной текст',
  style: Theme.of(context).textTheme.bodyLarge,
)

// Или создание собственных стилей
Text(
  'Кастомный текст',
  style: TextStyle(
    fontSize: REBATheme.fontSizeLg,
    fontWeight: FontWeight.w600,
    color: REBATheme.textPrimary,
    height: REBATheme.lineHeightRelaxed,
  ),
)
```

### Spacing

#### React Native:
```javascript
// Использование spacing токенов
const containerStyle = {
  padding: REBATheme.spacing[4], // 16px
  margin: REBATheme.spacing[2], // 8px
  gap: REBATheme.spacing[3], // 12px
};
```

#### Flutter:
```dart
// Использование spacing токенов
Container(
  padding: EdgeInsets.all(REBATheme.spacing4), // 16px
  margin: EdgeInsets.all(REBATheme.spacing2), // 8px
  child: Column(
    children: [
      Widget1(),
      SizedBox(height: REBATheme.spacing3), // 12px
      Widget2(),
    ],
  ),
)
```

## Компоненты

### Button

#### React Native:
```javascript
import { REBAButton } from './design-system/react-native-components';

// Основная кнопка
<REBAButton
  title="Написать"
  onPress={() => console.log('Нажато')}
  variant="primary"
  size="medium"
/>

// Вторичная кнопка
<REBAButton
  title="Отмена"
  onPress={() => console.log('Отменено')}
  variant="secondary"
  size="medium"
/>

// Кнопка с иконкой
<REBAButton
  title="Позвонить"
  onPress={() => console.log('Звонок')}
  variant="primary"
  icon="call"
  size="medium"
/>

// Кнопка загрузки
<REBAButton
  title="Отправка..."
  onPress={() => {}}
  variant="primary"
  loading={true}
  size="medium"
/>
```

#### Flutter:
```dart
import 'package:reba_design_system/flutter_components.dart';

// Основная кнопка
REBAButton(
  text: 'Написать',
  onPressed: () => print('Нажато'),
  type: REBAButtonType.primary,
  size: REBAButtonSize.medium,
)

// Вторичная кнопка
REBAButton(
  text: 'Отмена',
  onPressed: () => print('Отменено'),
  type: REBAButtonType.secondary,
  size: REBAButtonSize.medium,
)

// Кнопка с иконкой
REBAButton(
  text: 'Позвонить',
  onPressed: () => print('Звонок'),
  type: REBAButtonType.primary,
  icon: Icons.call,
  size: REBAButtonSize.medium,
)

// Кнопка загрузки
REBAButton(
  text: 'Отправка...',
  onPressed: null,
  type: REBAButtonType.primary,
  isLoading: true,
  size: REBAButtonSize.medium,
)
```

### Input

#### React Native:
```javascript
import { REBAInput } from './design-system/react-native-components';

// Обычное поле ввода
<REBAInput
  placeholder="Введите email"
  value={email}
  onChangeText={setEmail}
  keyboardType="email-address"
/>

// Поле с ошибкой
<REBAInput
  placeholder="Введите пароль"
  value={password}
  onChangeText={setPassword}
  secureTextEntry={true}
  error="Пароль должен содержать минимум 8 символов"
/>

// Поле поиска
<REBAInput
  placeholder="Поиск центров..."
  value={searchQuery}
  onChangeText={setSearchQuery}
  leftIcon="search-outline"
  rightIcon="close-circle"
  onRightIconPress={() => setSearchQuery('')}
/>
```

#### Flutter:
```dart
import 'package:reba_design_system/flutter_components.dart';

// Обычное поле ввода
REBAInput(
  label: 'Email',
  hint: 'Введите email',
  controller: emailController,
  keyboardType: TextInputType.emailAddress,
)

// Поле с ошибкой
REBAInput(
  label: 'Пароль',
  hint: 'Введите пароль',
  controller: passwordController,
  obscureText: true,
  errorText: 'Пароль должен содержать минимум 8 символов',
)

// Поле поиска
REBAInput(
  hint: 'Поиск центров...',
  controller: searchController,
  prefixIcon: Icon(Icons.search),
  suffixIcon: IconButton(
    icon: Icon(Icons.clear),
    onPressed: () => searchController.clear(),
  ),
)
```

### Card

#### React Native:
```javascript
import { REBACard } from './design-system/react-native-components';

// Обычная карточка
<REBACard variant="default">
  <Text style={typographyStyles.h3}>Название центра</Text>
  <Text style={typographyStyles.body}>Описание центра...</Text>
</REBACard>

// Карточка с тенью
<REBACard variant="elevated">
  <Text style={typographyStyles.h3}>Название центра</Text>
  <Text style={typographyStyles.body}>Описание центра...</Text>
</REBACard>

// Интерактивная карточка
<REBACard 
  variant="default" 
  onPress={() => navigation.navigate('CenterDetail')}
>
  <Text style={typographyStyles.h3}>Название центра</Text>
  <Text style={typographyStyles.body}>Описание центра...</Text>
</REBACard>
```

#### Flutter:
```dart
import 'package:reba_design_system/flutter_components.dart';

// Обычная карточка
REBACard(
  variant: REBACardVariant.default_,
  child: Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Text('Название центра', style: Theme.of(context).textTheme.headlineSmall),
      Text('Описание центра...', style: Theme.of(context).textTheme.bodyLarge),
    ],
  ),
)

// Карточка с тенью
REBACard(
  variant: REBACardVariant.elevated,
  child: Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Text('Название центра', style: Theme.of(context).textTheme.headlineSmall),
      Text('Описание центра...', style: Theme.of(context).textTheme.bodyLarge),
    ],
  ),
)

// Интерактивная карточка
REBACard(
  variant: REBACardVariant.default_,
  onTap: () => Navigator.pushNamed(context, '/center-detail'),
  child: Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Text('Название центра', style: Theme.of(context).textTheme.headlineSmall),
      Text('Описание центра...', style: Theme.of(context).textTheme.bodyLarge),
    ],
  ),
)
```

### Rating

#### React Native:
```javascript
import { REBARating } from './design-system/react-native-components';

// Рейтинг только для чтения
<REBARating
  rating={4.8}
  maxRating={5}
  size="medium"
  readonly={true}
  showText={true}
/>

// Интерактивный рейтинг
<REBARating
  rating={userRating}
  maxRating={5}
  size="large"
  readonly={false}
  onRatingChange={setUserRating}
  showText={true}
/>
```

#### Flutter:
```dart
import 'package:reba_design_system/flutter_components.dart';

// Рейтинг только для чтения
REBARating(
  rating: 4.8,
  maxRating: 5,
  size: REBARatingSize.medium,
  readonly: true,
  showText: true,
)

// Интерактивный рейтинг
REBARating(
  rating: userRating,
  maxRating: 5,
  size: REBARatingSize.large,
  readonly: false,
  onRatingChanged: (rating) => setState(() => userRating = rating),
  showText: true,
)
```

### Search Input

#### React Native:
```javascript
import { REBASearchInput } from './design-system/react-native-components';

<REBASearchInput
  placeholder="Поиск по центрам, городу..."
  value={searchQuery}
  onChangeText={setSearchQuery}
  onClear={() => setSearchQuery('')}
  onFilterPress={() => setFiltersVisible(true)}
  showFilter={true}
  filterActive={hasActiveFilters}
/>
```

#### Flutter:
```dart
import 'package:reba_design_system/flutter_components.dart';

REBASearchInput(
  placeholder: 'Поиск по центрам, городу...',
  value: searchQuery,
  onChanged: (value) => setState(() => searchQuery = value),
  onClear: () => setState(() => searchQuery = ''),
  onFilterPress: () => setState(() => filtersVisible = true),
  showFilter: true,
  filterActive: hasActiveFilters,
)
```

## Lottie анимации

### Установка

#### React Native:
```bash
npm install lottie-react-native
```

#### Flutter:
```yaml
dependencies:
  lottie: ^2.7.0
```

### Использование

#### React Native:
```javascript
import LottieView from 'lottie-react-native';

// Onboarding анимация
<LottieView
  source={require('./assets/animations/reba-onboarding.json')}
  autoPlay
  loop={false}
  style={{ width: 200, height: 200 }}
  resizeMode="contain"
/>

// Empty state анимация
<LottieView
  source={require('./assets/animations/reba-empty-state.json')}
  autoPlay
  loop={true}
  style={{ width: 150, height: 150 }}
  resizeMode="contain"
/>

// Success анимация
<LottieView
  source={require('./assets/animations/reba-success.json')}
  autoPlay
  loop={false}
  style={{ width: 120, height: 120 }}
  resizeMode="contain"
/>
```

#### Flutter:
```dart
import 'package:lottie/lottie.dart';

// Onboarding анимация
Lottie.asset(
  'assets/animations/reba-onboarding.json',
  width: 200,
  height: 200,
  fit: BoxFit.contain,
  repeat: false,
)

// Empty state анимация
Lottie.asset(
  'assets/animations/reba-empty-state.json',
  width: 150,
  height: 150,
  fit: BoxFit.contain,
  repeat: true,
)

// Success анимация
Lottie.asset(
  'assets/animations/reba-success.json',
  width: 120,
  height: 120,
  fit: BoxFit.contain,
  repeat: false,
)
```

## Адаптивность

### Breakpoints

#### React Native:
```javascript
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Определение размера экрана
const isSmallScreen = width < 375;
const isMediumScreen = width >= 375 && width < 414;
const isLargeScreen = width >= 414;

// Адаптивные стили
const adaptiveStyles = {
  container: {
    padding: isSmallScreen ? REBATheme.spacing[3] : REBATheme.spacing[4],
  },
  title: {
    fontSize: isSmallScreen ? REBATheme.typography.fontSize.lg : REBATheme.typography.fontSize.xl,
  },
};
```

#### Flutter:
```dart
import 'package:flutter/material.dart';

class ResponsiveWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    
    final isSmallScreen = screenWidth < 375;
    final isMediumScreen = screenWidth >= 375 && screenWidth < 414;
    final isLargeScreen = screenWidth >= 414;
    
    return Container(
      padding: EdgeInsets.all(isSmallScreen ? REBATheme.spacing3 : REBATheme.spacing4),
      child: Text(
        'Заголовок',
        style: TextStyle(
          fontSize: isSmallScreen ? REBATheme.fontSizeLg : REBATheme.fontSizeXl,
        ),
      ),
    );
  }
}
```

## Accessibility

### React Native:
```javascript
// Доступная кнопка
<TouchableOpacity
  accessible={true}
  accessibilityLabel="Закрыть модальное окно"
  accessibilityRole="button"
  accessibilityHint="Закрывает текущее модальное окно"
  onPress={onClose}
>
  <Text>×</Text>
</TouchableOpacity>

// Доступное поле ввода
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
// Доступная кнопка
ElevatedButton(
  onPressed: onPressed,
  child: Text('Закрыть'),
).semantics(
  label: 'Закрыть модальное окно',
  hint: 'Закрывает текущее модальное окно',
  button: true,
)

// Доступное поле ввода
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

## Тестирование

### Unit тесты

#### React Native (Jest):
```javascript
import { REBAButton } from './design-system/react-native-components';
import { render, fireEvent } from '@testing-library/react-native';

describe('REBAButton', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <REBAButton title="Test Button" onPress={() => {}} />
    );
    
    expect(getByText('Test Button')).toBeTruthy();
  });
  
  it('calls onPress when pressed', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <REBAButton title="Test Button" onPress={mockOnPress} />
    );
    
    fireEvent.press(getByText('Test Button'));
    expect(mockOnPress).toHaveBeenCalled();
  });
});
```

#### Flutter (Flutter Test):
```dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:reba_design_system/flutter_components.dart';

void main() {
  group('REBAButton', () {
    testWidgets('renders correctly', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: REBAButton(
              text: 'Test Button',
              onPressed: () {},
            ),
          ),
        ),
      );
      
      expect(find.text('Test Button'), findsOneWidget);
    });
    
    testWidgets('calls onPressed when tapped', (WidgetTester tester) async {
      bool pressed = false;
      
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: REBAButton(
              text: 'Test Button',
              onPressed: () => pressed = true,
            ),
          ),
        ),
      );
      
      await tester.tap(find.text('Test Button'));
      expect(pressed, isTrue);
    });
  });
}
```

### Accessibility тесты

#### React Native:
```javascript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('should not have accessibility violations', async () => {
  const { container } = render(<MyComponent />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## Производительность

### Оптимизация изображений

#### React Native:
```javascript
import { Image } from 'react-native';

// Оптимизированное изображение
<Image
  source={{ uri: imageUrl }}
  style={{ width: 200, height: 200 }}
  resizeMode="cover"
  loadingIndicatorSource={require('./placeholder.png')}
/>
```

#### Flutter:
```dart
import 'package:cached_network_image/cached_network_image.dart';

// Оптимизированное изображение
CachedNetworkImage(
  imageUrl: imageUrl,
  width: 200,
  height: 200,
  fit: BoxFit.cover,
  placeholder: (context, url) => CircularProgressIndicator(),
  errorWidget: (context, url, error) => Icon(Icons.error),
)
```

### Оптимизация списков

#### React Native:
```javascript
import { FlatList } from 'react-native';

<FlatList
  data={centers}
  renderItem={renderCenter}
  keyExtractor={(item) => item.id}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  updateCellsBatchingPeriod={100}
  initialNumToRender={5}
  windowSize={10}
/>
```

#### Flutter:
```dart
import 'package:flutter/material.dart';

ListView.builder(
  itemCount: centers.length,
  itemBuilder: (context, index) {
    return CenterCard(center: centers[index]);
  },
  cacheExtent: 250.0,
)
```

## Troubleshooting

### Частые проблемы

#### 1. Шрифты не загружаются
**Проблема**: Шрифт Inter не отображается
**Решение**: 
- Убедитесь, что шрифт добавлен в проект
- Проверьте правильность импорта
- Для React Native: добавьте шрифт в `react-native.config.js`

#### 2. Lottie анимации не воспроизводятся
**Проблема**: Анимации не показываются
**Решение**:
- Проверьте путь к файлу анимации
- Убедитесь, что файл добавлен в assets
- Проверьте версию Lottie библиотеки

#### 3. Цвета не соответствуют дизайну
**Проблема**: Цвета отображаются неправильно
**Решение**:
- Проверьте правильность импорта темы
- Убедитесь, что используете правильные токены
- Проверьте поддержку цветовых пространств

### Поддержка

Для получения помощи:
1. Проверьте документацию компонентов
2. Изучите примеры кода
3. Обратитесь к команде дизайна
4. Создайте issue в репозитории

## Changelog

### v1.0.0 (2025-01-20)
- Первый релиз дизайн-системы
- Базовые компоненты и токены
- Поддержка React Native и Flutter
- Lottie анимации
- Accessibility guidelines

