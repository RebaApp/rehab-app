import React, { memo, useCallback, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Center, RehabCenter } from '../types';
import ExpandedCardRehabCenter from '../components/common/ExpandedCardRehabCenter';
import { responsiveWidth, responsiveHeight, responsivePadding } from '../utils/responsive';
import useAppStore from '../store/useAppStore';

interface FavoritesScreenProps {
  onCenterPress: (center: Center) => void;
  onToggleFavorite: (centerId: string) => void;
  isFavorite: (centerId: string) => boolean;
  onSearchPress: () => void;
  shimmer?: any;
}

const FavoritesScreen: React.FC<FavoritesScreenProps> = memo(({
  onCenterPress,
  onToggleFavorite,
  isFavorite,
  onSearchPress
}) => {
  const { centers, favorites } = useAppStore();
  
  // Получаем избранные центры
  const favoriteCenters = centers.filter(center => favorites[center.id]);
  
  // Анимации
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Начальные анимации (fade, slide, scale) - только один раз
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 40,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Бесконечная плавная анимация вращения для сердечка
    const startRotation = () => {
      rotateAnim.setValue(0);
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 10000, // 10 секунд на полный оборот - очень медленно
          useNativeDriver: true,
        }),
        { iterations: -1 } // бесконечно
      ).start();
    };

    // Запускаем вращение с небольшой задержкой после появления
    setTimeout(startRotation, 1200);
  }, []);

  const renderCenter = useCallback(({ item }: { item: Center }) => {
    // Определяем изображение: приоритет image, затем photos[0], затем fallback
    let imageUrl = item.image;
    if (!imageUrl && item.photos && item.photos.length > 0) {
      // Если photos содержит строку (URL), используем её
      if (typeof item.photos[0] === 'string') {
        imageUrl = item.photos[0];
      } else {
        // Для чисел и объектов (require() результат) используем как есть
        imageUrl = item.photos[0];
      }
    }
    if (!imageUrl) {
      imageUrl = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop';
    }

    // Преобразуем Center в RehabCenter для ExpandedCardRehabCenter
    const rehabCenter: RehabCenter = {
      id: item.id,
      name: item.name,
      location: `${item.city}, ${item.address}`,
      image: imageUrl,
      logo: imageUrl, // используем то же изображение как логотип
      shortDescription: item.description,
      priceFrom: parseInt(item.price?.replace(/\D/g, '')) || parseInt(item.priceRange?.replace(/\D/g, '')) || 0,
      duration: item.duration || '30 дней', // Используем duration из данных
      license: !!item.license,
      rating: item.rating,
      reviewsCount: item.reviewsCount,
      tags: item.services || item.specializations || [],
      verification_status: item.verified ? 'verified' : 'pending',
      phone: item.phone,
      address: item.address,
      services: item.services || item.specializations || [],
      methods: item.methods || item.amenities || [],
      capacity: item.capacity || 50,
      yearFounded: item.yearFounded || 2020,
      workingHours: item.workingHours,
      website: item.website || '',
      email: item.email,
      coordinates: item.coordinates || { latitude: 55.7558, longitude: 37.6176 },
      distance: item.distance || 0,
    };

    return (
      <ExpandedCardRehabCenter
        center={rehabCenter}
        onOpen={() => onCenterPress(item)}
        onToggleFavorite={onToggleFavorite}
        isFavorite={isFavorite(item.id)}
      />
    );
  }, [onCenterPress, onToggleFavorite, isFavorite]);


  const renderEmpty = useCallback(() => (
    <Animated.View style={[styles.emptyContainer, { 
      opacity: fadeAnim, 
      transform: [{ scale: scaleAnim }] 
    }]}>
      <BlurView intensity={20} tint="light" style={styles.emptyBlur}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)']}
          style={styles.emptyGradient}
        >
          <View style={styles.emptyContent}>
            <Animated.View style={[styles.emptyIconContainer, {
              transform: [{
                rotate: rotateAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg']
                })
              }]
            }]}>
              <LinearGradient
                colors={['#81D4FA', '#42A5F5']}
                style={styles.emptyIconGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="heart-outline" size={48} color="#FFFFFF" />
              </LinearGradient>
            </Animated.View>
            
            <View style={styles.emptyTextContainer}>
              <Text style={styles.emptyTitle}>Пока нет избранных центров</Text>
              <Text style={styles.emptySubtitle}>
                Добавьте центры в избранное, чтобы быстро к ним вернуться
              </Text>
            </View>
            
            <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.loginButton} onPress={onSearchPress}>
              <LinearGradient
                colors={['#81D4FA', '#42A5F5']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Ionicons name="search" size={16} color="#fff" />
                <Text style={styles.buttonText}>Перейти в Поиск</Text>
              </LinearGradient>
            </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </BlurView>
    </Animated.View>
  ), [onSearchPress, fadeAnim, scaleAnim, rotateAnim]);

  const keyExtractor = useCallback((item: Center) => item.id, []);

  return (
    <View style={styles.container}>
      {favoriteCenters.length === 0 ? (
        // Пустое состояние - центрированное
        <View style={styles.emptyContentContainer}>
          {renderEmpty()}
        </View>
      ) : (
        // Заполненное состояние - скроллируемое
        <View style={styles.filledContentContainer}>
          <Animated.View style={[styles.listSection, { 
            opacity: fadeAnim, 
            transform: [{ translateY: slideAnim }] 
          }]}>
            <FlatList
              data={favoriteCenters}
              renderItem={renderCenter}
              keyExtractor={keyExtractor}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
              removeClippedSubviews={true}
              maxToRenderPerBatch={10}
              updateCellsBatchingPeriod={100}
              initialNumToRender={5}
              windowSize={10}
              scrollEnabled={true}
            />
          </Animated.View>
        </View>
      )}
    </View>
  );
});

FavoritesScreen.displayName = 'FavoritesScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
  },
  // Пустое состояние - центрированное
  emptyContentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 0,
  },
  // Заполненное состояние - скроллируемое
  filledContentContainer: {
    flex: 1,
    paddingHorizontal: 0,
  },
  listSection: {
    width: '100%',
    alignItems: 'center',
  },
  listContainer: {
    paddingBottom: 0, // Убираем отступ снизу
    paddingHorizontal: 0, // Убираем горизонтальные отступы
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyBlur: {
    borderRadius: responsiveWidth(24),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: responsiveHeight(4) },
    shadowOpacity: 0.15,
    shadowRadius: responsiveWidth(16),
    elevation: 8,
  },
  emptyGradient: {
    padding: responsivePadding(32), // Как в JourneyScreen
  },
  emptyContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIconContainer: {
    marginBottom: 24, // Как в JourneyScreen
  },
  emptyTextContainer: {
    alignItems: 'center',
  },
  emptyIconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyTitle: {
    fontSize: 24, // Как в JourneyScreen
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 12, // Как в JourneyScreen
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  emptySubtitle: {
    fontSize: 16, // Как в JourneyScreen
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
    marginBottom: 24, // Отступ перед кнопкой
  },
  buttonContainer: {
    alignItems: 'center', // Центрируем кнопку
  },
  loginButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 0,
    alignSelf: 'center', // Делаем кнопку меньше по ширине
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    minWidth: 200, // Фиксированная ширина кнопки
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 8,
  },
});

export default FavoritesScreen;