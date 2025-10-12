import React, { memo, useCallback, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Center } from '../types';
import CenterCard from '../components/common/CenterCard';
import FiltersModal from '../components/common/FiltersModal';
import { THEME } from '../utils/constants';
import useAppStore from '../store/useAppStore';

interface SearchScreenProps {
  onCenterPress: (center: Center) => void;
  onToggleFavorite: (centerId: string) => void;
  isFavorite: (centerId: string) => boolean;
  onFiltersPress: () => void;
  onRefresh: () => void;
  refreshing: boolean;
  shimmer?: any;
}

const SearchScreen: React.FC<SearchScreenProps> = memo(({
  onCenterPress,
  onToggleFavorite,
  isFavorite,
  onFiltersPress,
  onRefresh,
  refreshing
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filtersVisible, setFiltersVisible] = useState(false);
  const { centers, filters, setFilters } = useAppStore();

  const handleSearchChange = useCallback((text: string) => {
    setSearchQuery(text);
  }, []);

  const handleFiltersPress = useCallback(() => {
    setFiltersVisible(true);
  }, []);

  const handleFiltersClose = useCallback(() => {
    setFiltersVisible(false);
  }, []);

  const handleFiltersApply = useCallback((newFilters: any) => {
    setFilters(newFilters);
    setFiltersVisible(false);
  }, [setFilters]);

  const filteredCenters = centers.filter(center => {
    // Поиск по тексту
    const matchesSearch = !searchQuery || 
      center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      center.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      center.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Фильтр по городам
    const matchesCity = filters.cities.length === 0 || 
      filters.cities.includes(center.city);

    // Фильтр по рейтингу
    const matchesRating = center.rating >= filters.minRating;

    // Фильтр по цене (если указан)
    let matchesPrice = true;
    if (filters.minPrice || filters.maxPrice) {
      const centerPrice = parseInt(center.price.replace(/\D/g, ''));
      if (filters.minPrice && centerPrice < parseInt(filters.minPrice)) {
        matchesPrice = false;
      }
      if (filters.maxPrice && centerPrice > parseInt(filters.maxPrice)) {
        matchesPrice = false;
      }
    }

    return matchesSearch && matchesCity && matchesRating && matchesPrice;
  }).sort((a, b) => {
    // Сортировка
    switch (filters.sortBy) {
      case 'rating':
        return filters.sortOrder === 'asc' ? a.rating - b.rating : b.rating - a.rating;
      case 'price':
        const priceA = parseInt(a.price.replace(/\D/g, ''));
        const priceB = parseInt(b.price.replace(/\D/g, ''));
        return filters.sortOrder === 'asc' ? priceA - priceB : priceB - priceA;
      case 'name':
        return filters.sortOrder === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      case 'reviewsCount':
        return filters.sortOrder === 'asc' 
          ? a.reviewsCount - b.reviewsCount 
          : b.reviewsCount - a.reviewsCount;
      default:
        return 0;
    }
  });

  const renderCenter = useCallback(({ item }: { item: Center }) => (
    <CenterCard
      item={item}
      onPress={onCenterPress}
      onToggleFavorite={onToggleFavorite}
      isFavorite={isFavorite(item.id)}
      showDistance={false}
    />
  ), [onCenterPress, onToggleFavorite, isFavorite]);

  const renderHeader = useCallback(() => (
    <View style={styles.header}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Поиск по центрам, городу..."
          value={searchQuery}
          onChangeText={handleSearchChange}
          placeholderTextColor={THEME.muted}
        />
        <TouchableOpacity style={styles.filterButton} onPress={handleFiltersPress}>
          <Ionicons name="options-outline" size={20} color={THEME.primary} />
          {(filters.cities.length > 0 || filters.types.length > 0 || filters.minRating > 0 || filters.minPrice || filters.maxPrice) && (
            <View style={styles.filterBadge} />
          )}
        </TouchableOpacity>
      </View>
      {filteredCenters.length > 0 && (
        <Text style={styles.resultsCount}>
          Найдено центров: {filteredCenters.length}
        </Text>
      )}
    </View>
  ), [searchQuery, handleSearchChange, handleFiltersPress, filters, filteredCenters.length]);

  return (
    <View style={styles.container}>
      {renderHeader()}
      <FlatList
        data={filteredCenters}
        renderItem={renderCenter}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={64} color={THEME.muted} />
            <Text style={styles.emptyText}>
              {searchQuery ? 'Центры не найдены' : 'Начните поиск центров'}
            </Text>
            <Text style={styles.emptySubtext}>
              {searchQuery ? 'Попробуйте изменить поисковый запрос или фильтры' : 'Используйте поиск или фильтры для поиска подходящих центров'}
            </Text>
          </View>
        }
      />
      <FiltersModal
        visible={filtersVisible}
        onClose={handleFiltersClose}
        onApply={handleFiltersApply}
        initialFilters={filters}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.bgTop,
  },
  header: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: THEME.text,
  },
  filterButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(26, 132, 255, 0.1)',
    position: 'relative',
  },
  filterBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff4444',
  },
  resultsCount: {
    fontSize: 14,
    color: THEME.muted,
    marginTop: 8,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: THEME.text,
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: THEME.muted,
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 20,
  },
  listContainer: {
    padding: 20,
  },
});

export default SearchScreen;