import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useFavorites = () => {
  const [favorites, setFavorites] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = useCallback(async () => {
    try {
      const favs = await AsyncStorage.getItem("reba:favorites_v1");
      if (favs) {
        setFavorites(JSON.parse(favs));
      }
    } catch {
      // В production можно логировать ошибки в сервис аналитики
      // console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleFavorite = useCallback(async (id) => {
    try {
      const newFavorites = { ...favorites };
      if (newFavorites[id]) {
        delete newFavorites[id];
      } else {
        newFavorites[id] = true;
      }
      
      setFavorites(newFavorites);
      await AsyncStorage.setItem("reba:favorites_v1", JSON.stringify(newFavorites));
    } catch {
      // В production можно логировать ошибки в сервис аналитики
      // console.error('Error toggling favorite:', error);
    }
  }, [favorites]);

  const isFavorite = useCallback((id) => {
    return !!favorites[id];
  }, [favorites]);

  const clearFavorites = useCallback(async () => {
    try {
      setFavorites({});
      await AsyncStorage.removeItem("reba:favorites_v1");
    } catch {
      // В production можно логировать ошибки в сервис аналитики
      // console.error('Error clearing favorites:', error);
    }
  }, []);

  return {
    favorites,
    loading,
    toggleFavorite,
    isFavorite,
    clearFavorites
  };
};

export default useFavorites;
