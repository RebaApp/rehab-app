import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Animated,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';
import { Center } from '../types';
import { responsiveWidth, responsivePadding, responsiveFontSize } from '../utils/responsive';
import useAppStore from '../store/useAppStore';
import apiService from '../services/apiService';

interface AddEditCenterScreenProps {
  center?: Center; // Если передан, то редактирование, иначе - создание
  onClose: () => void;
  onSuccess?: (center: Center) => void;
}

const AddEditCenterScreen: React.FC<AddEditCenterScreenProps> = ({ center, onClose, onSuccess }) => {
  const isEditMode = !!center;
  
  const [formData, setFormData] = useState({
    name: center?.name || '',
    city: center?.city || '',
    address: center?.address || '',
    description: center?.description || '',
    phone: center?.phone || '',
    email: center?.email || '',
    website: center?.website || '',
    workingHours: center?.workingHours || '',
    capacity: center?.capacity?.toString() || '',
    yearFounded: center?.yearFounded?.toString() || '',
    license: center?.license || '',
    price: center?.price || '',
    latitude: center?.coordinates?.latitude?.toString() || '',
    longitude: center?.coordinates?.longitude?.toString() || '',
    photos: center?.photos || [] as string[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Анимации
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Валидация формы
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Обязательные поля
    if (!formData.name.trim()) {
      newErrors.name = 'Название обязательно';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Название должно содержать минимум 2 символа';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'Город обязателен';
    } else if (formData.city.trim().length < 2) {
      newErrors.city = 'Город должен содержать минимум 2 символа';
    }

    // Валидация телефона (если указан)
    if (formData.phone && formData.phone.trim()) {
      const phoneRegex = /^(\+7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
      if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
        newErrors.phone = 'Некорректный формат телефона';
      }
    }

    // Валидация email (если указан)
    if (formData.email && formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Некорректный формат email';
      }
    }

    // Валидация website (если указан)
    if (formData.website && formData.website.trim()) {
      try {
        new URL(formData.website);
      } catch {
        newErrors.website = 'Некорректный URL';
      }
    }

    // Валидация capacity (если указан)
    if (formData.capacity && formData.capacity.trim()) {
      const capacityNum = parseInt(formData.capacity);
      if (isNaN(capacityNum) || capacityNum < 1) {
        newErrors.capacity = 'Вместимость должна быть положительным числом';
      }
    }

    // Валидация yearFounded (если указан)
    if (formData.yearFounded && formData.yearFounded.trim()) {
      const yearNum = parseInt(formData.yearFounded);
      const currentYear = new Date().getFullYear();
      if (isNaN(yearNum) || yearNum < 1900 || yearNum > currentYear) {
        newErrors.yearFounded = `Год должен быть от 1900 до ${currentYear}`;
      }
    }

    // Валидация координат (если указаны)
    if (formData.latitude && formData.latitude.trim()) {
      const lat = parseFloat(formData.latitude);
      if (isNaN(lat) || lat < -90 || lat > 90) {
        newErrors.latitude = 'Широта должна быть от -90 до 90';
      }
    }

    if (formData.longitude && formData.longitude.trim()) {
      const lng = parseFloat(formData.longitude);
      if (isNaN(lng) || lng < -180 || lng > 180) {
        newErrors.longitude = 'Долгота должна быть от -180 до 180';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Загрузка фото
  const pickImage = async () => {
    try {
      setUploadingPhoto(true);
      
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Ошибка', 'Необходимо разрешение на доступ к фотографиям');
        setUploadingPhoto(false);
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        // В реальном приложении здесь нужно загрузить изображение на сервер
        // Пока сохраняем локальный URI
        setFormData({ ...formData, photos: [...formData.photos, result.assets[0].uri] });
      }
    } catch (error) {
      console.error('Ошибка выбора изображения:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить изображение');
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Удаление фото
  const removePhoto = (index: number) => {
    const newPhotos = formData.photos.filter((_, i) => i !== index);
    setFormData({ ...formData, photos: newPhotos });
  };

  // Сохранение центра
  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const centerData: any = {
        name: formData.name.trim(),
        city: formData.city.trim(),
        ...(formData.address.trim() && { address: formData.address.trim() }),
        ...(formData.description.trim() && { description: formData.description.trim() }),
        ...(formData.phone.trim() && { phone: formData.phone.trim() }),
        ...(formData.email.trim() && { email: formData.email.trim() }),
        ...(formData.website.trim() && { website: formData.website.trim() }),
        ...(formData.workingHours.trim() && { workingHours: formData.workingHours.trim() }),
        ...(formData.capacity.trim() && { capacity: parseInt(formData.capacity) }),
        ...(formData.yearFounded.trim() && { yearFounded: parseInt(formData.yearFounded) }),
        ...(formData.license.trim() && { license: formData.license.trim() }),
        ...(formData.price.trim() && { price: formData.price.trim() }),
      };

      // Добавляем координаты, если указаны
      if (formData.latitude.trim() && formData.longitude.trim()) {
        centerData.coordinates = {
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
        };
      }

      let result;
      if (isEditMode && center) {
        // Редактирование
        result = await apiService.updateCenter(center.id, centerData);
      } else {
        // Создание
        result = await apiService.createCenter(centerData);
      }

      if (result.success && result.data) {
        // Обновляем список центров в store
        const { loadCenters } = useAppStore.getState();
        await loadCenters();
        
        // Показываем сообщение о модерации
        if (!isEditMode) {
          Alert.alert(
            'Центр создан',
            'Ваш центр отправлен на модерацию. После проверки вы сможете оплатить подписку и центр появится в поиске.',
            [
              {
                text: 'OK',
                onPress: () => {
                  if (onSuccess) {
                    onSuccess(result.data);
                  }
                  onClose();
                },
              },
            ]
          );
        } else {
          if (onSuccess) {
            onSuccess(result.data);
          }
          onClose();
        }
      } else {
        const errorMessage = result.error || 'Не удалось сохранить центр';
        let userFriendlyMessage = 'Не удалось сохранить центр';
        
        if (errorMessage.includes('validation') || errorMessage.includes('Validation')) {
          userFriendlyMessage = 'Проверьте правильность введенных данных';
        } else if (errorMessage.includes('unauthorized') || errorMessage.includes('Unauthorized')) {
          userFriendlyMessage = 'Не удалось сохранить. Проверьте авторизацию';
        }
        
        Alert.alert('Ошибка', userFriendlyMessage);
      }
    } catch (error) {
      console.error('Ошибка сохранения центра:', error);
      Alert.alert('Ошибка', 'Произошла ошибка при сохранении центра');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Заголовок */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={24} color="#1a1a1a" />
            </TouchableOpacity>
            <Text style={styles.title}>
              {isEditMode ? 'Редактирование центра' : 'Добавление центра'}
            </Text>
            <View style={styles.placeholder} />
          </View>

          {/* Форма */}
          <View style={styles.formContainer}>
            {/* Название * */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Название центра *</Text>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                value={formData.name}
                onChangeText={(text) => {
                  setFormData({ ...formData, name: text });
                  if (errors.name) {
                    setErrors({ ...errors, name: '' });
                  }
                }}
                placeholder="Введите название центра"
                placeholderTextColor="#999"
              />
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            {/* Город * */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Город *</Text>
              <TextInput
                style={[styles.input, errors.city && styles.inputError]}
                value={formData.city}
                onChangeText={(text) => {
                  setFormData({ ...formData, city: text });
                  if (errors.city) {
                    setErrors({ ...errors, city: '' });
                  }
                }}
                placeholder="Введите город"
                placeholderTextColor="#999"
              />
              {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
            </View>

            {/* Адрес */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Адрес</Text>
              <TextInput
                style={styles.input}
                value={formData.address}
                onChangeText={(text) => setFormData({ ...formData, address: text })}
                placeholder="Введите адрес"
                placeholderTextColor="#999"
              />
            </View>

            {/* Описание */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Описание</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                placeholder="Введите описание центра"
                placeholderTextColor="#999"
                multiline
                numberOfLines={4}
              />
            </View>

            {/* Телефон */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Телефон</Text>
              <TextInput
                style={[styles.input, errors.phone && styles.inputError]}
                value={formData.phone}
                onChangeText={(text) => {
                  setFormData({ ...formData, phone: text });
                  if (errors.phone) {
                    setErrors({ ...errors, phone: '' });
                  }
                }}
                placeholder="+7 (999) 123-45-67"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
              />
              {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                value={formData.email}
                onChangeText={(text) => {
                  setFormData({ ...formData, email: text });
                  if (errors.email) {
                    setErrors({ ...errors, email: '' });
                  }
                }}
                placeholder="info@center.ru"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            {/* Сайт */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Сайт</Text>
              <TextInput
                style={[styles.input, errors.website && styles.inputError]}
                value={formData.website}
                onChangeText={(text) => {
                  setFormData({ ...formData, website: text });
                  if (errors.website) {
                    setErrors({ ...errors, website: '' });
                  }
                }}
                placeholder="https://center.ru"
                placeholderTextColor="#999"
                keyboardType="url"
                autoCapitalize="none"
              />
              {errors.website && <Text style={styles.errorText}>{errors.website}</Text>}
            </View>

            {/* Режим работы */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Режим работы</Text>
              <TextInput
                style={styles.input}
                value={formData.workingHours}
                onChangeText={(text) => setFormData({ ...formData, workingHours: text })}
                placeholder="Пн-Вс: 9:00-21:00"
                placeholderTextColor="#999"
              />
            </View>

            {/* Вместимость */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Вместимость</Text>
              <TextInput
                style={[styles.input, errors.capacity && styles.inputError]}
                value={formData.capacity}
                onChangeText={(text) => {
                  const numericValue = text.replace(/[^0-9]/g, '');
                  setFormData({ ...formData, capacity: numericValue });
                  if (errors.capacity) {
                    setErrors({ ...errors, capacity: '' });
                  }
                }}
                placeholder="50"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
              {errors.capacity && <Text style={styles.errorText}>{errors.capacity}</Text>}
            </View>

            {/* Год основания */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Год основания</Text>
              <TextInput
                style={[styles.input, errors.yearFounded && styles.inputError]}
                value={formData.yearFounded}
                onChangeText={(text) => {
                  const numericValue = text.replace(/[^0-9]/g, '');
                  setFormData({ ...formData, yearFounded: numericValue });
                  if (errors.yearFounded) {
                    setErrors({ ...errors, yearFounded: '' });
                  }
                }}
                placeholder="2010"
                placeholderTextColor="#999"
                keyboardType="numeric"
                maxLength={4}
              />
              {errors.yearFounded && <Text style={styles.errorText}>{errors.yearFounded}</Text>}
            </View>

            {/* Лицензия */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Лицензия</Text>
              <TextInput
                style={styles.input}
                value={formData.license}
                onChangeText={(text) => setFormData({ ...formData, license: text })}
                placeholder="Лицензия №123456"
                placeholderTextColor="#999"
              />
            </View>

            {/* Цена */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Цена</Text>
              <TextInput
                style={styles.input}
                value={formData.price}
                onChangeText={(text) => setFormData({ ...formData, price: text })}
                placeholder="от 50,000 ₽/месяц"
                placeholderTextColor="#999"
              />
            </View>

            {/* Координаты */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Координаты (опционально)</Text>
              <View style={styles.coordinatesRow}>
                <View style={styles.coordinateInput}>
                  <Text style={styles.coordinateLabel}>Широта</Text>
                  <TextInput
                    style={[styles.input, styles.coordinateInputField, errors.latitude && styles.inputError]}
                    value={formData.latitude}
                    onChangeText={(text) => {
                      setFormData({ ...formData, latitude: text });
                      if (errors.latitude) {
                        setErrors({ ...errors, latitude: '' });
                      }
                    }}
                    placeholder="55.7558"
                    placeholderTextColor="#999"
                    keyboardType="decimal-pad"
                  />
                  {errors.latitude && <Text style={styles.errorText}>{errors.latitude}</Text>}
                </View>
                <View style={styles.coordinateInput}>
                  <Text style={styles.coordinateLabel}>Долгота</Text>
                  <TextInput
                    style={[styles.input, styles.coordinateInputField, errors.longitude && styles.inputError]}
                    value={formData.longitude}
                    onChangeText={(text) => {
                      setFormData({ ...formData, longitude: text });
                      if (errors.longitude) {
                        setErrors({ ...errors, longitude: '' });
                      }
                    }}
                    placeholder="37.6176"
                    placeholderTextColor="#999"
                    keyboardType="decimal-pad"
                  />
                  {errors.longitude && <Text style={styles.errorText}>{errors.longitude}</Text>}
                </View>
              </View>
            </View>

            {/* Фотографии */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Фотографии</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosContainer}>
                {formData.photos.map((photo, index) => (
                  <View key={index} style={styles.photoItem}>
                    <Image source={{ uri: photo }} style={styles.photoImage} />
                    <TouchableOpacity
                      style={styles.removePhotoButton}
                      onPress={() => removePhoto(index)}
                    >
                      <Ionicons name="close-circle" size={24} color="#F44336" />
                    </TouchableOpacity>
                  </View>
                ))}
                <TouchableOpacity
                  style={styles.addPhotoButton}
                  onPress={pickImage}
                  disabled={uploadingPhoto}
                  activeOpacity={0.7}
                >
                  {uploadingPhoto ? (
                    <ActivityIndicator size="small" color="#42A5F5" />
                  ) : (
                    <>
                      <Ionicons name="camera" size={24} color="#42A5F5" />
                      <Text style={styles.addPhotoText}>Добавить фото</Text>
                    </>
                  )}
                </TouchableOpacity>
              </ScrollView>
            </View>

            {/* Кнопка сохранения */}
            <TouchableOpacity
              style={[styles.saveButton, loading && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={loading}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={loading ? ['#ccc', '#aaa'] : ['#81D4FA', '#42A5F5']}
                style={styles.saveButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                    <Text style={styles.saveButtonText}>
                      {isEditMode ? 'Сохранить изменения' : 'Создать центр'}
                    </Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: responsivePadding(50),
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: responsivePadding(100),
  },
  content: {
    flex: 1,
    paddingHorizontal: responsivePadding(16),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: responsivePadding(24),
  },
  closeButton: {
    padding: responsivePadding(8),
    borderRadius: responsiveWidth(20),
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  title: {
    fontSize: responsiveFontSize(20),
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
    flex: 1,
  },
  placeholder: {
    width: responsiveWidth(40),
  },
  formContainer: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: responsivePadding(16),
  },
  label: {
    fontSize: responsiveFontSize(14),
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: responsivePadding(8),
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: responsiveWidth(12),
    paddingHorizontal: responsivePadding(16),
    paddingVertical: responsivePadding(12),
    fontSize: responsiveFontSize(16),
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  textArea: {
    minHeight: responsivePadding(100),
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#F44336',
  },
  errorText: {
    fontSize: responsiveFontSize(12),
    color: '#F44336',
    marginTop: responsivePadding(4),
  },
  coordinatesRow: {
    flexDirection: 'row',
    gap: responsivePadding(12),
  },
  coordinateInput: {
    flex: 1,
  },
  coordinateLabel: {
    fontSize: responsiveFontSize(12),
    color: '#666',
    marginBottom: responsivePadding(4),
  },
  coordinateInputField: {
    fontSize: responsiveFontSize(14),
  },
  photosContainer: {
    flexDirection: 'row',
    marginTop: responsivePadding(8),
  },
  photoItem: {
    position: 'relative',
    marginRight: responsivePadding(12),
  },
  photoImage: {
    width: responsiveWidth(100),
    height: responsiveWidth(100),
    borderRadius: responsiveWidth(12),
  },
  removePhotoButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#fff',
    borderRadius: responsiveWidth(12),
  },
  addPhotoButton: {
    width: responsiveWidth(100),
    height: responsiveWidth(100),
    borderRadius: responsiveWidth(12),
    borderWidth: 2,
    borderColor: '#42A5F5',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
  },
  addPhotoText: {
    fontSize: responsiveFontSize(12),
    color: '#42A5F5',
    marginTop: responsivePadding(4),
  },
  saveButton: {
    borderRadius: responsiveWidth(12),
    overflow: 'hidden',
    marginTop: responsivePadding(24),
    marginBottom: responsivePadding(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: responsivePadding(16),
    paddingHorizontal: responsivePadding(24),
  },
  saveButtonText: {
    color: '#fff',
    fontSize: responsiveFontSize(16),
    fontWeight: '600',
    marginLeft: responsivePadding(8),
  },
});

export default AddEditCenterScreen;

