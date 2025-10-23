import React, { memo, useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
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
import AnimatedBanner from '../components/AnimatedBanner';

interface HomeScreenProps {
  onArticlePress: (article: any) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = memo(({ onArticlePress }) => {
  // Состояние для поиска и фильтрации
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [filteredArticles, setFilteredArticles] = useState(() => {
    const articles = ARTICLES.filter(article => article.id.startsWith('main'));
    console.log('Загруженные статьи:', articles.map(a => ({ id: a.id, title: a.title, tags: a.tags })));
    return articles;
  });
  const [showBanner] = useState(true);

  // Получаем все уникальные теги для фильтрации
  const allTags = Array.from(new Set(
    ARTICLES.filter(article => article.id.startsWith('main'))
      .flatMap(article => article.tags || [])
  ));
  
  // Анимация для скроллинга
  const scrollY = useRef(new Animated.Value(0)).current;

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
      if (rotateAnim) {
      rotateAnim.setValue(0);
        Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
            duration: 8000, // 8 секунд на полный оборот - очень медленно
        useNativeDriver: true,
          }),
          { iterations: -1 } // бесконечно
        ).start();
      }
    };

    // Запускаем вращение с небольшой задержкой после появления
    setTimeout(startRotation, 1200);
  }, []);

  // Функция поиска и фильтрации
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFilters(query, selectedTag);
  };

  const handleTagFilter = (tag: string) => {
    setSelectedTag(tag);
    applyFilters(searchQuery, tag);
  };

  const applyFilters = (query: string, tag: string) => {
    let filtered = ARTICLES.filter(article => article.id.startsWith('main'));

    // Фильтр по поисковому запросу
    if (query.trim() !== '') {
      filtered = filtered.filter(article => {
        const searchTerm = query.toLowerCase();
        return (
          article.title.toLowerCase().includes(searchTerm) ||
          article.excerpt.toLowerCase().includes(searchTerm) ||
          (article.body && article.body.toLowerCase().includes(searchTerm)) ||
          (article.category && article.category.toLowerCase().includes(searchTerm)) ||
          (article.tags && article.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
        );
      });
    }

    // Фильтр по тегу
    if (tag !== '') {
      filtered = filtered.filter(article => 
        article.tags && article.tags.includes(tag)
      );
    }

    setFilteredArticles(filtered);
  };

  // Функция для отображения тегов
  const renderTags = (tags: string[] | undefined) => {
    if (!tags || !Array.isArray(tags) || tags.length === 0) {
      return null;
    }
    
    return (
      <View style={styles.tagsContainer}>
        {tags.map((tag, index) => (
          <View key={index} style={styles.tag}>
            <LinearGradient
              colors={['#81D4FA', '#42A5F5']}
              style={styles.tagGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.tagText}>{tag}</Text>
            </LinearGradient>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[THEME.bgTop, THEME.bgMid, THEME.bgBottom]}
        style={styles.gradient}
      >
        {/* Анимированный баннер */}
        <AnimatedBanner scrollY={scrollY} isVisible={showBanner} />
        
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        >
          {/* Поисковая строка с фильтрацией */}
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
                  autoCorrect={false}
                  autoCapitalize="none"
                  returnKeyType="search"
                  clearButtonMode="while-editing"
                />
                </LinearGradient>
              </BlurView>
            </View>

          {/* Фильтрация по тегам */}
          <View style={styles.filtersSection}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filtersContainer}
            >
              <TouchableOpacity 
                style={[styles.filterTag, selectedTag === '' && styles.filterTagActive]}
                onPress={() => handleTagFilter('')}
              >
                <Text style={[styles.filterTagText, selectedTag === '' && styles.filterTagTextActive]}>
                  Все темы
                </Text>
              </TouchableOpacity>
              {allTags.map((tag, index) => (
              <TouchableOpacity 
                  key={index}
                  style={[styles.filterTag, selectedTag === tag && styles.filterTagActive]}
                  onPress={() => handleTagFilter(tag)}
                >
                  <Text style={[styles.filterTagText, selectedTag === tag && styles.filterTagTextActive]}>
                    {tag}
                  </Text>
              </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Секция статей - ВО ВСЮ ШИРИНУ ЭКРАНА */}
          <View style={styles.articlesSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {searchQuery.trim() === '' && selectedTag === ''
                  ? 'Полезное чтиво' 
                  : `Результаты поиска (${filteredArticles.length})`
                }
              </Text>
            </View>
            
            {filteredArticles.length === 0 && (searchQuery.trim() !== '' || selectedTag !== '') ? (
              <View style={styles.noResultsContainer}>
                <Ionicons name="search" size={48} color="#81D4FA" />
                <Text style={styles.noResultsTitle}>Ничего не найдено</Text>
                <Text style={styles.noResultsText}>
                  Попробуйте изменить поисковый запрос или выбрать другую тему
                </Text>
              </View>
            ) : (
              filteredArticles && filteredArticles.length > 0 ? (
                filteredArticles.map((article) => (
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
                          <Image source={article.image} style={styles.articleImage} />
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
                        </View>
                  </LinearGradient>
                </BlurView>
              </TouchableOpacity>
                ))
              ) : null
            )}
            </View>
        </ScrollView>
      </LinearGradient>
    </View>
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
    paddingBottom: responsiveHeight(100), // Возвращено обратно
    paddingTop: responsiveHeight(180), // Возвращено обратно
    paddingHorizontal: responsivePadding(0), // МИНИМАЛЬНЫЙ ОТСТУП ОТ КРАЕВ ЭКРАНА ДЛЯ ВСЕЙ СТРАНИЦЫ
    alignItems: 'stretch', // Растягиваем элементы на всю ширину
  },
  content: {
    paddingTop: responsivePadding(20), // Возвращено обратно
  },

  // Поисковая строка - НА ВСЮ ШИРИНУ ЭКРАНА
  searchSection: {
    marginBottom: responsivePadding(16), // Возвращено обратно
    paddingHorizontal: 0, // БЕЗ отступов - на всю ширину
    width: '100%', // Принудительно на всю ширину
    alignSelf: 'stretch', // Растягиваем на всю ширину
  },
  searchBlur: {
    borderRadius: responsiveWidth(20), // Более округлые углы
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: responsiveHeight(4) }, // Более глубокая тень
    shadowOpacity: 0.2, // Более заметная тень
    shadowRadius: responsiveWidth(12), // Больший радиус тени
    elevation: 8, // Большая высота
    borderWidth: 2, // Добавляем границу
    borderColor: 'rgba(129, 212, 250, 0.3)', // Светло-голубая граница
    width: '100%', // Принудительно на всю ширину
    alignSelf: 'stretch', // Растягиваем на всю ширину
  },
  searchGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: responsivePadding(12),
    width: '100%',
    flex: 1,
  },
  searchIcon: {
    marginRight: responsivePadding(16), // Увеличили отступ от текста
  },
  searchInput: {
    flex: 1,
    fontSize: responsiveFontSize(16),
    color: '#1a1a1a',
    width: '100%', // Принудительно на всю ширину
  },

  // Фильтрация по тегам
  filtersSection: {
    marginBottom: responsivePadding(16),
    width: '100%',
  },
  filtersContainer: {
    paddingHorizontal: responsivePadding(1), // Сокращено с 2 до 1 (горизонтально)
  },
  filterTag: {
    paddingHorizontal: responsivePadding(8), // Увеличили пространство для текста
    paddingVertical: responsivePadding(8), // Увеличили вертикальный отступ
    borderRadius: responsiveWidth(16),
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginRight: responsivePadding(2),
    borderWidth: 1,
    borderColor: 'rgba(129, 212, 250, 0.3)',
  },
  filterTagActive: {
    backgroundColor: 'rgba(129, 212, 250, 0.2)',
    borderColor: '#81D4FA',
  },
  filterTagText: {
    fontSize: responsiveFontSize(12),
    color: '#666',
    fontWeight: '600',
  },
  filterTagTextActive: {
    color: '#42A5F5',
    fontWeight: '700',
  },

  // Секция статей - БЕЗ ОТСТУПОВ, ВО ВСЮ ШИРИНУ ЭКРАНА
  articlesSection: {
    marginBottom: responsivePadding(16), // Минимальный отступ
    paddingHorizontal: 0, // БЕЗ отступов - во всю ширину
    alignItems: 'flex-start', // Выравнивание по левой стороне
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: responsivePadding(12),
    paddingHorizontal: responsivePadding(1), // Сокращено с 2 до 1 (горизонтально)
  },
  sectionTitle: {
    fontSize: responsiveFontSize(16), // Уменьшен с 24 до 16
    fontWeight: '700',
    color: '#1a1a1a',
    flex: 1,
    textAlign: 'left',
  },
  // Карточка статьи - БЕЗ ОТСТУПОВ
  articleCard: {
    marginBottom: responsivePadding(12), // Минимальный отступ
    borderRadius: responsiveWidth(8), // Минимальный радиус
    overflow: 'hidden',
    alignItems: 'flex-start', // Выравнивание по левой стороне
  },
  articleBlur: {
    borderRadius: responsiveWidth(8), // Минимальный радиус
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: responsiveHeight(2) }, // Минимальная тень
    shadowOpacity: 0.1, // Минимальная прозрачность
    shadowRadius: responsiveWidth(4), // Минимальный радиус тени
    elevation: 2, // Минимальная высота
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
    bottom: responsivePadding(8), // Минимальный отступ
    left: responsivePadding(8), // Минимальный отступ
    right: responsivePadding(8), // Минимальный отступ
    alignItems: 'flex-start', // Выравнивание тегов по левой стороне
  },
  articleContent: {
    paddingHorizontal: 0, // БЕЗ отступов
    paddingVertical: responsivePadding(8), // Минимальные отступы
    alignItems: 'flex-start', // Выравнивание по левой стороне
  },
  articleTitle: {
    fontSize: responsiveFontSize(18),
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: responsivePadding(8),
    lineHeight: responsiveFontSize(24),
    textAlign: 'left', // Выравнивание по левой стороне
    paddingHorizontal: responsivePadding(2), // Сокращено с 4 до 2 (горизонтально)
  },
  articleExcerpt: {
    fontSize: responsiveFontSize(14),
    color: '#666',
    marginBottom: responsivePadding(16),
    lineHeight: responsiveFontSize(20),
    textAlign: 'left', // Выравнивание по левой стороне
    paddingHorizontal: responsivePadding(2), // Сокращено с 4 до 2 (горизонтально)
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    borderRadius: responsiveWidth(12),
    marginRight: responsivePadding(6),
    marginBottom: responsivePadding(4),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: responsiveHeight(1) },
    shadowOpacity: 0.1,
    shadowRadius: responsiveWidth(2),
    elevation: 2,
  },
  tagGradient: {
    paddingHorizontal: responsivePadding(8), // Увеличили пространство для текста
    paddingVertical: responsivePadding(6), // Увеличили вертикальный отступ
  },
  tagText: {
    fontSize: responsiveFontSize(11),
    color: '#FFFFFF', // Белый текст на градиенте
    fontWeight: '700',
  },
  
  // Стили для сообщения "Ничего не найдено"
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: responsivePadding(40),
    paddingHorizontal: responsivePadding(5), // Сокращено с 10 до 5 (горизонтально)
  },
  noResultsTitle: {
    fontSize: responsiveFontSize(20),
    fontWeight: '700',
    color: '#1a1a1a',
    marginTop: responsivePadding(16),
    marginBottom: responsivePadding(8),
    textAlign: 'center',
  },
  noResultsText: {
    fontSize: responsiveFontSize(14),
    color: '#666',
    textAlign: 'center',
    lineHeight: responsiveFontSize(20),
  },
});

export default HomeScreen;