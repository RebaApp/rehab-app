import React, { memo, useCallback, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  FlatList,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../../utils/constants';
import useAppStore from '../../store/useAppStore';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  body: string;
  image: string;
  author?: string;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
  views?: number;
  likes?: number;
}

interface ArticlesListModalProps {
  visible: boolean;
  onClose: () => void;
  onEditArticle: (article: Article) => void;
  onDeleteArticle: (articleId: string) => void;
}

const ArticlesListModal: React.FC<ArticlesListModalProps> = memo(({
  visible,
  onClose,
  onEditArticle,
  onDeleteArticle
}) => {
  const { articles } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'views' | 'title'>('date');

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedArticles = [...filteredArticles].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
      case 'views':
        return (b.views || 0) - (a.views || 0);
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const handleEditArticle = useCallback((article: Article) => {
    onClose();
    onEditArticle(article);
  }, [onClose, onEditArticle]);

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
            onDeleteArticle(articleId);
            Alert.alert('Успех', 'Статья удалена');
          }
        }
      ]
    );
  }, [onDeleteArticle]);

  const renderArticleItem = useCallback(({ item }: { item: Article }) => (
    <View style={styles.articleCard}>
      <View style={styles.articleHeader}>
        <Text style={styles.articleTitle} numberOfLines={2}>
          {item.title}
        </Text>
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
      
      <Text style={styles.articleExcerpt} numberOfLines={2}>
        {item.excerpt}
      </Text>
      
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
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
            <Ionicons name="close" size={24} color={THEME.muted} />
          </TouchableOpacity>
          <Text style={styles.title}>Управление статьями</Text>
          <View style={styles.headerRight}>
            <Text style={styles.articlesCount}>{articles.length}</Text>
          </View>
        </View>

        {/* Фильтры и поиск */}
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
          
          <View style={styles.sortContainer}>
            <Text style={styles.sortLabel}>Сортировка:</Text>
            <TouchableOpacity
              style={[styles.sortButton, sortBy === 'date' && styles.sortButtonActive]}
              onPress={() => setSortBy('date')}
            >
              <Text style={[styles.sortButtonText, sortBy === 'date' && styles.sortButtonTextActive]}>
                Дата
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sortButton, sortBy === 'views' && styles.sortButtonActive]}
              onPress={() => setSortBy('views')}
            >
              <Text style={[styles.sortButtonText, sortBy === 'views' && styles.sortButtonTextActive]}>
                Просмотры
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sortButton, sortBy === 'title' && styles.sortButtonActive]}
              onPress={() => setSortBy('title')}
            >
              <Text style={[styles.sortButtonText, sortBy === 'title' && styles.sortButtonTextActive]}>
                Название
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Список статей */}
        <FlatList
          data={sortedArticles}
          renderItem={renderArticleItem}
          keyExtractor={(item) => item.id}
          style={styles.articlesList}
          contentContainerStyle={styles.articlesListContent}
          showsVerticalScrollIndicator={false}
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
    </Modal>
  );
});

ArticlesListModal.displayName = 'ArticlesListModal';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  cancelButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  headerRight: {
    minWidth: 40,
    alignItems: 'center',
  },
  articlesCount: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.primary,
  },
  filtersContainer: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sortLabel: {
    fontSize: 14,
    color: THEME.muted,
    marginRight: 8,
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: THEME.primary,
  },
  sortButtonActive: {
    backgroundColor: THEME.primary,
  },
  sortButtonText: {
    fontSize: 12,
    color: THEME.primary,
    fontWeight: '500',
  },
  sortButtonTextActive: {
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
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  articleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 12,
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
  articleExcerpt: {
    fontSize: 14,
    color: THEME.muted,
    lineHeight: 20,
    marginBottom: 12,
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

export default ArticlesListModal;
