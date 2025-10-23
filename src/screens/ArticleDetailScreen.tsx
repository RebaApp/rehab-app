import React, { memo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Article } from '../types';
import { THEME } from '../utils/constants';
import OptimizedImage from '../components/common/OptimizedImage';
import FormattedText from '../components/common/FormattedText';

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
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color={THEME.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Статья</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.imageContainer}>
            <OptimizedImage
              uri={article.image}
              style={styles.image}
              priority={true}
              cachePolicy="memory"
              contentFit="cover"
              transition={200}
            />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.title}>{article.title}</Text>
            
            <View style={styles.metaContainer}>
              <View style={styles.metaItem}>
                <Ionicons name="calendar-outline" size={16} color={THEME.muted} />
                <Text style={styles.metaText}>{formattedDate}</Text>
              </View>
              {article.author && (
                <View style={styles.metaItem}>
                  <Ionicons name="person-outline" size={16} color={THEME.muted} />
                  <Text style={styles.metaText}>{article.author}</Text>
                </View>
              )}
            </View>

            <Text style={styles.excerpt}>{article.excerpt}</Text>
            
            <FormattedText 
              text={article.body || article.content || 'Содержимое статьи недоступно.'}
              style={styles.body}
            />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: THEME.textPrimary,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    height: 250,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: THEME.radius,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: THEME.textPrimary,
    lineHeight: 32,
    marginBottom: 15,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 20,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    color: THEME.muted,
    fontWeight: '500',
  },
  excerpt: {
    fontSize: 16,
    color: THEME.textPrimary,
    lineHeight: 24,
    marginBottom: 20,
    fontStyle: 'italic',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: THEME.primary,
  },
  body: {
    fontSize: 16,
    color: THEME.textPrimary,
    lineHeight: 26,
    textAlign: 'justify',
  },
});

export default ArticleDetailScreen;
