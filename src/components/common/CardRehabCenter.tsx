import React, { memo, useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Linking,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { CardRehabCenterProps, RehabCenter } from '../../types';
import OptimizedImage from './OptimizedImage';
import { THEME } from '../../utils/constants';
import { responsiveWidth, responsiveHeight, responsivePadding } from '../../utils/responsive';

const CardRehabCenter: React.FC<CardRehabCenterProps> = memo(({
  center,
  onOpen,
  onCall,
  onToggleFavorite,
  isFavorite = false,
  showDistance = false
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const heartScaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = useCallback(() => {
    onOpen(center.id);
  }, [center.id, onOpen]);

  const handleCallPress = useCallback(() => {
    if (center.phone && onCall) {
      onCall(center.phone);
    } else if (center.phone) {
      // Fallback для прямого звонка
      Linking.openURL(`tel:${center.phone}`);
    }
  }, [center.phone, onCall]);

  const handleFavoritePress = useCallback(() => {
    if (!onToggleFavorite) return;

    // Анимация нажатия на кнопку
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Анимация сердца
    Animated.sequence([
      Animated.timing(heartScaleAnim, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(heartScaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    onToggleFavorite(center.id);
  }, [center.id, onToggleFavorite, scaleAnim, heartScaleAnim]);

  // Форматирование цены
  const formattedPrice = useMemo(() => {
    if (!center.priceFrom) return 'По запросу';
    return `от ${center.priceFrom.toLocaleString('ru-RU')} ₽`;
  }, [center.priceFrom]);

  // Форматирование описания (трим до 140 символов)
  const formattedDescription = useMemo(() => {
    if (!center.shortDescription) return '';
    return center.shortDescription.length > 140 
      ? `${center.shortDescription.substring(0, 140)}...`
      : center.shortDescription;
  }, [center.shortDescription]);

  // Рендер звезд рейтинга
  const renderStars = useMemo(() => {
    if (!center.rating) return null;
    
    const stars = [];
    const fullStars = Math.floor(center.rating);
    const hasHalfStar = center.rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Ionicons key={i} name="star" size={12} color="#FFD700" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Ionicons key="half" name="star-half" size={12} color="#FFD700" />
      );
    }

    const emptyStars = 5 - Math.ceil(center.rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Ionicons key={`empty-${i}`} name="star-outline" size={12} color="#FFD700" />
      );
    }

    return stars;
  }, [center.rating]);

  // Статус верификации
  const getVerificationStatus = useMemo(() => {
    switch (center.verification_status) {
      case 'verified':
        return { color: '#34A853', icon: 'checkmark-circle', text: 'Проверен' };
      case 'pending':
        return { color: '#FF9800', icon: 'time-outline', text: 'На проверке' };
      case 'rejected':
        return { color: '#F44336', icon: 'close-circle', text: 'Отклонен' };
      case 'draft':
        return { color: '#9AA0A6', icon: 'create-outline', text: 'Черновик' };
      default:
        return null;
    }
  }, [center.verification_status]);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={styles.container}
        onPress={handlePress}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={`Реабилитационный центр ${center.name}`}
        accessibilityHint="Нажмите для просмотра подробной информации"
      >
        <BlurView intensity={15} tint="light" style={styles.cardBlur}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.8)']}
            style={styles.cardGradient}
          >
            {/* Hero Image */}
            <View style={styles.imageContainer}>
              <OptimizedImage
                uri={center.image || 'https://via.placeholder.com/300x200?text=Реабилитационный+центр'}
                style={styles.image}
                priority={false}
                cachePolicy="memory"
                contentFit="cover"
                transition={150}
              />
              
              {/* Кнопка избранного */}
              {onToggleFavorite && (
                <TouchableOpacity
                  style={styles.favoriteButton}
                  onPress={handleFavoritePress}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  accessibilityLabel={isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
                >
                  <BlurView intensity={10} tint="light" style={styles.favoriteBlur}>
                    <LinearGradient
                      colors={isFavorite ? ['#ff6b6b', '#ff5252'] : ['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.3)']}
                      style={styles.favoriteGradient}
                    >
                      <Animated.View style={{ transform: [{ scale: heartScaleAnim }] }}>
                        <Ionicons
                          name={isFavorite ? "heart" : "heart-outline"}
                          size={20}
                          color="#FFFFFF"
                        />
                      </Animated.View>
                    </LinearGradient>
                  </BlurView>
                </TouchableOpacity>
              )}
              
              {/* Бейдж лицензии */}
              {center.license && (
                <View style={styles.licenseBadge}>
                  <BlurView intensity={10} tint="light" style={styles.licenseBlur}>
                    <LinearGradient
                      colors={['rgba(76, 175, 80, 0.9)', 'rgba(76, 175, 80, 0.8)']}
                      style={styles.licenseGradient}
                    >
                      <Ionicons name="shield-checkmark" size={16} color="#FFFFFF" />
                    </LinearGradient>
                  </BlurView>
                </View>
              )}

              {/* Статус верификации */}
              {getVerificationStatus && (
                <View style={[
                  styles.statusBadge,
                  !center.license && styles.statusBadgeNoLicense
                ]}>
                  <BlurView intensity={10} tint="light" style={styles.statusBlur}>
                    <LinearGradient
                      colors={[`${getVerificationStatus.color}CC`, `${getVerificationStatus.color}99`]}
                      style={styles.statusGradient}
                    >
                      <Ionicons name={getVerificationStatus.icon as any} size={14} color="#FFFFFF" />
                    </LinearGradient>
                  </BlurView>
                </View>
              )}
            </View>

            {/* Контент карточки */}
            <View style={styles.content}>
              {/* Заголовок и рейтинг */}
              <View style={styles.header}>
                <Text style={styles.name} numberOfLines={1} accessibilityLabel={`Название: ${center.name}`}>
                  {center.name}
                </Text>
                {center.rating && (
                  <View style={styles.ratingContainer}>
                    {renderStars}
                    <Text style={styles.ratingText}>
                      {center.rating.toFixed(1)}
                    </Text>
                  </View>
                )}
              </View>

              {/* Локация */}
              <View style={styles.locationContainer}>
                <Ionicons name="location-outline" size={16} color="#81D4FA" />
                <Text style={styles.location} numberOfLines={1}>
                  {center.location}
                </Text>
                {showDistance && center.distance && (
                  <Text style={styles.distance}>
                    {center.distance.toFixed(1)} км
                  </Text>
                )}
              </View>

              {/* Описание */}
              {formattedDescription && (
                <Text style={styles.description} numberOfLines={3}>
                  {formattedDescription}
                </Text>
              )}

              {/* Теги/услуги */}
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

              {/* Футер с ценой и отзывами */}
              <View style={styles.footer}>
                <View style={styles.priceContainer}>
                  <Text style={styles.price}>{formattedPrice}</Text>
                  {center.duration && (
                    <Text style={styles.duration}>{center.duration}</Text>
                  )}
                </View>
                {center.reviewsCount && (
                  <View style={styles.reviewsContainer}>
                    <Ionicons name="chatbubble-outline" size={12} color="#81D4FA" />
                    <Text style={styles.reviewsText}>
                      {center.reviewsCount} отзывов
                    </Text>
                  </View>
                )}
              </View>

              {/* Кнопки действий */}
              <View style={styles.actionsContainer}>
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={handlePress}
                  accessibilityLabel="Подробнее о центре"
                >
                  <BlurView intensity={10} tint="light" style={styles.buttonBlur}>
                    <LinearGradient
                      colors={['rgba(10, 132, 255, 0.9)', 'rgba(10, 132, 255, 0.8)']}
                      style={styles.buttonGradient}
                    >
                      <Text style={styles.primaryButtonText}>Подробнее</Text>
                    </LinearGradient>
                  </BlurView>
                </TouchableOpacity>

                {center.phone && (
                  <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={handleCallPress}
                    accessibilityLabel={`Позвонить по номеру ${center.phone}`}
                  >
                    <BlurView intensity={10} tint="light" style={styles.buttonBlur}>
                      <LinearGradient
                        colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.8)']}
                        style={styles.buttonGradient}
                      >
                        <Ionicons name="call" size={16} color="#0A84FF" />
                        <Text style={styles.secondaryButtonText}>Позвонить</Text>
                      </LinearGradient>
                    </BlurView>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </LinearGradient>
        </BlurView>
      </TouchableOpacity>
    </Animated.View>
  );
});

CardRehabCenter.displayName = 'CardRehabCenter';

const styles = StyleSheet.create({
  container: {
    marginHorizontal: responsivePadding(16),
    marginBottom: responsivePadding(20),
    borderRadius: responsiveWidth(20),
    overflow: 'hidden',
    ...THEME.shadowMedium,
  },
  cardBlur: {
    borderRadius: responsiveWidth(20),
    overflow: 'hidden',
  },
  cardGradient: {
    borderRadius: responsiveWidth(20),
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: responsiveHeight(200),
    width: '100%'
  },
  image: {
    width: '100%',
    height: '100%'
  },
  favoriteButton: {
    position: 'absolute',
    top: responsivePadding(16),
    right: responsivePadding(16),
    width: responsiveWidth(40),
    height: responsiveWidth(40),
    borderRadius: responsiveWidth(20),
    overflow: 'hidden',
  },
  favoriteBlur: {
    borderRadius: responsiveWidth(20),
    overflow: 'hidden',
  },
  favoriteGradient: {
    width: responsiveWidth(40),
    height: responsiveWidth(40),
    alignItems: 'center',
    justifyContent: 'center',
  },
  licenseBadge: {
    position: 'absolute',
    top: responsivePadding(16),
    left: responsivePadding(16),
    borderRadius: responsiveWidth(12),
    overflow: 'hidden',
  },
  licenseBlur: {
    borderRadius: responsiveWidth(12),
    overflow: 'hidden',
  },
  licenseGradient: {
    padding: responsivePadding(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBadge: {
    position: 'absolute',
    top: responsivePadding(16),
    left: responsivePadding(60), // Смещение от бейджа лицензии
    borderRadius: responsiveWidth(12),
    overflow: 'hidden',
  },
  statusBadgeNoLicense: {
    left: responsivePadding(16), // Если нет лицензии, позиционируем слева
  },
  statusBlur: {
    borderRadius: responsiveWidth(12),
    overflow: 'hidden',
  },
  statusGradient: {
    padding: responsivePadding(6),
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: responsivePadding(20)
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: responsivePadding(12)
  },
  name: {
    fontSize: responsiveWidth(18),
    fontWeight: '700',
    color: THEME.textPrimary,
    flex: 1,
    marginRight: responsivePadding(12),
    lineHeight: responsiveWidth(22),
    letterSpacing: responsiveWidth(-0.3),
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  ratingText: {
    fontSize: responsiveWidth(14),
    color: THEME.textSecondary,
    marginLeft: responsivePadding(6),
    fontWeight: '600',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsivePadding(16)
  },
  location: {
    fontSize: responsiveWidth(14),
    color: THEME.textSecondary,
    marginLeft: responsivePadding(8),
    flex: 1,
    fontWeight: '500',
  },
  distance: {
    fontSize: responsiveWidth(14),
    color: THEME.primary,
    marginLeft: responsivePadding(8),
    fontWeight: '600',
  },
  description: {
    fontSize: responsiveWidth(14),
    color: THEME.textSecondary,
    lineHeight: responsiveWidth(20),
    marginBottom: responsivePadding(16),
    fontWeight: '400',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: responsivePadding(16)
  },
  tag: {
    borderRadius: responsiveWidth(12),
    overflow: 'hidden',
    marginRight: responsivePadding(8),
    marginBottom: responsivePadding(8)
  },
  tagBlur: {
    borderRadius: responsiveWidth(12),
    overflow: 'hidden',
  },
  tagGradient: {
    paddingHorizontal: responsivePadding(12),
    paddingVertical: responsivePadding(6),
    alignItems: 'center',
  },
  tagText: {
    fontSize: responsiveWidth(12),
    color: THEME.primary,
    fontWeight: '600',
  },
  moreTags: {
    fontSize: responsiveWidth(12),
    color: THEME.textSecondary,
    alignSelf: 'center',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: responsivePadding(16)
  },
  priceContainer: {
    flex: 1,
  },
  price: {
    fontSize: responsiveWidth(18),
    fontWeight: '700',
    color: THEME.primary,
    marginBottom: responsivePadding(2),
  },
  duration: {
    fontSize: responsiveWidth(12),
    color: THEME.textSecondary,
    fontWeight: '500',
  },
  reviewsContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  reviewsText: {
    fontSize: responsiveWidth(12),
    color: THEME.textSecondary,
    marginLeft: responsivePadding(6),
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: responsivePadding(12),
  },
  primaryButton: {
    flex: 1,
    borderRadius: responsiveWidth(12),
    overflow: 'hidden',
  },
  secondaryButton: {
    flex: 1,
    borderRadius: responsiveWidth(12),
    overflow: 'hidden',
  },
  buttonBlur: {
    borderRadius: responsiveWidth(12),
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: responsivePadding(12),
    paddingHorizontal: responsivePadding(16),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: responsivePadding(8),
  },
  primaryButtonText: {
    fontSize: responsiveWidth(16),
    fontWeight: '600',
    color: '#FFFFFF',
  },
  secondaryButtonText: {
    fontSize: responsiveWidth(16),
    fontWeight: '600',
    color: THEME.primary,
  },
});

export default CardRehabCenter;
