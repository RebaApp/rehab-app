import React, { memo, useCallback, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { RehabCenter } from '../types';
import OptimizedImage from '../components/common/OptimizedImage';

interface CenterDetailScreenProps {
  center: RehabCenter;
  onClose: () => void;
  onToggleFavorite: (centerId: string) => void;
  isFavorite: boolean;
}

const CenterDetailScreen: React.FC<CenterDetailScreenProps> = memo(({
  center,
  onClose,
  onToggleFavorite,
  isFavorite
}) => {
  const handleCall = useCallback(() => {
    Linking.openURL(`tel:${center.phone}`).catch(() => {
      Alert.alert('Ошибка', 'Не удалось открыть номер телефона');
    });
  }, [center.phone]);

  const handleEmail = useCallback(() => {
    Linking.openURL(`mailto:${center.email}`).catch(() => {
      Alert.alert('Ошибка', 'Не удалось открыть почтовый клиент');
    });
  }, [center.email]);

  const handleMap = useCallback(() => {
    const url = `https://maps.google.com/maps?q=${center.coordinates.latitude},${center.coordinates.longitude}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Ошибка', 'Не удалось открыть карту');
    });
  }, [center.coordinates]);

  const handleFavoritePress = useCallback(() => {
    onToggleFavorite(center.id);
  }, [center.id, onToggleFavorite]);

  const renderStars = useMemo(() => {
    const stars = [];
    const fullStars = Math.floor(center.rating);
    const hasHalfStar = center.rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Ionicons key={i} name="star" size={16} color="#FFD700" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Ionicons key="half" name="star-half" size={16} color="#FFD700" />
      );
    }

    const emptyStars = 5 - Math.ceil(center.rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Ionicons key={`empty-${i}`} name="star-outline" size={16} color="#FFD700" />
      );
    }

    return stars;
  }, [center.rating]);

  return (
    <View style={styles.container}>
      <BlurView intensity={20} tint="light" style={styles.blurContainer}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.9)']}
          style={styles.gradient}
        >
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <View style={styles.closeButtonContainer}>
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']}
                  style={styles.closeGradient}
                >
                  <Ionicons name="close" size={18} color="#1a1a1a" />
                </LinearGradient>
              </View>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Центр</Text>
            <TouchableOpacity style={styles.favoriteButton} onPress={handleFavoritePress}>
              <View style={styles.favoriteButtonContainer}>
                <LinearGradient
                  colors={isFavorite ? ['#ff6b6b', '#ff5252'] : ['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']}
                  style={styles.favoriteGradient}
                >
                  <Ionicons 
                    name={isFavorite ? "heart" : "heart-outline"} 
                    size={18} 
                    color={isFavorite ? "#FFFFFF" : "#ff6b6b"} 
                  />
                </LinearGradient>
              </View>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Галерея изображений */}
            <View style={styles.imageContainer}>
              <OptimizedImage
                uri={center.image || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop&crop=center'}
                style={styles.image}
                priority={true}
                cachePolicy="memory"
                contentFit="cover"
                transition={200}
              />
              {center.verification_status === 'verified' && (
                <View style={styles.verifiedBadge}>
                  <BlurView intensity={10} tint="light" style={styles.verifiedBlur}>
                    <LinearGradient
                      colors={['rgba(76, 175, 80, 0.9)', 'rgba(76, 175, 80, 0.8)']}
                      style={styles.verifiedGradient}
                    >
                      <Ionicons name="checkmark-circle" size={16} color="#FFFFFF" />
                      <Text style={styles.verifiedText}>Проверен</Text>
                    </LinearGradient>
                  </BlurView>
                </View>
              )}
            </View>

            <View style={styles.textContainer}>
              {/* Основная информация */}
              <Text style={styles.title}>{center.name}</Text>
              
              <View style={styles.ratingContainer}>
                <View style={styles.starsContainer}>
                  {renderStars}
                </View>
                <Text style={styles.ratingText}>{center.rating}</Text>
                <Text style={styles.reviewsText}>({center.reviewsCount} отзывов)</Text>
              </View>

              <View style={styles.locationContainer}>
                <Ionicons name="location-outline" size={16} color="#81D4FA" />
                <Text style={styles.locationText}>{center.location}</Text>
              </View>

              <Text style={styles.description}>{center.shortDescription}</Text>

              {/* Цена и услуги */}
              <View style={styles.priceContainer}>
                <Text style={styles.priceLabel}>Стоимость:</Text>
                <Text style={styles.price}>от {center.priceFrom?.toLocaleString('ru-RU')} ₽</Text>
              </View>

              {/* Услуги */}
              <View style={styles.servicesContainer}>
                <Text style={styles.servicesTitle}>Услуги:</Text>
                <View style={styles.servicesList}>
                  {(center.services || []).map((service, index) => (
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
                </View>
              </View>

              {/* Контактная информация */}
              <View style={styles.contactContainer}>
                <Text style={styles.contactTitle}>Контакты:</Text>
                
                <TouchableOpacity style={styles.contactItem} onPress={handleCall}>
                  <BlurView intensity={10} tint="light" style={styles.contactBlur}>
                    <LinearGradient
                      colors={['rgba(129, 212, 250, 0.3)', 'rgba(66, 165, 245, 0.2)']}
                      style={styles.contactGradient}
                    >
                      <Ionicons name="call" size={20} color="#42A5F5" />
                      <Text style={styles.contactText}>{center.phone}</Text>
                    </LinearGradient>
                  </BlurView>
                </TouchableOpacity>

                <TouchableOpacity style={styles.contactItem} onPress={handleEmail}>
                  <BlurView intensity={10} tint="light" style={styles.contactBlur}>
                    <LinearGradient
                      colors={['rgba(129, 212, 250, 0.3)', 'rgba(66, 165, 245, 0.2)']}
                      style={styles.contactGradient}
                    >
                      <Ionicons name="mail" size={20} color="#42A5F5" />
                      <Text style={styles.contactText}>{center.email}</Text>
                    </LinearGradient>
                  </BlurView>
                </TouchableOpacity>

                <TouchableOpacity style={styles.contactItem} onPress={handleMap}>
                  <BlurView intensity={10} tint="light" style={styles.contactBlur}>
                    <LinearGradient
                      colors={['rgba(129, 212, 250, 0.3)', 'rgba(66, 165, 245, 0.2)']}
                      style={styles.contactGradient}
                    >
                      <Ionicons name="map" size={20} color="#42A5F5" />
                      <Text style={styles.contactText}>Открыть на карте</Text>
                    </LinearGradient>
                  </BlurView>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </LinearGradient>
      </BlurView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    marginHorizontal: 5, // Горизонтальные отступы по 5px слева и справа
  },
  blurContainer: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
    paddingVertical: 0,
    paddingTop: 0,
    paddingBottom: 0,
    borderBottomWidth: 0,
    borderBottomColor: 'transparent',
    zIndex: 1000,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  closeButtonContainer: {
    flex: 1,
    borderRadius: 18,
    overflow: 'hidden',
  },
  closeGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: -0.3,
  },
  favoriteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  favoriteButtonContainer: {
    flex: 1,
    borderRadius: 18,
    overflow: 'hidden',
  },
  favoriteGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  content: {
    flex: 1,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
  },
  imageContainer: {
    position: 'relative',
    height: 250,
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  verifiedText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 6,
  },
  textContainer: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    marginHorizontal: 0,
    marginVertical: 0,
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 0,
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    paddingBottom: 0,
    paddingTop: 0,
    paddingLeft: 0,
    paddingRight: 0,
    letterSpacing: -0.5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    paddingBottom: 0,
    paddingTop: 0,
    paddingLeft: 0,
    paddingRight: 0,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginRight: 8,
  },
  reviewsText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    paddingBottom: 0,
    paddingTop: 0,
    paddingLeft: 0,
    paddingRight: 0,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    fontWeight: '500',
  },
  description: {
    fontSize: 16,
    color: '#1a1a1a',
    lineHeight: 24,
    marginBottom: 0,
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    paddingBottom: 0,
    paddingTop: 0,
    paddingLeft: 0,
    paddingRight: 0,
    fontWeight: '400',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    paddingBottom: 0,
    paddingTop: 0,
    paddingLeft: 0,
    paddingRight: 0,
  },
  priceLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
    marginRight: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#42A5F5',
  },
  servicesContainer: {
    marginBottom: 0,
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    paddingBottom: 0,
    paddingTop: 0,
    paddingLeft: 0,
    paddingRight: 0,
  },
  servicesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 0,
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    paddingBottom: 0,
    paddingTop: 0,
    paddingLeft: 0,
    paddingRight: 0,
    letterSpacing: -0.3,
  },
  servicesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  serviceTag: {
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 8,
    marginBottom: 8,
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
  contactContainer: {
    marginBottom: 0,
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    paddingBottom: 0,
    paddingTop: 0,
    paddingLeft: 0,
    paddingRight: 0,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 0,
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    paddingBottom: 0,
    paddingTop: 0,
    paddingLeft: 0,
    paddingRight: 0,
    letterSpacing: -0.3,
  },
  contactItem: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
  },
  contactBlur: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  contactGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  contactText: {
    fontSize: 14,
    color: '#42A5F5',
    fontWeight: '500',
    marginLeft: 12,
  },
});

export default CenterDetailScreen;