// Firebase configuration для проекта "РЕБА"
// Все значения берутся из переменных окружения для безопасности
export const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '',
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || '',
};

// Проверка, что все необходимые переменные установлены
const requiredFirebaseVars = [
  'EXPO_PUBLIC_FIREBASE_API_KEY',
  'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'EXPO_PUBLIC_FIREBASE_PROJECT_ID',
];

const missingVars = requiredFirebaseVars.filter(
  (varName) => !process.env[varName]
);

if (missingVars.length > 0 && __DEV__) {
  console.warn(
    `⚠️ Firebase конфигурация неполная. Отсутствуют переменные: ${missingVars.join(', ')}. ` +
    'Убедитесь, что все EXPO_PUBLIC_FIREBASE_* переменные установлены в .env файле.'
  );
}

// Для разработки можно использовать тестовые значения
export const isDevelopment = __DEV__;

// Если вы используете Expo, то нужно настроить Firebase через Expo
export const useExpoFirebase = true;
