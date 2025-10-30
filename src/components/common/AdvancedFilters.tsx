import React, { memo, useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Location from 'expo-location';
import { responsiveWidth, responsiveHeight, responsivePadding } from '../../utils/responsive';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface FilterOptions {
  cities: string[];
  programs: string[];
  priceRange: { min: number; max: number };
  rating: { min: number; max: number };
  reviews: { min: number; max: number };
  specializations: string[];
  amenities: string[];
  distance: number;
  location: { latitude: number; longitude: number } | null;
}

export interface AdvancedFiltersProps {
  isVisible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterOptions) => void;
  currentFilters: FilterOptions;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = memo(({
  isVisible,
  onClose,
  onApplyFilters,
  currentFilters
}) => {
  const [filters, setFilters] = useState<FilterOptions>({
    ...currentFilters,
    location: null, // По умолчанию "Любые"
  });
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationPermission, setLocationPermission] = useState<boolean>(false);

  // Запрос разрешения на геолокацию
  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          setLocationPermission(true);
          const location = await Location.getCurrentPositionAsync({});
          setUserLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
          });
          // Убираем автоматическую установку геолокации в фильтры
          // Пользователь сам выберет "Ближайшие" если захочет
        } else {
          setLocationPermission(false);
        }
      } catch (error) {
        console.log('Ошибка получения геолокации:', error);
        setLocationPermission(false);
      }
    };

    if (isVisible) {
      requestLocationPermission();
    }
  }, [isVisible]);

  // Данные для фильтров (соответствуют реальным данным центров)
  const cities = ['Москва', 'Санкт-Петербург', 'Екатеринбург', 'Новосибирск', 'Казань'];
  const programs = [
    'Индивидуальные программы', 'Семейная терапия', 'Трудотерапия', 'Медикаментозное лечение', 
    'Психотерапия', 'Реабилитация', 'Групповая терапия', 'Социальная адаптация'
  ];
  const specializations = [
    'Алкоголизм', 'Наркомания', 'Игровая зависимость'
  ];
  const amenities = [
    'Индивидуальные программы', 'Семейная терапия', 'Трудотерапия', 'Медикаментозное лечение', 
    'Психотерапия', 'Реабилитация', 'Групповая терапия', 'Социальная адаптация', 'Детокс'
  ];

  const handleCityToggle = useCallback((city: string) => {
    setFilters(prev => ({
      ...prev,
      cities: prev.cities.includes(city)
        ? prev.cities.filter(c => c !== city)
        : [...prev.cities, city]
    }));
  }, []);

  const handleProgramToggle = useCallback((program: string) => {
    setFilters(prev => ({
      ...prev,
      programs: prev.programs.includes(program)
        ? prev.programs.filter(p => p !== program)
        : [...prev.programs, program]
    }));
  }, []);

  const handleSpecializationToggle = useCallback((spec: string) => {
    setFilters(prev => ({
      ...prev,
      specializations: prev.specializations.includes(spec)
        ? prev.specializations.filter(s => s !== spec)
        : [...prev.specializations, spec]
    }));
  }, []);

  const handleAmenityToggle = useCallback((amenity: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  }, []);

  const handleDistanceChange = useCallback((distance: number) => {
    setFilters(prev => ({
      ...prev,
      distance
    }));
  }, []);

  const handlePriceRangeChange = useCallback((min: number, max: number) => {
    setFilters(prev => ({
      ...prev,
      priceRange: { min, max }
    }));
  }, []);

  const handleRatingChange = useCallback((min: number, max: number) => {
    setFilters(prev => ({
      ...prev,
      rating: { min, max }
    }));
  }, []);

  const handleApply = useCallback(() => {
    onApplyFilters(filters);
    onClose();
  }, [filters, onApplyFilters, onClose]);


  const handleReset = useCallback(() => {
    const resetFilters: FilterOptions = {
      cities: [],
      programs: [],
      priceRange: { min: 0, max: 1000000 },
      rating: { min: 0, max: 5 },
      reviews: { min: 0, max: 1000 },
      specializations: [],
      amenities: [],
      distance: 50,
      location: null,
    };
    setFilters(resetFilters);
    onApplyFilters(resetFilters);
    onClose();
  }, [onApplyFilters, onClose]);

  const handleCancel = useCallback(() => {
    onClose();
  }, [onClose]);

  const renderLiquidGlassTag = (text: string, isSelected: boolean, onToggle: () => void) => (
    <TouchableOpacity
      key={text}
      style={styles.tagContainer}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      <BlurView intensity={10} tint="light" style={styles.tagBlur}>
        <LinearGradient
          colors={['#FFFFFF', '#FFFFFF']}
          style={styles.tagGradient}
        >
          <View style={styles.tagContent}>
            <Text style={[styles.tagText, isSelected && styles.tagTextSelected]}>
              {text}
            </Text>
            {/* outline only, no filled icon when selected */}
          </View>
        </LinearGradient>
      </BlurView>
    </TouchableOpacity>
  );

  const renderPriceSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Цена</Text>
      <View style={styles.priceOptions}>
        <TouchableOpacity 
          style={[styles.priceOption, (filters.priceRange.min === 0 && filters.priceRange.max === 1000000) ? styles.priceOptionSelected : styles.priceOptionUnselected]}
          onPress={() => handlePriceRangeChange(0, 1000000)}
        >
          <BlurView intensity={10} tint="light" style={styles.priceBlur}>
            <LinearGradient colors={['#FFFFFF', '#FFFFFF']} style={styles.priceGradient}>
              <Text style={[styles.priceOptionText, (filters.priceRange.min === 0 && filters.priceRange.max === 1000000) ? styles.priceOptionTextSelected : styles.priceOptionTextUnselected]}>
                Любая
              </Text>
            </LinearGradient>
          </BlurView>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.priceOption, (filters.priceRange.min === 0 && filters.priceRange.max === 50000) ? styles.priceOptionSelected : styles.priceOptionUnselected]}
          onPress={() => handlePriceRangeChange(0, 50000)}
        >
          <BlurView intensity={10} tint="light" style={styles.priceBlur}>
            <LinearGradient colors={['#FFFFFF', '#FFFFFF']} style={styles.priceGradient}>
              <Text style={[styles.priceOptionText, (filters.priceRange.min === 0 && filters.priceRange.max === 50000) ? styles.priceOptionTextSelected : styles.priceOptionTextUnselected]}>
                До 50,000 ₽
              </Text>
            </LinearGradient>
          </BlurView>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.priceOption, (filters.priceRange.min === 50000 && filters.priceRange.max === 100000) ? styles.priceOptionSelected : styles.priceOptionUnselected]}
          onPress={() => handlePriceRangeChange(50000, 100000)}
        >
          <BlurView intensity={10} tint="light" style={styles.priceBlur}>
            <LinearGradient colors={['#FFFFFF', '#FFFFFF']} style={styles.priceGradient}>
              <Text style={[styles.priceOptionText, (filters.priceRange.min === 50000 && filters.priceRange.max === 100000) ? styles.priceOptionTextSelected : styles.priceOptionTextUnselected]}>
                50,000 - 100,000 ₽
              </Text>
            </LinearGradient>
          </BlurView>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.priceOption, (filters.priceRange.min === 100000 && filters.priceRange.max === 200000) ? styles.priceOptionSelected : styles.priceOptionUnselected]}
          onPress={() => handlePriceRangeChange(100000, 200000)}
        >
          <BlurView intensity={10} tint="light" style={styles.priceBlur}>
            <LinearGradient colors={['#FFFFFF', '#FFFFFF']} style={styles.priceGradient}>
              <Text style={[styles.priceOptionText, (filters.priceRange.min === 100000 && filters.priceRange.max === 200000) ? styles.priceOptionTextSelected : styles.priceOptionTextUnselected]}>
                100,000 - 200,000 ₽
              </Text>
            </LinearGradient>
          </BlurView>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.priceOption, (filters.priceRange.min === 200000 && filters.priceRange.max === 1000000) ? styles.priceOptionSelected : styles.priceOptionUnselected]}
          onPress={() => handlePriceRangeChange(200000, 1000000)}
        >
          <BlurView intensity={10} tint="light" style={styles.priceBlur}>
            <LinearGradient colors={['#FFFFFF', '#FFFFFF']} style={styles.priceGradient}>
              <Text style={[styles.priceOptionText, (filters.priceRange.min === 200000 && filters.priceRange.max === 1000000) ? styles.priceOptionTextSelected : styles.priceOptionTextUnselected]}>
                200,000 ₽ и выше
              </Text>
            </LinearGradient>
          </BlurView>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderLocationSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Геолокация</Text>
      <View style={styles.locationOptions}>
        <TouchableOpacity 
          style={[styles.locationOption, !filters.location ? styles.locationOptionSelected : styles.locationOptionUnselected]}
          onPress={() => setFilters(prev => ({ ...prev, location: null }))}
        >
          <BlurView intensity={10} tint="light" style={styles.locationBlur}>
            <LinearGradient colors={['#FFFFFF', '#FFFFFF']} style={styles.locationGradient}>
              <Text style={[styles.locationOptionText, !filters.location ? styles.locationOptionTextSelected : styles.locationOptionTextUnselected]}>
                Любые
              </Text>
            </LinearGradient>
          </BlurView>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.locationOption, filters.location ? styles.locationOptionSelected : styles.locationOptionUnselected]}
          onPress={() => {
            if (userLocation) {
              setFilters(prev => ({ ...prev, location: userLocation }));
            }
          }}
        >
          <BlurView intensity={10} tint="light" style={styles.locationBlur}>
            <LinearGradient colors={['#FFFFFF', '#FFFFFF']} style={styles.locationGradient}>
              <Text style={[styles.locationOptionText, filters.location ? styles.locationOptionTextSelected : styles.locationOptionTextUnselected]}>
                Ближайшие
              </Text>
            </LinearGradient>
          </BlurView>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSection = (title: string, items: string[], selectedItems: string[], onToggle: (item: string) => void) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.tagsContainer}>
        {items.map(item => renderLiquidGlassTag(
          item,
          selectedItems.includes(item),
          () => onToggle(item)
        ))}
      </View>
    </View>
  );

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <LinearGradient
          colors={['#FFFFFF', '#FFFFFF']}
          style={styles.gradient}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.headerButton} onPress={handleCancel}>
              <BlurView intensity={15} tint="light" style={styles.buttonBlur}>
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0.2)']}
                  style={styles.buttonGradient}
                >
                  <Ionicons name="close" size={20} color="#42A5F5" />
                </LinearGradient>
              </BlurView>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Фильтры</Text>
            <TouchableOpacity style={styles.headerButton} onPress={handleReset}>
              <BlurView intensity={15} tint="light" style={styles.buttonBlur}>
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0.2)']}
                  style={styles.buttonGradient}
                >
                  <Ionicons name="refresh" size={20} color="#42A5F5" />
                </LinearGradient>
              </BlurView>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {renderLocationSection()}
            {renderPriceSection()}
            {renderSection('Города', cities, filters.cities, handleCityToggle)}
            {renderSection('Программы', programs, filters.programs, handleProgramToggle)}
            {renderSection('Специализации', specializations, filters.specializations, handleSpecializationToggle)}
            {renderSection('Удобства', amenities, filters.amenities, handleAmenityToggle)}
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={[styles.resetButton, styles.outlineButton]} onPress={handleReset}>
              <LinearGradient colors={['#FFFFFF', '#FFFFFF']} style={styles.resetGradient}>
                <Ionicons name="refresh" size={18} color="#42A5F5" />
                <Text style={styles.outlineButtonText}>Сбросить</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.applyButton, styles.outlineButton]} onPress={handleApply}>
              <LinearGradient colors={['#FFFFFF', '#FFFFFF']} style={styles.applyGradient}>
                <Ionicons name="checkmark" size={20} color="#42A5F5" />
                <Text style={styles.outlineButtonText}>Применить</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );
});

