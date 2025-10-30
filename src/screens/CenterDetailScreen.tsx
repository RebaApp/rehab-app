import React, { memo, useCallback, useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  FlatList,
  Dimensions,
  Modal,
  PanResponder,
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
  console.log('CenterDetailScreen received center:', center);
  const [galleryVisible, setGalleryVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Текущее изображение в главной галерее
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
    if (center.coordinates) {
    const url = `https://maps.google.com/maps?q=${center.coordinates.latitude},${center.coordinates.longitude}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Ошибка', 'Не удалось открыть карту');
    });
    }
  }, [center.coordinates]);

  const handleFavoritePress = useCallback(() => {
    console.log('Like button pressed!', center.id);
    onToggleFavorite(center.id);
  }, [center.id, onToggleFavorite]);

  // Получаем все изображения центра
  const allImages = useMemo(() => {
    console.log('Center image:', center.image);
    console.log('Center photos:', center.photos);
    const images: (string | any)[] = [];
    if (center.image) {
      images.push(center.image);
    }
    if (center.photos && center.photos.length > 0) {
      images.push(...center.photos);
    }
    // Убираем дубликаты (для объектов require() это не сработает, но для URL строк сработает)
    const result = images.filter((img, index) => {
      if (typeof img === 'string') {
        return images.indexOf(img) === index;
      }
      return true; // Для объектов require() оставляем все
    });
    console.log('All images result:', result);
    return result;
  }, [center.image, center.photos]);


  const handleCloseGallery = useCallback(() => {
    setGalleryVisible(false);
  }, []);

  // PanResponder для свайпа по главному изображению
  const panResponder = useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      // Активируем только при горизонтальном свайпе
      return Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 10;
    },
    onPanResponderMove: () => {
      // Можно добавить анимацию во время свайпа
    },
    onPanResponderRelease: (_, gestureState) => {
      const { dx } = gestureState;
      const threshold = 50; // Минимальное расстояние для смены изображения
      
      if (Math.abs(dx) > threshold && allImages.length > 1) {
        if (dx > 0) {
          // Свайп вправо - предыдущее изображение
          setCurrentImageIndex(prev => prev > 0 ? prev - 1 : allImages.length - 1);
        } else {
          // Свайп влево - следующее изображение
          setCurrentImageIndex(prev => prev < allImages.length - 1 ? prev + 1 : 0);
        }
      }
    },
  }), [allImages.length]);


  return (
    <View style={styles.container}>
      <BlurView intensity={20} tint="light" style={styles.blurContainer}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.9)']}
          style={styles.gradient}
        >
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <LinearGradient
                colors={['#81D4FA', '#42A5F5']}
                style={styles.closeGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Ionicons name="arrow-back" size={18} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
            <View style={styles.headerPlaceholder} />
          </View>

          {/* Favorite Button - вынесен из ScrollView */}
          <TouchableOpacity
            style={styles.favoriteButtonFixed}
            onPress={handleFavoritePress}
            onPressIn={() => console.log('Like button pressed IN!')}
            onPressOut={() => console.log('Like button pressed OUT!')}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            accessibilityLabel={isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
          >
            <View style={styles.favoriteButtonFixedContainer}>
              <LinearGradient
                colors={isFavorite ? ['#ff6b6b', '#ff5252'] : ['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']}
                style={styles.favoriteGradientFixed}
              >
                <Ionicons
                  name={isFavorite ? "heart" : "heart-outline"}
                  size={18}
                  color={isFavorite ? "#FFFFFF" : "#ff6b6b"}
                />
              </LinearGradient>
            </View>
          </TouchableOpacity>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false} pointerEvents="box-none">
            {/* Галерея изображений */}
            <View style={styles.imageContainer}>
              <View {...panResponder.panHandlers} style={styles.imageWrapper}>
              <OptimizedImage
                  uri={allImages[currentImageIndex] || center.image || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop&crop=center'}
                style={styles.image}
                priority={true}
                cachePolicy="memory"
                contentFit="cover"
                transition={200}
              />
                
                {/* Индикаторы изображений */}
                {allImages.length > 1 && (
                  <View style={styles.imageIndicators}>
                    {allImages.map((_, index) => (
                      <View
                        key={index}
                        style={[
                          styles.indicator,
                          index === currentImageIndex && styles.activeIndicator
                        ]}
                      />
                    ))}
                  </View>
                )}
                
              </View>
              
              {/* Overlay Gradient */}
              <View style={styles.imageOverlay}>
                <LinearGradient
                  colors={['transparent', 'rgba(0, 0, 0, 0.3)']}
                  style={styles.imageGradient}
                />
              </View>

              {/* Badges Container */}
              <View style={styles.badgesContainer}>
                <View style={styles.leftBadges}>
                  {center.license && (
                    <View style={styles.licenseBadge}>
                      <BlurView intensity={10} tint="light" style={styles.badgeBlur}>
                        <LinearGradient
                          colors={['#81D4FA', '#42A5F5']}
                          style={styles.badgeGradient}
                        >
                          <Ionicons name="shield-checkmark" size={12} color="#FFFFFF" />
                          <Text style={styles.badgeText}>Лицензия</Text>
                        </LinearGradient>
                      </BlurView>
                    </View>
                  )}

              {center.verification_status === 'verified' && (
                <View style={styles.verifiedBadge}>
                      <BlurView intensity={10} tint="light" style={styles.badgeBlur}>
                        <LinearGradient
                          colors={['#81D4FA', '#42A5F5']}
                          style={styles.badgeGradient}
                        >
                          <Ionicons name="checkmark-circle" size={12} color="#FFFFFF" />
                          <Text style={styles.badgeText}>Проверен</Text>
                        </LinearGradient>
                      </BlurView>
                    </View>
                  )}
                </View>

                {/* Rating Badge */}
                {center.rating !== undefined && (
                  <View style={styles.ratingBadgeOnImage}>
                    <LinearGradient
                      colors={['#81D4FA', '#42A5F5']}
                      style={styles.ratingBadgeGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      <Ionicons name="star" size={12} color="#FFFFFF" />
                      <Text style={styles.ratingBadgeTextOnImage}>
                        {center.rating.toFixed(1)}
                      </Text>
                    </LinearGradient>
                  </View>
                )}
              </View>

            </View>


            <View style={styles.textContainer}>
              {/** Работает с расширенным набором полей без ошибки типов */}
              {(() => { const anyCenter: any = center; return (
              <>
              <Text style={styles.title}>{center.name}</Text>

              <View style={styles.metaGrid}>
                {anyCenter.city ? (<Text style={styles.metaItem}><Text style={styles.metaLabel}>Город: </Text>{anyCenter.city}</Text>) : null}
                {anyCenter.yearFounded ? (<Text style={styles.metaItem}><Text style={styles.metaLabel}>Основан: </Text>{anyCenter.yearFounded}</Text>) : null}
                {anyCenter.organizationType ? (<Text style={styles.metaItem}><Text style={styles.metaLabel}>Тип: </Text>{anyCenter.organizationType}</Text>) : null}
                {anyCenter.capacity ? (<Text style={styles.metaItem}><Text style={styles.metaLabel}>Вместимость: </Text>{anyCenter.capacity}</Text>) : null}
                {anyCenter.staffCount ? (<Text style={styles.metaItem}><Text style={styles.metaLabel}>Сотрудников: </Text>{anyCenter.staffCount}</Text>) : null}
                {anyCenter.license ? (<Text style={styles.metaItem}><Text style={styles.metaLabel}>Лицензия: </Text>{anyCenter.license}</Text>) : null}
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>О центре</Text>
                <Text style={styles.paragraph}>{anyCenter.descriptionFull || center.shortDescription || 'Информация уточняется.'}</Text>
              </View>

              {Array.isArray(center.services) && center.services.length > 0 ? (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Специализация</Text>
                  <Text style={styles.paragraph}>{center.services.join(', ')}</Text>
                </View>
              ) : null}

              {Array.isArray(center.methods) && center.methods.length > 0 ? (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Методы и подход</Text>
                  <Text style={styles.paragraph}>{center.methods.join(', ')}</Text>
                </View>
              ) : null}

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Условия проживания</Text>
                <Text style={styles.paragraph}>{anyCenter.accommodation || 'Условия проживания уточняются. Обычно это 2–3-местные комнаты, питание и дневной распорядок с терапией.'}</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Стоимость и программы</Text>
                <Text style={styles.paragraph}>
                  {center.priceFrom ? `Проживание от ${center.priceFrom.toLocaleString('ru-RU')} ₽ в день.` : 'Стоимость по запросу.'}
                  {center.duration ? ` Программа: ${center.duration}.` : ''}
                </Text>
              </View>

              {Array.isArray(anyCenter.extras) && anyCenter.extras.length > 0 ? (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Дополнительные услуги</Text>
                  <Text style={styles.paragraph}>{anyCenter.extras.join(', ')}</Text>
                </View>
              ) : null}

              {Array.isArray(anyCenter.reviews) && anyCenter.reviews.length > 0 ? (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Отзывы</Text>
                  {anyCenter.reviews.slice(0,2).map((r: any, i: number) => (
                    <Text key={i} style={styles.quote}>“{r.text || r.comment}” — {r.userName || r.name}</Text>
                  ))}
                </View>
              ) : null}

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Контакты</Text>
                {center.phone ? (
                  <TouchableOpacity style={styles.contactLine} onPress={handleCall}>
                    <Ionicons name="call" size={18} color="#0A84FF" />
                    <Text style={styles.contactLineText}>{center.phone}</Text>
                  </TouchableOpacity>
                ) : null}
                {center.email ? (
                  <TouchableOpacity style={styles.contactLine} onPress={handleEmail}>
                    <Ionicons name="mail" size={18} color="#0A84FF" />
                    <Text style={styles.contactLineText}>{center.email}</Text>
                  </TouchableOpacity>
                ) : null}
                {center.location || center.address ? (
                  <TouchableOpacity style={styles.contactLine} onPress={handleMap}>
                    <Ionicons name="map" size={18} color="#0A84FF" />
                    <Text style={styles.contactLineText}>{center.location || center.address}</Text>
                  </TouchableOpacity>
                ) : null}
              </View>

              {(anyCenter.license || anyCenter.inn || anyCenter.ogrn) ? (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Юридическая информация</Text>
                  {anyCenter.license ? (<Text style={styles.paragraph}><Text style={styles.metaLabel}>Лицензия: </Text>{anyCenter.license}</Text>) : null}
                  {anyCenter.inn ? (<Text style={styles.paragraph}><Text style={styles.metaLabel}>ИНН: </Text>{anyCenter.inn}</Text>) : null}
                  {anyCenter.ogrn ? (<Text style={styles.paragraph}><Text style={styles.metaLabel}>ОГРН: </Text>{anyCenter.ogrn}</Text>) : null}
                </View>
              ) : null}
              </>
              ); })()}
            </View>
          </ScrollView>
        </LinearGradient>
      </BlurView>

      {/* Модальное окно галереи */}
      <Modal
        visible={galleryVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseGallery}
      >
        <View style={styles.modalContainer}>
          <BlurView intensity={20} tint="dark" style={styles.modalBlur}>
            <LinearGradient
              colors={['rgba(0, 0, 0, 0.9)', 'rgba(0, 0, 0, 0.8)']}
              style={styles.modalGradient}
            >
              {/* Заголовок модального окна */}
              <View style={styles.modalHeader}>
                <TouchableOpacity style={styles.modalCloseButton} onPress={handleCloseGallery}>
                  <Ionicons name="close" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>
                  {selectedImageIndex + 1} из {allImages.length}
                </Text>
                <View style={styles.modalPlaceholder} />
              </View>

              {/* Полноэкранное изображение */}
              <View style={styles.modalImageContainer}>
                <OptimizedImage
                  uri={allImages[selectedImageIndex]}
                  style={styles.modalImage}
                  contentFit="contain"
                  transition={200}
                />
              </View>

              {/* Миниатюры внизу */}
              <View style={styles.modalThumbnails}>
                <FlatList
                  data={allImages}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item, index) => `thumb-${item}-${index}`}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity
                      style={[
                        styles.modalThumbnail,
                        selectedImageIndex === index && styles.modalThumbnailActive
                      ]}
                      onPress={() => setSelectedImageIndex(index)}
                      activeOpacity={0.8}
                    >
                      <OptimizedImage
                        uri={item}
                        style={styles.modalThumbnailImage}
                        contentFit="cover"
                        transition={200}
                      />
                    </TouchableOpacity>
                  )}
                  contentContainerStyle={styles.modalThumbnailsContent}
                />
              </View>
            </LinearGradient>
          </BlurView>
        </View>
      </Modal>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    marginHorizontal: 16, // Единые горизонтальные отступы
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
    marginTop: 12,
    marginLeft: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
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
  headerPlaceholder: {
    width: 36,
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
    height: 300, // Увеличиваем для соотношения 4:3 (800x600)
    width: '100%',
  },
  imageWrapper: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageIndicators: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  activeIndicator: {
    backgroundColor: '#FFFFFF',
    width: 12,
  },
  textContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    color: '#1a1a1a',
    lineHeight: 22,
  },
  metaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 4,
    marginBottom: 12,
  },
  metaItem: {
    fontSize: 13,
    color: '#333',
  },
  metaLabel: {
    color: '#666',
    fontWeight: '600',
  },
  quote: {
    fontSize: 13,
    color: '#333',
    fontStyle: 'italic',
    marginTop: 6,
  },
  contactLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  contactLineText: {
    fontSize: 14,
    color: '#0A84FF',
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
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
  reviewsContainer: {
    marginBottom: 12,
  },
  reviewsText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
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
    marginBottom: 16,
    fontWeight: '400',
  },
  priceDurationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    marginBottom: 16,
  },
  servicesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  servicesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  serviceTag: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  serviceBlur: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  serviceGradient: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignItems: 'center',
  },
  serviceText: {
    fontSize: 11,
    color: '#0A84FF',
    fontWeight: '600',
  },
  contactContainer: {
    marginBottom: 16,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
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
    color: '#0A84FF',
    fontWeight: '500',
    marginLeft: 12,
  },
  
  // Новые стили для улучшенного дизайна
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  imageGradient: {
    flex: 1,
  },
  badgesContainer: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  leftBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  licenseBadge: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  verifiedBadge: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  badgeBlur: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  badgeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  ratingBadgeOnImage: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    borderRadius: 12,
    overflow: 'hidden',
    zIndex: 10,
  },
  ratingBadgeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 4,
  },
  ratingBadgeTextOnImage: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  favoriteButtonOnImage: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 44, // Увеличиваем размер для лучшего нажатия
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 10, // Добавляем zIndex для гарантии, что кнопка будет сверху
  },
  favoriteButtonOnImageContainer: {
    flex: 1,
    borderRadius: 22,
    overflow: 'hidden',
  },
  favoriteGradientOnImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
  },
  favoriteButtonFixed: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36, // Уменьшаем размер
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 1000, // Еще выше zIndex
  },
  favoriteButtonFixedContainer: {
    flex: 1,
    borderRadius: 18,
    overflow: 'hidden',
  },
  favoriteGradientFixed: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0A84FF',
    marginLeft: 4,
  },
  additionalInfoContainer: {
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    marginLeft: 8,
    marginRight: 8,
  },
  infoValue: {
    fontSize: 14,
    color: '#0A84FF',
    fontWeight: '600',
  },
  tagsContainer: {
    marginBottom: 16,
  },
  tagsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  tagBlur: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  tagGradient: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignItems: 'center',
  },
  tagText: {
    fontSize: 11,
    color: '#0A84FF',
    fontWeight: '600',
  },
  methodsContainer: {
    marginBottom: 16,
  },
  methodsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  methodsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  methodTag: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  methodBlur: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  methodGradient: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignItems: 'center',
  },
  methodText: {
    fontSize: 11,
    color: '#0A84FF',
    fontWeight: '600',
  },
  
  // Стили для галереи
  galleryContainer: {
    marginBottom: 16,
  },
  galleryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  galleryContent: {
    paddingHorizontal: 16,
    paddingRight: 16,
  },
  galleryItem: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'rgba(129, 212, 250, 0.3)',
  },
  galleryImage: {
    width: '100%',
    height: '100%',
  },
  
  // Стили для модального окна галереи
  modalContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  modalBlur: {
    flex: 1,
  },
  modalGradient: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalPlaceholder: {
    width: 40,
  },
  modalImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalImage: {
    width: Dimensions.get('window').width - 40,
    height: Dimensions.get('window').height * 0.6,
  },
  modalThumbnails: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  modalThumbnailsContent: {
    paddingRight: 20,
  },
  modalThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  modalThumbnailActive: {
    borderColor: '#0A84FF',
  },
  modalThumbnailImage: {
    width: '100%',
    height: '100%',
  },
});

export default CenterDetailScreen;