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
import { CenterCardProps } from '../../types';
import { THEME } from '../../utils/constants';
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
      <LinearGradient
        colors={[THEME.bgTop, THEME.bgMid]}
        style={styles.gradient}
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
            <Animated.View style={{ transform: [{ scale: heartScaleAnim }] }}>
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={20}
                color={isFavorite ? "#ff6b6b" : "#fff"}
              />
            </Animated.View>
          </TouchableOpacity>
          
          {item.verified && (
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
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
            <Ionicons name="location-outline" size={14} color={THEME.muted} />
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
                <Text style={styles.serviceText}>{service}</Text>
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
              <Ionicons name="chatbubble-outline" size={12} color={THEME.muted} />
              <Text style={styles.reviewsText}>
                {item.reviewsCount} отзывов
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
    </Animated.View>
  );
});

CenterCard.displayName = 'CenterCard';

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
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
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    padding: 4
  },
  content: {
    padding: 16
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    flex: 1,
    marginRight: 8
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginLeft: 4
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  location: {
    fontSize: 14,
    color: THEME.muted,
    marginLeft: 4,
    flex: 1
  },
  distance: {
    fontSize: 12,
    color: THEME.primary,
    fontWeight: '600',
    marginLeft: 8
  },
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12
  },
  serviceTag: {
    backgroundColor: THEME.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4
  },
  serviceText: {
    fontSize: 12,
    color: THEME.primary,
    fontWeight: '600'
  },
  moreServices: {
    fontSize: 12,
    color: THEME.muted,
    alignSelf: 'center'
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.primary
  },
  reviewsContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  reviewsText: {
    fontSize: 12,
    color: THEME.muted,
    marginLeft: 4
  }
});

export default CenterCard;
