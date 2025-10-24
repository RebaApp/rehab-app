import React, { memo, useRef, useEffect, useState, useCallback, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import ExpandedCardRehabCenter from '../components/common/ExpandedCardRehabCenter';
import { mockRehabCenters } from '../data/mockCenters';
import { RehabCenter } from '../types';
import { THEME } from '../utils/constants';
import { responsiveWidth, responsiveHeight, responsivePadding, responsiveFontSize } from '../utils/responsive';
import useAppStore from '../store/useAppStore';

interface SearchScreenProps {
  onCenterPress: (center: any) => void;
  onToggleFavorite: (centerId: string) => void;
  isFavorite: (centerId: string) => boolean;
}

const SearchScreen: React.FC<SearchScreenProps> = memo(() => {
  // Состояние для поиска и фильтров
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'verified' | 'licensed'>('all');

  // Используем глобальное состояние избранного и центров
  const { toggleFavorite, isFavorite, centers } = useAppStore();
  
  // Отладка данных
  console.log('SearchScreen centers:', centers.length, centers[0]);

  // Анимации
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current; // Для отслеживания скроллинга

  useEffect(() => {
    // Начальные анимации
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Бесконечная плавная анимация вращения
    const startRotation = () => {
      rotateAnim.setValue(0);
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 8000,
          useNativeDriver: true,
        }),
        { iterations: -1 }
      ).start();
    };

    setTimeout(startRotation, 1200);
  }, []);

  // Преобразование Center в RehabCenter
  const convertToRehabCenter = useCallback((center: any): RehabCenter => {
    console.log('Converting center:', center.name, 'image:', center.image, 'photos:', center.photos);
    
    // Определяем изображение: приоритет image, затем photos[0], затем fallback
    let imageUrl = center.image;
    if (!imageUrl && center.photos && center.photos.length > 0) {
      // Если photos содержит строку (URL), используем её
      if (typeof center.photos[0] === 'string') {
        imageUrl = center.photos[0];
      } else {
        // Для чисел и объектов (require() результат) используем как есть
        imageUrl = center.photos[0];
      }
    }
    if (!imageUrl) {
      imageUrl = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop';
    }
    
    return {
      id: center.id,
      name: center.name,
      location: `${center.city}, ${center.address}`,
      image: imageUrl,
      logo: imageUrl, // Используем то же изображение как логотип
      shortDescription: center.description,
      priceFrom: parseInt(center.price?.replace(/\D/g, '')) || parseInt(center.priceRange?.replace(/\D/g, '')) || 0,
      duration: center.duration || '30 дней', // Используем duration из данных
      license: center.verified,
      rating: center.rating,
      reviewsCount: center.reviewsCount,
      tags: center.specializations || center.services || [],
      verification_status: center.verified ? 'verified' : 'pending',
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
  }, []);

  // Фильтрация центров
  const filteredCenters = useMemo(() => {
    let filteredCenters = centers;

    // Фильтр по статусу
    switch (selectedFilter) {
      case 'verified':
        filteredCenters = centers.filter(center => center.verified);
        break;
      case 'licensed':
        filteredCenters = centers.filter(center => center.verified);
        break;
      default:
        filteredCenters = centers;
    }

    // Поиск по тексту
    if (searchQuery.trim()) {
      filteredCenters = filteredCenters.filter(center => 
        center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        center.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        center.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Преобразуем в RehabCenter
    return filteredCenters.map(convertToRehabCenter);
  }, [searchQuery, selectedFilter, centers, convertToRehabCenter]);

  // Обработчики событий
  const handleCenterOpen = useCallback((centerId: string) => {
    console.log('Открыть центр:', centerId);
    Alert.alert(
      'Открыть центр',
      `Переход к детальной информации о центре ${centerId}`,
      [{ text: 'OK' }]
    );
  }, []);


  // Рендер элемента списка
  const renderCenterCard = useCallback(({ item }: { item: RehabCenter }) => (
    <ExpandedCardRehabCenter
      center={item}
      onOpen={handleCenterOpen}
      onToggleFavorite={toggleFavorite}
      isFavorite={isFavorite(item.id)}
      showDistance={true}
    />
  ), [handleCenterOpen, toggleFavorite, isFavorite]);

  // Рендер заголовка списка
  const renderListHeader = useCallback(() => (
    <View style={styles.headerContainer}>
      {/* Поисковая строка с фильтрацией */}
      <View style={styles.searchContainer}>
        <BlurView intensity={20} tint="light" style={styles.searchBlur}>
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.6)', 'rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)']}
                  style={styles.searchGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
            <Ionicons name="search" size={20} color="#81D4FA" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Поиск центров..."
              placeholderTextColor="#9AA0A6"
              value={searchQuery}
              onChangeText={setSearchQuery}
              accessibilityLabel="Поиск реабилитационных центров"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                style={styles.clearButton}
                accessibilityLabel="Очистить поиск"
              >
                <Ionicons name="close-circle" size={20} color="#9AA0A6" />
              </TouchableOpacity>
            )}
            
            {/* Фильтр справа */}
            <View style={styles.filterDropdown}>
              <TouchableOpacity
                style={styles.filterButton}
                onPress={() => {
                  // Здесь можно добавить модальное окно с фильтрами
                  Alert.alert('Фильтры', 'Выберите фильтры', [
                    { text: 'Все', onPress: () => setSelectedFilter('all') },
                    { text: 'Проверенные', onPress: () => setSelectedFilter('verified') },
                    { text: 'С лицензией', onPress: () => setSelectedFilter('licensed') },
                  ]);
                }}
                accessibilityLabel="Открыть фильтры"
              >
                <Ionicons name="filter" size={18} color="#81D4FA" />
                <Text style={styles.filterButtonText}>Фильтр</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </BlurView>
      </View>

      {/* Статистика - показываем только при использовании фильтров */}
      {(searchQuery.trim() !== '' || selectedFilter !== 'all') && (
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>
            Найдено {filteredCenters.length} центров
          </Text>
        </View>
      )}
    </View>
  ), [searchQuery, selectedFilter, filteredCenters.length]);

  // Рендер пустого состояния
  const renderEmptyState = useCallback(() => (
    <View style={styles.emptyContainer}>
      <BlurView intensity={15} tint="light" style={styles.emptyBlur}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.8)']}
          style={styles.emptyGradient}
        >
          <Ionicons name="search-outline" size={64} color="#81D4FA" />
          <Text style={styles.emptyTitle}>Центры не найдены</Text>
          <Text style={styles.emptyDescription}>
            Попробуйте изменить поисковый запрос или фильтры
          </Text>
        </LinearGradient>
      </BlurView>
    </View>
  ), []);

  // Всегда показываем карточки с поиском
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[THEME.bgTop, THEME.bgMid, THEME.bgBottom]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {/* Заголовок с анимацией */}
          <Animated.View 
            style={[
              styles.titleContainer,
              {
                opacity: scrollY.interpolate({
                  inputRange: [0, 50],
                  outputRange: [1, 0],
                  extrapolate: 'clamp',
                }),
                transform: [{
                  translateY: scrollY.interpolate({
                    inputRange: [0, 50],
                    outputRange: [0, -30],
                    extrapolate: 'clamp',
                  }),
                }],
                height: scrollY.interpolate({
                  inputRange: [0, 50],
                  outputRange: [responsiveHeight(80), 0], // Сокращаем высоту на 20%
                  extrapolate: 'clamp',
                }),
                overflow: 'hidden',
              },
            ]}
          >
            <Text style={styles.title}>Поиск центров</Text>
            <Text style={styles.subtitle}>
              Найдите подходящий реабилитационный центр
            </Text>
          </Animated.View>

          {/* Список центров */}
          <FlatList
            data={filteredCenters}
            renderItem={renderCenterCard}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={renderListHeader}
            ListEmptyComponent={renderEmptyState}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            style={styles.list}
            contentInsetAdjustmentBehavior="never"
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: false }
            )}
            scrollEventThrottle={16}
          />
        </View>
      </LinearGradient>
    </View>
  );

});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor убран - градиент покрывает весь экран
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    // Убираем отступы - карточки должны упираться в края экрана
  },
  mainSection: {
    alignItems: 'center',
    width: '100%',
  },
  
  // Секция значка
  iconSection: {
    marginBottom: responsivePadding(40),
  },
  iconBlur: {
    borderRadius: responsiveWidth(24),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: responsiveHeight(4) },
    shadowOpacity: 0.15,
    shadowRadius: responsiveWidth(16),
    elevation: 8,
  },
  iconGradient: {
    padding: responsivePadding(32),
    alignItems: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconGradientInner: {
    width: responsiveWidth(120),
    height: responsiveWidth(120),
    borderRadius: responsiveWidth(60),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#81D4FA',
    shadowOffset: { width: 0, height: responsiveHeight(4) },
    shadowOpacity: 0.3,
    shadowRadius: responsiveWidth(12),
    elevation: 6,
  },

  // Секция текста
  textSection: {
    alignItems: 'center',
    marginBottom: responsivePadding(32),
  },
  title: {
    fontSize: responsiveWidth(26), // Уменьшаем шрифт на 20%
    fontWeight: '800',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: responsivePadding(8), // Уменьшаем отступ
    letterSpacing: responsiveWidth(-0.5),
  },
  subtitle: {
    fontSize: responsiveWidth(14), // Уменьшаем шрифт на 20%
    fontWeight: '500',
    color: '#666',
    textAlign: 'center',
    lineHeight: responsiveWidth(18), // Уменьшаем межстрочный интервал
  },

  // Секция описания
  descriptionSection: {
    width: '100%',
    marginBottom: responsivePadding(32),
  },
  descriptionBlur: {
    borderRadius: responsiveWidth(20),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: responsiveHeight(4) },
    shadowOpacity: 0.1,
    shadowRadius: responsiveWidth(16),
    elevation: 8,
  },
  descriptionGradient: {
    padding: responsivePadding(24),
  },
  descriptionContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  descriptionText: {
    flex: 1,
    fontSize: responsiveWidth(16),
    color: '#666',
    lineHeight: responsiveWidth(22),
    marginLeft: responsivePadding(12),
  },

  // Секция кнопки действия
  actionSection: {
    width: '100%',
  },
  actionButton: {
    borderRadius: responsiveWidth(16),
    overflow: 'hidden',
    ...THEME.shadowMedium,
  },
  actionButtonBlur: {
    borderRadius: responsiveWidth(16),
    overflow: 'hidden',
  },
  actionButtonGradient: {
    paddingVertical: responsivePadding(16),
    paddingHorizontal: responsivePadding(24),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: responsivePadding(12),
  },
  actionButtonText: {
    fontSize: responsiveWidth(18),
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Стили для режима поиска
  titleContainer: {
    paddingHorizontal: responsivePadding(2), // Отступы 2px только для заголовка
    paddingVertical: responsivePadding(12), // Сокращаем вертикальные отступы на 20%
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: responsivePadding(20),
    width: responsiveWidth(40),
    height: responsiveWidth(40),
    borderRadius: responsiveWidth(20),
    overflow: 'hidden',
  },
  backButtonBlur: {
    borderRadius: responsiveWidth(20),
    overflow: 'hidden',
  },
  backButtonGradient: {
    width: responsiveWidth(40),
    height: responsiveWidth(40),
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContainer: {
    paddingHorizontal: 0, // Убираем отступы полностью
    paddingBottom: responsivePadding(20),
  },
  list: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: responsivePadding(2), // Отступы 2px только для заголовка
    paddingBottom: responsivePadding(16),
    // Убираем alignItems: 'center' - поисковик должен растягиваться на всю ширину
  },
  searchContainer: {
    marginBottom: responsivePadding(16),
  },
  searchBlur: {
    borderRadius: responsiveWidth(20), // Более округлые углы как на главной
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: responsiveHeight(4) },
    shadowOpacity: 0.2,
    shadowRadius: responsiveWidth(12),
    elevation: 8,
    borderWidth: 2,
    borderColor: 'rgba(129, 212, 250, 0.3)', // Светло-голубая граница
    width: '100%',
    alignSelf: 'stretch',
  },
  searchGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8, // Уменьшаем отступы еще больше
    width: '100%',
    flex: 1,
  },
  searchIcon: {
    marginLeft: responsivePadding(12), // Отступ от левого края
    marginRight: responsivePadding(16), // Увеличили отступ от текста
  },
  searchInput: {
    flex: 1,
    fontSize: responsiveFontSize(16), // Точно как на главной странице
    color: '#1a1a1a', // Точно как на главной странице
    width: '100%', // Точно как на главной странице
  },
  clearButton: {
    marginLeft: responsivePadding(8),
  },
  filterDropdown: {
    marginLeft: responsivePadding(12),
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(129, 212, 250, 0.3)',
    paddingLeft: responsivePadding(12),
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsivePadding(12), // Увеличиваем отступы для центрирования
    paddingVertical: responsivePadding(8), // Увеличиваем вертикальные отступы
    borderRadius: responsiveWidth(12), // Увеличиваем радиус
    backgroundColor: 'rgba(129, 212, 250, 0.1)', // Возвращаем светлый фон
    marginRight: responsivePadding(12), // Отступ от правого края
  },
  filterButtonText: {
    fontSize: responsiveWidth(12),
    color: '#2196F3', // Делаем текст более синим
    fontWeight: '600',
    marginLeft: responsivePadding(4),
  },
  statsContainer: {
    marginBottom: responsivePadding(8),
    paddingHorizontal: responsivePadding(2), // Выравниваем по левой стороне поисковика
  },
  statsText: {
    fontSize: responsiveWidth(12), // Маленький шрифт
    fontWeight: '500',
    color: '#2196F3', // Делаем текст более синим
    textAlign: 'left', // Выравниваем по левой стороне
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: responsivePadding(40),
    paddingVertical: responsivePadding(60),
  },
  emptyBlur: {
    borderRadius: responsiveWidth(20),
    overflow: 'hidden',
    ...THEME.shadowMedium,
  },
  emptyGradient: {
    paddingVertical: responsivePadding(40),
    paddingHorizontal: responsivePadding(32),
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: responsiveWidth(20),
    fontWeight: '700',
    color: THEME.textPrimary,
    textAlign: 'center',
    marginTop: responsivePadding(16),
    marginBottom: responsivePadding(8),
  },
  emptyDescription: {
    fontSize: responsiveWidth(16),
    fontWeight: '500',
    color: THEME.textSecondary,
    textAlign: 'center',
    lineHeight: responsiveWidth(22),
  },

  // Новые стили для расширенных фильтров
  filterRow: {
    flexDirection: 'row',
    marginBottom: responsivePadding(12),
    gap: responsivePadding(8),
  },
  locationFilterContainer: {
    marginTop: responsivePadding(8),
  },
  locationFilterBlur: {
    borderRadius: responsiveWidth(16),
    overflow: 'hidden',
  },
  locationFilterGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsivePadding(16),
    paddingVertical: responsivePadding(12),
  },
  locationIcon: {
    marginRight: responsivePadding(12),
  },
  locationInput: {
    flex: 1,
    fontSize: responsiveWidth(16),
    color: THEME.textPrimary,
    fontWeight: '500',
  },
  clearLocationButton: {
    marginLeft: responsivePadding(8),
  },
});

export default SearchScreen;