import React, { memo, useCallback, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Center } from '../types';
import { THEME } from '../utils/constants';
import OptimizedImage from '../components/common/OptimizedImage';

interface CenterDetailScreenProps {
  center: Center;
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
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[THEME.bgTop, THEME.bgMid, THEME.bgBottom]}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color={THEME.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Центр</Text>
          <TouchableOpacity style={styles.favoriteButton} onPress={handleFavoritePress}>
            <Ionicons 
              name={isFavorite ? "heart" : "heart-outline"} 
              size={24} 
              color={isFavorite ? "#ff6b6b" : THEME.text} 
            />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Галерея изображений */}
          <View style={styles.imageContainer}>
            <OptimizedImage
              uri={center.photos[0] || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop&crop=center'}
              style={styles.image}
              priority={true}
              cachePolicy="memory"
              contentFit="cover"
              transition={200}
            />
            {center.verified && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                <Text style={styles.verifiedText}>Проверен</Text>
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
              <Ionicons name="location-outline" size={16} color={THEME.muted} />
              <Text style={styles.locationText}>{center.city}, {center.address}</Text>
            </View>

            <Text style={styles.description}>{center.description}</Text>

            {/* Цена и услуги */}
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Стоимость:</Text>
              <Text style={styles.price}>{center.price}</Text>
            </View>

            {center.duration && (
              <View style={styles.durationContainer}>
                <Text style={styles.durationLabel}>Длительность:</Text>
                <Text style={styles.duration}>{center.duration}</Text>
              </View>
            )}

            {/* Услуги */}
            <View style={styles.servicesContainer}>
              <Text style={styles.sectionTitle}>Услуги:</Text>
              <View style={styles.servicesList}>
                {center.services.map((service, index) => (
                  <View key={index} style={styles.serviceItem}>
                    <Ionicons name="checkmark-circle-outline" size={16} color={THEME.primary} />
                    <Text style={styles.serviceText}>{service}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Методы лечения */}
            {center.methods && center.methods.length > 0 && (
              <View style={styles.methodsContainer}>
                <Text style={styles.sectionTitle}>Методы лечения:</Text>
                <View style={styles.methodsList}>
                  {center.methods.map((method, index) => (
                    <View key={index} style={styles.methodItem}>
                      <Ionicons name="medical-outline" size={16} color={THEME.primary} />
                      <Text style={styles.methodText}>{method}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Дополнительная информация */}
            <View style={styles.infoContainer}>
              <Text style={styles.sectionTitle}>Информация о центре:</Text>
              
              <View style={styles.infoItem}>
                <Ionicons name="time-outline" size={16} color={THEME.muted} />
                <Text style={styles.infoLabel}>Режим работы:</Text>
                <Text style={styles.infoValue}>{center.workingHours}</Text>
              </View>

              <View style={styles.infoItem}>
                <Ionicons name="people-outline" size={16} color={THEME.muted} />
                <Text style={styles.infoLabel}>Вместимость:</Text>
                <Text style={styles.infoValue}>{center.capacity} мест</Text>
              </View>

              <View style={styles.infoItem}>
                <Ionicons name="calendar-outline" size={16} color={THEME.muted} />
                <Text style={styles.infoLabel}>Основан:</Text>
                <Text style={styles.infoValue}>{center.yearFounded} год</Text>
              </View>

              <View style={styles.infoItem}>
                <Ionicons name="document-text-outline" size={16} color={THEME.muted} />
                <Text style={styles.infoLabel}>Лицензия:</Text>
                <Text style={styles.infoValue}>{center.license}</Text>
              </View>
            </View>

            {/* Полное описание */}
            {center.descriptionFull && (
              <View style={styles.fullDescriptionContainer}>
                <Text style={styles.sectionTitle}>Подробное описание:</Text>
                <Text style={styles.fullDescription}>{center.descriptionFull}</Text>
              </View>
            )}

            {/* Отзывы */}
            {center.reviews && center.reviews.length > 0 && (
              <View style={styles.reviewsContainer}>
                <Text style={styles.sectionTitle}>Отзывы:</Text>
                {center.reviews.map((review, index) => (
                  <View key={index} style={styles.reviewItem}>
                    <View style={styles.reviewHeader}>
                      <Text style={styles.reviewAuthor}>{review.userName}</Text>
                      <View style={styles.reviewRating}>
                        {Array.from({ length: 5 }, (_, i) => (
                          <Ionicons
                            key={i}
                            name={i < review.rating ? "star" : "star-outline"}
                            size={12}
                            color="#FFD700"
                          />
                        ))}
                      </View>
                    </View>
                    <Text style={styles.reviewText}>{review.text}</Text>
                    <Text style={styles.reviewDate}>{review.date}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>

        {/* Кнопки действий */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
            <Ionicons name="call" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Позвонить</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleEmail}>
            <Ionicons name="mail" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Написать</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleMap}>
            <Ionicons name="map" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Карта</Text>
          </TouchableOpacity>
        </View>
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
    color: THEME.text,
  },
  favoriteButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
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
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  verifiedBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4CAF50',
  },
  textContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: THEME.text,
    lineHeight: 32,
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.text,
  },
  reviewsText: {
    fontSize: 14,
    color: THEME.muted,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 6,
  },
  locationText: {
    fontSize: 14,
    color: THEME.muted,
    fontWeight: '500',
  },
  description: {
    fontSize: 16,
    color: THEME.text,
    lineHeight: 24,
    marginBottom: 20,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  priceLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.text,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME.primary,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 8,
  },
  durationLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.text,
  },
  duration: {
    fontSize: 16,
    color: THEME.text,
  },
  servicesContainer: {
    marginBottom: 20,
  },
  methodsContainer: {
    marginBottom: 20,
  },
  infoContainer: {
    marginBottom: 20,
  },
  fullDescriptionContainer: {
    marginBottom: 20,
  },
  reviewsContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: THEME.text,
    marginBottom: 10,
  },
  servicesList: {
    gap: 8,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  serviceText: {
    fontSize: 14,
    color: THEME.text,
  },
  methodsList: {
    gap: 8,
  },
  methodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  methodText: {
    fontSize: 14,
    color: THEME.text,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: THEME.text,
    minWidth: 100,
  },
  infoValue: {
    fontSize: 14,
    color: THEME.text,
    flex: 1,
  },
  fullDescription: {
    fontSize: 16,
    color: THEME.text,
    lineHeight: 24,
    textAlign: 'justify',
  },
  reviewItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.text,
  },
  reviewRating: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewText: {
    fontSize: 14,
    color: THEME.text,
    lineHeight: 20,
    marginBottom: 8,
  },
  reviewDate: {
    fontSize: 12,
    color: THEME.muted,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 1,
    borderTopColor: THEME.border,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.primary,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});

export default CenterDetailScreen;
