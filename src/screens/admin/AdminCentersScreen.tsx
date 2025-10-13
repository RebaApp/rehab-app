import React, { memo, useCallback, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  FlatList,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../../utils/constants';
import useAppStore from '../../store/useAppStore';
import { Center } from '../../types';

interface AdminCentersScreenProps {
  onNavigate: (screen: string) => void;
  onEditCenter: (center: Center) => void;
}

const AdminCentersScreen: React.FC<AdminCentersScreenProps> = memo(({
  onNavigate,
  onEditCenter
}) => {
  const { centers } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'reviews' | 'verified'>('name');
  const [filterBy, setFilterBy] = useState<'all' | 'verified' | 'unverified'>('all');

  const filteredCenters = centers.filter(center => {
    const matchesSearch = center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         center.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         center.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesFilter = true;
    if (filterBy === 'verified') {
      matchesFilter = center.verified;
    } else if (filterBy === 'unverified') {
      matchesFilter = !center.verified;
    }
    
    return matchesSearch && matchesFilter;
  });

  const sortedCenters = [...filteredCenters].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'reviews':
        return (b.reviewsCount || 0) - (a.reviewsCount || 0);
      case 'verified':
        return (b.verified ? 1 : 0) - (a.verified ? 1 : 0);
      default:
        return 0;
    }
  });

  const handleEditCenter = useCallback((center: Center) => {
    onEditCenter(center);
  }, [onEditCenter]);

  const handleToggleVerification = useCallback((centerId: string, centerName: string, currentStatus: boolean) => {
    Alert.alert(
      currentStatus ? 'Отозвать верификацию' : 'Верифицировать центр',
      `Вы уверены, что хотите ${currentStatus ? 'отозвать верификацию' : 'верифицировать'} центр "${centerName}"?`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: currentStatus ? 'Отозвать' : 'Верифицировать',
          style: currentStatus ? 'destructive' : 'default',
          onPress: () => {
            // TODO: Implement verification toggle
            Alert.alert('Успех', `Центр ${currentStatus ? 'деверифицирован' : 'верифицирован'}`);
          }
        }
      ]
    );
  }, []);

  const getStats = useCallback(() => {
    const verifiedCenters = centers.filter(center => center.verified).length;
    const totalReviews = centers.reduce((sum, center) => sum + (center.reviewsCount || 0), 0);
    const avgRating = centers.length > 0 
      ? centers.reduce((sum, center) => sum + (center.rating || 0), 0) / centers.length 
      : 0;
    
    return {
      totalCenters: centers.length,
      verifiedCenters,
      unverifiedCenters: centers.length - verifiedCenters,
      totalReviews,
      avgRating: Math.round(avgRating * 10) / 10,
    };
  }, [centers]);

  const stats = getStats();

  const renderCenterItem = useCallback(({ item }: { item: Center }) => (
    <View style={styles.centerCard}>
      <View style={styles.centerHeader}>
        <View style={styles.centerInfo}>
          <View style={styles.centerTitleRow}>
            <Text style={styles.centerName} numberOfLines={1}>
              {item.name}
            </Text>
            {item.verified && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                <Text style={styles.verifiedText}>Верифицирован</Text>
              </View>
            )}
          </View>
          <Text style={styles.centerLocation}>
            <Ionicons name="location" size={14} color={THEME.muted} />
            {` ${item.city}, ${item.address}`}
          </Text>
          <Text style={styles.centerDescription} numberOfLines={2}>
            {item.description}
          </Text>
        </View>
        <View style={styles.centerActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEditCenter(item)}
          >
            <Ionicons name="create-outline" size={18} color={THEME.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleToggleVerification(item.id, item.name, item.verified)}
          >
            <Ionicons 
              name={item.verified ? "shield-checkmark-outline" : "shield-outline"} 
              size={18} 
              color={item.verified ? "#4CAF50" : "#FF9800"} 
            />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.centerMeta}>
        <View style={styles.metaItem}>
          <Ionicons name="star" size={14} color="#FFD700" />
          <Text style={styles.metaText}>{item.rating || 0}</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="chatbubble" size={14} color={THEME.muted} />
          <Text style={styles.metaText}>{item.reviewsCount || 0}</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="people" size={14} color={THEME.muted} />
          <Text style={styles.metaText}>{item.capacity || 0} мест</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="cash" size={14} color={THEME.muted} />
          <Text style={styles.metaText}>{item.price || 'Цена не указана'}</Text>
        </View>
      </View>

      {item.services && item.services.length > 0 && (
        <View style={styles.servicesContainer}>
          <Text style={styles.servicesTitle}>Услуги:</Text>
          <View style={styles.servicesList}>
            {item.services.slice(0, 3).map((service, index) => (
              <View key={index} style={styles.serviceTag}>
                <Text style={styles.serviceText}>{service}</Text>
              </View>
            ))}
            {item.services.length > 3 && (
              <Text style={styles.moreServices}>+{item.services.length - 3} еще</Text>
            )}
          </View>
        </View>
      )}
    </View>
  ), [handleEditCenter, handleToggleVerification]);

  return (
    <View style={styles.container}>
      {/* Заголовок с навигацией */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => onNavigate('home')}
        >
          <Ionicons name="arrow-back" size={24} color={THEME.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Управление центрами</Text>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => onNavigate('home')}
        >
          <Ionicons name="close" size={24} color={THEME.muted} />
        </TouchableOpacity>
      </View>

      {/* Список центров */}
      <FlatList
        data={sortedCenters}
        renderItem={renderCenterItem}
        keyExtractor={(item) => item.id}
        style={styles.centersList}
        contentContainerStyle={styles.centersListContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {/* Кнопка добавления */}
            <View style={styles.addButtonContainer}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => onNavigate('create-center')}
              >
                <Ionicons name="add" size={20} color="#fff" />
                <Text style={styles.addButtonText}>Новый центр</Text>
              </TouchableOpacity>
            </View>


            {/* Фильтры */}
            <View style={styles.filtersContainer}>
              <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color={THEME.muted} />
                <TextInput
                  style={styles.searchInput}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Поиск центров..."
                  placeholderTextColor={THEME.muted}
                />
              </View>
              
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersRow}>
                <TouchableOpacity
                  style={[styles.filterButton, sortBy === 'name' && styles.filterButtonActive]}
                  onPress={() => setSortBy('name')}
                >
                  <Text style={[styles.filterButtonText, sortBy === 'name' && styles.filterButtonTextActive]}>
                    По названию
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.filterButton, sortBy === 'rating' && styles.filterButtonActive]}
                  onPress={() => setSortBy('rating')}
                >
                  <Text style={[styles.filterButtonText, sortBy === 'rating' && styles.filterButtonTextActive]}>
                    По рейтингу
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.filterButton, sortBy === 'reviews' && styles.filterButtonActive]}
                  onPress={() => setSortBy('reviews')}
                >
                  <Text style={[styles.filterButtonText, sortBy === 'reviews' && styles.filterButtonTextActive]}>
                    По отзывам
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.filterButton, sortBy === 'verified' && styles.filterButtonActive]}
                  onPress={() => setSortBy('verified')}
                >
                  <Text style={[styles.filterButtonText, sortBy === 'verified' && styles.filterButtonTextActive]}>
                    По верификации
                  </Text>
                </TouchableOpacity>
              </ScrollView>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersRow}>
                <TouchableOpacity
                  style={[styles.filterButton, filterBy === 'all' && styles.filterButtonActive]}
                  onPress={() => setFilterBy('all')}
                >
                  <Text style={[styles.filterButtonText, filterBy === 'all' && styles.filterButtonTextActive]}>
                    Все центры
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.filterButton, filterBy === 'verified' && styles.filterButtonActive]}
                  onPress={() => setFilterBy('verified')}
                >
                  <Text style={[styles.filterButtonText, filterBy === 'verified' && styles.filterButtonTextActive]}>
                    Верифицированные
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.filterButton, filterBy === 'unverified' && styles.filterButtonActive]}
                  onPress={() => setFilterBy('unverified')}
                >
                  <Text style={[styles.filterButtonText, filterBy === 'unverified' && styles.filterButtonTextActive]}>
                    На проверке
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="business-outline" size={48} color={THEME.muted} />
            <Text style={styles.emptyText}>Центры не найдены</Text>
            <Text style={styles.emptySubtext}>
              {searchQuery ? 'Попробуйте изменить поисковый запрос' : 'Добавьте первый центр'}
            </Text>
          </View>
        }
      />
    </View>
  );
});

