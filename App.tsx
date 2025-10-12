import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  Text,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

// Store
import useAppStore from './src/store/useAppStore';

// Components
import ErrorBoundary from './src/components/common/ErrorBoundary';
import LoadingSpinner from './src/components/common/LoadingSpinner';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/SearchScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import ProfileScreen from './src/screens/ProfileScreen';

// Utils
import { THEME } from './src/utils/constants';

// Types
import { Center, Article } from './src/types';

export default function App() {
  // Zustand store
  const {
    // State
    user,
    isAuthenticated,
    authLoading,
    centersLoading,
    centersError,
    currentTab,
    refreshing,
    
    // Actions
    setCurrentTab,
    setSelectedCenter,
    setArticleOpen,
    setSettingsVisible,
    setFiltersVisible,
    setRefreshing,
    toggleFavorite,
    isFavorite,
    logout,
  } = useAppStore();

  // Animations
  const tabTransition = useRef(new Animated.Value(0)).current;
  const shimmer = useRef(new Animated.Value(0.3)).current;

  // Effects
  useEffect(() => {
    // Initialize shimmer animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 0.9,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: 0.3,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [shimmer]);

  useEffect(() => {
    // Tab transition animation
    Animated.timing(tabTransition, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      tabTransition.setValue(0);
    });
  }, [currentTab, tabTransition]);

  // Handlers
  const handleTabChange = (newTab: 'home' | 'search' | 'fav' | 'profile') => {
    setCurrentTab(newTab);
  };

  const handleCenterPress = (center: Center) => {
    setSelectedCenter(center);
  };

  const handleArticlePress = (article: Article) => {
    setArticleOpen(article);
  };

  const handleLoginPress = () => {
    Alert.alert('Вход', 'Функция входа будет добавлена в следующей версии');
  };

  const handleRegisterPress = () => {
    Alert.alert('Регистрация', 'Функция регистрации будет добавлена в следующей версии');
  };

  const handleLogout = async () => {
    try {
      logout();
      Alert.alert('Выход', 'Вы вышли из аккаунта');
    } catch {
      Alert.alert('Ошибка', 'Не удалось выйти из аккаунта');
    }
  };

  const handleSettingsPress = () => {
    setSettingsVisible(true);
  };

  const handleFiltersPress = () => {
    setFiltersVisible(true);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // Simulate refresh
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch {
      // В production можно логировать ошибки в сервис аналитики
      // console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Render loading screen
  if (authLoading || centersLoading) {
    return (
      <ErrorBoundary>
        <View style={styles.loadingContainer}>
          <LoadingSpinner />
        </View>
      </ErrorBoundary>
    );
  }

  // Render error screen
  if (centersError) {
    return (
      <ErrorBoundary>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Ошибка загрузки данных</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
            <Text style={styles.retryButtonText}>Повторить</Text>
          </TouchableOpacity>
        </View>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <LinearGradient colors={[THEME.bgTop, THEME.bgMid, THEME.bgBottom]} style={styles.app}>
        <SafeAreaView style={styles.container}>
          <Animated.View
            style={[
              styles.content,
              {
                opacity: tabTransition.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [1, 0.7, 1],
                }),
                transform: [
                  {
                    scale: tabTransition.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [1, 0.98, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            {currentTab === 'home' && (
              <HomeScreen
                onArticlePress={handleArticlePress}
                shimmer={shimmer}
              />
            )}
            {currentTab === 'search' && (
              <SearchScreen
                onCenterPress={handleCenterPress}
                onToggleFavorite={toggleFavorite}
                isFavorite={isFavorite}
                onFiltersPress={handleFiltersPress}
                onRefresh={handleRefresh}
                refreshing={refreshing}
              />
            )}
            {currentTab === 'fav' && (
              <FavoritesScreen
                onCenterPress={handleCenterPress}
                onToggleFavorite={toggleFavorite}
                isFavorite={isFavorite}
                onSearchPress={() => setCurrentTab('search')}
              />
            )}
            {currentTab === 'profile' && (
              <ProfileScreen
                user={user}
                isAuthenticated={isAuthenticated}
                onLoginPress={handleLoginPress}
                onRegisterPress={handleRegisterPress}
                onLogoutPress={handleLogout}
                onSettingsPress={handleSettingsPress}
              />
            )}
          </Animated.View>

          {/* Bottom Navigation */}
          <View style={styles.bottomNav}>
            <TouchableOpacity
              style={styles.navItem}
              onPress={() => handleTabChange('home')}
              activeOpacity={0.7}
            >
              <Ionicons
                name={currentTab === 'home' ? 'home' : 'home-outline'}
                size={24}
                color={currentTab === 'home' ? THEME.primary : THEME.muted}
              />
              <Text
                style={[
                  styles.navText,
                  { color: currentTab === 'home' ? THEME.primary : THEME.muted },
                ]}
              >
                Главная
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navItem}
              onPress={() => handleTabChange('search')}
              activeOpacity={0.7}
            >
              <Ionicons
                name={currentTab === 'search' ? 'search' : 'search-outline'}
                size={24}
                color={currentTab === 'search' ? THEME.primary : THEME.muted}
              />
              <Text
                style={[
                  styles.navText,
                  { color: currentTab === 'search' ? THEME.primary : THEME.muted },
                ]}
              >
                Поиск
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navItem}
              onPress={() => handleTabChange('fav')}
              activeOpacity={0.7}
            >
              <Ionicons
                name={currentTab === 'fav' ? 'heart' : 'heart-outline'}
                size={24}
                color={currentTab === 'fav' ? THEME.primary : THEME.muted}
              />
              <Text
                style={[
                  styles.navText,
                  { color: currentTab === 'fav' ? THEME.primary : THEME.muted },
                ]}
              >
                Избранное
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navItem}
              onPress={() => handleTabChange('profile')}
              activeOpacity={0.7}
            >
              <Ionicons
                name={currentTab === 'profile' ? 'person' : 'person-outline'}
                size={24}
                color={currentTab === 'profile' ? THEME.primary : THEME.muted}
              />
              <Text
                style={[
                  styles.navText,
                  { color: currentTab === 'profile' ? THEME.primary : THEME.muted },
                ]}
              >
                Профиль
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: THEME.bgTop,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: THEME.bgTop,
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: THEME.muted,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: THEME.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  bottomNav: {
    height: 70,
    margin: 12,
    backgroundColor: '#fff',
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    ...THEME.shadow,
  },
  navItem: {
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  navText: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
});
