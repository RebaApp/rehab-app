import React, { memo, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../../utils/constants';
import useAppStore from '../../store/useAppStore';

interface AdminHomeScreenProps {
  onNavigate: (screen: string) => void;
  onClose?: () => void;
}

const AdminHomeScreen: React.FC<AdminHomeScreenProps> = memo(({ onNavigate, onClose }) => {
  const { articles, centers, user } = useAppStore();

  const handleNavigate = useCallback((screen: string) => {
    onNavigate(screen);
  }, [onNavigate]);

  const getStats = useCallback(() => {
    const totalViews = articles.reduce((sum, article) => sum + (article.views || 0), 0);
    const totalLikes = articles.reduce((sum, article) => sum + (article.likes || 0), 0);
    const verifiedCenters = centers.filter(center => center.verified).length;
    
    return {
      totalArticles: articles.length,
      totalCenters: centers.length,
      verifiedCenters,
      totalViews,
      totalLikes,
    };
  }, [articles, centers]);

  const stats = getStats();

  const adminSections = [
    {
      id: 'articles',
      title: 'Управление статьями',
      description: 'Создание, редактирование и удаление статей',
      icon: 'document-text',
      color: '#4CAF50',
      stats: `${stats.totalArticles} статей`,
      actions: [
        { label: 'Все статьи', screen: 'articles-list' },
        { label: 'Создать статью', screen: 'create-article' },
        { label: 'Статистика', screen: 'articles-stats' },
      ]
    },
    {
      id: 'centers',
      title: 'Управление центрами',
      description: 'Добавление и редактирование реабилитационных центров',
      icon: 'business',
      color: '#2196F3',
      stats: `${stats.totalCenters} центров (${stats.verifiedCenters} проверенных)`,
      actions: [
        { label: 'Все центры', screen: 'centers-list' },
        { label: 'Добавить центр', screen: 'create-center' },
        { label: 'Проверка центров', screen: 'centers-verification' },
      ]
    },
    {
      id: 'users',
      title: 'Управление пользователями',
      description: 'Модерация пользователей и отзывов',
      icon: 'people',
      color: '#FF9800',
      stats: 'Активные пользователи',
      actions: [
        { label: 'Все пользователи', screen: 'users-list' },
        { label: 'Модерация отзывов', screen: 'reviews-moderation' },
        { label: 'Статистика пользователей', screen: 'users-stats' },
      ]
    },
    {
      id: 'analytics',
      title: 'Аналитика и статистика',
      description: 'Общая статистика и аналитика платформы',
      icon: 'analytics',
      color: '#9C27B0',
      stats: `${stats.totalViews} просмотров, ${stats.totalLikes} лайков`,
      actions: [
        { label: 'Общая статистика', screen: 'analytics-overview' },
        { label: 'Статистика статей', screen: 'articles-analytics' },
        { label: 'Статистика центров', screen: 'centers-analytics' },
      ]
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Админ панель</Text>
          <Text style={styles.subtitle}>Добро пожаловать, {user?.name || 'Администратор'}</Text>
        </View>
        {onClose && (
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <Ionicons name="close" size={24} color={THEME.muted} />
          </TouchableOpacity>
        )}
      </View>


      {/* Разделы админ панели */}
      <View style={styles.sectionsContainer}>
        <Text style={styles.sectionsTitle}>Управление</Text>
        {adminSections.map((section) => (
          <View key={section.id} style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIcon, { backgroundColor: section.color + '20' }]}>
                <Ionicons name={section.icon as any} size={24} color={section.color} />
              </View>
              <View style={styles.sectionInfo}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <Text style={styles.sectionDescription}>{section.description}</Text>
                <Text style={styles.sectionStats}>{section.stats}</Text>
              </View>
            </View>
            
            <View style={styles.sectionActions}>
              {section.actions.map((action, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.actionButton}
                  onPress={() => handleNavigate(action.screen)}
                >
                  <Text style={styles.actionButtonText}>{action.label}</Text>
                  <Ionicons name="chevron-forward" size={16} color={THEME.primary} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </View>

      {/* Быстрые действия */}
      <View style={styles.quickActionsContainer}>
        <Text style={styles.quickActionsTitle}>Быстрые действия</Text>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => handleNavigate('create-article')}
          >
            <Ionicons name="add-circle" size={20} color="#fff" />
            <Text style={styles.quickActionText}>Новая статья</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => handleNavigate('create-center')}
          >
            <Ionicons name="add-circle" size={20} color="#fff" />
            <Text style={styles.quickActionText}>Новый центр</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => handleNavigate('analytics-overview')}
          >
            <Ionicons name="analytics" size={20} color="#fff" />
            <Text style={styles.quickActionText}>Аналитика</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => Alert.alert('Настройки', 'Настройки админ панели')}
          >
            <Ionicons name="settings" size={20} color="#fff" />
            <Text style={styles.quickActionText}>Настройки</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
});

AdminHomeScreen.displayName = 'AdminHomeScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  headerContent: {
    flex: 1,
  },
  closeButton: {
    padding: 8,
    marginTop: -8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: THEME.muted,
  },
  statsContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: THEME.primary,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: THEME.muted,
    marginTop: 4,
  },
  sectionsContainer: {
    marginBottom: 24,
  },
  sectionsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  sectionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  sectionInfo: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
    color: THEME.muted,
    marginBottom: 8,
  },
  sectionStats: {
    fontSize: 12,
    color: THEME.primary,
    fontWeight: '500',
  },
  sectionActions: {
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  actionButtonText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  quickActionsContainer: {
    marginBottom: 24,
  },
  quickActionsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: THEME.primary,
    borderRadius: 12,
    gap: 8,
  },
  quickActionText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
});

export default AdminHomeScreen;
