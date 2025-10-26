import React, { useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import useAppStore from './src/store/useAppStore';
import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/SearchScreen';
import JourneyScreen from './src/screens/JourneyScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ArticlesScreen from './src/screens/ArticlesScreen';
import ArticleDetailScreen from './src/screens/ArticleDetailScreen';
import CenterDetailScreen from './src/screens/CenterDetailScreen';
import { THEME } from './src/utils/constants';
import { responsiveWidth, responsiveHeight, responsivePadding, responsiveFontSize } from './src/utils/responsive';

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
    login,
    register,
    loginWithYandex,
    logout,
  } = useAppStore();

  // Анимация для содержимого вкладок
  const contentFadeAnim = useRef(new Animated.Value(1)).current;
  
  // Анимации для загрузки
  const loadingFadeAnim = useRef(new Animated.Value(0)).current;
  const loadingScaleAnim = useRef(new Animated.Value(0.9)).current;
  const loadingRotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    console.log('App mounted, loading centers...');
    try {
      loadCenters();
    } catch (error) {
      console.error('Failed to load centers:', error);
    }
  }, [loadCenters]);

  // Анимация при смене вкладки - только плавное fade
  useEffect(() => {
    Animated.timing(contentFadeAnim, {
      toValue: 0.7,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(contentFadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  }, [currentTab]);

  // Анимация загрузки
  useEffect(() => {
    if (centersLoading) {
      // Начальные анимации загрузки
      Animated.parallel([
        Animated.timing(loadingFadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(loadingScaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();

      // Бесконечная анимация вращения
      const startRotation = () => {
        loadingRotateAnim.setValue(0);
        Animated.loop(
          Animated.timing(loadingRotateAnim, {
            toValue: 1,
            duration: 3000, // 3 секунды на полный оборот
            useNativeDriver: true,
          }),
          { iterations: -1 }
        ).start();
      };
      startRotation();
    } else {
      // Сброс анимаций при завершении загрузки
      loadingFadeAnim.setValue(0);
      loadingScaleAnim.setValue(0.9);
      loadingRotateAnim.setValue(0);
    }
  }, [centersLoading]);

  const [selectedArticle, setSelectedArticle] = React.useState(null);
  const [selectedCenter, setSelectedCenter] = React.useState(null);
  const [showArticlesScreen, setShowArticlesScreen] = React.useState(false);

  const handleArticlePress = useCallback((article: any) => {
    console.log('Article pressed:', article.title);
    setSelectedArticle(article);
  }, []);

  const handleCenterPress = useCallback((center: any) => {
    console.log('Center pressed:', center.name);
    setSelectedCenter(center);
  }, []);

  const handleShowArticles = useCallback(() => {
    setShowArticlesScreen(true);
  }, []);

  const handleBackFromArticles = useCallback(() => {
    setShowArticlesScreen(false);
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
      // Преобразуем Center в RehabCenter
      const convertToRehabCenter = (center: any) => {
        console.log('Converting center in App.tsx:', center);
        // Определяем изображение: приоритет image, затем photos[0], затем fallback
        let imageUrl = center.image;
        if (!imageUrl && center.photos && center.photos.length > 0) {
          // Для локальных изображений (require()) используем как есть
          // Для URL строк используем как есть
          imageUrl = center.photos[0];
        }
        if (!imageUrl) {
          imageUrl = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop';
        }
        
        return {
          id: center.id,
          name: center.name,
          location: center.city, // Только город, без адреса
          image: imageUrl,
          logo: imageUrl,
          photos: center.photos || [],
          shortDescription: center.description,
          priceFrom: parseInt(center.priceRange?.replace(/\D/g, '')) || parseInt(center.price?.replace(/\D/g, '')) || 0,
          duration: center.duration || '30 дней',
          license: center.verified,
          rating: center.rating,
          reviewsCount: center.reviewsCount,
          tags: center.specializations || center.services || [],
          verification_status: center.verified ? 'verified' as const : 'pending' as const,
          phone: center.phone,
          address: center.address,
          services: center.specializations || center.services || [],
          methods: center.amenities || center.methods || [],
          capacity: center.capacity || 50,
          yearFounded: center.yearFounded || 2020,
          workingHours: center.workingHours,
          website: center.website,
          email: center.email,
          coordinates: center.coordinates || { latitude: 55.7558, longitude: 37.6176 },
          distance: center.distance || 0,
        };
      };

      return (
        <CenterDetailScreen
          center={convertToRehabCenter(selectedCenter)}
          onClose={handleCloseCenter}
          onToggleFavorite={toggleFavorite}
          isFavorite={selectedCenter ? isFavorite((selectedCenter as any).id) : false}
        />
      );
    }

    if (centersLoading) {
      return (
        <SafeAreaView style={styles.loadingContainer}>
          <LinearGradient
            colors={[THEME.bgTop, THEME.bgMid, THEME.bgBottom]}
            style={styles.loadingGradient}
          >
            <Animated.View style={styles.loadingContent}>
              {/* Анимированная иконка с градиентом */}
              <Animated.View style={[styles.loadingIconContainer, {
                transform: [{
                  rotate: loadingRotateAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg']
                  })
                }]
              }]}>
                <BlurView intensity={20} tint="light" style={styles.loadingIconBlur}>
                  <LinearGradient
                    colors={['#45B7D1', '#4ECDC4', '#96CEB4', '#FFEAA7', '#FF6B6B']}
                    style={styles.loadingIconGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Ionicons name="heart" size={32} color="#FFFFFF" />
                  </LinearGradient>
                </BlurView>
              </Animated.View>
              
              {/* Анимированный текст */}
              <Animated.Text style={[styles.loadingText, {
                opacity: loadingFadeAnim,
                transform: [{ scale: loadingScaleAnim }]
              }]}>
                Загрузка данных...
              </Animated.Text>
              
              {/* Анимированные точки */}
              <Animated.View style={styles.loadingDots}>
                {[0, 1, 2].map((index) => (
                  <Animated.View
                    key={index}
                    style={[styles.loadingDot, {
                      opacity: loadingFadeAnim,
                      transform: [{
                        scale: loadingFadeAnim.interpolate({
                          inputRange: [0, 0.5, 1],
                          outputRange: [0.5, 1.2, 0.5]
                        })
                      }]
                    }]}
                  />
                ))}
              </Animated.View>
            </Animated.View>
          </LinearGradient>
        </SafeAreaView>
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
            onLogoutPress={logout}
            onLogin={login}
            onRegister={register}
            onYandexSignIn={loginWithYandex}
          />
        );
      default:
        return (
          <View style={styles.content}>
            <Text style={styles.title}>РЕБА - Реабилитационные центры</Text>
            <Text style={styles.subtitle}>Приложение работает!</Text>
            <Text style={styles.info}>Текущая вкладка: {currentTab}</Text>
            <Text style={styles.info}>Центров загружено: {centersLoading ? 'Загрузка...' : 'Готово'}</Text>
            <TouchableOpacity 
              style={styles.reloadButton} 
              onPress={() => {
                console.log('Принудительная перезагрузка данных...');
                loadCenters();
              }}
            >
              <Text style={styles.reloadButtonText}>🔄 Перезагрузить данные</Text>
            </TouchableOpacity>
            <Ionicons name="checkmark-circle" size={50} color={THEME.primary} />
          </View>
        );
    }
  };

  const renderTabBar = () => (
    <View style={styles.tabContainer}>
      <BlurView intensity={25} tint="light" style={styles.tabBarBlur}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0.15)']}
          style={styles.tabBarGradient}
        >
          <TouchableOpacity
            style={[styles.tab, currentTab === 'home' && styles.activeTab]}
            onPress={() => setCurrentTab('home')}
          >
            <View style={styles.iconContainer}>
              <LinearGradient
                colors={currentTab === 'home' ? ['#81D4FA', '#42A5F5'] : ['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)']}
                style={styles.iconGradient}
              >
                <Ionicons 
                  name={currentTab === 'home' ? 'home' : 'home-outline'} 
                  size={24} 
                  color={currentTab === 'home' ? '#fff' : '#666'} 
                />
              </LinearGradient>
            </View>
            <Text style={[styles.tabText, currentTab === 'home' && styles.activeTabText]}>
              Главная
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, currentTab === 'search' && styles.activeTab]}
            onPress={() => setCurrentTab('search')}
          >
            <View style={styles.iconContainer}>
              <LinearGradient
                colors={currentTab === 'search' ? ['#81D4FA', '#42A5F5'] : ['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)']}
                style={styles.iconGradient}
              >
                <Ionicons 
                  name={currentTab === 'search' ? 'search' : 'search-outline'} 
                  size={24} 
                  color={currentTab === 'search' ? '#fff' : '#666'} 
                />
              </LinearGradient>
            </View>
            <Text style={[styles.tabText, currentTab === 'search' && styles.activeTabText]}>
              Поиск
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, currentTab === 'journey' && styles.activeTab]}
            onPress={() => setCurrentTab('journey')}
          >
            <View style={styles.iconContainer}>
              <LinearGradient
                colors={currentTab === 'journey' ? ['#81D4FA', '#42A5F5'] : ['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)']}
                style={styles.iconGradient}
              >
                <Ionicons 
                  name="trending-up" 
                  size={24} 
                  color={currentTab === 'journey' ? '#fff' : '#666'} 
                />
              </LinearGradient>
            </View>
            <Text style={[styles.tabText, currentTab === 'journey' && styles.activeTabText]}>
              Путь
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, currentTab === 'favorites' && styles.activeTab]}
            onPress={() => setCurrentTab('favorites')}
          >
            <View style={styles.iconContainer}>
              <LinearGradient
                colors={currentTab === 'favorites' ? ['#81D4FA', '#42A5F5'] : ['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)']}
                style={styles.iconGradient}
              >
                <Ionicons 
                  name={currentTab === 'favorites' ? 'heart' : 'heart-outline'} 
                  size={24} 
                  color={currentTab === 'favorites' ? '#fff' : '#666'} 
                />
              </LinearGradient>
            </View>
            <Text style={[styles.tabText, currentTab === 'favorites' && styles.activeTabText]}>
              Избранное
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, currentTab === 'profile' && styles.activeTab]}
            onPress={() => setCurrentTab('profile')}
          >
            <View style={styles.iconContainer}>
              <LinearGradient
                colors={currentTab === 'profile' ? ['#81D4FA', '#42A5F5'] : ['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)']}
                style={styles.iconGradient}
              >
                <Ionicons 
                  name={currentTab === 'profile' ? 'person' : 'person-outline'} 
                  size={24} 
                  color={currentTab === 'profile' ? '#fff' : '#666'} 
                />
              </LinearGradient>
            </View>
            <Text style={[styles.tabText, currentTab === 'profile' && styles.activeTabText]}>
              Профиль
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </BlurView>
    </View>
  );

  // Если открыт экран статей
  if (showArticlesScreen) {
    return (
      <ArticlesScreen
        onArticlePress={handleArticlePress}
        onBackPress={handleBackFromArticles}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={styles.animatedContainer}>
        <LinearGradient
          colors={[THEME.bgTop, THEME.bgMid, THEME.bgBottom]}
          style={styles.gradient}
        >
          <Animated.View style={[
            styles.content,
            {
              opacity: contentFadeAnim
            }
          ]}>
            {renderContent()}
          </Animated.View>
            {!selectedArticle && !selectedCenter && !showArticlesScreen && renderTabBar()}
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
    padding: 0,
  },
  loadingContainer: {
    flex: 1,
  },
  loadingGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingIconContainer: {
    marginBottom: responsivePadding(24),
  },
  loadingIconBlur: {
    borderRadius: responsiveWidth(24),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: responsiveHeight(4) },
    shadowOpacity: 0.15,
    shadowRadius: responsiveWidth(16),
    elevation: 8,
  },
  loadingIconGradient: {
    width: responsiveWidth(80),
    height: responsiveWidth(80),
    borderRadius: responsiveWidth(40),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: responsiveHeight(2) },
    shadowOpacity: 0.2,
    shadowRadius: responsiveWidth(8),
    elevation: 4,
  },
  loadingText: {
    fontSize: responsiveFontSize(18),
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: responsivePadding(16),
    textAlign: 'center',
    letterSpacing: responsiveWidth(0.5),
  },
  loadingDots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingDot: {
    width: responsiveWidth(8),
    height: responsiveWidth(8),
    borderRadius: responsiveWidth(4),
    backgroundColor: '#81D4FA',
    marginHorizontal: responsiveWidth(4),
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
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabBarBlur: {
    borderRadius: 0,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: responsiveHeight(-6) },
    shadowOpacity: 0.15,
    shadowRadius: responsiveWidth(20),
    elevation: 12,
  },
  tabBarGradient: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: responsivePadding(8), // Уменьшаем с 12 до 8
    paddingHorizontal: responsivePadding(8),
    height: responsiveHeight(70), // Уменьшаем с 80 до 70
    paddingBottom: responsiveHeight(15), // Уменьшаем с 20 до 15
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: responsivePadding(8),
    paddingHorizontal: responsivePadding(4),
    height: responsiveHeight(80),
    minHeight: responsiveHeight(80),
    position: 'relative',
  },
  activeTab: {
    backgroundColor: 'rgba(129, 212, 250, 0.15)',
    borderRadius: responsiveWidth(16),
    marginHorizontal: responsiveWidth(2),
  },
  iconContainer: {
    marginBottom: responsiveHeight(2),
    height: responsiveWidth(36),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    top: 0,
  },
  iconGradient: {
    width: responsiveWidth(40), // Увеличиваем с 36 до 40
    height: responsiveWidth(40), // Увеличиваем с 36 до 40
    borderRadius: responsiveWidth(20), // Увеличиваем с 18 до 20
    justifyContent: 'center',
    alignItems: 'center',
    // Убираем тени
  },
  tabText: {
    fontSize: responsiveFontSize(11),
    color: '#666',
    fontWeight: '500',
    marginTop: responsiveHeight(2),
    textAlign: 'center',
    letterSpacing: 0.1,
    lineHeight: responsiveFontSize(13),
    height: responsiveFontSize(13),
    position: 'relative',
    top: 0,
  },
  activeTabText: {
    color: '#81D4FA',
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
  reloadButton: {
    backgroundColor: '#0A84FF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  reloadButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});