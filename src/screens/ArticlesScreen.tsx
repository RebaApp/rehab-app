import React, { memo, useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Image,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { THEME, ARTICLES } from '../utils/constants';
import { responsiveWidth, responsiveHeight, responsivePadding, responsiveFontSize } from '../utils/responsive';
import ArticleDetailScreen from './ArticleDetailScreen';

interface ArticlesScreenProps {
  onArticlePress: (article: any) => void;
  onBackPress: () => void;
}

const ArticlesScreen: React.FC<ArticlesScreenProps> = memo(({
  onArticlePress,
  onBackPress
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredArticles, setFilteredArticles] = useState(ARTICLES.filter(article => 
    article.id.startsWith('main')
  ));
  const [selectedArticle, setSelectedArticle] = useState(null);

  // Анимации в стиле JourneyScreen
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Начальные анимации (fade, scale) - только один раз
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Бесконечная плавная анимация вращения
    const startRotation = () => {
      rotateAnim.setValue(0);
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 8000, // 8 секунд на полный оборот - очень медленно
          useNativeDriver: true,
        }),
        { iterations: -1 } // бесконечно
      ).start();
    };

    // Запускаем вращение с небольшой задержкой после появления
    setTimeout(startRotation, 1200);
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
          (article.tags && article.tags.some((tag: string) => 
            tag.toLowerCase().includes(query.toLowerCase())
          ))
        )
      );
      setFilteredArticles(filtered);
    }
  };

  // Обработчики для статей
  const handleArticlePress = (article: any) => {
    console.log('Article pressed in ArticlesScreen:', article.title);
    setSelectedArticle(article);
  };

  const handleCloseArticle = () => {
    setSelectedArticle(null);
  };

  // Функция рендера тегов
  const renderTags = (tags: string[]) => {
    if (!tags || tags.length === 0) return null;
    
    return (
      <View style={styles.tagsContainer}>
        {tags.map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>
    );
  };

  // Если выбрана статья, показываем детальный экран
  if (selectedArticle) {
    return (
      <ArticleDetailScreen
        article={selectedArticle}
        onClose={handleCloseArticle}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[THEME.bgTop, THEME.bgMid, THEME.bgBottom]}
        style={styles.gradient}
      >
        {/* Заголовок с кнопкой назад */}
        <Animated.View style={[styles.header, { 
          opacity: fadeAnim, 
          transform: [{ scale: scaleAnim }] 
        }]}>
          <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
            <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Полезное чтиво</Text>
          <View style={styles.placeholder} />
        </Animated.View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Поисковая строка */}
          <View style={styles.searchSection}>
            <BlurView intensity={20} tint="light" style={styles.searchBlur}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.6)', 'rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)']}
                style={styles.searchGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
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

          {/* Секция статей - ВО ВСЮ ШИРИНУ ЭКРАНА */}
          <View style={styles.articlesSection}>
            {filteredArticles.map((article) => (
              <TouchableOpacity
                key={article.id}
                style={styles.articleCard}
                onPress={() => handleArticlePress(article)}
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
    alignItems: 'flex-start', // Выравнивание по левой стороне
  },

  // Заголовок с кнопкой назад
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: responsivePadding(16),
    paddingVertical: responsivePadding(12),
    marginBottom: responsivePadding(16),
  },
  backButton: {
    width: responsiveWidth(40),
    height: responsiveWidth(40),
    borderRadius: responsiveWidth(20),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: responsiveFontSize(20),
    fontWeight: '700',
    color: '#1a1a1a',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: responsiveWidth(40),
  },

  // Поисковая строка - НА ВСЮ ШИРИНУ ЭКРАНА
  searchSection: {
    marginBottom: responsivePadding(16), // Минимальный отступ
    paddingHorizontal: 0, // БЕЗ отступов - на всю ширину
  },
  searchBlur: {
    borderRadius: responsiveWidth(20), // Более округлые углы
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: responsiveHeight(4) }, // Более глубокая тень
    shadowOpacity: 0.2, // Более заметная тень
    shadowRadius: responsiveWidth(12), // Больший радиус тени
    elevation: 8, // Большая высота
    marginHorizontal: responsivePadding(8), // Небольшие отступы для красоты
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

  // Секция статей - БЕЗ ОТСТУПОВ, ВО ВСЮ ШИРИНУ ЭКРАНА
  articlesSection: {
    marginBottom: responsivePadding(16), // Минимальный отступ
    paddingHorizontal: 0, // БЕЗ отступов - во всю ширину
    alignItems: 'flex-start', // Выравнивание по левой стороне
  },

  // Карточка статьи - БЕЗ ОТСТУПОВ
  articleCard: {
    marginBottom: responsivePadding(12), // Минимальный отступ
    borderRadius: responsiveWidth(8), // Минимальный радиус
    overflow: 'hidden',
    alignItems: 'flex-start', // Выравнивание по левой стороне
    width: '100%', // Во всю ширину
  },
  articleBlur: {
    borderRadius: responsiveWidth(8), // Минимальный радиус
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: responsiveHeight(2) }, // Минимальная тень
    shadowOpacity: 0.1, // Минимальная прозрачность
    shadowRadius: responsiveWidth(4), // Минимальный радиус тени
    elevation: 2, // Минимальная высота
    width: '100%', // Во всю ширину
  },
  articleGradient: {
    padding: 0,
    width: '100%', // Во всю ширину
  },
  articleImageContainer: {
    position: 'relative',
    height: responsiveHeight(180),
    width: '100%', // Во всю ширину
  },
  articleImage: {
    width: '100%', // Во всю ширину
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
    bottom: responsivePadding(8), // Минимальный отступ
    left: responsivePadding(8), // Минимальный отступ
    right: responsivePadding(8), // Минимальный отступ
    alignItems: 'flex-start', // Выравнивание тегов по левой стороне
  },
  articleContent: {
    paddingHorizontal: 0, // БЕЗ отступов
    paddingVertical: responsivePadding(8), // Минимальные отступы
    alignItems: 'flex-start', // Выравнивание по левой стороне
    width: '100%', // Во всю ширину
  },
  articleTitle: {
    fontSize: responsiveFontSize(18),
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: responsivePadding(8),
    lineHeight: responsiveFontSize(24),
    textAlign: 'left', // Выравнивание по левой стороне
    paddingHorizontal: responsivePadding(8), // Минимальные отступы только для текста
  },
  articleExcerpt: {
    fontSize: responsiveFontSize(14),
    color: '#666',
    marginBottom: responsivePadding(16),
    lineHeight: responsiveFontSize(20),
    textAlign: 'left', // Выравнивание по левой стороне
    paddingHorizontal: responsivePadding(8), // Минимальные отступы только для текста
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
    justifyContent: 'flex-start', // Выравнивание по левой стороне
    paddingHorizontal: responsivePadding(8), // Минимальные отступы только для навигации
  },
  readMoreText: {
    fontSize: responsiveFontSize(14),
    color: '#81D4FA',
    fontWeight: '600',
    marginRight: responsivePadding(4),
  },
});

export default ArticlesScreen;
