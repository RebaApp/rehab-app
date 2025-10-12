import React, { memo, useCallback, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { Center } from '../types';
import CenterCard from '../components/common/CenterCard';
import { THEME } from '../utils/constants';

interface SearchScreenProps {
  onCenterPress: (center: Center) => void;
  onToggleFavorite: (centerId: string) => void;
  isFavorite: (centerId: string) => boolean;
  onFiltersPress: () => void;
  onRefresh: () => void;
  refreshing: boolean;
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
  const [sortByDistance, setSortByDistance] = useState(false);

  const handleSearchChange = useCallback((text: string) => {
    setSearchQuery(text);
  }, []);

  const handleSortToggle = useCallback(() => {
    setSortByDistance(!sortByDistance);
  }, [sortByDistance]);

  // Mock data - в реальном приложении это будет приходить из store
  const mockCenters: Center[] = [
    {
      id: '1',
      name: 'Центр Возрождение',
      city: 'Москва',
      address: 'ул. Примерная, д. 1',
      phone: '+7 (495) 123-45-67',
      email: 'info@center1.ru',
      rating: 4.5,
      reviewsCount: 25,
      verified: true,
      photos: ['https://via.placeholder.com/300x200'],
      services: ['Консультация', 'Детокс', 'Реабилитация'],
      description: 'Профессиональная помощь в борьбе с зависимостями',
      price: '50 000 ₽/месяц',
      coordinates: { latitude: 55.7558, longitude: 37.6176 },
      workingHours: 'Пн-Вс: 9:00-21:00',
      capacity: 50,
      yearFounded: 2010,
      license: 'ЛО-77-01-123456',
      descriptionFull: 'Полное описание центра',
      methods: ['12 шагов', 'КПТ'],
      reviews: []
    }
  ];

  const filteredCenters = mockCenters.filter(center =>
    center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    center.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    center.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderCenter = useCallback(({ item }: { item: Center }) => (
    <CenterCard
      item={item}
      onPress={onCenterPress}
      onToggleFavorite={onToggleFavorite}
      isFavorite={isFavorite(item.id)}
      showDistance={sortByDistance}
    />
  ), [onCenterPress, onToggleFavorite, isFavorite, sortByDistance]);

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
        <TouchableOpacity style={styles.filterButton} onPress={onFiltersPress}>
          <Text style={styles.filterButtonText}>Фильтры</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.sortControls}>
        <TouchableOpacity
          style={[styles.sortButton, sortByDistance && styles.sortButtonActive]}
          onPress={handleSortToggle}
        >
          <Ionicons
            name={sortByDistance ? 'location' : 'location-outline'}
            size={16}
            color={sortByDistance ? '#fff' : THEME.primary}
          />
          <Text style={[styles.sortButtonText, sortByDistance && styles.sortButtonTextActive]}>
            {sortByDistance ? 'По расстоянию' : 'Ближайшие'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  ), [searchQuery, handleSearchChange, onFiltersPress, sortByDistance, handleSortToggle]);

  const renderEmpty = useCallback(() => (
    <View style={styles.emptyContainer}>
      <Ionicons name="search-outline" size={48} color={THEME.muted} />
      <Text style={styles.emptyTitle}>Центры не найдены</Text>
      <Text style={styles.emptyText}>
        Попробуйте изменить поисковый запрос или фильтры
      </Text>
    </View>
  ), []);

  const keyExtractor = useCallback((item: Center) => item.id, []);

  return (
    <View style={styles.container}>
      <FlashList
        data={filteredCenters}
        renderItem={renderCenter}
        keyExtractor={keyExtractor}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        estimatedItemSize={250}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[THEME.primary]}
            tintColor={THEME.primary}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        drawDistance={500}
        overrideItemLayout={(layout, _item) => {
          layout.size = 250;
        }}
      />
    </View>
  );
});

SearchScreen.displayName = 'SearchScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  listContainer: {
    paddingBottom: 20
  },
  header: {
    padding: 12
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
    ...THEME.shadow
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    marginLeft: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eef7ff'
  },
  filterButtonText: {
    fontWeight: '700',
    color: THEME.primary
  },
  sortControls: {
    flexDirection: 'row',
    gap: 8
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: THEME.primary,
    backgroundColor: '#fff'
  },
  sortButtonActive: {
    backgroundColor: THEME.primary,
    borderColor: THEME.primary
  },
  sortButtonText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '600',
    color: THEME.primary
  },
  sortButtonTextActive: {
    color: '#fff'
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginTop: 16,
    marginBottom: 8
  },
  emptyText: {
    fontSize: 16,
    color: THEME.muted,
    textAlign: 'center',
    lineHeight: 22
  }
});

export default SearchScreen;