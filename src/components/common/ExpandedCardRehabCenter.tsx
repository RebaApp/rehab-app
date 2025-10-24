import React, { memo, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { RehabCenter } from '../../types';
import { THEME } from '../../utils/constants';
import { responsiveWidth, responsiveHeight, responsivePadding } from '../../utils/responsive';

interface ExpandedCardRehabCenterProps {
  center: RehabCenter;
  onOpen: (center: RehabCenter) => void;
  onToggleFavorite?: (centerId: string) => void;
  isFavorite?: boolean;
  showDistance?: boolean;
}

const ExpandedCardRehabCenter: React.FC<ExpandedCardRehabCenterProps> = memo(({
  center,
  onOpen,
  onToggleFavorite,
  isFavorite = false,
  showDistance = false
}) => {
  const handlePress = useCallback(() => {
    onOpen(center);
  }, [center, onOpen]);


  const handleFavoritePress = useCallback(() => {
    if (!onToggleFavorite) return;
    onToggleFavorite(center.id);
  }, [center.id, onToggleFavorite]);


  const formattedPrice = useMemo(() => {
    if (center.priceFrom) {
      return `от ${center.priceFrom.toLocaleString('ru-RU')} ₽`;
    }
    return 'По запросу';
  }, [center.priceFrom]);

  const shortDescriptionTrimmed = useMemo(() => {
    if (!center.shortDescription) return '';
    return center.shortDescription.length > 120
      ? center.shortDescription.substring(0, 117) + '...'
      : center.shortDescription;
  }, [center.shortDescription]);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={`Реабилитационный центр ${center.name}`}
    >
      <BlurView intensity={20} tint="light" style={styles.cardBlur}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0.2)']}
          style={styles.cardGradient}
        >
          {/* Hero Image */}
          <View style={styles.imageContainer}>
            {typeof center.image === 'string' ? (
              <Image source={{ uri: center.image }} style={styles.image} />
            ) : (
              <Image source={center.image} style={styles.image} />
            )}
            
            {/* Overlay Gradient */}
            <View style={styles.imageOverlay}>
              <LinearGradient
                colors={['transparent', 'rgba(0, 0, 0, 0.3)']}
                style={styles.imageGradient}
              />
            </View>

            {/* Badges */}
            <View style={styles.badgesContainer}>
              <View style={styles.leftBadges}>
                {center.license && (
                  <View style={styles.licenseBadge}>
                    <LinearGradient
                      colors={['#81D4FA', '#42A5F5']}
                      style={styles.badgeGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      <Ionicons name="shield-checkmark" size={responsiveWidth(12)} color="#FFFFFF" />
                      <Text style={styles.badgeText}>Лицензия</Text>
                    </LinearGradient>
                  </View>
                )}

                {center.verification_status === 'verified' && (
                  <View style={styles.verifiedBadge}>
                    <LinearGradient
                      colors={['#81D4FA', '#42A5F5']}
                      style={styles.badgeGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      <Ionicons name="checkmark-circle" size={responsiveWidth(12)} color="#FFFFFF" />
                      <Text style={styles.badgeText}>Проверен</Text>
                    </LinearGradient>
                  </View>
                )}
              </View>

              {/* Rating Badge - современный дизайн */}
              {center.rating !== undefined && (
                <View style={styles.ratingBadgeOnImage}>
                  <LinearGradient
                    colors={['#81D4FA', '#42A5F5']} // Синий градиент как у тегов
                    style={styles.ratingBadgeGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Ionicons name="star" size={responsiveWidth(10)} color="#FFFFFF" />
                    <Text style={styles.ratingBadgeTextOnImage}>
                      {center.rating.toFixed(1)}
                    </Text>
                  </LinearGradient>
                </View>
              )}
            </View>

            {/* Favorite Button - современный дизайн */}
            {onToggleFavorite && (
              <TouchableOpacity
                style={styles.favoriteButton}
                onPress={handleFavoritePress}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                accessibilityLabel={isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
              >
                <View style={styles.favoriteButtonContainer}>
                  <LinearGradient
                    colors={isFavorite ? ['#ff6b6b', '#ff5252'] : ['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']}
                    style={styles.favoriteGradient}
                  >
                    <Ionicons
                      name={isFavorite ? "heart" : "heart-outline"}
                      size={responsiveWidth(18)}
                      color={isFavorite ? "#FFFFFF" : "#ff6b6b"}
                    />
                  </LinearGradient>
                </View>
              </TouchableOpacity>
            )}
          </View>

          {/* Content */}
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.name} numberOfLines={2}>
                {center.name}
              </Text>
            </View>

            {/* Location */}
            <View style={styles.locationContainer}>
              <Ionicons name="location-outline" size={responsiveWidth(16)} color="#0A84FF" />
              <Text style={styles.location} numberOfLines={1}>
                {center.location}
              </Text>
              {showDistance && center.distance !== undefined && (
                <Text style={styles.distance}>
                  {center.distance.toFixed(1)} км
                </Text>
              )}
            </View>

            {/* Description */}
            {shortDescriptionTrimmed.length > 0 && (
              <Text style={styles.description} numberOfLines={2}>
                {shortDescriptionTrimmed}
              </Text>
            )}

            {/* Tags */}
            {center.tags && center.tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {center.tags.slice(0, 3).map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <BlurView intensity={10} tint="light" style={styles.tagBlur}>
                      <LinearGradient
                        colors={['rgba(129, 212, 250, 0.3)', 'rgba(66, 165, 245, 0.2)']}
                        style={styles.tagGradient}
                      >
                        <Text style={styles.tagText}>{tag}</Text>
                      </LinearGradient>
                    </BlurView>
                  </View>
                ))}
                {center.tags.length > 3 && (
                  <Text style={styles.moreTags}>
                    +{center.tags.length - 3}
                  </Text>
                )}
              </View>
            )}

            {/* Footer */}
            <View style={styles.footer}>
              <View style={styles.priceDurationContainer}>
                <Text style={styles.price}>{formattedPrice}</Text>
                {center.duration && (
                  <Text style={styles.duration}>
                    {center.duration}
                  </Text>
                )}
              </View>
              {center.reviewsCount !== undefined && (
                <View style={styles.reviewsContainer}>
                  <Ionicons name="chatbubble-outline" size={responsiveWidth(12)} color="#0A84FF" />
                  <Text style={styles.reviewsText}>
                    {center.reviewsCount} отзывов
                  </Text>
                </View>
              )}
            </View>

          </View>
        </LinearGradient>
      </BlurView>
    </TouchableOpacity>
  );
});

