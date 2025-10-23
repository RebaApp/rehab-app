import React, { memo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
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
        {/* Заголовок с эффектом жидкого стекла */}
        <View style={styles.header}>
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
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Изображение статьи */}
          <View style={styles.imageContainer}>
            <Image source={{ uri: article.image }} style={styles.image} />
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
                
                <View style={styles.metaContainer}>
                  <View style={styles.metaItem}>
                    <Ionicons name="calendar-outline" size={16} color="#666" />
                    <Text style={styles.metaText}>{formattedDate}</Text>
                  </View>
                  {article.author && (
                    <View style={styles.metaItem}>
                      <Ionicons name="person-outline" size={16} color="#666" />
                      <Text style={styles.metaText}>{article.author}</Text>
                    </View>
                  )}
                </View>

                <Text style={styles.excerpt}>{article.excerpt}</Text>
                
                {/* Теги статьи */}
                {article.tags && (
                  <View style={styles.tagsContainer}>
                    {article.tags.map((tag, index) => (
                      <View key={index} style={styles.tag}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
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
    paddingHorizontal: responsivePadding(20),
    paddingVertical: responsivePadding(15),
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
    justifyContent: 'space-between',
    paddingHorizontal: responsivePadding(16),
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
  },
  placeholder: {
    width: responsiveWidth(40),
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    height: responsiveHeight(250),
    marginHorizontal: responsivePadding(20),
    marginTop: responsivePadding(20),
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
    padding: responsivePadding(20),
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
    padding: responsivePadding(24),
  },
  title: {
    fontSize: responsiveFontSize(24),
    fontWeight: '700',
    color: '#1a1a1a',
    lineHeight: responsiveFontSize(32),
    marginBottom: responsivePadding(15),
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsivePadding(15),
    gap: responsivePadding(20),
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsivePadding(6),
  },
  metaText: {
    fontSize: responsiveFontSize(14),
    color: '#666',
    fontWeight: '500',
  },
  excerpt: {
    fontSize: responsiveFontSize(16),
    color: '#1a1a1a',
    lineHeight: responsiveFontSize(24),
    marginBottom: responsivePadding(20),
    fontStyle: 'italic',
    backgroundColor: 'rgba(129, 212, 250, 0.1)',
    padding: responsivePadding(15),
    borderRadius: responsiveWidth(12),
    borderLeftWidth: 4,
    borderLeftColor: '#81D4FA',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: responsivePadding(20),
  },
  tag: {
    backgroundColor: 'rgba(129, 212, 250, 0.2)',
    paddingHorizontal: responsivePadding(12),
    paddingVertical: responsivePadding(6),
    borderRadius: responsiveWidth(16),
    marginRight: responsivePadding(8),
    marginBottom: responsivePadding(8),
  },
  tagText: {
    fontSize: responsiveFontSize(12),
    color: '#81D4FA',
    fontWeight: '600',
  },
  body: {
    fontSize: responsiveFontSize(16),
    color: '#1a1a1a',
    lineHeight: responsiveFontSize(26),
    textAlign: 'justify',
  },
});

export default ArticleDetailScreen;
