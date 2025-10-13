import React, { memo, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Center } from '../types';
import CenterCard from '../components/common/CenterCard';
import { THEME } from '../utils/constants';
import useAppStore from '../store/useAppStore';

const { height: screenHeight } = Dimensions.get('window');

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
      <Ionicons name="heart-outline" size={48} color={THEME.muted} />
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
    <LinearGradient
      colors={[THEME.bgTop, THEME.bgMid, THEME.bgBottom]}
      style={styles.container}
    >
      <FlatList
        data={favoriteCenters}
        renderItem={renderCenter}
        keyExtractor={keyExtractor}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={favoriteCenters.length === 0 ? styles.emptyListContainer : styles.listContainer}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={100}
        initialNumToRender={5}
        windowSize={10}
      />
    </LinearGradient>
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
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: screenHeight * 0.7,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center'
  },
  emptyText: {
    fontSize: 14,
    color: THEME.muted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20
  },
  searchButton: {
    backgroundColor: THEME.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14
  }
});

export default FavoritesScreen;