import React, { memo, useState, useCallback, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Filters } from '../../types';

interface FiltersModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: Filters) => void;
  initialFilters: Filters;
}

const FiltersModal: React.FC<FiltersModalProps> = memo(({
  visible,
  onClose,
  onApply,
  initialFilters
}) => {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [expandedSections, setExpandedSections] = useState<{
    cities: boolean;
    types: boolean;
    price: boolean;
    rating: boolean;
  }>({
    cities: false,
    types: false,
    price: false,
    rating: false,
  });

  // Анимации
  const slideAnim = useState(new Animated.Value(300))[0];
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 300,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const cities = [
    'Москва', 'Санкт-Петербург', 'Казань', 'Екатеринбург', 'Новосибирск',
    'Нижний Новгород', 'Самара', 'Омск', 'Ростов-на-Дону', 'Уфа'
  ];

  const types = [
    'Алкоголизм', 'Наркомания', 'Игромания', 'Пищевая зависимость', 'Табакокурение'
  ];

  const sortOptions = [
    { value: 'rating', label: 'По рейтингу' },
    { value: 'price', label: 'По цене' },
    { value: 'name', label: 'По названию' },
    { value: 'reviewsCount', label: 'По количеству отзывов' },
  ];

  const toggleSection = useCallback((section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  }, []);

  const toggleCity = useCallback((city: string) => {
    setFilters(prev => ({
      ...prev,
      cities: prev.cities.includes(city)
        ? prev.cities.filter(c => c !== city)
        : [...prev.cities, city]
    }));
  }, []);

  const toggleType = useCallback((type: string) => {
    setFilters(prev => ({
      ...prev,
      types: prev.types.includes(type)
        ? prev.types.filter(t => t !== type)
        : [...prev.types, type]
    }));
  }, []);

  const updatePrice = useCallback((field: 'minPrice' | 'maxPrice', value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const updateRating = useCallback((rating: number) => {
    setFilters(prev => ({
      ...prev,
      minRating: rating
    }));
  }, []);

  const updateSortBy = useCallback((sortBy: 'rating' | 'price' | 'name' | 'reviewsCount') => {
    setFilters(prev => ({
      ...prev,
      sortBy
    }));
  }, []);

  const toggleSortOrder = useCallback(() => {
    setFilters(prev => ({
      ...prev,
      sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  const resetFilters = useCallback(() => {
    const resetFilters: Filters = {
      cities: [],
      types: [],
      minPrice: '',
      maxPrice: '',
      minRating: 0,
      sortBy: 'rating',
      sortOrder: 'desc',
    };
    setFilters(resetFilters);
  }, []);

  const handleApply = useCallback(() => {
    onApply(filters);
    onClose();
  }, [filters, onApply, onClose]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
      <Animated.View style={[styles.modal, { transform: [{ translateY: slideAnim }] }]}>
        <BlurView intensity={20} tint="light" style={styles.modalBlur}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.9)']}
            style={styles.modalGradient}
          >
            <View style={styles.header}>
              <Text style={styles.title}>Фильтры</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <BlurView intensity={10} tint="light" style={styles.closeBlur}>
                  <LinearGradient
                    colors={['rgba(129, 212, 250, 0.3)', 'rgba(66, 165, 245, 0.2)']}
                    style={styles.closeGradient}
                  >
                    <Ionicons name="close" size={20} color="#42A5F5" />
                  </LinearGradient>
                </BlurView>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
              {/* Города */}
              <View style={styles.section}>
                <TouchableOpacity
                  style={styles.sectionHeader}
                  onPress={() => toggleSection('cities')}
                >
                  <BlurView intensity={10} tint="light" style={styles.sectionBlur}>
                    <LinearGradient
                      colors={['rgba(129, 212, 250, 0.2)', 'rgba(66, 165, 245, 0.1)']}
                      style={styles.sectionGradient}
                    >
                      <Text style={styles.sectionTitle}>Города</Text>
                      <Ionicons
                        name={expandedSections.cities ? "chevron-up" : "chevron-down"}
                        size={20}
                        color="#42A5F5"
                      />
                    </LinearGradient>
                  </BlurView>
                </TouchableOpacity>
                {expandedSections.cities && (
                  <View style={styles.optionsContainer}>
                    {cities.map(city => (
                      <TouchableOpacity
                        key={city}
                        style={styles.option}
                        onPress={() => toggleCity(city)}
                      >
                        <BlurView intensity={10} tint="light" style={styles.optionBlur}>
                          <LinearGradient
                            colors={filters.cities.includes(city) 
                              ? ['rgba(129, 212, 250, 0.4)', 'rgba(66, 165, 245, 0.3)']
                              : ['rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.6)']
                            }
                            style={styles.optionGradient}
                          >
                            <Text style={[
                              styles.optionText,
                              filters.cities.includes(city) && styles.selectedOptionText
                            ]}>
                              {city}
                            </Text>
                            {filters.cities.includes(city) && (
                              <Ionicons name="checkmark" size={16} color="#42A5F5" />
                            )}
                          </LinearGradient>
                        </BlurView>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Типы зависимостей */}
              <View style={styles.section}>
                <TouchableOpacity
                  style={styles.sectionHeader}
                  onPress={() => toggleSection('types')}
                >
                  <BlurView intensity={10} tint="light" style={styles.sectionBlur}>
                    <LinearGradient
                      colors={['rgba(129, 212, 250, 0.2)', 'rgba(66, 165, 245, 0.1)']}
                      style={styles.sectionGradient}
                    >
                      <Text style={styles.sectionTitle}>Типы зависимостей</Text>
                      <Ionicons
                        name={expandedSections.types ? "chevron-up" : "chevron-down"}
                        size={20}
                        color="#42A5F5"
                      />
                    </LinearGradient>
                  </BlurView>
                </TouchableOpacity>
                {expandedSections.types && (
                  <View style={styles.optionsContainer}>
                    {types.map(type => (
                      <TouchableOpacity
                        key={type}
                        style={styles.option}
                        onPress={() => toggleType(type)}
                      >
                        <BlurView intensity={10} tint="light" style={styles.optionBlur}>
                          <LinearGradient
                            colors={filters.types.includes(type) 
                              ? ['rgba(129, 212, 250, 0.4)', 'rgba(66, 165, 245, 0.3)']
                              : ['rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.6)']
                            }
                            style={styles.optionGradient}
                          >
                            <Text style={[
                              styles.optionText,
                              filters.types.includes(type) && styles.selectedOptionText
                            ]}>
                              {type}
                            </Text>
                            {filters.types.includes(type) && (
                              <Ionicons name="checkmark" size={16} color="#42A5F5" />
                            )}
                          </LinearGradient>
                        </BlurView>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Цена */}
              <View style={styles.section}>
                <TouchableOpacity
                  style={styles.sectionHeader}
                  onPress={() => toggleSection('price')}
                >
                  <BlurView intensity={10} tint="light" style={styles.sectionBlur}>
                    <LinearGradient
                      colors={['rgba(129, 212, 250, 0.2)', 'rgba(66, 165, 245, 0.1)']}
                      style={styles.sectionGradient}
                    >
                      <Text style={styles.sectionTitle}>Цена за месяц</Text>
                      <Ionicons
                        name={expandedSections.price ? "chevron-up" : "chevron-down"}
                        size={20}
                        color="#42A5F5"
                      />
                    </LinearGradient>
                  </BlurView>
                </TouchableOpacity>
                {expandedSections.price && (
                  <View style={styles.priceContainer}>
                    <View style={styles.priceInputContainer}>
                      <Text style={styles.priceLabel}>От</Text>
                      <BlurView intensity={10} tint="light" style={styles.inputBlur}>
                        <TextInput
                          style={styles.priceInput}
                          placeholder="0"
                          value={filters.minPrice}
                          onChangeText={(value) => updatePrice('minPrice', value)}
                          keyboardType="numeric"
                          placeholderTextColor="#999"
                        />
                      </BlurView>
                      <Text style={styles.priceLabel}>₽</Text>
                    </View>
                    <View style={styles.priceInputContainer}>
                      <Text style={styles.priceLabel}>До</Text>
                      <BlurView intensity={10} tint="light" style={styles.inputBlur}>
                        <TextInput
                          style={styles.priceInput}
                          placeholder="100000"
                          value={filters.maxPrice}
                          onChangeText={(value) => updatePrice('maxPrice', value)}
                          keyboardType="numeric"
                          placeholderTextColor="#999"
                        />
                      </BlurView>
                      <Text style={styles.priceLabel}>₽</Text>
                    </View>
                  </View>
                )}
              </View>

              {/* Рейтинг */}
              <View style={styles.section}>
                <TouchableOpacity
                  style={styles.sectionHeader}
                  onPress={() => toggleSection('rating')}
                >
                  <BlurView intensity={10} tint="light" style={styles.sectionBlur}>
                    <LinearGradient
                      colors={['rgba(129, 212, 250, 0.2)', 'rgba(66, 165, 245, 0.1)']}
                      style={styles.sectionGradient}
                    >
                      <Text style={styles.sectionTitle}>Минимальный рейтинг</Text>
                      <Ionicons
                        name={expandedSections.rating ? "chevron-up" : "chevron-down"}
                        size={20}
                        color="#42A5F5"
                      />
                    </LinearGradient>
                  </BlurView>
                </TouchableOpacity>
                {expandedSections.rating && (
                  <View style={styles.ratingContainer}>
                    {[0, 3, 3.5, 4, 4.5, 5].map(rating => (
                      <TouchableOpacity
                        key={rating}
                        style={styles.ratingOption}
                        onPress={() => updateRating(rating)}
                      >
                        <BlurView intensity={10} tint="light" style={styles.ratingBlur}>
                          <LinearGradient
                            colors={filters.minRating === rating 
                              ? ['#81D4FA', '#42A5F5']
                              : ['rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.6)']
                            }
                            style={styles.ratingGradient}
                          >
                            <Text style={[
                              styles.ratingText,
                              filters.minRating === rating && styles.selectedRatingText
                            ]}>
                              {rating === 0 ? 'Любой' : `${rating}+`}
                            </Text>
                          </LinearGradient>
                        </BlurView>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Сортировка */}
              <View style={styles.section}>
                <BlurView intensity={10} tint="light" style={styles.sectionBlur}>
                  <LinearGradient
                    colors={['rgba(129, 212, 250, 0.2)', 'rgba(66, 165, 245, 0.1)']}
                    style={styles.sectionGradient}
                  >
                    <Text style={styles.sectionTitle}>Сортировка</Text>
                  </LinearGradient>
                </BlurView>
                <View style={styles.sortContainer}>
                  {sortOptions.map(option => (
                    <TouchableOpacity
                      key={option.value}
                      style={styles.sortOption}
                      onPress={() => updateSortBy(option.value as any)}
                    >
                      <BlurView intensity={10} tint="light" style={styles.sortBlur}>
                        <LinearGradient
                          colors={filters.sortBy === option.value 
                            ? ['#81D4FA', '#42A5F5']
                            : ['rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.6)']
                          }
                          style={styles.sortGradient}
                        >
                          <Text style={[
                            styles.sortText,
                            filters.sortBy === option.value && styles.selectedSortText
                          ]}>
                            {option.label}
                          </Text>
                        </LinearGradient>
                      </BlurView>
                    </TouchableOpacity>
                  ))}
                </View>
                <TouchableOpacity
                  style={styles.sortOrderButton}
                  onPress={toggleSortOrder}
                >
                  <BlurView intensity={10} tint="light" style={styles.sortOrderBlur}>
                    <LinearGradient
                      colors={['rgba(129, 212, 250, 0.3)', 'rgba(66, 165, 245, 0.2)']}
                      style={styles.sortOrderGradient}
                    >
                      <Ionicons
                        name={filters.sortOrder === 'asc' ? "arrow-up" : "arrow-down"}
                        size={20}
                        color="#42A5F5"
                      />
                      <Text style={styles.sortOrderText}>
                        {filters.sortOrder === 'asc' ? 'По возрастанию' : 'По убыванию'}
                      </Text>
                    </LinearGradient>
                  </BlurView>
                </TouchableOpacity>
              </View>
            </ScrollView>

            <View style={styles.footer}>
              <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
                <BlurView intensity={10} tint="light" style={styles.buttonBlur}>
                  <LinearGradient
                    colors={['rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.6)']}
                    style={styles.buttonGradient}
                  >
                    <Text style={styles.resetButtonText}>Сбросить</Text>
                  </LinearGradient>
                </BlurView>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
                <BlurView intensity={10} tint="light" style={styles.buttonBlur}>
                  <LinearGradient
                    colors={['#81D4FA', '#42A5F5']}
                    style={styles.buttonGradient}
                  >
                    <Text style={styles.applyButtonText}>Применить</Text>
                  </LinearGradient>
                </BlurView>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </BlurView>
      </Animated.View>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  modal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    minHeight: '60%',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  modalBlur: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
  },
  modalGradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(129, 212, 250, 0.2)',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: -0.5,
  },
  closeButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  closeBlur: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  closeGradient: {
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 8,
  },
  sectionBlur: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  sectionGradient: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    letterSpacing: -0.3,
  },
  optionsContainer: {
    marginTop: 8,
  },
  option: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
  },
  optionBlur: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  optionGradient: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  optionText: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  selectedOptionText: {
    color: '#42A5F5',
    fontWeight: '600',
  },
  priceContainer: {
    marginTop: 8,
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 16,
    color: '#1a1a1a',
    marginRight: 12,
    fontWeight: '500',
  },
  inputBlur: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 12,
  },
  priceInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  ratingOption: {
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 8,
    marginBottom: 8,
  },
  ratingBlur: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  ratingGradient: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  selectedRatingText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  sortContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  sortOption: {
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 8,
    marginBottom: 8,
  },
  sortBlur: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  sortGradient: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
  sortText: {
    fontSize: 14,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  selectedSortText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  sortOrderButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 12,
  },
  sortOrderBlur: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  sortOrderGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  sortOrderText: {
    fontSize: 16,
    color: '#42A5F5',
    fontWeight: '500',
    marginLeft: 8,
  },
  footer: {
    flexDirection: 'row',
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(129, 212, 250, 0.2)',
    gap: 12,
  },
  resetButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  applyButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  buttonBlur: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default FiltersModal;