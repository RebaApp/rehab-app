import React, { memo, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ArticleCardProps } from '../../types';
import { THEME } from '../../utils/constants';
import OptimizedImage from './OptimizedImage';
import FormattedText from './FormattedText';

const ArticleCard: React.FC<ArticleCardProps> = memo(({
  item,
  onPress
}) => {
  const handlePress = useCallback(() => {
    onPress(item);
  }, [item, onPress]);

  const formattedDate = useMemo(() => {
    if (!item.createdAt) return 'Недавно';
    const date = new Date(item.createdAt);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }, [item.createdAt]);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={[THEME.bgTop, THEME.bgMid]}
        style={styles.gradient}
      >
        <View style={styles.imageContainer}>
          {typeof item.image === 'string' ? (
            <OptimizedImage
              uri={item.image}
              style={styles.image}
              priority={false}
              cachePolicy="memory"
              contentFit="cover"
              transition={150}
            />
          ) : (
            <Image
              source={item.image}
              style={styles.image}
            />
          )}
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          
          <FormattedText 
            text={item.excerpt} 
            maxLines={3}
            style={styles.excerpt}
          />

          <View style={styles.footer}>
            <View style={styles.authorContainer}>
              <Ionicons name="person-outline" size={14} color={THEME.muted} />
              <Text style={styles.author}>{item.author}</Text>
            </View>
            
            <View style={styles.dateContainer}>
              <Ionicons name="calendar-outline" size={14} color={THEME.muted} />
              <Text style={styles.date}>
                {formattedDate}
              </Text>
            </View>
          </View>

          <View style={styles.readMoreContainer}>
            <Text style={styles.readMoreText}>Читать далее</Text>
            <Ionicons name="arrow-forward" size={16} color={THEME.primary} />
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
});

ArticleCard.displayName = 'ArticleCard';

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, // Увеличиваем с 0.25 до 0.4 для более заметного эффекта
    shadowRadius: 12,
    elevation: 6,
  },
  gradient: {
    borderRadius: 16,
    overflow: 'hidden'
  },
  imageContainer: {
    position: 'relative',
    height: 200,
    width: '100%'
  },
  image: {
    width: '100%',
    height: '100%'
  },
  categoryBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: THEME.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16
  },
  categoryText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600'
  },
  content: {
    padding: 16
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    lineHeight: 24,
    marginBottom: 8
  },
  excerpt: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  author: {
    fontSize: 12,
    color: THEME.muted,
    marginLeft: 4
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  date: {
    fontSize: 12,
    color: THEME.muted,
    marginLeft: 4
  },
  readMoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8
  },
  readMoreText: {
    fontSize: 14,
    color: THEME.primary,
    fontWeight: '600',
    marginRight: 4
  }
});

export default ArticleCard;
