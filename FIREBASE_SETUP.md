# 🔐 Настройка Firebase Auth

## 📋 Пошаговая инструкция

### 1. Создание проекта Firebase

1. Перейдите на [Firebase Console](https://console.firebase.google.com/)
2. Нажмите "Создать проект"
3. Введите название проекта (например: "rehab-app")
4. Отключите Google Analytics (опционально)
5. Нажмите "Создать проект"

### 2. Настройка аутентификации

1. В левом меню выберите "Authentication"
2. Нажмите "Начать"
3. Перейдите на вкладку "Sign-in method"
4. Включите "Email/Password"
5. Нажмите "Сохранить"

### 3. Получение конфигурации

1. В левом меню выберите "Project settings" (шестеренка)
2. Прокрутите вниз до "Your apps"
3. Нажмите "Add app" → выберите веб-приложение (</>)
4. Введите название приложения
5. Скопируйте конфигурацию

### 4. Обновление конфигурации

Замените значения в файле `src/config/firebase.ts`:

```typescript
export const firebaseConfig = {
  apiKey: "AIzaSyC...", // Ваш API ключ
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### 5. Альтернатива для Expo

Если используете Expo, установите:

```bash
npx expo install @react-native-firebase/app @react-native-firebase/auth
```

И настройте через `app.json`:

```json
{
  "expo": {
    "plugins": [
      "@react-native-firebase/app"
    ]
  }
}
```

### 6. Тестирование

После настройки:

1. Запустите приложение
2. Перейдите в профиль
3. Попробуйте зарегистрироваться
4. Проверьте в Firebase Console → Authentication → Users

## 🚨 Важные моменты

- **API ключ** - не является секретом для клиентских приложений
- **Правила безопасности** - настройте в Firebase Console → Firestore → Rules
- **Тестовые пользователи** - можно создать вручную в Firebase Console

## 🔧 Отладка

Если возникают ошибки:

1. Проверьте конфигурацию Firebase
2. Убедитесь, что включена аутентификация по email/password
3. Проверьте консоль браузера на ошибки
4. Убедитесь, что проект Firebase активен

## 📱 Готово!

После настройки у вас будет:
- ✅ Реальная регистрация пользователей
- ✅ Вход в систему
- ✅ Выход из системы
- ✅ Сохранение состояния авторизации
- ✅ Обработка ошибок

