// Тестовый файл для проверки авторизации
import authService from '../services/authService';

export const testYandexAuth = async () => {
  console.log('🧪 Тестируем Яндекс авторизацию...');
  
  try {
    const result = await authService.signInWithYandex();
    console.log('📊 Результат теста:', result);
    return result;
  } catch (error) {
    console.error('💥 Ошибка в тесте:', error);
    return { success: false, error: error.message };
  }
};

export const testEmailAuth = async (email: string, password: string) => {
  console.log('🧪 Тестируем Email авторизацию...');
  
  try {
    const result = await authService.signInWithEmail(email, password);
    console.log('📊 Результат теста:', result);
    return result;
  } catch (error) {
    console.error('💥 Ошибка в тесте:', error);
    return { success: false, error: error.message };
  }
};

