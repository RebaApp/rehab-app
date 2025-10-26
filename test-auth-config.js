// Простой тест авторизации
import authService from './src/services/authService';

console.log('🧪 Тестируем конфигурацию авторизации...');

// Проверяем, что authService загружается
console.log('✅ AuthService загружен');

// Проверяем конфигурацию Яндекс OAuth
console.log('📋 Client ID:', authService.getYandexClientId());
console.log('🔐 Client Secret:', authService.hasYandexClientSecret() ? 'УСТАНОВЛЕН' : 'НЕ НАЙДЕН');

// Тестируем создание redirect URI
import * as AuthSession from 'expo-auth-session';

const redirectUri = AuthSession.makeRedirectUri({
  scheme: 'reba',
  path: 'auth',
});

console.log('🔗 Redirect URI:', redirectUri);

console.log('✅ Тест конфигурации завершен');
