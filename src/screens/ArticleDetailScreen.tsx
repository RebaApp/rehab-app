import React, { memo, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Article } from '../types';
import { THEME } from '../utils/constants';
import { responsiveWidth, responsiveHeight, responsivePadding, responsiveFontSize } from '../utils/responsive';

interface ArticleDetailScreenProps {
  article: Article;
  onClose: () => void;
}

const ArticleDetailScreen: React.FC<ArticleDetailScreenProps> = memo(({
  article,
  onClose
}) => {
  // Анимация для скроллинга
  const scrollY = useRef(new Animated.Value(0)).current;

  const formattedDate = article.createdAt 
    ? new Date(article.createdAt).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : 'Недавно';

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[THEME.bgTop, THEME.bgMid, THEME.bgBottom]}
        style={styles.gradient}
      >
        {/* Заголовок с эффектом жидкого стекла и анимацией */}
        <Animated.View style={[
          styles.header,
          {
            transform: [{
              translateY: scrollY.interpolate({
                inputRange: [0, 100],
                outputRange: [0, -100],
                extrapolate: 'clamp',
              })
            }],
            opacity: scrollY.interpolate({
              inputRange: [0, 50, 100],
              outputRange: [1, 0.5, 0],
              extrapolate: 'clamp',
            })
          }
        ]}>
          <BlurView intensity={25} tint="light" style={styles.headerBlur}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0.2)']}
              style={styles.headerGradient}
            >
              <TouchableOpacity style={styles.backButton} onPress={onClose}>
                <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Статья</Text>
              <View style={styles.placeholder} />
            </LinearGradient>
          </BlurView>
        </Animated.View>

        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        >
          {/* Изображение статьи */}
          <View style={styles.imageContainer}>
            <Image source={article.image} style={styles.image} />
            <View style={styles.imageOverlay}>
              <LinearGradient
                colors={['transparent', 'rgba(0, 0, 0, 0.3)']}
                style={styles.imageGradient}
              />
            </View>
          </View>

          {/* Контент статьи */}
          <View style={styles.textContainer}>
            <BlurView intensity={20} tint="light" style={styles.contentBlur}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0.2)']}
                style={styles.contentGradient}
              >
                <Text style={styles.title}>{article.title}</Text>
                <Text style={styles.excerpt}>{article.excerpt}</Text>
                
                {/* Теги статьи */}
                {article.tags && (
                  <View style={styles.tagsContainer}>
                    {article.tags.map((tag, index) => (
                      <TouchableOpacity key={index} style={styles.tag}>
                        <LinearGradient
                          colors={['#81D4FA', '#42A5F5']}
                          style={styles.tagGradient}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                        >
                          <Text style={styles.tagText}>{tag}</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
                
                <Text style={styles.body}>
                  {article.body || article.content || 'Содержимое статьи недоступно.'}
                </Text>
              </LinearGradient>
            </BlurView>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.bgTop,
  },
  gradient: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingTop: responsiveHeight(8), // МИНИМАЛЬНЫЙ отступ от верха экрана
    paddingHorizontal: responsivePadding(8),
  },
  headerBlur: {
    borderRadius: responsiveWidth(16),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: responsiveHeight(2) },
    shadowOpacity: 0.1,
    shadowRadius: responsiveWidth(8),
    elevation: 4,
  },
  headerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start', // Выравнивание по левой стороне
    paddingHorizontal: responsivePadding(8), // Уменьшили отступы
    paddingVertical: responsivePadding(12),
  },
  backButton: {
    padding: responsivePadding(8),
    borderRadius: responsiveWidth(20),
    backgroundColor: 'rgba(129, 212, 250, 0.2)',
  },
  headerTitle: {
    fontSize: responsiveFontSize(18),
    fontWeight: '600',
    color: '#1a1a1a',
    marginLeft: responsivePadding(12), // Отступ от стрелки назад
  },
  placeholder: {
    flex: 1, // Занимает оставшееся пространство
  },
  content: {
    flex: 1,
    paddingTop: responsiveHeight(80), // Уменьшили отступ для заголовка
  },
  imageContainer: {
    height: responsiveHeight(250),
    marginHorizontal: responsivePadding(2),
    marginTop: responsivePadding(8), // Уменьшили отступ сверху
    borderRadius: responsiveWidth(16),
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
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
  textContainer: {
    padding: responsivePadding(4),
  },
  contentBlur: {
    borderRadius: responsiveWidth(16),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: responsiveHeight(4) },
    shadowOpacity: 0.15,
    shadowRadius: responsiveWidth(12),
    elevation: 6,
  },
  contentGradient: {
    padding: responsivePadding(8),
  },
  title: {
    fontSize: responsiveFontSize(28),
    fontWeight: '700',
    color: '#1a1a1a',
    lineHeight: responsiveFontSize(36),
    marginBottom: responsivePadding(16),
  },
  excerpt: {
    fontSize: responsiveFontSize(16),
    color: '#2c2c2c',
    lineHeight: responsiveFontSize(24),
    marginBottom: responsivePadding(20),
    fontStyle: 'italic',
    backgroundColor: 'rgba(129, 212, 250, 0.08)',
    padding: responsivePadding(16),
    borderRadius: responsiveWidth(12),
    borderLeftWidth: 4,
    borderLeftColor: '#81D4FA',
    borderRightWidth: 1,
    borderRightColor: 'rgba(129, 212, 250, 0.2)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(129, 212, 250, 0.2)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(129, 212, 250, 0.2)',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: responsivePadding(20),
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
    paddingVertical: responsivePadding(6),
  },
  tagText: {
    fontSize: responsiveFontSize(11),
    color: '#FFFFFF',
    fontWeight: '700',
  },
  body: {
    fontSize: responsiveFontSize(16),
    color: '#2c2c2c',
    lineHeight: responsiveFontSize(26),
    textAlign: 'left',
  },
});

export default ArticleDetailScreen;
