import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch {
      // В production можно логировать ошибки в сервис аналитики
      // console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, _password) => {
    // Mock login
    const mockUser = {
      id: '1',
      email,
      name: email.split('@')[0]
    };
    setUser(mockUser);
    await AsyncStorage.setItem('user', JSON.stringify(mockUser));
    return mockUser;
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('user');
  };

  return {
    user,
    loading,
    login,
    logout
  };
};

export default useAuth;