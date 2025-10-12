import React, { memo, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Center } from '../types';
import CenterCard from '../components/common/CenterCard';
import { THEME } from '../utils/constants';
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

  const renderCenter = useCallback(({ item }: { item: Center }) => (
    <CenterCard
      item={item}
      onPress={onCenterPress}
      onToggleFavorite={onToggleFavorite}
      isFavorite={isFavorite(item.id)}
    />
  ), [onCenterPress, onToggleFavorite, isFavorite]);

  const renderEmpty = useCallback(() => (
    <View style={styles.emptyContainer}>
      <Ionicons name="heart-outline" size={64} color={THEME.muted} />
      <Text style={styles.emptyTitle}>Пока нет избранных центров</Text>
      <Text style={styles.emptyText}>
        Добавьте центры в избранное, чтобы они появились здесь
      </Text>
      <TouchableOpacity style={styles.searchButton} onPress={onSearchPress}>
        <Text style={styles.searchButtonText}>Перейти в Поиск</Text>
      </TouchableOpacity>
    </View>
  ), [onSearchPress]);

  const keyExtractor = useCallback((item: Center) => item.id, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={favoriteCenters}
        renderItem={renderCenter}
        keyExtractor={keyExtractor}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={100}
        initialNumToRender={5}
        windowSize={10}
      />
    </View>
  );
});

FavoritesScreen.displayName = 'FavoritesScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  listContainer: {
    padding: 12,
    paddingBottom: 20
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center'
  },
  emptyText: {
    fontSize: 16,
    color: THEME.muted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24
  },
  searchButton: {
    backgroundColor: THEME.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16
  }
});

export default FavoritesScreen;