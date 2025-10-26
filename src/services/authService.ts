import { auth } from '../config/firebaseInit';
import { User } from '../types';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { Linking } from 'react-native';

export interface AuthError {
  code: string;
  message: string;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: AuthError;
}

class AuthService {
  // ВАЖНО: Замените эти значения на ваши реальные Client ID и Secret из Яндекс.OAuth
  private yandexClientId = 'b08282bbc8e8435d88e7c02b2098496f';
  private yandexClientSecret = 'ba5c7710a1fa4cd58ecccbacc514c890';

  constructor() {
    // Настраиваем WebBrowser для правильной работы
    WebBrowser.maybeCompleteAuthSession();
  }

  // Яндекс авторизация через WebBrowser (без PKCE)
  async signInWithYandex(): Promise<AuthResult> {
    try {
      console.log('🚀 Начинаем Яндекс авторизацию через WebBrowser...');
      
      // Создаем redirect URI для Яндекс OAuth
      const redirectUri = 'reba://auth';
      
      console.log('📱 Redirect URI:', redirectUri);
      
      // Создаем URL для авторизации без PKCE
      const authUrl = `https://oauth.yandex.ru/authorize?response_type=code&client_id=${this.yandexClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=login:email+login:info`;
      
      console.log('🌐 URL авторизации:', authUrl);
      console.log('🌐 Открываем браузер для Яндекс авторизации...');
      
      // Открываем браузер для авторизации
      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);
      
      console.log('📋 Результат Яндекс авторизации:', result);
      
      if (result.type === 'success' && result.url) {
        console.log('✅ Получен код авторизации от Яндекса');
        
        // Извлекаем код из URL
        const url = new URL(result.url);
        const code = url.searchParams.get('code');
        
        if (!code) {
          throw new Error('Код авторизации не найден в URL');
        }
        
        console.log('🔑 Код авторизации:', code);
        
        // Обмениваем код на токен напрямую через fetch
        const tokenParams = new URLSearchParams();
        tokenParams.append('grant_type', 'authorization_code');
        tokenParams.append('code', code);
        tokenParams.append('client_id', this.yandexClientId);
        tokenParams.append('client_secret', this.yandexClientSecret);
        tokenParams.append('redirect_uri', redirectUri);

        console.log('🔄 Отправляем запрос на получение токена...');
        console.log('📋 Параметры:', tokenParams.toString());

        const tokenResponse = await fetch('https://oauth.yandex.ru/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
          },
          body: tokenParams.toString(),
        });

        if (!tokenResponse.ok) {
          const errorText = await tokenResponse.text();
          console.log('❌ Ошибка получения токена:', errorText);
          throw new Error(`Ошибка получения токена: ${tokenResponse.status}`);
        }

        const tokenData = await tokenResponse.json();
        
        console.log('🎫 Получен токен от Яндекса:', tokenData.access_token);
        
        // Получаем информацию о пользователе
        const userInfoResponse = await fetch(
          `https://login.yandex.ru/info?format=json`,
          {
            headers: {
              'Authorization': `OAuth ${tokenData.access_token}`,
            },
          }
        );
        
        if (!userInfoResponse.ok) {
          throw new Error(`Ошибка получения данных пользователя: ${userInfoResponse.status}`);
        }
        
        const userInfo = await userInfoResponse.json();
        
        console.log('👤 Информация о пользователе от Яндекса:', userInfo);
        
