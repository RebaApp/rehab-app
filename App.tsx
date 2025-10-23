import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import useAppStore from './src/store/useAppStore';
import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/SearchScreen';
import JourneyScreen from './src/screens/JourneyScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ArticleDetailScreen from './src/screens/ArticleDetailScreen';
import CenterDetailScreen from './src/screens/CenterDetailScreen';
import { THEME } from './src/utils/constants';

export default function App() {
  const {
    user,
    isAuthenticated,
    currentTab,
    setCurrentTab,
    centersLoading,
    loadCenters,
    toggleFavorite,
    isFavorite,
  } = useAppStore();

  useEffect(() => {
    console.log('App mounted, loading centers...');
    try {
      loadCenters();
    } catch (error) {
      console.error('Failed to load centers:', error);
    }
  }, [loadCenters]);

  const [selectedArticle, setSelectedArticle] = React.useState(null);
  const [selectedCenter, setSelectedCenter] = React.useState(null);

  const handleArticlePress = useCallback((article: any) => {
    console.log('Article pressed:', article.title);
    setSelectedArticle(article);
  }, []);

  const handleCenterPress = useCallback((center: any) => {
    console.log('Center pressed:', center.name);
    setSelectedCenter(center);
  }, []);

  const handleCloseArticle = useCallback(() => {
    setSelectedArticle(null);
  }, []);

  const handleCloseCenter = useCallback(() => {
    setSelectedCenter(null);
  }, []);

  const renderContent = () => {
    // Если открыта статья, показываем её детальную страницу
    if (selectedArticle) {
      return (
        <ArticleDetailScreen
          article={selectedArticle}
          onClose={handleCloseArticle}
        />
      );
    }

    // Если открыт центр, показываем его детальную страницу
    if (selectedCenter) {
      return (
        <CenterDetailScreen
          center={selectedCenter}
          onClose={handleCloseCenter}
          onToggleFavorite={toggleFavorite}
          isFavorite={selectedCenter ? isFavorite((selectedCenter as any).id) : false}
        />
      );
    }

    if (centersLoading) {
      return (
        <View style={styles.loadingContainer}>
          <Ionicons name="hourglass-outline" size={50} color={THEME.primary} />
          <Text style={styles.loadingText}>Загрузка данных...</Text>
        </View>
      );
    }

    switch (currentTab) {
      case 'home':
        return (
          <HomeScreen
            onArticlePress={handleArticlePress}
          />
        );
      case 'search':
        return (
          <SearchScreen
            onCenterPress={handleCenterPress}
            onToggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
          />
        );
      case 'journey':
        return <JourneyScreen />;
      case 'favorites':
        return (
          <FavoritesScreen
            onCenterPress={handleCenterPress}
            onToggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
            onSearchPress={() => {
              setCurrentTab('search');
            }}
          />
        );
      case 'profile':
        return (
          <ProfileScreen
            user={user}
            isAuthenticated={isAuthenticated}
            onLogoutPress={() => {
              console.log('Logout pressed');
            }}
          />
        );
      default:
        return (
          <View style={styles.content}>
            <Text style={styles.title}>РЕБА - Реабилитационные центры</Text>
            <Text style={styles.subtitle}>Приложение работает!</Text>
            <Text style={styles.info}>Текущая вкладка: {currentTab}</Text>
            <Text style={styles.info}>Центров загружено: {centersLoading ? 'Загрузка...' : 'Готово'}</Text>
            <Ionicons name="checkmark-circle" size={50} color={THEME.primary} />
          </View>
        );
    }
  };

  const renderTabBar = () => (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[styles.tab, currentTab === 'home' && styles.activeTab]}
        onPress={() => setCurrentTab('home')}
      >
        <Ionicons 
          name={currentTab === 'home' ? 'home' : 'home-outline'} 
          size={20} 
          color={currentTab === 'home' ? '#fff' : THEME.muted} 
        />
        <Text style={[styles.tabText, currentTab === 'home' && styles.activeTabText]}>
          Главная
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.tab, currentTab === 'search' && styles.activeTab]}
        onPress={() => setCurrentTab('search')}
      >
        <Ionicons 
          name={currentTab === 'search' ? 'search' : 'search-outline'} 
          size={20} 
          color={currentTab === 'search' ? '#fff' : THEME.muted} 
        />
        <Text style={[styles.tabText, currentTab === 'search' && styles.activeTabText]}>
          Поиск
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.tab, currentTab === 'journey' && styles.activeTab]}
        onPress={() => setCurrentTab('journey')}
      >
        <Ionicons 
          name="trending-up" 
          size={20} 
          color={currentTab === 'journey' ? '#fff' : THEME.muted} 
        />
        <Text style={[styles.tabText, currentTab === 'journey' && styles.activeTabText]}>
          Путь
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.tab, currentTab === 'favorites' && styles.activeTab]}
        onPress={() => setCurrentTab('favorites')}
      >
        <Ionicons 
          name={currentTab === 'favorites' ? 'heart' : 'heart-outline'} 
          size={20} 
          color={currentTab === 'favorites' ? '#fff' : THEME.muted} 
        />
        <Text style={[styles.tabText, currentTab === 'favorites' && styles.activeTabText]}>
          Избранное
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.tab, currentTab === 'profile' && styles.activeTab]}
        onPress={() => setCurrentTab('profile')}
      >
        <Ionicons 
          name={currentTab === 'profile' ? 'person' : 'person-outline'} 
          size={20} 
          color={currentTab === 'profile' ? '#fff' : THEME.muted} 
        />
        <Text style={[styles.tabText, currentTab === 'profile' && styles.activeTabText]}>
          Профиль
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={styles.animatedContainer}>
        <LinearGradient
          colors={[THEME.bgTop, THEME.bgMid, THEME.bgBottom]}
          style={styles.gradient}
        >
          <View style={styles.content}>
            {renderContent()}
          </View>
            {!selectedArticle && !selectedCenter && renderTabBar()}
        </LinearGradient>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.bgTop,
  },
  animatedContainer: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: THEME.bgTop,
  },
  loadingText: {
    fontSize: 16,
    color: '#333',
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  info: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: THEME.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 2,
  },
  activeTab: {
    backgroundColor: THEME.primary,
  },
  tabText: {
    fontSize: 12,
    color: THEME.muted,
    fontWeight: '500',
    marginTop: 4,
  },
  activeTabText: {
    color: '#fff',
    fontWeight: '600',
  },
  button: {
    backgroundColor: THEME.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});