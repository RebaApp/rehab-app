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
import { User } from '../types';
import { responsiveWidth, responsiveHeight, responsivePadding, responsiveFontSize } from '../utils/responsive';
import useAppStore from '../store/useAppStore';

interface EditProfileScreenProps {
  user: User;
  onClose: () => void;
  onSuccess?: (user: User) => void;
}

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ user, onClose, onSuccess }) => {
  const { updateProfile } = useAppStore();
  
  const [formData, setFormData] = useState({
    name: user.name || '',
    phone: user.phone || '',
    age: user.age?.toString() || '',
    avatar: user.avatar || user.photo || '',
  });
  
  // Отслеживаем, были ли поля изменены (для определения, нужно ли удалять их при очистке)
  const [originalData] = useState({
    phone: user.phone || '',
    age: user.age?.toString() || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

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

    // Валидация имени
    if (!formData.name.trim()) {
      newErrors.name = 'Имя обязательно для заполнения';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Имя должно содержать минимум 2 символа';
    }

    // Валидация телефона (если указан)
    if (formData.phone && formData.phone.trim()) {
      const phoneRegex = /^(\+7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
      if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
        newErrors.phone = 'Некорректный формат телефона';
      }
    }

    // Валидация возраста (если указан)
    if (formData.age && formData.age.trim()) {
      const ageNum = parseInt(formData.age);
      if (isNaN(ageNum) || ageNum < 18 || ageNum > 100) {
        newErrors.age = 'Возраст должен быть от 18 до 100 лет';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Загрузка фото
  const pickImage = async () => {
    try {
      setUploadingAvatar(true);
      
      // Запрашиваем разрешение
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Ошибка', 'Необходимо разрешение на доступ к фотографиям');
        setUploadingAvatar(false);
        return;
      }

      // Открываем выбор изображения
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        // В реальном приложении здесь нужно загрузить изображение на сервер
        // Пока сохраняем локальный URI
        setFormData({ ...formData, avatar: result.assets[0].uri });
      }
    } catch (error) {
      console.error('Ошибка выбора изображения:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить изображение');
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Сохранение профиля
  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const updateData: {
        name?: string;
        phone?: string;
        age?: number;
        avatar?: string;
      } = {
        name: formData.name.trim(),
      };

      if (formData.phone.trim()) {
        updateData.phone = formData.phone.trim();
      }

      if (formData.age.trim()) {
        updateData.age = parseInt(formData.age);
      }

      if (formData.avatar) {
        updateData.avatar = formData.avatar;
      }

      const result = await updateProfile(updateData);

      if (result.success && result.data) {
        // Просто закрываем экран и обновляем профиль
        if (onSuccess) {
          onSuccess(result.data);
        }
        onClose();
      } else {
        // Проверяем, является ли это ошибкой аутентификации
        const isAuthError = result.error?.includes('Authentication required');
        
        // Проверяем, является ли это сетевой ошибкой (backend недоступен)
        const isNetworkError = result.error?.includes('Network request failed') || 
                              result.error?.includes('Backend server is not available') ||
                              result.error?.includes('Failed to fetch') ||
                              result.error?.includes('fetch failed');
        
        if (isAuthError) {
          // Если нет токена, сохраняем локально без показа технических сообщений
          // Пользователь уже авторизован через Яндекс, просто сохраняем локально
          const { setUser } = useAppStore.getState();
          const updatedUser: User = {
            id: user.id,
            email: user.email,
            name: updateData.name || user.name,
            userType: user.userType,
            ...(formData.phone.trim() && { phone: updateData.phone }),
            ...(formData.age.trim() && { age: updateData.age }),
            ...(updateData.avatar && { 
              avatar: updateData.avatar, 
              photo: updateData.avatar
            }),
            ...(!updateData.avatar && user.avatar && { 
              avatar: user.avatar, 
              photo: user.photo || user.avatar 
            }),
            createdAt: user.createdAt,
            updatedAt: new Date().toISOString(),
          };
          
          if (originalData.phone && !formData.phone.trim()) {
            delete (updatedUser as any).phone;
          }
          if (originalData.age && !formData.age.trim()) {
            delete (updatedUser as any).age;
          }
          
          setUser(updatedUser);
          
          // Просто закрываем экран без показа сообщения
          if (onSuccess) {
            onSuccess(updatedUser);
          }
          onClose();
        } else if (isNetworkError) {
          // Если backend недоступен, сохраняем локально без технических деталей
          const { setUser } = useAppStore.getState();
          
          // Создаем обновленного пользователя с правильной обработкой optional полей
          const updatedUser: User = {
            id: user.id,
            email: user.email,
            name: updateData.name || user.name,
            userType: user.userType,
            ...(formData.phone.trim() 
              ? { phone: updateData.phone }
              : originalData.phone ? {} : {}
            ),
            ...(formData.age.trim() 
              ? { age: updateData.age }
              : originalData.age ? {} : {}
            ),
            ...(updateData.avatar && { 
              avatar: updateData.avatar, 
              photo: updateData.avatar
            }),
            ...(!updateData.avatar && user.avatar && { 
              avatar: user.avatar, 
              photo: user.photo || user.avatar 
            }),
            createdAt: user.createdAt,
            updatedAt: new Date().toISOString(),
          };
          
          // Если поля были очищены, явно удаляем их из объекта
          if (originalData.phone && !formData.phone.trim()) {
            delete (updatedUser as any).phone;
          }
          if (originalData.age && !formData.age.trim()) {
            delete (updatedUser as any).age;
          }
          
          setUser(updatedUser);
          
          // Просто закрываем экран без показа сообщения
          if (onSuccess) {
            onSuccess(updatedUser);
          }
          onClose();
        } else {
          // Другие ошибки - показываем понятное сообщение
          const errorMessage = result.error || 'Не удалось обновить профиль';
          let userFriendlyMessage = 'Не удалось сохранить изменения';
          
          // Преобразуем технические ошибки в понятные сообщения
          if (errorMessage.includes('validation') || errorMessage.includes('Validation')) {
            userFriendlyMessage = 'Проверьте правильность введенных данных';
          } else if (errorMessage.includes('unauthorized') || errorMessage.includes('Unauthorized')) {
            userFriendlyMessage = 'Не удалось сохранить изменения. Попробуйте войти заново';
          } else if (errorMessage.includes('server') || errorMessage.includes('Server')) {
            userFriendlyMessage = 'Проблема с сервером. Попробуйте позже';
          }
          
          Alert.alert('Ошибка', userFriendlyMessage);
        }
      }
    } catch (error) {
      console.error('Ошибка обновления профиля:', error);
      Alert.alert('Ошибка', 'Произошла ошибка при обновлении профиля');
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
            <Text style={styles.title}>Редактирование профиля</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Форма */}
          <View style={styles.formContainer}>
            {/* Аватар */}
            <View style={styles.avatarSection}>
              <BlurView intensity={20} tint="light" style={styles.avatarBlur}>
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)']}
                  style={styles.avatarGradient}
                >
                  <View style={styles.avatarContainer}>
                    {formData.avatar ? (
                      <Image source={{ uri: formData.avatar }} style={styles.avatarImage} />
                    ) : (
                      <View style={styles.avatarPlaceholder}>
                        <Ionicons name="person" size={40} color="#81D4FA" />
                      </View>
                    )}
                    <TouchableOpacity
                      style={styles.avatarEditButton}
                      onPress={pickImage}
                      disabled={uploadingAvatar}
                      activeOpacity={0.7}
                    >
                      {uploadingAvatar ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <Ionicons name="camera" size={20} color="#fff" />
                      )}
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.avatarHint}>
                    Нажмите на камеру, чтобы изменить фото
                  </Text>
                </LinearGradient>
              </BlurView>
            </View>

            {/* Имя */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Имя *</Text>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                value={formData.name}
                onChangeText={(text) => {
                  setFormData({ ...formData, name: text });
                  if (errors.name) {
                    setErrors({ ...errors, name: '' });
                  }
                }}
                placeholder="Введите ваше имя"
                placeholderTextColor="#999"
              />
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
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

            {/* Возраст */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Возраст</Text>
              <TextInput
                style={[styles.input, errors.age && styles.inputError]}
                value={formData.age}
                onChangeText={(text) => {
                  // Разрешаем только цифры
                  const numericValue = text.replace(/[^0-9]/g, '');
                  setFormData({ ...formData, age: numericValue });
                  if (errors.age) {
                    setErrors({ ...errors, age: '' });
                  }
                }}
                placeholder="18"
                placeholderTextColor="#999"
                keyboardType="numeric"
                maxLength={3}
              />
              {errors.age && <Text style={styles.errorText}>{errors.age}</Text>}
            </View>

            {/* Email (только для отображения) */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={[styles.input, styles.inputDisabled]}>
                <Text style={styles.disabledText}>{user.email}</Text>
              </View>
              <Text style={styles.hintText}>Email нельзя изменить</Text>
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
                    <Text style={styles.saveButtonText}>Сохранить изменения</Text>
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
  avatarSection: {
    marginBottom: responsivePadding(24),
    alignItems: 'center',
  },
  avatarBlur: {
    borderRadius: responsiveWidth(24),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  avatarGradient: {
    padding: responsivePadding(24),
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: responsivePadding(12),
  },
  avatarImage: {
    width: responsiveWidth(120),
    height: responsiveWidth(120),
    borderRadius: responsiveWidth(60),
  },
  avatarPlaceholder: {
    width: responsiveWidth(120),
    height: responsiveWidth(120),
    borderRadius: responsiveWidth(60),
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEditButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: responsiveWidth(36),
    height: responsiveWidth(36),
    borderRadius: responsiveWidth(18),
    backgroundColor: '#42A5F5',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  avatarHint: {
    fontSize: responsiveFontSize(12),
    color: '#666',
    textAlign: 'center',
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
  inputError: {
    borderColor: '#F44336',
  },
  inputDisabled: {
    backgroundColor: '#F5F5F5',
  },
  disabledText: {
    fontSize: responsiveFontSize(16),
    color: '#999',
  },
  errorText: {
    fontSize: responsiveFontSize(12),
    color: '#F44336',
    marginTop: responsivePadding(4),
  },
  hintText: {
    fontSize: responsiveFontSize(12),
    color: '#999',
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

export default EditProfileScreen;

