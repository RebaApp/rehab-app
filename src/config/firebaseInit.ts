import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { firebaseConfig } from './firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Инициализация Firebase
const app = initializeApp(firebaseConfig);

// Инициализация Auth с AsyncStorage для React Native
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export default app;