import React, { memo, useRef, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  SafeAreaView,
  ScrollView,
  TextInput,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { THEME, ARTICLES } from '../utils/constants';
import { responsiveWidth, responsiveHeight, responsivePadding, responsiveFontSize } from '../utils/responsive';

interface HomeScreenProps {
  onArticlePress: (article: any) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = memo(({ onArticlePress }) => {
  // Состояние для поиска
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredArticles, setFilteredArticles] = useState(ARTICLES.filter(article => 
    article.id.startsWith('main')
  ));

  // Анимации
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    // Начальные анимации
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Функция поиска
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredArticles(ARTICLES.filter(article => article.id.startsWith('main')));
    } else {
      const filtered = ARTICLES.filter(article => 
        article.id.startsWith('main') && (
          article.title.toLowerCase().includes(query.toLowerCase()) ||
          article.excerpt.toLowerCase().includes(query.toLowerCase()) ||
          article.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        )
      );
      setFilteredArticles(filtered);
    }
  };

  // Функция для отображения тегов
  const renderTags = (tags: string[]) => (
    <View style={styles.tagsContainer}>
      {tags.map((tag, index) => (
        <View key={index} style={styles.tag}>
          <Text style={styles.tagText}>{tag}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[THEME.bgTop, THEME.bgMid, THEME.bgBottom]}
        style={styles.gradient}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim }
              ]
            }
          ]}>
            {/* Заголовок и слоган */}
            <View style={styles.headerSection}>
              <Text style={styles.title}>РЕБА</Text>
              <Text style={styles.slogan}>помощь ближе чем кажется</Text>
            </View>

            {/* Поисковая строка */}
            <View style={styles.searchSection}>
              <BlurView intensity={20} tint="light" style={styles.searchBlur}>
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0.2)']}
                  style={styles.searchGradient}
                >
                  <Ionicons name="search" size={20} color="#81D4FA" style={styles.searchIcon} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Поиск статей..."
                    placeholderTextColor="#999"
                    value={searchQuery}
                    onChangeText={handleSearch}
                  />
                </LinearGradient>
              </BlurView>
            </View>

            {/* Секция статей */}
            <View style={styles.articlesSection}>
              <Text style={styles.sectionTitle}>Статьи о реабилитации</Text>
              
              {filteredArticles.map((article) => (
                <TouchableOpacity
                  key={article.id}
                  style={styles.articleCard}
                  onPress={() => onArticlePress(article)}
                  activeOpacity={0.8}
                >
                  <BlurView intensity={20} tint="light" style={styles.articleBlur}>
                    <LinearGradient
                      colors={['rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0.2)']}
                      style={styles.articleGradient}
                    >
                      {/* Горизонтальная обложка на всю ширину */}
                      <View style={styles.articleImageContainer}>
                        <Image source={{ uri: article.image }} style={styles.articleImage} />
                        <View style={styles.imageOverlay}>
                          <LinearGradient
                            colors={['transparent', 'rgba(0, 0, 0, 0.3)']}
                            style={styles.imageGradient}
                          />
                        </View>
                        {/* Теги внизу картинки */}
                        <View style={styles.tagsOverlay}>
                          {renderTags(article.tags)}
                        </View>
                      </View>
                      
                      {/* Контент статьи */}
                      <View style={styles.articleContent}>
                        <Text style={styles.articleTitle}>{article.title}</Text>
                        <Text style={styles.articleExcerpt}>{article.excerpt}</Text>
                        <View style={styles.readMoreContainer}>
                          <Text style={styles.readMoreText}>Читать</Text>
                          <Ionicons name="arrow-forward" size={16} color="#81D4FA" />
                        </View>
                      </View>
                    </LinearGradient>
                  </BlurView>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: responsiveHeight(100),
  },
  content: {
    paddingHorizontal: responsivePadding(20),
    paddingTop: responsivePadding(20),
  },

  // Заголовок и слоган
  headerSection: {
    alignItems: 'center',
    marginBottom: responsivePadding(32),
  },
  title: {
    fontSize: responsiveFontSize(48),
    fontWeight: '900',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: responsivePadding(8),
    letterSpacing: responsiveWidth(-1),
  },
  slogan: {
    fontSize: responsiveFontSize(18),
    fontWeight: '500',
    color: '#666',
    textAlign: 'center',
    letterSpacing: responsiveWidth(0.5),
  },

  // Поисковая строка
  searchSection: {
    marginBottom: responsivePadding(32),
  },
  searchBlur: {
    borderRadius: responsiveWidth(16),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: responsiveHeight(2) },
    shadowOpacity: 0.1,
    shadowRadius: responsiveWidth(8),
    elevation: 4,
  },
  searchGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsivePadding(16),
    paddingVertical: responsivePadding(12),
  },
  searchIcon: {
    marginRight: responsivePadding(12),
  },
  searchInput: {
    flex: 1,
    fontSize: responsiveFontSize(16),
    color: '#1a1a1a',
  },

  // Секция статей
  articlesSection: {
    marginBottom: responsivePadding(32),
  },
  sectionTitle: {
    fontSize: responsiveFontSize(24),
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: responsivePadding(20),
    textAlign: 'center',
  },

  // Карточка статьи
  articleCard: {
    marginBottom: responsivePadding(20),
    borderRadius: responsiveWidth(16),
    overflow: 'hidden',
  },
  articleBlur: {
    borderRadius: responsiveWidth(16),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: responsiveHeight(4) },
    shadowOpacity: 0.15,
    shadowRadius: responsiveWidth(12),
    elevation: 6,
  },
  articleGradient: {
    padding: 0,
  },
  articleImageContainer: {
    position: 'relative',
    height: responsiveHeight(180),
    width: '100%',
  },
  articleImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: responsiveHeight(60),
  },
  imageGradient: {
    flex: 1,
  },
  tagsOverlay: {
    position: 'absolute',
    bottom: responsivePadding(12),
    left: responsivePadding(16),
    right: responsivePadding(16),
  },
  articleContent: {
    padding: responsivePadding(20),
  },
  articleTitle: {
    fontSize: responsiveFontSize(18),
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: responsivePadding(8),
    lineHeight: responsiveFontSize(24),
  },
  articleExcerpt: {
    fontSize: responsiveFontSize(14),
    color: '#666',
    marginBottom: responsivePadding(16),
    lineHeight: responsiveFontSize(20),
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: responsivePadding(8),
    paddingVertical: responsivePadding(4),
    borderRadius: responsiveWidth(12),
    marginRight: responsivePadding(6),
    marginBottom: responsivePadding(4),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: responsiveHeight(1) },
    shadowOpacity: 0.1,
    shadowRadius: responsiveWidth(2),
    elevation: 2,
  },
  tagText: {
    fontSize: responsiveFontSize(11),
    color: '#81D4FA',
    fontWeight: '600',
  },
  readMoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readMoreText: {
    fontSize: responsiveFontSize(14),
    color: '#81D4FA',
    fontWeight: '600',
    marginRight: responsivePadding(4),
  },
});

export default HomeScreen;