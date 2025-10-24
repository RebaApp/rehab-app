import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import CardRehabCenter from '../components/common/CardRehabCenter';
import { mockRehabCenters, searchCenters, getCentersByStatus, getLicensedCenters } from '../data/mockCenters';
import { RehabCenter } from '../types';
import { THEME } from '../utils/constants';
import { responsiveWidth, responsiveHeight, responsivePadding } from '../utils/responsive';

const SearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'verified' | 'licensed'>('all');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Фильтрация центров
  const filteredCenters = useMemo(() => {
    let centers = mockRehabCenters;

    // Применяем фильтр по статусу
    switch (selectedFilter) {
      case 'verified':
        centers = getCentersByStatus('verified');
        break;
      case 'licensed':
        centers = getLicensedCenters();
        break;
      default:
        centers = mockRehabCenters;
    }

    // Применяем поиск
    if (searchQuery.trim()) {
      centers = searchCenters(searchQuery.trim());
    }

    return centers;
  }, [searchQuery, selectedFilter]);

  // Обработчики событий
  const handleCenterOpen = useCallback((centerId: string) => {
    console.log('Открыть центр:', centerId);
    Alert.alert(
      'Открыть центр',
      `Переход к детальной информации о центре ${centerId}`,
      [{ text: 'OK' }]
    );
  }, []);

  const handleCall = useCallback((phone: string) => {
    console.log('Позвонить:', phone);
    Alert.alert(
      'Позвонить',
      `Вызов номера ${phone}`,
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Позвонить', 
          onPress: () => Linking.openURL(`tel:${phone}`)
        }
      ]
    );
  }, []);

  const handleToggleFavorite = useCallback((centerId: string) => {
    console.log('Переключить избранное:', centerId);
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(centerId)) {
        newFavorites.delete(centerId);
      } else {
        newFavorites.add(centerId);
      }
      return newFavorites;
    });
  }, []);

  const handleFilterPress = useCallback((filter: typeof selectedFilter) => {
    setSelectedFilter(filter);
  }, []);

  // Рендер элемента списка
  const renderCenterCard = useCallback(({ item }: { item: RehabCenter }) => (
    <CardRehabCenter
      center={item}
      onOpen={handleCenterOpen}
      onCall={handleCall}
      onToggleFavorite={handleToggleFavorite}
      isFavorite={favorites.has(item.id)}
      showDistance={true}
    />
  ), [handleCenterOpen, handleCall, handleToggleFavorite, favorites]);

  // Рендер заголовка списка
  const renderListHeader = useCallback(() => (
    <View style={styles.headerContainer}>
      {/* Поисковая строка */}
      <View style={styles.searchContainer}>
        <BlurView intensity={15} tint="light" style={styles.searchBlur}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.8)']}
            style={styles.searchGradient}
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
          </LinearGradient>
        </BlurView>
      </View>

      {/* Фильтры */}
      <View style={styles.filtersContainer}>
        <TouchableOpacity
          style={[styles.filterButton, selectedFilter === 'all' && styles.filterButtonActive]}
          onPress={() => handleFilterPress('all')}
        >
          <BlurView intensity={10} tint="light" style={styles.filterBlur}>
            <LinearGradient
              colors={selectedFilter === 'all' 
                ? ['rgba(10, 132, 255, 0.9)', 'rgba(10, 132, 255, 0.8)']
                : ['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.8)']
              }
              style={styles.filterGradient}
            >
              <Text style={[
                styles.filterText,
                selectedFilter === 'all' && styles.filterTextActive
              ]}>
                Все
              </Text>
            </LinearGradient>
          </BlurView>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterButton, selectedFilter === 'verified' && styles.filterButtonActive]}
          onPress={() => handleFilterPress('verified')}
        >
          <BlurView intensity={10} tint="light" style={styles.filterBlur}>
            <LinearGradient
              colors={selectedFilter === 'verified' 
                ? ['rgba(10, 132, 255, 0.9)', 'rgba(10, 132, 255, 0.8)']
                : ['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.8)']
              }
              style={styles.filterGradient}
            >
              <Text style={[
                styles.filterText,
                selectedFilter === 'verified' && styles.filterTextActive
              ]}>
                Проверенные
              </Text>
            </LinearGradient>
          </BlurView>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterButton, selectedFilter === 'licensed' && styles.filterButtonActive]}
          onPress={() => handleFilterPress('licensed')}
        >
          <BlurView intensity={10} tint="light" style={styles.filterBlur}>
            <LinearGradient
              colors={selectedFilter === 'licensed' 
                ? ['rgba(10, 132, 255, 0.9)', 'rgba(10, 132, 255, 0.8)']
                : ['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.8)']
              }
              style={styles.filterGradient}
            >
              <Text style={[
                styles.filterText,
                selectedFilter === 'licensed' && styles.filterTextActive
              ]}>
                С лицензией
              </Text>
            </LinearGradient>
          </BlurView>
        </TouchableOpacity>
      </View>

      {/* Статистика */}
      <View style={styles.statsContainer}>
        <BlurView intensity={10} tint="light" style={styles.statsBlur}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.8)']}
            style={styles.statsGradient}
          >
            <Text style={styles.statsText}>
              Найдено центров: {filteredCenters.length}
            </Text>
            {favorites.size > 0 && (
              <Text style={styles.statsText}>
                В избранном: {favorites.size}
              </Text>
            )}
          </LinearGradient>
        </BlurView>
      </View>
    </View>
  ), [searchQuery, selectedFilter, filteredCenters.length, favorites.size, handleFilterPress]);

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

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[THEME.bgTop, THEME.bgMid, THEME.bgBottom]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {/* Заголовок */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Поиск центров</Text>
            <Text style={styles.subtitle}>
              Найдите подходящий реабилитационный центр
            </Text>
          </View>

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
          />
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  titleContainer: {
    paddingHorizontal: responsivePadding(20),
    paddingVertical: responsivePadding(16),
    alignItems: 'center',
  },
  title: {
    fontSize: responsiveWidth(28),
    fontWeight: '800',
    color: THEME.textPrimary,
    textAlign: 'center',
    marginBottom: responsivePadding(8),
    letterSpacing: responsiveWidth(-0.5),
  },
  subtitle: {
    fontSize: responsiveWidth(16),
    fontWeight: '500',
    color: THEME.textSecondary,
    textAlign: 'center',
    lineHeight: responsiveWidth(22),
  },
  listContainer: {
    paddingBottom: responsivePadding(20),
  },
  list: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: responsivePadding(20),
    paddingBottom: responsivePadding(20),
  },
  searchContainer: {
    marginBottom: responsivePadding(16),
  },
  searchBlur: {
    borderRadius: responsiveWidth(16),
    overflow: 'hidden',
    ...THEME.shadowSmall,
  },
  searchGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsivePadding(16),
    paddingVertical: responsivePadding(12),
  },
  searchIcon: {
    marginRight: responsivePadding(12),
  },
  searchInput: {
    flex: 1,
    fontSize: responsiveWidth(16),
    color: THEME.textPrimary,
    fontWeight: '500',
  },
  clearButton: {
    marginLeft: responsivePadding(8),
  },
  filtersContainer: {
    flexDirection: 'row',
    gap: responsivePadding(12),
    marginBottom: responsivePadding(16),
  },
  filterButton: {
    flex: 1,
    borderRadius: responsiveWidth(12),
    overflow: 'hidden',
  },
  filterButtonActive: {
    // Активное состояние обрабатывается в градиенте
  },
  filterBlur: {
    borderRadius: responsiveWidth(12),
    overflow: 'hidden',
  },
  filterGradient: {
    paddingVertical: responsivePadding(10),
    paddingHorizontal: responsivePadding(16),
    alignItems: 'center',
  },
  filterText: {
    fontSize: responsiveWidth(14),
    fontWeight: '600',
    color: THEME.textPrimary,
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  statsContainer: {
    marginBottom: responsivePadding(8),
  },
  statsBlur: {
    borderRadius: responsiveWidth(12),
    overflow: 'hidden',
  },
  statsGradient: {
    paddingVertical: responsivePadding(12),
    paddingHorizontal: responsivePadding(16),
    alignItems: 'center',
  },
  statsText: {
    fontSize: responsiveWidth(14),
    fontWeight: '500',
    color: THEME.textSecondary,
    marginBottom: responsivePadding(4),
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
});

export default SearchPage;
