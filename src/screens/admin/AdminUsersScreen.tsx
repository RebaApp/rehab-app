import React, { memo, useCallback, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../../utils/constants';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
  status: 'active' | 'blocked' | 'pending';
  createdAt: string;
  lastLogin?: string;
  articlesCount?: number;
  centersCount?: number;
}

interface AdminUsersScreenProps {
  onBack: () => void;
}

const AdminUsersScreen: React.FC<AdminUsersScreenProps> = memo(({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'email' | 'role' | 'status' | 'createdAt'>('name');
  const [filterBy, setFilterBy] = useState<'all' | 'admin' | 'user' | 'moderator' | 'active' | 'blocked' | 'pending'>('all');

  // Мокап данные пользователей
  const users: User[] = [
    {
      id: 'u1',
      name: 'Администратор Системы',
      email: 'admin@reba.ru',
      role: 'admin',
      status: 'active',
      createdAt: '2024-01-01T00:00:00Z',
      lastLogin: '2024-01-20T10:30:00Z',
      articlesCount: 15,
      centersCount: 8
    },
    {
      id: 'u2',
      name: 'Модератор Контента',
      email: 'moderator@reba.ru',
      role: 'moderator',
      status: 'active',
      createdAt: '2024-01-05T09:15:00Z',
      lastLogin: '2024-01-19T16:45:00Z',
      articlesCount: 8,
      centersCount: 3
    },
    {
      id: 'u3',
      name: 'Пользователь Тест',
      email: 'user@example.com',
      role: 'user',
      status: 'active',
      createdAt: '2024-01-10T14:20:00Z',
      lastLogin: '2024-01-18T12:10:00Z',
      articlesCount: 2,
      centersCount: 1
    },
    {
      id: 'u4',
      name: 'Заблокированный Пользователь',
      email: 'blocked@example.com',
      role: 'user',
      status: 'blocked',
      createdAt: '2024-01-12T11:30:00Z',
      lastLogin: '2024-01-15T09:20:00Z',
      articlesCount: 0,
      centersCount: 0
    },
    {
      id: 'u5',
      name: 'Ожидающий Подтверждения',
      email: 'pending@example.com',
      role: 'user',
      status: 'pending',
      createdAt: '2024-01-18T16:45:00Z',
      lastLogin: undefined,
      articlesCount: 0,
      centersCount: 0
    }
  ];

  const filteredAndSortedUsers = useCallback(() => {
    let filtered = users.filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Фильтрация по роли или статусу
    if (filterBy !== 'all') {
      if (['admin', 'user', 'moderator'].includes(filterBy)) {
        filtered = filtered.filter(user => user.role === filterBy);
      } else if (['active', 'blocked', 'pending'].includes(filterBy)) {
        filtered = filtered.filter(user => user.status === filterBy);
      }
    }

    // Сортировка
    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'email':
        filtered.sort((a, b) => a.email.localeCompare(b.email));
        break;
      case 'role':
        const roleOrder = { admin: 0, moderator: 1, user: 2 };
        filtered.sort((a, b) => roleOrder[a.role] - roleOrder[b.role]);
        break;
      case 'status':
        const statusOrder = { active: 0, pending: 1, blocked: 2 };
        filtered.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
        break;
      case 'createdAt':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }
    return filtered;
  }, [searchQuery, sortBy, filterBy]);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return '#ff4444';
      case 'moderator': return '#ff8800';
      case 'user': return THEME.primary;
      default: return THEME.muted;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#00aa00';
      case 'pending': return '#ffaa00';
      case 'blocked': return '#ff4444';
      default: return THEME.muted;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Активен';
      case 'pending': return 'Ожидает';
      case 'blocked': return 'Заблокирован';
      default: return status;
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin': return 'Администратор';
      case 'moderator': return 'Модератор';
      case 'user': return 'Пользователь';
      default: return role;
    }
  };

  const handleToggleStatus = useCallback((user: User) => {
    const newStatus = user.status === 'active' ? 'blocked' : 'active';
    const action = newStatus === 'active' ? 'разблокировать' : 'заблокировать';
    
    Alert.alert(
      'Изменить статус пользователя',
      `Вы хотите ${action} пользователя "${user.name}"?`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: action === 'разблокировать' ? 'Разблокировать' : 'Заблокировать',
          onPress: () => {
            // Здесь будет логика изменения статуса
            Alert.alert('Успех', `Пользователь "${user.name}" ${action === 'разблокировать' ? 'разблокирован' : 'заблокирован'}`);
          },
        },
      ]
    );
  }, []);

  const handleChangeRole = useCallback((user: User) => {
    Alert.alert(
      'Изменить роль пользователя',
      `Выберите новую роль для "${user.name}":`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Администратор',
          onPress: () => Alert.alert('Успех', `Роль пользователя "${user.name}" изменена на "Администратор"`),
        },
        {
          text: 'Модератор',
          onPress: () => Alert.alert('Успех', `Роль пользователя "${user.name}" изменена на "Модератор"`),
        },
        {
          text: 'Пользователь',
          onPress: () => Alert.alert('Успех', `Роль пользователя "${user.name}" изменена на "Пользователь"`),
        },
      ]
    );
  }, []);

  const renderUserItem = useCallback(({ item }: { item: User }) => (
    <View style={styles.userItem}>
      <View style={styles.userContent}>
        <View style={styles.userHeader}>
          <Text style={styles.userName}>{item.name}</Text>
          <View style={styles.userBadges}>
            <View style={[styles.badge, { backgroundColor: getRoleColor(item.role) + '20' }]}>
              <Text style={[styles.badgeText, { color: getRoleColor(item.role) }]}>
                {getRoleText(item.role)}
              </Text>
            </View>
            <View style={[styles.badge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
              <Text style={[styles.badgeText, { color: getStatusColor(item.status) }]}>
                {getStatusText(item.status)}
              </Text>
            </View>
          </View>
        </View>
        
        <Text style={styles.userEmail}>{item.email}</Text>
        
        <View style={styles.userStats}>
          <View style={styles.statItem}>
            <Ionicons name="document-outline" size={14} color={THEME.muted} />
            <Text style={styles.statText}>{item.articlesCount || 0} статей</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="business-outline" size={14} color={THEME.muted} />
            <Text style={styles.statText}>{item.centersCount || 0} центров</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="calendar-outline" size={14} color={THEME.muted} />
            <Text style={styles.statText}>
              {item.lastLogin ? new Date(item.lastLogin).toLocaleDateString() : 'Никогда'}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.userActions}>
        <TouchableOpacity 
          onPress={() => handleChangeRole(item)} 
          style={styles.actionButton}
        >
          <Ionicons name="person-outline" size={20} color={THEME.primary} />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => handleToggleStatus(item)} 
          style={styles.actionButton}
        >
          <Ionicons 
            name={item.status === 'active' ? 'lock-closed-outline' : 'lock-open-outline'} 
            size={20} 
            color={item.status === 'active' ? '#ff4444' : '#00aa00'} 
          />
        </TouchableOpacity>
      </View>
    </View>
  ), [handleChangeRole, handleToggleStatus]);

  return (
    <View style={styles.container}>
      {/* Заголовок с навигацией */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
        >
          <Ionicons name="arrow-back" size={24} color={THEME.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Управление пользователями</Text>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onBack}
        >
          <Ionicons name="close" size={24} color={THEME.muted} />
        </TouchableOpacity>
      </View>

      {/* Список пользователей */}
      <FlatList
        data={filteredAndSortedUsers()}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id}
        style={styles.usersList}
        contentContainerStyle={styles.usersListContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>

            {/* Фильтры */}
            <View style={styles.filtersContainer}>
              <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color={THEME.muted} />
                <TextInput
                  style={styles.searchInput}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Поиск пользователей..."
                  placeholderTextColor={THEME.muted}
                />
              </View>
              
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersRow}>
                <TouchableOpacity
                  style={[styles.filterButton, sortBy === 'name' && styles.filterButtonActive]}
                  onPress={() => setSortBy('name')}
                >
                  <Text style={[styles.filterButtonText, sortBy === 'name' && styles.filterButtonTextActive]}>
                    По имени
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.filterButton, sortBy === 'email' && styles.filterButtonActive]}
                  onPress={() => setSortBy('email')}
                >
                  <Text style={[styles.filterButtonText, sortBy === 'email' && styles.filterButtonTextActive]}>
                    По email
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.filterButton, sortBy === 'role' && styles.filterButtonActive]}
                  onPress={() => setSortBy('role')}
                >
                  <Text style={[styles.filterButtonText, sortBy === 'role' && styles.filterButtonTextActive]}>
                    По роли
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.filterButton, sortBy === 'status' && styles.filterButtonActive]}
                  onPress={() => setSortBy('status')}
                >
                  <Text style={[styles.filterButtonText, sortBy === 'status' && styles.filterButtonTextActive]}>
                    По статусу
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.filterButton, sortBy === 'createdAt' && styles.filterButtonActive]}
                  onPress={() => setSortBy('createdAt')}
                >
                  <Text style={[styles.filterButtonText, sortBy === 'createdAt' && styles.filterButtonTextActive]}>
                    По дате
                  </Text>
                </TouchableOpacity>
              </ScrollView>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersRow}>
                <TouchableOpacity
                  style={[styles.filterButton, filterBy === 'all' && styles.filterButtonActive]}
                  onPress={() => setFilterBy('all')}
                >
                  <Text style={[styles.filterButtonText, filterBy === 'all' && styles.filterButtonTextActive]}>
                    Все
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.filterButton, filterBy === 'admin' && styles.filterButtonActive]}
                  onPress={() => setFilterBy('admin')}
                >
                  <Text style={[styles.filterButtonText, filterBy === 'admin' && styles.filterButtonTextActive]}>
                    Администраторы
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.filterButton, filterBy === 'moderator' && styles.filterButtonActive]}
                  onPress={() => setFilterBy('moderator')}
                >
                  <Text style={[styles.filterButtonText, filterBy === 'moderator' && styles.filterButtonTextActive]}>
                    Модераторы
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.filterButton, filterBy === 'user' && styles.filterButtonActive]}
                  onPress={() => setFilterBy('user')}
                >
                  <Text style={[styles.filterButtonText, filterBy === 'user' && styles.filterButtonTextActive]}>
                    Пользователи
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.filterButton, filterBy === 'active' && styles.filterButtonActive]}
                  onPress={() => setFilterBy('active')}
                >
                  <Text style={[styles.filterButtonText, filterBy === 'active' && styles.filterButtonTextActive]}>
                    Активные
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.filterButton, filterBy === 'blocked' && styles.filterButtonActive]}
                  onPress={() => setFilterBy('blocked')}
                >
                  <Text style={[styles.filterButtonText, filterBy === 'blocked' && styles.filterButtonTextActive]}>
                    Заблокированные
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.filterButton, filterBy === 'pending' && styles.filterButtonActive]}
                  onPress={() => setFilterBy('pending')}
                >
                  <Text style={[styles.filterButtonText, filterBy === 'pending' && styles.filterButtonTextActive]}>
                    Ожидающие
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={48} color={THEME.muted} />
            <Text style={styles.emptyText}>Пользователи не найдены</Text>
            <Text style={styles.emptySubtext}>
              {searchQuery ? 'Попробуйте изменить поисковый запрос' : 'Пользователи появятся после регистрации'}
            </Text>
          </View>
        }
      />
    </View>
  );
});

AdminUsersScreen.displayName = 'AdminUsersScreen';

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
  usersList: {
    flex: 1,
  },
  usersListContent: {
    padding: 20,
  },
  statsContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
    // Добавляем эффект нажатия
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: THEME.primary,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: THEME.muted,
    textAlign: 'center',
  },
  filtersContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 16,
    color: '#333',
  },
  filtersRow: {
    marginBottom: 10,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: THEME.primary,
    backgroundColor: '#fff',
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: THEME.primary,
  },
  filterButtonText: {
    fontSize: 12,
    color: THEME.primary,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  userItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e9ecef',
    alignItems: 'center',
  },
  userContent: {
    flex: 1,
    marginRight: 15,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  userBadges: {
    flexDirection: 'row',
    gap: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  userEmail: {
    fontSize: 14,
    color: THEME.muted,
    marginBottom: 8,
  },
  userStats: {
    flexDirection: 'row',
    gap: 15,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: THEME.muted,
  },
  userActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: THEME.muted,
    marginTop: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: THEME.muted,
    marginTop: 5,
    textAlign: 'center',
  },
});

export default AdminUsersScreen;
