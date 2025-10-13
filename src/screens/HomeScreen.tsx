import React, { memo, useCallback, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Animated,
  FlatList,
  Platform,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Article } from '../types';
import ArticleCard from '../components/common/ArticleCard';
import { THEME } from '../utils/constants';
import useAppStore from '../store/useAppStore';

interface HomeScreenProps {
  onArticlePress: (article: Article) => void;
  shimmer?: Animated.Value;
}

const HomeScreen: React.FC<HomeScreenProps> = memo(({
  onArticlePress,
  shimmer
}) => {
  const [articleQuery, setArticleQuery] = React.useState('');
  const { articles } = useAppStore();

  const handleSearchChange = useCallback((text: string) => {
    setArticleQuery(text);
  }, []);

  const filteredArticles = useMemo(() => {
    if (!articleQuery) return articles;
    
    const query = articleQuery.toLowerCase();
    return articles.filter(article =>
      article.title.toLowerCase().includes(query) ||
      article.excerpt.toLowerCase().includes(query) ||
      (article.body || '').toLowerCase().includes(query)
    );
  }, [articleQuery, articles]);

  const renderArticle = useCallback(({ item }: { item: Article }) => (
    <ArticleCard
      item={item}
      onPress={onArticlePress}
    />
  ), [onArticlePress]);

  const renderHeader = useCallback(() => (
    <View style={styles.header}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>РЕБА</Text>
        {shimmer && (
          <Animated.View 
            pointerEvents="none" 
            style={[styles.shimmerOverlay, { opacity: shimmer }]}
          >
            <LinearGradient 
              colors={["rgba(255,255,255,0)", "rgba(255,255,255,0.6)", "rgba(255,255,255,0)"]} 
              start={[0,0]} 
              end={[1,0]} 
              style={styles.shimmerGradient} 
            />
          </Animated.View>
        )}
      </View>
      <Text style={styles.subtitle}>ПОМОЩЬ БЛИЖЕ ЧЕМ КАЖЕТСЯ</Text>
      
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color={THEME.muted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Поиск статей..."
          value={articleQuery}
          onChangeText={handleSearchChange}
          placeholderTextColor={THEME.muted}
        />
        {articleQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => setArticleQuery('')}
            style={styles.clearButton}
          >
            <Ionicons name="close-circle" size={20} color={THEME.muted} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  ), [articleQuery, handleSearchChange, shimmer]);

  const renderEmpty = useCallback(() => (
    <View style={styles.emptyContainer}>
      <Ionicons name="document-outline" size={48} color={THEME.muted} />
      <Text style={styles.emptyTitle}>Статьи не найдены</Text>
      <Text style={styles.emptyText}>
        Попробуйте изменить поисковый запрос
      </Text>
    </View>
  ), []);

  const keyExtractor = useCallback((item: Article) => item.id, []);

  return (
    <View style={styles.container}>
      {Platform.OS === 'web' ? (
        <FlatList
          data={filteredArticles}
          renderItem={renderArticle}
          keyExtractor={keyExtractor}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmpty}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={100}
          initialNumToRender={5}
          windowSize={10}
        />
      ) : (
        <FlashList
          data={filteredArticles}
          renderItem={renderArticle}
          keyExtractor={keyExtractor}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmpty}
          estimatedItemSize={200}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          drawDistance={500}
          overrideItemLayout={(layout, _item) => {
            layout.size = 200;
          }}
        />
      )}
    </View>
  );
});

HomeScreen.displayName = 'HomeScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  listContainer: {
    paddingBottom: 20
  },
  header: {
    alignItems: 'center',
    marginTop: 6,
    paddingHorizontal: 20,
    paddingBottom: 20
  },
  titleContainer: {
    position: 'relative',
    alignItems: 'center'
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#023245',
    letterSpacing: 1
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    left: -100,
    width: 200,
    height: 44,
    borderRadius: 8,
    overflow: 'hidden'
  },
  shimmerGradient: {
    width: 200,
    height: 44
  },
  subtitle: {
    color: THEME.muted,
    marginTop: 6,
    fontWeight: '700'
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 10,
    width: '100%',
    maxWidth: 640,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 12
  },
  clearButton: {
    padding: 4
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

export default HomeScreen;