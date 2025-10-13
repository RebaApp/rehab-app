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
import { THEME, ARTICLE_RUBRICS } from '../../utils/constants';
import useAppStore from '../../store/useAppStore';
import { Article } from '../../types';

interface AdminArticlesScreenProps {
  onNavigate: (screen: string) => void;
  onEditArticle: (article: Article) => void;
}

const AdminArticlesScreen: React.FC<AdminArticlesScreenProps> = memo(({
  onNavigate,
  onEditArticle
}) => {
  const { articles, deleteArticle } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'views' | 'title' | 'likes'>('date');
  const [filterBy, setFilterBy] = useState<string>('all');

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterBy === 'all' || article.category === filterBy;
    return matchesSearch && matchesFilter;
  });

  const sortedArticles = [...filteredArticles].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
      case 'views':
        return (b.views || 0) - (a.views || 0);
      case 'likes':
        return (b.likes || 0) - (a.likes || 0);
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const handleEditArticle = useCallback((article: Article) => {
    onEditArticle(article);
  }, [onEditArticle]);

  const handleDeleteArticle = useCallback((articleId: string, articleTitle: string) => {
    Alert.alert(
      'Удалить статью',
      `Вы уверены, что хотите удалить статью "${articleTitle}"?`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: () => {
            deleteArticle(articleId);
            Alert.alert('Успех', 'Статья удалена');
          }
        }
      ]
    );
  }, [deleteArticle]);

  const getStats = useCallback(() => {
    const totalViews = articles.reduce((sum, article) => sum + (article.views || 0), 0);
    const totalLikes = articles.reduce((sum, article) => sum + (article.likes || 0), 0);
    const avgViews = articles.length > 0 ? Math.round(totalViews / articles.length) : 0;
    
    return {
      totalArticles: articles.length,
      totalViews,
      totalLikes,
      avgViews,
    };
  }, [articles]);

  const stats = getStats();

  const renderArticleItem = useCallback(({ item }: { item: Article }) => (
    <View style={styles.articleCard}>
      <View style={styles.articleHeader}>
        <View style={styles.articleInfo}>
          <Text style={styles.articleTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.articleExcerpt} numberOfLines={2}>
            {item.excerpt}
          </Text>
        </View>
        <View style={styles.articleActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEditArticle(item)}
          >
            <Ionicons name="create-outline" size={18} color={THEME.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDeleteArticle(item.id, item.title)}
          >
            <Ionicons name="trash-outline" size={18} color="#ff4444" />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.articleMeta}>
        <View style={styles.metaItem}>
          <Ionicons name="eye" size={14} color={THEME.muted} />
          <Text style={styles.metaText}>{item.views || 0}</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="heart" size={14} color={THEME.muted} />
          <Text style={styles.metaText}>{item.likes || 0}</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="calendar" size={14} color={THEME.muted} />
          <Text style={styles.metaText}>
            {item.createdAt ? new Date(item.createdAt).toLocaleDateString('ru-RU') : 'Неизвестно'}
          </Text>
        </View>
        {item.category && (
          <View style={styles.metaItem}>
            <Ionicons name="folder" size={14} color={THEME.muted} />
            <Text style={styles.metaText}>{item.category}</Text>
          </View>
        )}
      </View>
    </View>
  ), [handleEditArticle, handleDeleteArticle]);

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
        <Text style={styles.title}>Управление статьями</Text>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => onNavigate('home')}
        >
          <Ionicons name="close" size={24} color={THEME.muted} />
        </TouchableOpacity>
      </View>

      {/* Список статей */}
      <FlatList
        data={sortedArticles}
        renderItem={renderArticleItem}
        keyExtractor={(item) => item.id}
        style={styles.articlesList}
        contentContainerStyle={styles.articlesListContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {/* Кнопка добавления */}
            <View style={styles.addButtonContainer}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => onNavigate('create-article')}
              >
                <Ionicons name="add" size={20} color="#fff" />
                <Text style={styles.addButtonText}>Новая статья</Text>
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
                  placeholder="Поиск статей..."
                  placeholderTextColor={THEME.muted}
                />
              </View>
              
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersRow}>
                <TouchableOpacity
                  style={[styles.filterButton, sortBy === 'date' && styles.filterButtonActive]}
                  onPress={() => setSortBy('date')}
                >
                  <Text style={[styles.filterButtonText, sortBy === 'date' && styles.filterButtonTextActive]}>
                    По дате
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.filterButton, sortBy === 'views' && styles.filterButtonActive]}
                  onPress={() => setSortBy('views')}
                >
                  <Text style={[styles.filterButtonText, sortBy === 'views' && styles.filterButtonTextActive]}>
                    По просмотрам
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.filterButton, sortBy === 'likes' && styles.filterButtonActive]}
                  onPress={() => setSortBy('likes')}
                >
                  <Text style={[styles.filterButtonText, sortBy === 'likes' && styles.filterButtonTextActive]}>
                    По лайкам
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.filterButton, sortBy === 'title' && styles.filterButtonActive]}
                  onPress={() => setSortBy('title')}
                >
                  <Text style={[styles.filterButtonText, sortBy === 'title' && styles.filterButtonTextActive]}>
                    По названию
                  </Text>
                </TouchableOpacity>
              </ScrollView>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersRow}>
                <TouchableOpacity
                  style={[styles.filterButton, filterBy === 'all' && styles.filterButtonActive]}
                  onPress={() => setFilterBy('all')}
                >
                  <Text style={[styles.filterButtonText, filterBy === 'all' && styles.filterButtonTextActive]}>
                    Все рубрики
                  </Text>
                </TouchableOpacity>
                {ARTICLE_RUBRICS.map((rubric) => (
                  <TouchableOpacity
                    key={rubric}
                    style={[styles.filterButton, filterBy === rubric && styles.filterButtonActive]}
                    onPress={() => setFilterBy(rubric)}
                  >
                    <Text style={[styles.filterButtonText, filterBy === rubric && styles.filterButtonTextActive]}>
                      {rubric}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-outline" size={48} color={THEME.muted} />
            <Text style={styles.emptyText}>Статьи не найдены</Text>
            <Text style={styles.emptySubtext}>
              {searchQuery ? 'Попробуйте изменить поисковый запрос' : 'Создайте первую статью'}
            </Text>
          </View>
        }
      />
    </View>
  );
});

AdminArticlesScreen.displayName = 'AdminArticlesScreen';

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
  articlesList: {
    flex: 1,
  },
  articlesListContent: {
    padding: 20,
  },
  articleCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  articleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  articleInfo: {
    flex: 1,
    marginRight: 12,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  articleExcerpt: {
    fontSize: 14,
    color: THEME.muted,
    lineHeight: 20,
  },
  articleActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#f8f9fa',
  },
  articleMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
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

export default AdminArticlesScreen;
