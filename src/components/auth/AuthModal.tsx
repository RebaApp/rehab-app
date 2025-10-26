import React, { useState, useRef, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { User } from '../../types';
import { responsiveWidth, responsiveHeight, responsivePadding, responsiveFontSize } from '../../utils/responsive';

interface AuthModalProps {
  visible: boolean;
  mode: 'login' | 'register' | 'registerCenter';
  onClose: () => void;
  onSuccess: (user: User) => void;
  onSwitchMode: (mode: 'login' | 'register' | 'registerCenter') => void;
  onYandexSignIn?: () => Promise<any>;
  onEmailLogin?: (email: string, password: string) => Promise<any>;
  onEmailRegister?: (email: string, password: string, userData: Partial<User>) => Promise<any>;
}

const AuthModal: React.FC<AuthModalProps> = ({
  visible,
  mode,
  onClose,
  onSuccess,
  onSwitchMode,
  onYandexSignIn,
  onEmailLogin,
  onEmailRegister,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    centerName: '',
    centerAddress: '',
    centerPhone: '',
    centerEmail: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    if (visible) {
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
    } else {
      fadeAnim.setValue(0);
      slideAnim.setValue(50);
    }
  }, [visible]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Некорректный email';
    }

    if (!formData.password) {
      newErrors.password = 'Пароль обязателен';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов';
    }

    if (mode === 'register' || mode === 'registerCenter') {
      if (!formData.name) {
        newErrors.name = 'Имя обязательно';
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Пароли не совпадают';
      }

      if (mode === 'registerCenter') {
        if (!formData.centerName) {
          newErrors.centerName = 'Название центра обязательно';
        }
        if (!formData.centerAddress) {
          newErrors.centerAddress = 'Адрес центра обязателен';
        }
        if (!formData.centerPhone) {
          newErrors.centerPhone = 'Телефон центра обязателен';
        }
        if (!formData.centerEmail) {
          newErrors.centerEmail = 'Email центра обязателен';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    console.log('📧 Нажата кнопка Email авторизации');
    
    if (!validateForm()) {
      console.log('❌ Валидация не прошла');
      return;
    }

    console.log('⏳ Устанавливаем loading = true');
    setLoading(true);
    
    try {
      console.log('🚀 Начинаем Email авторизацию, mode:', mode);
      
      let result;
      
      if (mode === 'login') {
        if (!onEmailLogin) {
          console.log('❌ onEmailLogin не передан');
          Alert.alert('Ошибка', 'Функция входа не настроена');
          return;
        }
        
        console.log('🔑 Вызываем onEmailLogin...');
        result = await onEmailLogin(formData.email, formData.password);
      } else {
        if (!onEmailRegister) {
          console.log('❌ onEmailRegister не передан');
          Alert.alert('Ошибка', 'Функция регистрации не настроена');
          return;
        }
        
        console.log('📝 Вызываем onEmailRegister...');
        const userData = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          userType: mode === 'registerCenter' ? 'CENTER' : 'USER',
        };
        
        result = await onEmailRegister(formData.email, formData.password, userData);
      }
      
      console.log('📋 Результат Email авторизации:', result);
      
      if (result.success) {
        console.log('✅ Email авторизация успешна, закрываем модал');
        onClose();
      } else {
        console.log('❌ Email авторизация неуспешна:', result.error);
        Alert.alert('Ошибка', result.error || 'Ошибка при авторизации');
      }
    } catch (error) {
      console.log('💥 Ошибка в handleSubmit:', error);
      Alert.alert('Ошибка', 'Произошла ошибка при авторизации');
    } finally {
      console.log('⏹️ Устанавливаем loading = false');
      setLoading(false);
    }
  };

  const handleYandexSignIn = async () => {
    console.log('🔵 Нажата кнопка Яндекс Sign In');
    
    if (!onYandexSignIn) {
      console.log('❌ onYandexSignIn не передан');
      return;
    }
    
    console.log('⏳ Устанавливаем loading = true');
    setLoading(true);
    
    try {
      console.log('🚀 Вызываем onYandexSignIn...');
      const result = await onYandexSignIn();
      
      console.log('📋 Результат Яндекс Sign In:', result);
      
      if (result.success) {
        console.log('✅ Яндекс авторизация успешна, закрываем модал');
        onClose();
      } else {
        console.log('❌ Яндекс авторизация неуспешна:', result.error);
        Alert.alert('Ошибка', result.error?.message || 'Ошибка при входе через Яндекс');
      }
    } catch (error) {
      console.log('💥 Ошибка в handleYandexSignIn:', error);
      Alert.alert('Ошибка', 'Произошла ошибка при входе через Яндекс');
    } finally {
      console.log('⏹️ Устанавливаем loading = false');
      setLoading(false);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'login':
        return 'Вход в систему';
      case 'register':
        return 'Регистрация пользователя';
      case 'registerCenter':
        return 'Регистрация центра';
      default:
        return '';
    }
  };

  const getSubmitText = () => {
    switch (mode) {
      case 'login':
        return 'Войти';
      case 'register':
        return 'Зарегистрироваться';
      case 'registerCenter':
        return 'Зарегистрировать центр';
      default:
        return '';
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <BlurView intensity={20} tint="light" style={styles.glassContainer}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.1)']}
          style={styles.gradient}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
          >
            <Animated.View
              style={[
                styles.modalContent,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
                {/* Header */}
                <View style={styles.header}>
                  <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Ionicons name="close" size={24} color="#666" />
                  </TouchableOpacity>
                  <Text style={styles.title}>{getTitle()}</Text>
                  <View style={styles.placeholder} />
                </View>

                <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
                  {/* User Info */}
                  {(mode === 'register' || mode === 'registerCenter') && (
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Имя *</Text>
                      <TextInput
                        style={[styles.input, errors.name && styles.inputError]}
                        value={formData.name}
                        onChangeText={(text) => setFormData({ ...formData, name: text })}
                        placeholder="Введите ваше имя"
                        autoCapitalize="words"
                      />
                      {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
                    </View>
                  )}

                  {/* Email */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email *</Text>
                    <TextInput
                      style={[styles.input, errors.email && styles.inputError]}
                      value={formData.email}
                      onChangeText={(text) => setFormData({ ...formData, email: text })}
                      placeholder="example@email.com"
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                    {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                  </View>

                  {/* Password */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Пароль *</Text>
                    <TextInput
                      style={[styles.input, errors.password && styles.inputError]}
                      value={formData.password}
                      onChangeText={(text) => setFormData({ ...formData, password: text })}
                      placeholder="Минимум 6 символов"
                      secureTextEntry
                    />
                    {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                  </View>

                  {/* Confirm Password */}
                  {(mode === 'register' || mode === 'registerCenter') && (
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Подтвердите пароль *</Text>
                      <TextInput
                        style={[styles.input, errors.confirmPassword && styles.inputError]}
                        value={formData.confirmPassword}
                        onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
                        placeholder="Повторите пароль"
                        secureTextEntry
                      />
                      {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
                    </View>
                  )}

                  {/* Phone */}
                  {(mode === 'register' || mode === 'registerCenter') && (
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Телефон</Text>
                      <TextInput
                        style={styles.input}
                        value={formData.phone}
                        onChangeText={(text) => setFormData({ ...formData, phone: text })}
                        placeholder="+7 (999) 123-45-67"
                        keyboardType="phone-pad"
                      />
                    </View>
                  )}

                  {/* Center Info */}
                  {mode === 'registerCenter' && (
                    <>
                      <View style={styles.divider} />
                      <Text style={styles.sectionTitle}>Информация о центре</Text>
                      
                      <View style={styles.inputGroup}>
                        <Text style={styles.label}>Название центра *</Text>
                        <TextInput
                          style={[styles.input, errors.centerName && styles.inputError]}
                          value={formData.centerName}
                          onChangeText={(text) => setFormData({ ...formData, centerName: text })}
                          placeholder="Название вашего центра"
                        />
                        {errors.centerName && <Text style={styles.errorText}>{errors.centerName}</Text>}
                      </View>

                      <View style={styles.inputGroup}>
                        <Text style={styles.label}>Адрес центра *</Text>
                        <TextInput
                          style={[styles.input, errors.centerAddress && styles.inputError]}
                          value={formData.centerAddress}
                          onChangeText={(text) => setFormData({ ...formData, centerAddress: text })}
                          placeholder="Полный адрес центра"
                        />
                        {errors.centerAddress && <Text style={styles.errorText}>{errors.centerAddress}</Text>}
                      </View>

                      <View style={styles.inputGroup}>
                        <Text style={styles.label}>Телефон центра *</Text>
                        <TextInput
                          style={[styles.input, errors.centerPhone && styles.inputError]}
                          value={formData.centerPhone}
                          onChangeText={(text) => setFormData({ ...formData, centerPhone: text })}
                          placeholder="+7 (999) 123-45-67"
                          keyboardType="phone-pad"
                        />
                        {errors.centerPhone && <Text style={styles.errorText}>{errors.centerPhone}</Text>}
                      </View>

                      <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email центра *</Text>
                        <TextInput
                          style={[styles.input, errors.centerEmail && styles.inputError]}
                          value={formData.centerEmail}
                          onChangeText={(text) => setFormData({ ...formData, centerEmail: text })}
                          placeholder="center@example.com"
                          keyboardType="email-address"
                          autoCapitalize="none"
                        />
                        {errors.centerEmail && <Text style={styles.errorText}>{errors.centerEmail}</Text>}
                      </View>
                    </>
                  )}
                </ScrollView>

                {/* Submit Button */}
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleSubmit}
                  disabled={loading}
                >
                  <LinearGradient
                    colors={loading ? ['#ccc', '#999'] : ['#81D4FA', '#42A5F5']}
                    style={styles.submitGradient}
                  >
                    <Text style={styles.submitText}>
                      {loading ? 'Загрузка...' : getSubmitText()}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                {/* Яндекс Sign In Button */}
                {mode === 'login' && onYandexSignIn && (
                  <TouchableOpacity
                    style={styles.googleButton}
                    onPress={handleYandexSignIn}
                    disabled={loading}
                  >
                    <View style={styles.googleButtonContent}>
                      <Text style={styles.yandexIcon}>Я</Text>
                      <Text style={styles.googleButtonText}>Войти через Яндекс</Text>
                    </View>
                  </TouchableOpacity>
                )}

                {/* Switch Mode */}
                <View style={styles.switchContainer}>
                  {mode === 'login' && (
                    <>
                      <TouchableOpacity onPress={() => onSwitchMode('register')}>
                        <Text style={styles.switchText}>
                          Нет аккаунта? <Text style={styles.switchLink}>Зарегистрироваться</Text>
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => onSwitchMode('registerCenter')}>
                        <Text style={styles.switchText}>
                          Центр реабилитации? <Text style={styles.switchLink}>Регистрация центра</Text>
                        </Text>
                      </TouchableOpacity>
                    </>
                  )}
                  
                  {(mode === 'register' || mode === 'registerCenter') && (
                    <TouchableOpacity onPress={() => onSwitchMode('login')}>
                      <Text style={styles.switchText}>
                        Уже есть аккаунт? <Text style={styles.switchLink}>Войти</Text>
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </Animated.View>
            </KeyboardAvoidingView>
          </LinearGradient>
        </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  glassContainer: {
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: responsivePadding(20),
    paddingTop: responsivePadding(60),
    paddingBottom: responsivePadding(40),
  },
  modalContent: {
    flex: 1,
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
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
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
    paddingBottom: responsivePadding(20),
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
  errorText: {
    fontSize: responsiveFontSize(12),
    color: '#F44336',
    marginTop: responsivePadding(4),
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: responsivePadding(20),
  },
  sectionTitle: {
    fontSize: responsiveFontSize(16),
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: responsivePadding(16),
  },
  submitButton: {
    borderRadius: responsiveWidth(12),
    overflow: 'hidden',
    marginTop: responsivePadding(20),
    marginBottom: responsivePadding(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  submitGradient: {
    paddingVertical: responsivePadding(16),
    alignItems: 'center',
  },
  submitText: {
    fontSize: responsiveFontSize(16),
    fontWeight: '600',
    color: '#FFFFFF',
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: responsiveWidth(12),
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    marginTop: responsivePadding(12),
    marginBottom: responsivePadding(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  googleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: responsivePadding(16),
    gap: responsiveWidth(8),
  },
  googleButtonText: {
    fontSize: responsiveFontSize(16),
    fontWeight: '500',
    color: '#1a1a1a',
  },
  yandexIcon: {
    fontSize: responsiveFontSize(18),
    fontWeight: 'bold',
    color: '#FF0000',
    backgroundColor: '#FFCC00',
    borderRadius: 10,
    width: 20,
    height: 20,
    textAlign: 'center',
    lineHeight: 20,
  },
  switchContainer: {
    alignItems: 'center',
    marginTop: responsivePadding(20),
  },
  switchText: {
    fontSize: responsiveFontSize(14),
    color: '#666',
    marginBottom: responsivePadding(8),
  },
  switchLink: {
    color: '#42A5F5',
    fontWeight: '600',
  },
});

export default AuthModal;