AdminCentersScreen.displayName = 'AdminCentersScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 8,
  },
  addButtonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  statsContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    // Добавляем эффект нажатия
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    // Делаем кнопку более заметной
    minHeight: 80,
    justifyContent: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: THEME.primary,
  },
  statLabel: {
    fontSize: 12,
    color: THEME.muted,
    marginTop: 4,
  },
  filtersContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  filtersRow: {
    marginBottom: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  filterButtonActive: {
    backgroundColor: THEME.primary,
    borderColor: THEME.primary,
  },
  filterButtonText: {
    fontSize: 12,
    color: THEME.muted,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  centersList: {
    flex: 1,
  },
  centersListContent: {
    padding: 20,
  },
  centerCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  centerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  centerInfo: {
    flex: 1,
    marginRight: 12,
  },
  centerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  centerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  verifiedText: {
    fontSize: 10,
    color: '#4CAF50',
    fontWeight: '500',
    marginLeft: 4,
  },
  centerLocation: {
    fontSize: 14,
    color: THEME.muted,
    marginBottom: 4,
  },
  centerDescription: {
    fontSize: 14,
    color: THEME.muted,
    lineHeight: 20,
  },
  centerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#f8f9fa',
  },
  centerMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: THEME.muted,
    fontWeight: '500',
  },
  servicesContainer: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  servicesTitle: {
    fontSize: 12,
    color: THEME.muted,
    fontWeight: '500',
    marginBottom: 8,
  },
  servicesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  serviceTag: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  serviceText: {
    fontSize: 10,
    color: THEME.muted,
    fontWeight: '500',
  },
  moreServices: {
    fontSize: 10,
    color: THEME.primary,
    fontWeight: '500',
    alignSelf: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: THEME.muted,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: THEME.muted,
    textAlign: 'center',
  },
});

export default AdminCentersScreen;