        // Создаем объект пользователя для нашего приложения
        const appUser: User = {
          id: userInfo.id,
          email: userInfo.default_email || userInfo.emails?.[0] || '',
          name: userInfo.display_name || userInfo.real_name || userInfo.login || 'Пользователь',
          userType: 'USER',
          photo: userInfo.default_avatar_id ? `https://avatars.yandex.net/get-yapic/${userInfo.default_avatar_id}/islands-200` : '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        return {
          success: true,
          user: appUser,
        };
      } else if (result.type === 'cancel') {
        console.log('❌ Яндекс авторизация отменена пользователем');
        return {
          success: false,
          error: {
            code: 'CANCELLED',
            message: 'Вход отменен пользователем',
          },
        };
      } else {
        console.log('❌ Ошибка Яндекс авторизации:', result);
        return {
          success: false,
          error: {
            code: 'AUTH_ERROR',
            message: 'Ошибка при авторизации',
          },
        };
      }
    } catch (error: any) {
      console.log('💥 Ошибка в Яндекс авторизации:', error);
      
      return {
        success: false,
        error: {
          code: error.code || 'UNKNOWN',
          message: this.getYandexErrorMessage(error.code),
        },
      };
    }
  }

  // Регистрация с email и паролем
  async registerWithEmail(email: string, password: string, userData: Partial<User>): Promise<AuthResult> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Профиль пользователя будет создан с базовой информацией

      // Создаем объект пользователя для нашего приложения
      const appUser: User = {
        id: userCredential.user.uid,
        email: userCredential.user.email || email,
        name: userData.name || userCredential.user.displayName || email.split('@')[0],
        userType: userData.userType || 'USER',
        phone: userData.phone || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return {
        success: true,
        user: appUser,
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.code,
          message: this.getErrorMessage(error.code),
        },
      };
    }
  }

  // Вход с email и паролем
  async signInWithEmail(email: string, password: string): Promise<AuthResult> {
    try {
      console.log('📧 Начинаем Email авторизацию:', email);
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      console.log('✅ Email авторизация успешна:', userCredential.user.email);
      
      const appUser: User = {
        id: userCredential.user.uid,
        email: userCredential.user.email || email,
        name: userCredential.user.displayName || email.split('@')[0],
        userType: 'USER', // По умолчанию, можно расширить логику
        createdAt: userCredential.user.metadata.creationTime || new Date().toISOString(),
        updatedAt: userCredential.user.metadata.lastSignInTime || new Date().toISOString(),
      };

      return {
        success: true,
        user: appUser,
      };
    } catch (error: any) {
      console.log('💥 Ошибка в Email авторизации:', error);
      return {
        success: false,
        error: {
          code: error.code,
          message: this.getErrorMessage(error.code),
        },
      };
    }
  }

  // Выход из системы
  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }

  // Сброс пароля
  async resetPassword(email: string): Promise<AuthResult> {
    try {
      await sendPasswordResetEmail(auth, email);
      return {
        success: true,
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.code,
          message: this.getErrorMessage(error.code),
        },
      };
    }
  }

  // Получение текущего пользователя
  getCurrentUser(): User | null {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) return null;

    return {
      id: firebaseUser.uid,
      email: firebaseUser.email || '',
      name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Пользователь',
      userType: 'USER',
      createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
      updatedAt: firebaseUser.metadata.lastSignInTime || new Date().toISOString(),
    };
  }

  // Слушатель изменений состояния авторизации
  onAuthStateChanged(callback: (user: User | null) => void) {
    return firebaseOnAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const appUser: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Пользователь',
          userType: 'USER',
          createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
          updatedAt: firebaseUser.metadata.lastSignInTime || new Date().toISOString(),
        };
        callback(appUser);
      } else {
        callback(null);
      }
    });
  }

  // Методы для тестирования конфигурации
  getYandexClientId(): string {
    return this.yandexClientId;
  }

  hasYandexClientSecret(): boolean {
    return !!this.yandexClientSecret;
  }

  // Преобразование кодов ошибок Яндекса в понятные сообщения
  private getYandexErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'access_denied':
        return 'Доступ запрещен пользователем';
      case 'invalid_request':
        return 'Неверный запрос авторизации';
      case 'invalid_client':
        return 'Неверный идентификатор приложения';
      case 'invalid_grant':
        return 'Неверный код авторизации';
      case 'unauthorized_client':
        return 'Приложение не авторизовано';
      case 'unsupported_grant_type':
        return 'Неподдерживаемый тип авторизации';
      case 'invalid_scope':
        return 'Неверные права доступа';
      case 'network_error':
        return 'Ошибка сети. Проверьте подключение';
      default:
        return 'Ошибка при входе через Яндекс';
    }
  }

  // Преобразование кодов ошибок Firebase в понятные сообщения
  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'Этот email уже используется';
      case 'auth/invalid-email':
        return 'Некорректный email';
      case 'auth/operation-not-allowed':
        return 'Операция не разрешена';
      case 'auth/weak-password':
        return 'Пароль слишком слабый';
      case 'auth/user-disabled':
        return 'Пользователь заблокирован';
      case 'auth/user-not-found':
        return 'Пользователь не найден. Сначала зарегистрируйтесь';
      case 'auth/wrong-password':
        return 'Неверный пароль';
      case 'auth/invalid-credential':
        return 'Пользователь не найден. Сначала зарегистрируйтесь';
      case 'auth/too-many-requests':
        return 'Слишком много попыток. Попробуйте позже';
      case 'auth/network-request-failed':
        return 'Ошибка сети. Проверьте подключение';
      default:
        return 'Произошла ошибка при авторизации';
    }
  }
}

export default new AuthService();