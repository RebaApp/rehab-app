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
import AnimatedBanner from '../components/AnimatedBanner';

interface HomeScreenProps {
  onArticlePress: (article: any) => void;
  onShowArticles: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = memo(({ onArticlePress, onShowArticles }) => {
  // Состояние для поиска
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredArticles, setFilteredArticles] = useState(ARTICLES.filter(article => 
    article.id.startsWith('main')
  ));
  const [showBanner, setShowBanner] = useState(true);
  
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

  // Функция поиска - улучшенная версия
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      // Показываем только основные статьи на главной странице
      setFilteredArticles(ARTICLES.filter(article => article.id.startsWith('main')));
    } else {
      // Ищем по всем статьям, включая содержимое
      const filtered = ARTICLES.filter(article => {
        const searchTerm = query.toLowerCase();
        return (
          article.title.toLowerCase().includes(searchTerm) ||
          article.excerpt.toLowerCase().includes(searchTerm) ||
          article.body.toLowerCase().includes(searchTerm) ||
          article.category.toLowerCase().includes(searchTerm) ||
          (article.tags && article.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
        );
      });
      setFilteredArticles(filtered);
    }
  };

  // Функция для отображения тегов
  const renderTags = (tags: string[]) => (
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

  return (
    <SafeAreaView style={styles.container}>
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
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {searchQuery.trim() === '' 
                  ? 'Полезное чтиво' 
                  : `Результаты поиска (${filteredArticles.length})`
                }
              </Text>
              {searchQuery.trim() === '' && (
                <TouchableOpacity style={styles.allArticlesButton} onPress={onShowArticles}>
                  <LinearGradient
                    colors={['#81D4FA', '#42A5F5']}
                    style={styles.allArticlesGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.allArticlesText}>Все статьи</Text>
                    <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>
            
            {filteredArticles.length === 0 && searchQuery.trim() !== '' ? (
              <View style={styles.noResultsContainer}>
                <Ionicons name="search" size={48} color="#81D4FA" />
                <Text style={styles.noResultsTitle}>Ничего не найдено</Text>
                <Text style={styles.noResultsText}>
                  Попробуйте изменить поисковый запрос или поищите по другим ключевым словам
                </Text>
              </View>
            ) : (
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
                          <LinearGradient
                            colors={['#81D4FA', '#42A5F5']}
                            style={styles.readMoreGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                          >
                            <Text style={styles.readMoreText}>Читать</Text>
                            <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                          </LinearGradient>
                        </View>
                      </View>
                    </LinearGradient>
                  </BlurView>
                </TouchableOpacity>
              ))
            )}
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
    paddingTop: responsiveHeight(180), // Отступ для баннера
    alignItems: 'flex-start', // Выравнивание по левой стороне
  },
  content: {
    paddingTop: responsivePadding(20),
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
    borderWidth: 2, // Добавляем границу
    borderColor: 'rgba(129, 212, 250, 0.3)', // Светло-голубая граница
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: responsivePadding(12),
    paddingHorizontal: responsivePadding(4),
  },
  sectionTitle: {
    fontSize: responsiveFontSize(16), // Уменьшен с 24 до 16
    fontWeight: '700',
    color: '#1a1a1a',
    flex: 1,
    textAlign: 'left',
  },
  allArticlesButton: {
    borderRadius: responsiveWidth(16),
    overflow: 'hidden',
  },
  allArticlesGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: responsivePadding(16),
    paddingVertical: responsivePadding(8),
  },
  allArticlesText: {
    fontSize: responsiveFontSize(14),
    color: '#FFFFFF', // Белый текст на градиенте
    fontWeight: '700',
    marginRight: responsivePadding(4),
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
    paddingHorizontal: responsivePadding(8),
    paddingVertical: responsivePadding(4),
  },
  tagText: {
    fontSize: responsiveFontSize(11),
    color: '#FFFFFF', // Белый текст на градиенте
    fontWeight: '700',
  },
  readMoreContainer: {
    justifyContent: 'flex-start', // Выравнивание по левой стороне
    paddingHorizontal: responsivePadding(8), // Минимальные отступы только для навигации
    marginTop: responsivePadding(8),
  },
  readMoreGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: responsivePadding(12),
    paddingVertical: responsivePadding(6),
    borderRadius: responsiveWidth(16),
    alignSelf: 'flex-start', // Выравнивание по левой стороне
  },
  readMoreText: {
    fontSize: responsiveFontSize(14),
    color: '#FFFFFF', // Белый текст на градиенте
    fontWeight: '700',
    marginRight: responsivePadding(4),
  },
  
  // Стили для сообщения "Ничего не найдено"
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: responsivePadding(40),
    paddingHorizontal: responsivePadding(20),
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