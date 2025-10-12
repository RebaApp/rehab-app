import React, { memo, useState, useCallback, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Switch,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../../utils/constants';
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
    <View style={styles.overlay}>
      <View style={styles.modal}>
        <View style={styles.header}>
          <Text style={styles.title}>Фильтры</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={THEME.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Города */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => toggleSection('cities')}
            >
              <Text style={styles.sectionTitle}>Города</Text>
              <Ionicons
                name={expandedSections.cities ? "chevron-up" : "chevron-down"}
                size={20}
                color={THEME.primary}
              />
            </TouchableOpacity>
            {expandedSections.cities && (
              <View style={styles.optionsContainer}>
                {cities.map(city => (
                  <TouchableOpacity
                    key={city}
                    style={[
                      styles.option,
                      filters.cities.includes(city) && styles.selectedOption
                    ]}
                    onPress={() => toggleCity(city)}
                  >
                    <Text style={[
                      styles.optionText,
                      filters.cities.includes(city) && styles.selectedOptionText
                    ]}>
                      {city}
                    </Text>
                    {filters.cities.includes(city) && (
                      <Ionicons name="checkmark" size={16} color={THEME.primary} />
                    )}
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
              <Text style={styles.sectionTitle}>Типы зависимостей</Text>
              <Ionicons
                name={expandedSections.types ? "chevron-up" : "chevron-down"}
                size={20}
                color={THEME.primary}
              />
            </TouchableOpacity>
            {expandedSections.types && (
              <View style={styles.optionsContainer}>
                {types.map(type => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.option,
                      filters.types.includes(type) && styles.selectedOption
                    ]}
                    onPress={() => toggleType(type)}
                  >
                    <Text style={[
                      styles.optionText,
                      filters.types.includes(type) && styles.selectedOptionText
                    ]}>
                      {type}
                    </Text>
                    {filters.types.includes(type) && (
                      <Ionicons name="checkmark" size={16} color={THEME.primary} />
                    )}
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
              <Text style={styles.sectionTitle}>Цена за месяц</Text>
              <Ionicons
                name={expandedSections.price ? "chevron-up" : "chevron-down"}
                size={20}
                color={THEME.primary}
              />
            </TouchableOpacity>
            {expandedSections.price && (
              <View style={styles.priceContainer}>
                <View style={styles.priceInputContainer}>
                  <Text style={styles.priceLabel}>От</Text>
                  <TextInput
                    style={styles.priceInput}
                    placeholder="0"
                    value={filters.minPrice}
                    onChangeText={(value) => updatePrice('minPrice', value)}
                    keyboardType="numeric"
                    placeholderTextColor={THEME.muted}
                  />
                  <Text style={styles.priceLabel}>₽</Text>
                </View>
                <View style={styles.priceInputContainer}>
                  <Text style={styles.priceLabel}>До</Text>
                  <TextInput
                    style={styles.priceInput}
                    placeholder="100000"
                    value={filters.maxPrice}
                    onChangeText={(value) => updatePrice('maxPrice', value)}
                    keyboardType="numeric"
                    placeholderTextColor={THEME.muted}
                  />
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
              <Text style={styles.sectionTitle}>Минимальный рейтинг</Text>
              <Ionicons
                name={expandedSections.rating ? "chevron-up" : "chevron-down"}
                size={20}
                color={THEME.primary}
              />
            </TouchableOpacity>
            {expandedSections.rating && (
              <View style={styles.ratingContainer}>
                {[0, 3, 3.5, 4, 4.5, 5].map(rating => (
                  <TouchableOpacity
                    key={rating}
                    style={[
                      styles.ratingOption,
                      filters.minRating === rating && styles.selectedRatingOption
                    ]}
                    onPress={() => updateRating(rating)}
                  >
                    <Text style={[
                      styles.ratingText,
                      filters.minRating === rating && styles.selectedRatingText
                    ]}>
                      {rating === 0 ? 'Любой' : `${rating}+`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Сортировка */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Сортировка</Text>
            <View style={styles.sortContainer}>
              {sortOptions.map(option => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.sortOption,
                    filters.sortBy === option.value && styles.selectedSortOption
                  ]}
                  onPress={() => updateSortBy(option.value as any)}
                >
                  <Text style={[
                    styles.sortText,
                    filters.sortBy === option.value && styles.selectedSortText
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={styles.sortOrderButton}
              onPress={toggleSortOrder}
            >
              <Ionicons
                name={filters.sortOrder === 'asc' ? "arrow-up" : "arrow-down"}
                size={20}
                color={THEME.primary}
              />
              <Text style={styles.sortOrderText}>
                {filters.sortOrder === 'asc' ? 'По возрастанию' : 'По убыванию'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
            <Text style={styles.resetButtonText}>Сбросить</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyButtonText}>Применить</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    minHeight: '60%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: THEME.text,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.text,
  },
  optionsContainer: {
    marginTop: 8,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 4,
    backgroundColor: 'rgba(26, 132, 255, 0.05)',
  },
  selectedOption: {
    backgroundColor: 'rgba(26, 132, 255, 0.15)',
  },
  optionText: {
    fontSize: 14,
    color: THEME.text,
  },
  selectedOptionText: {
    color: THEME.primary,
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
    fontSize: 14,
    color: THEME.text,
    marginRight: 8,
  },
  priceInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: THEME.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: THEME.text,
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  ratingOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(26, 132, 255, 0.1)',
    marginRight: 8,
    marginBottom: 8,
  },
  selectedRatingOption: {
    backgroundColor: THEME.primary,
  },
  ratingText: {
    fontSize: 14,
    color: THEME.primary,
    fontWeight: '500',
  },
  selectedRatingText: {
    color: 'white',
  },
  sortContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  sortOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(26, 132, 255, 0.1)',
    marginRight: 8,
    marginBottom: 8,
  },
  selectedSortOption: {
    backgroundColor: THEME.primary,
  },
  sortText: {
    fontSize: 14,
    color: THEME.primary,
    fontWeight: '500',
  },
  selectedSortText: {
    color: 'white',
  },
  sortOrderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(26, 132, 255, 0.1)',
    marginTop: 8,
  },
  sortOrderText: {
    fontSize: 14,
    color: THEME.primary,
    fontWeight: '500',
    marginLeft: 8,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: THEME.border,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    marginRight: 12,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.text,
  },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: THEME.primary,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});

export default FiltersModal;