ExpandedCardRehabCenter.displayName = 'ExpandedCardRehabCenter';

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 0, // Убираем горизонтальные отступы для полноэкранного отображения
    marginBottom: responsivePadding(20), // Увеличиваем отступ между карточками
    borderRadius: responsiveWidth(16), // Адаптивный радиус
    overflow: 'hidden',
    borderWidth: 0.5, // Тонкая рамка
    borderColor: 'rgba(129, 212, 250, 0.2)', // Светло-голубая рамка
    ...THEME.shadowMedium,
  },
  cardBlur: {
    borderRadius: responsiveWidth(16), // Адаптивный радиус
    overflow: 'hidden',
  },
  cardGradient: {
    borderRadius: responsiveWidth(16), // Адаптивный радиус
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: responsiveHeight(200),
    width: '100%',
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
  badgesContainer: {
    position: 'absolute',
    bottom: responsivePadding(12),
    left: responsivePadding(12),
    right: responsivePadding(12), // Добавляем правый отступ
    flexDirection: 'row',
    justifyContent: 'space-between', // Разделяем левые и правые теги
    alignItems: 'flex-end',
  },
  leftBadges: {
    flexDirection: 'row',
    gap: responsivePadding(8),
  },
  licenseBadge: {
    borderRadius: responsiveWidth(12),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: responsiveHeight(1) },
    shadowOpacity: 0.1,
    shadowRadius: responsiveWidth(2),
    elevation: 2,
  },
  verifiedBadge: {
    borderRadius: responsiveWidth(12),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: responsiveHeight(1) },
    shadowOpacity: 0.1,
    shadowRadius: responsiveWidth(2),
    elevation: 2,
  },
  badgeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsivePadding(8),
    paddingVertical: responsivePadding(6),
    gap: responsivePadding(4),
  },
  badgeText: {
    fontSize: responsiveWidth(10),
    fontWeight: '600',
    color: '#FFFFFF',
  },
  favoriteButton: {
    position: 'absolute',
    top: responsivePadding(12),
    right: responsivePadding(12),
    width: responsiveWidth(36),
    height: responsiveWidth(36),
    borderRadius: responsiveWidth(18),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: responsiveHeight(2) },
    shadowOpacity: 0.15,
    shadowRadius: responsiveWidth(4),
    elevation: 4,
  },
  favoriteButtonContainer: {
    flex: 1,
    borderRadius: responsiveWidth(18),
    overflow: 'hidden',
  },
  favoriteGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: responsiveWidth(18),
  },
  content: {
    padding: responsivePadding(16),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: responsivePadding(12),
  },
  name: {
    fontSize: responsiveWidth(18),
    fontWeight: '700',
    color: '#111827',
    flex: 1,
    marginRight: responsivePadding(12),
    lineHeight: responsiveWidth(22),
  },
  ratingBadgeOnImage: {
    borderRadius: responsiveWidth(10),
    overflow: 'hidden',
    shadowColor: '#42A5F5',
    shadowOffset: { width: 0, height: responsiveHeight(2) },
    shadowOpacity: 0.3,
    shadowRadius: responsiveWidth(3),
    elevation: 3,
  },
  ratingBadgeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsivePadding(6),
    paddingVertical: responsivePadding(4),
    gap: responsivePadding(2),
  },
  ratingBadgeTextOnImage: {
    fontSize: responsiveWidth(9),
    fontWeight: '700',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsivePadding(12),
  },
  location: {
    fontSize: responsiveWidth(14),
    color: '#374151',
    marginLeft: responsivePadding(8),
    flex: 1,
    fontWeight: '500',
  },
  distance: {
    fontSize: responsiveWidth(14),
    color: '#0A84FF',
    marginLeft: responsivePadding(8),
    fontWeight: '600',
  },
  description: {
    fontSize: responsiveWidth(14),
    color: '#374151',
    lineHeight: responsiveWidth(20),
    marginBottom: responsivePadding(12),
    fontWeight: '400',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: responsivePadding(12),
    gap: responsivePadding(6),
  },
  tag: {
    borderRadius: responsiveWidth(12),
    overflow: 'hidden',
  },
  tagBlur: {
    borderRadius: responsiveWidth(12),
    overflow: 'hidden',
  },
  tagGradient: {
    paddingHorizontal: responsivePadding(10),
    paddingVertical: responsivePadding(4),
    alignItems: 'center',
  },
  tagText: {
    fontSize: responsiveWidth(11),
    color: '#0A84FF',
    fontWeight: '600',
  },
  moreTags: {
    fontSize: responsiveWidth(11),
    color: '#374151',
    alignSelf: 'center',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: responsivePadding(12),
  },
  priceDurationContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: responsivePadding(8),
  },
  price: {
    fontSize: responsiveWidth(18),
    fontWeight: '700',
    color: '#0A84FF',
  },
  duration: {
    fontSize: responsiveWidth(14),
    fontWeight: '500',
    color: '#374151',
  },
  reviewsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewsText: {
    fontSize: responsiveWidth(12),
    color: '#374151',
    marginLeft: responsivePadding(4),
    fontWeight: '500',
  },
});

export default ExpandedCardRehabCenter;
