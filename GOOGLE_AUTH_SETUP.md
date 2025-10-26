# 🔐 Настройка Google авторизации

## 📋 Что нужно сделать в Firebase Console

### 1. Включить Google провайдер
1. Откройте [Firebase Console](https://console.firebase.google.com/)
2. Выберите проект "reba-df34c"
3. Перейдите в **Authentication** → **Sign-in method**
4. Найдите **Google** и нажмите **Enable**
5. Введите **Project support email** (ваш email)
6. Нажмите **Save**

### 2. Получить Web Client ID
1. В том же разделе **Google** нажмите **Web SDK configuration**
2. Скопируйте **Web client ID** (выглядит как `840686619600-xxxxxxxxx.apps.googleusercontent.com`)

### 3. Обновить код
Замените в файле `src/services/authService.ts` строку:
```typescript
webClientId: '840686619600-YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
```
на ваш реальный Web Client ID:
```typescript
webClientId: '840686619600-xxxxxxxxx.apps.googleusercontent.com',
```

## 🚀 Тестирование

После настройки:
1. Перезапустите приложение: `npx expo start --clear`
2. Перейдите в **Профиль**
3. Нажмите **Вход**
4. Нажмите **"Войти через Google"**
5. Выберите Google аккаунт
6. Разрешите доступ приложению

## ✅ Что должно произойти

- ✅ Откроется браузер с выбором Google аккаунта
- ✅ После выбора аккаунта модальное окно закроется
- ✅ В профиле появится информация о пользователе
- ✅ В Firebase Console → Authentication → Users появится новый пользователь

## 🔧 Возможные проблемы

### "Google Play Services недоступны"
- Это нормально для симулятора iOS
- На реальном устройстве Android должно работать

### "Web client ID неверный"
- Проверьте, что скопировали правильный Web Client ID
- Убедитесь, что Google провайдер включен в Firebase

### "Ошибка сети"
- Проверьте подключение к интернету
- Убедитесь, что Firebase проект активен

## 📱 Поддержка платформ

- ✅ **iOS**: Работает через Safari
- ✅ **Android**: Работает через Chrome/WebView
- ✅ **Web**: Полная поддержка

## 🎯 Преимущества Google авторизации

- 🚀 **Быстро**: Один клик для входа
- 🔒 **Безопасно**: Данные защищены Google
- 📱 **Удобно**: Не нужно запоминать пароли
- 🌍 **Популярно**: Большинство пользователей имеют Google аккаунт