AdvancedFilters.displayName = 'AdvancedFilters';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: responsivePadding(20),
    paddingVertical: responsivePadding(16),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(66, 165, 245, 0.1)',
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
  },
  buttonBlur: {
    borderRadius: 22,
    overflow: 'hidden',
  },
  buttonGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: responsiveWidth(20),
    fontWeight: '700',
    color: '#1a1a1a',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: responsivePadding(20),
  },
  section: {
    paddingVertical: responsivePadding(24),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsivePadding(12),
    gap: responsivePadding(6),
  },
  sectionTitle: {
    fontSize: responsiveWidth(18),
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: responsivePadding(16),
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  tagContainer: {
    borderRadius: responsiveWidth(16),
    overflow: 'hidden',
    marginBottom: 5,
  },
  tagSelected: {
    borderWidth: 1,
    borderColor: '#42A5F5',
    backgroundColor: '#FFFFFF',
  },
  tagUnselected: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  tagBlur: {
    borderRadius: responsiveWidth(16),
    overflow: 'hidden',
  },
  tagGradient: {
    paddingHorizontal: responsivePadding(16),
    paddingVertical: responsivePadding(10),
  },
  tagContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsivePadding(6),
  },
  tagText: {
    fontSize: responsiveWidth(14),
    fontWeight: '600',
    color: '#1a1a1a',
  },
  tagTextSelected: {
    color: '#42A5F5',
    fontWeight: '700',
  },
  tagTextUnselected: {
    color: '#1a1a1a',
  },
  locationBlur: {
    borderRadius: responsiveWidth(16),
    overflow: 'hidden',
  },
  locationGradient: {
    padding: responsivePadding(16),
  },
  locationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsivePadding(8),
  },
  locationText: {
    flex: 1,
  },
  locationTitle: {
    fontSize: responsiveWidth(16),
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: responsivePadding(4),
  },
  locationSubtitle: {
    fontSize: responsiveWidth(14),
    color: '#666',
  },
  sliderSection: {
    marginBottom: responsivePadding(16),
  },
  sliderTitle: {
    fontSize: responsiveWidth(16),
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: responsivePadding(16),
  },
  sliderContainer: {
    borderRadius: responsiveWidth(16),
    overflow: 'hidden',
  },
  sliderBlur: {
    borderRadius: responsiveWidth(16),
    overflow: 'hidden',
  },
  sliderGradient: {
    padding: responsivePadding(16),
  },
  sliderTrack: {
    height: responsiveHeight(8),
    backgroundColor: 'rgba(66, 165, 245, 0.2)',
    borderRadius: responsiveWidth(4),
    position: 'relative',
    marginBottom: responsivePadding(12),
  },
  sliderActiveTrack: {
    position: 'absolute',
    height: '100%',
    backgroundColor: '#42A5F5',
    borderRadius: responsiveWidth(4),
  },
  sliderThumb: {
    position: 'absolute',
    top: -responsiveHeight(8),
    width: responsiveWidth(32),
    height: responsiveWidth(32),
    borderRadius: responsiveWidth(16),
    overflow: 'hidden',
  },
  thumbBlur: {
    borderRadius: responsiveWidth(16),
    overflow: 'hidden',
  },
  thumbGradient: {
    width: responsiveWidth(32),
    height: responsiveWidth(32),
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbText: {
    fontSize: responsiveWidth(10),
    fontWeight: '700',
    color: '#FFFFFF',
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderLabel: {
    fontSize: responsiveWidth(12),
    color: '#666',
  },
  sliderButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: responsivePadding(16),
    marginTop: responsivePadding(12),
  },
  sliderButton: {
    width: responsiveWidth(40),
    height: responsiveWidth(40),
    borderRadius: responsiveWidth(20),
    backgroundColor: '#42A5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderButtonText: {
    fontSize: responsiveWidth(20),
    fontWeight: '700',
    color: '#FFFFFF',
  },
  distanceSlider: {
    marginTop: responsivePadding(16),
  },
  distanceLabel: {
    fontSize: responsiveWidth(14),
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: responsivePadding(8),
  },
  distanceTrack: {
    height: responsiveHeight(8),
    backgroundColor: 'rgba(66, 165, 245, 0.2)',
    borderRadius: responsiveWidth(4),
    position: 'relative',
    marginBottom: responsivePadding(8),
  },
  distanceActiveTrack: {
    position: 'absolute',
    height: '100%',
    backgroundColor: '#42A5F5',
    borderRadius: responsiveWidth(4),
  },
  distanceThumb: {
    position: 'absolute',
    top: -responsiveHeight(8),
    width: responsiveWidth(32),
    height: responsiveWidth(32),
    borderRadius: responsiveWidth(16),
    overflow: 'hidden',
  },
  distanceThumbBlur: {
    borderRadius: responsiveWidth(16),
    overflow: 'hidden',
  },
  distanceThumbGradient: {
    width: responsiveWidth(32),
    height: responsiveWidth(32),
    alignItems: 'center',
    justifyContent: 'center',
  },
  distanceThumbText: {
    fontSize: responsiveWidth(10),
    fontWeight: '700',
    color: '#FFFFFF',
  },
  distanceLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  distanceLabelText: {
    fontSize: responsiveWidth(12),
    color: '#666',
  },
  priceBlur: {
    borderRadius: responsiveWidth(16),
    overflow: 'hidden',
  },
  priceGradient: {
    padding: responsivePadding(16),
  },
  priceOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: responsivePadding(8),
    marginBottom: responsivePadding(16),
  },
  priceOption: {
    borderRadius: responsiveWidth(12),
    overflow: 'hidden',
  },
  priceOptionSelected: {
    borderWidth: 1,
    borderColor: '#42A5F5',
    backgroundColor: '#FFFFFF',
  },
  priceOptionUnselected: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  priceBlur: {
    borderRadius: responsiveWidth(12),
    overflow: 'hidden',
  },
  priceGradient: {
    paddingHorizontal: responsivePadding(12),
    paddingVertical: responsivePadding(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceOptionText: {
    fontSize: responsiveWidth(12),
    fontWeight: '600',
    color: '#1a1a1a',
  },
  priceOptionTextSelected: {
    color: '#42A5F5',
    fontWeight: '700',
  },
  priceOptionTextUnselected: {
    color: '#1a1a1a',
  },
  priceSlider: {
    marginTop: responsivePadding(8),
  },
  priceSliderLabel: {
    fontSize: responsiveWidth(14),
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: responsivePadding(8),
  },
  priceTrack: {
    height: responsiveHeight(8),
    backgroundColor: 'rgba(66, 165, 245, 0.2)',
    borderRadius: responsiveWidth(4),
    position: 'relative',
    marginBottom: responsivePadding(8),
  },
  priceActiveTrack: {
    position: 'absolute',
    height: '100%',
    backgroundColor: '#42A5F5',
    borderRadius: responsiveWidth(4),
  },
  priceThumb: {
    position: 'absolute',
    top: -responsiveHeight(8),
    width: responsiveWidth(32),
    height: responsiveWidth(32),
    borderRadius: responsiveWidth(16),
    overflow: 'hidden',
  },
  priceThumbBlur: {
    borderRadius: responsiveWidth(16),
    overflow: 'hidden',
  },
  priceThumbGradient: {
    width: responsiveWidth(32),
    height: responsiveWidth(32),
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceThumbText: {
    fontSize: responsiveWidth(10),
    fontWeight: '700',
    color: '#FFFFFF',
  },
  priceLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceLabelText: {
    fontSize: responsiveWidth(12),
    color: '#666',
  },
  locationOptions: {
    flexDirection: 'row',
    gap: responsivePadding(12),
  },
  locationOption: {
    flex: 1,
    borderRadius: responsiveWidth(12),
    overflow: 'hidden',
  },
  locationBlur: {
    borderRadius: responsiveWidth(12),
    overflow: 'hidden',
  },
  locationGradient: {
    paddingVertical: responsivePadding(12),
    paddingHorizontal: responsivePadding(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationOptionSelected: {
    borderWidth: 1,
    borderColor: '#42A5F5',
    backgroundColor: '#FFFFFF',
  },
  locationOptionUnselected: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  locationOptionText: {
    fontSize: responsiveWidth(14),
    fontWeight: '600',
    color: '#1a1a1a',
  },
  locationOptionTextSelected: {
    color: '#42A5F5',
    fontWeight: '700',
  },
  locationOptionTextUnselected: {
    color: '#1a1a1a',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: responsivePadding(20),
    paddingVertical: responsivePadding(20),
    paddingBottom: responsivePadding(30),
    gap: responsivePadding(12),
    borderTopWidth: 1,
    borderTopColor: 'rgba(66, 165, 245, 0.1)',
  },
  resetButton: {
    flex: 1,
    marginRight: responsivePadding(8),
    borderRadius: responsiveWidth(16),
    overflow: 'hidden',
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: '#42A5F5',
    backgroundColor: '#FFFFFF',
  },
  resetBlur: {
    borderRadius: responsiveWidth(16),
    overflow: 'hidden',
  },
  resetGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: responsivePadding(16),
    paddingHorizontal: responsivePadding(20),
    gap: responsivePadding(8),
  },
  outlineButtonText: {
    fontSize: responsiveWidth(16),
    fontWeight: '700',
    color: '#42A5F5',
  },
  applyButton: {
    flex: 1,
    borderRadius: responsiveWidth(16),
    overflow: 'hidden',
  },
  applyBlur: {
    borderRadius: responsiveWidth(16),
    overflow: 'hidden',
  },
  applyGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: responsivePadding(16),
    gap: responsivePadding(8),
  },
  applyButtonText: {
    fontSize: responsiveWidth(16),
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default AdvancedFilters;