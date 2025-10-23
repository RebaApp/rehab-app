import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Article } from '../../types';
import { 
  AppleColors, 
  AppleTypography, 
  AppleSpacing, 
  AppleRadius, 
  AppleShadows,
  GlassStyles,
  AppleAnimations,
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from '../../styles/appleDesignSystem';

interface AppleArticleCardProps {
  article: Article;
  onPress: (article: Article) => void;
  index: number;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - AppleSpacing.lg * 2;

export const AppleArticleCard: React.FC<AppleArticleCardProps> = ({
  article,
  onPress,
  index,
}) => {
  const scaleValue = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: scaleValue }],
        },
      ]}
    >
      <TouchableOpacity
        onPress={() => onPress(article)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        style={styles.touchable}
      >
        <View style={styles.card}>
          {/* Изображение статьи */}
          <View style={styles.imageContainer}>
            {article.image ? (
              <Image
                source={{ uri: article.image }}
                style={styles.image}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.placeholderImage}>
                <Ionicons
                  name="newspaper-outline"
                  size={responsiveWidth(40)}
                  color={AppleColors.text.tertiary}
                />
              </View>
            )}
            
            {/* Категория */}
            {article.rubric && (
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{article.rubric}</Text>
              </View>
            )}
          </View>

          {/* Контент */}
          <View style={styles.content}>
            {/* Заголовок */}
            <Text style={styles.title} numberOfLines={2}>
              {article.title}
            </Text>

            {/* Описание */}
            {article.description && (
              <Text style={styles.description} numberOfLines={3}>
                {article.description}
              </Text>
            )}

            {/* Метаинформация */}
            <View style={styles.metaContainer}>
              <View style={styles.metaLeft}>
                {/* Автор */}
                {article.authorName && (
                  <View style={styles.authorContainer}>
                    <Ionicons
                      name="person-outline"
                      size={responsiveWidth(14)}
                      color={AppleColors.text.tertiary}
                    />
                    <Text style={styles.authorText}>{article.authorName}</Text>
                  </View>
                )}

              </View>

              {/* Читать далее */}
              <View style={styles.readMoreContainer}>
                <Text style={styles.readMoreText}>Читать</Text>
                <Ionicons
                  name="arrow-forward"
                  size={responsiveWidth(16)}
                  color={AppleColors.accent.blue}
                />
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: AppleSpacing.sm,
    marginHorizontal: 0,
  },
  touchable: {
    borderRadius: AppleRadius.md,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: AppleRadius.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    ...AppleShadows.small,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: responsiveHeight(200),
    backgroundColor: AppleColors.background.secondary,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppleColors.background.tertiary,
  },
  categoryBadge: {
    position: 'absolute',
    top: AppleSpacing.md,
    left: AppleSpacing.md,
    backgroundColor: AppleColors.accent.blue,
    paddingHorizontal: AppleSpacing.sm,
    paddingVertical: AppleSpacing.xs,
    borderRadius: AppleRadius.sm,
  },
  categoryText: {
    ...AppleTypography.caption1,
    color: AppleColors.text.inverse,
    fontWeight: '600',
  },
  content: {
    padding: AppleSpacing.xs,
  },
  title: {
    ...AppleTypography.title3,
    color: AppleColors.text.primary,
    marginBottom: 0,
  },
  description: {
    ...AppleTypography.body,
    color: AppleColors.text.secondary,
    marginBottom: 0,
    lineHeight: responsiveFontSize(22),
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 0,
  },
  authorText: {
    ...AppleTypography.caption1,
    color: AppleColors.text.tertiary,
    marginLeft: AppleSpacing.xs,
  },
  readMoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readMoreText: {
    ...AppleTypography.callout,
    color: AppleColors.accent.blue,
    fontWeight: '600',
    marginRight: AppleSpacing.xs,
  },
});
