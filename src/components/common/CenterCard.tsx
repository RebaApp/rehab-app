import React, { memo, useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { CenterCardProps } from '../../types';
import OptimizedImage from './OptimizedImage';

const CenterCard: React.FC<CenterCardProps> = memo(({
  item,
  onPress,
  onToggleFavorite,
  isFavorite,
  showDistance = false
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const heartScaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = useCallback(() => {
    onPress(item);
  }, [item, onPress]);

  const handleFavoritePress = useCallback(() => {
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

    onToggleFavorite(item.id);
  }, [item.id, onToggleFavorite, scaleAnim, heartScaleAnim]);

  const renderStars = useMemo(() => {
    const stars = [];
    const fullStars = Math.floor(item.rating);
    const hasHalfStar = item.rating % 1 !== 0;

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

    const emptyStars = 5 - Math.ceil(item.rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Ionicons key={`empty-${i}`} name="star-outline" size={12} color="#FFD700" />
      );
    }

    return stars;
  }, [item.rating]);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={styles.container}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <BlurView intensity={15} tint="light" style={styles.cardBlur}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.8)']}
            style={styles.cardGradient}
          >
            <View style={styles.imageContainer}>
              <OptimizedImage
                uri={item.photos[0] || 'https://via.placeholder.com/300x200'}
                style={styles.image}
                priority={false}
                cachePolicy="memory"
                contentFit="cover"
                transition={150}
              />
              
              <TouchableOpacity
                style={styles.favoriteButton}
                onPress={handleFavoritePress}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
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
              
              {item.verified && (
                <View style={styles.verifiedBadge}>
                  <BlurView intensity={10} tint="light" style={styles.verifiedBlur}>
                    <LinearGradient
                      colors={['rgba(76, 175, 80, 0.9)', 'rgba(76, 175, 80, 0.8)']}
                      style={styles.verifiedGradient}
                    >
                      <Ionicons name="checkmark-circle" size={16} color="#FFFFFF" />
                    </LinearGradient>
                  </BlurView>
                </View>
              )}
            </View>

            <View style={styles.content}>
              <View style={styles.header}>
                <Text style={styles.name} numberOfLines={1}>
                  {item.name}
                </Text>
                <View style={styles.ratingContainer}>
                  {renderStars}
                  <Text style={styles.ratingText}>
                    {item.rating.toFixed(1)}
                  </Text>
                </View>
              </View>

              <View style={styles.locationContainer}>
                <Ionicons name="location-outline" size={16} color="#81D4FA" />
                <Text style={styles.location} numberOfLines={1}>
                  {item.city}
                </Text>
                {showDistance && item.distance && (
                  <Text style={styles.distance}>
                    {item.distance.toFixed(1)} км
                  </Text>
                )}
              </View>

              <View style={styles.servicesContainer}>
                {item.services.slice(0, 2).map((service, index) => (
                  <View key={index} style={styles.serviceTag}>
                    <BlurView intensity={10} tint="light" style={styles.serviceBlur}>
                      <LinearGradient
                        colors={['rgba(129, 212, 250, 0.3)', 'rgba(66, 165, 245, 0.2)']}
                        style={styles.serviceGradient}
                      >
                        <Text style={styles.serviceText}>{service}</Text>
                      </LinearGradient>
                    </BlurView>
                  </View>
                ))}
                {item.services.length > 2 && (
                  <Text style={styles.moreServices}>
                    +{item.services.length - 2}
                  </Text>
                )}
              </View>

              <Text style={styles.description} numberOfLines={2}>
                {item.description}
              </Text>

              <View style={styles.footer}>
                <Text style={styles.price}>{item.price}</Text>
                <View style={styles.reviewsContainer}>
                  <Ionicons name="chatbubble-outline" size={12} color="#81D4FA" />
                  <Text style={styles.reviewsText}>
                    {item.reviewsCount} отзывов
                  </Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </BlurView>
      </TouchableOpacity>
    </Animated.View>
  );
});

CenterCard.displayName = 'CenterCard';

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  cardBlur: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  cardGradient: {
    borderRadius: 20,
    overflow: 'hidden',
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
  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  favoriteBlur: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  favoriteGradient: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  verifiedBlur: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  verifiedGradient: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 20
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    flex: 1,
    marginRight: 12,
    lineHeight: 22,
    letterSpacing: -0.3,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
    fontWeight: '600',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
    fontWeight: '500',
  },
  distance: {
    fontSize: 14,
    color: '#42A5F5',
    marginLeft: 8,
    fontWeight: '600',
  },
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16
  },
  serviceTag: {
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 8,
    marginBottom: 8
  },
  serviceBlur: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  serviceGradient: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
  },
  serviceText: {
    fontSize: 12,
    color: '#42A5F5',
    fontWeight: '600',
  },
  moreServices: {
    fontSize: 12,
    color: '#666',
    alignSelf: 'center',
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
    fontWeight: '400',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#42A5F5'
  },
  reviewsContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  reviewsText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 6,
    fontWeight: '500',
  }
});

export default CenterCard;
