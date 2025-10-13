import React, { memo, useCallback, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../../utils/constants';

interface AuthModalProps {
  visible: boolean;
  mode: 'login' | 'register' | 'register-center';
  onClose: () => void;
  onSuccess: (userData: any) => void;
}

const AuthModal: React.FC<AuthModalProps> = memo(({
  visible,
  mode,
  onClose,
  onSuccess
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [centerName, setCenterName] = useState('');
  const [centerAddress, setCenterAddress] = useState('');
  const [centerDescription, setCenterDescription] = useState('');

  const handleSubmit = useCallback(() => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Ошибка', 'Заполните все обязательные поля');
      return;
    }

    if (mode === 'register' || mode === 'register-center') {
      if (password !== confirmPassword) {
        Alert.alert('Ошибка', 'Пароли не совпадают');
        return;
      }
      if (!name.trim()) {
        Alert.alert('Ошибка', 'Введите имя');
        return;
      }
    }

    // Здесь будет реальная аутентификация
    const userData = {
      email: email.trim(),
      name: name.trim(),
      phone: phone.trim(),
      userType: mode === 'register-center' ? 'CENTER_OWNER' : 'USER',
      centerData: mode === 'register-center' ? {
        name: centerName.trim(),
        address: centerAddress.trim(),
        description: centerDescription.trim(),
      } : undefined
    };

    onSuccess(userData);
    onClose();
  }, [email, password, confirmPassword, name, phone, centerName, centerAddress, centerDescription, mode, onSuccess, onClose]);

  const handleGoogleAuth = useCallback(() => {
    Alert.alert('Google Auth', 'Авторизация через Google будет реализована');
  }, []);

  const handleYandexAuth = useCallback(() => {
    Alert.alert('Yandex Auth', 'Авторизация через Яндекс будет реализована');
  }, []);

  const handleAppleAuth = useCallback(() => {
    Alert.alert('Apple Auth', 'Авторизация через Apple будет реализована');
  }, []);

  const getTitle = () => {
    switch (mode) {
      case 'login': return 'Вход в аккаунт';
      case 'register': return 'Регистрация пользователя';
      case 'register-center': return 'Регистрация центра';
      default: return 'Аутентификация';
    }
  };

  const getSubmitText = () => {
    switch (mode) {
      case 'login': return 'Войти';
      case 'register': return 'Зарегистрироваться';
      case 'register-center': return 'Зарегистрировать центр';
      default: return 'Отправить';
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={THEME.muted} />
          </TouchableOpacity>
          <Text style={styles.title}>{getTitle()}</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Социальные сети - только для пользователей */}
          {mode !== 'register-center' && (
            <>
              <View style={styles.socialSection}>
                <Text style={styles.sectionTitle}>Быстрый вход</Text>
                <View style={styles.socialButtons}>
                  <TouchableOpacity style={styles.socialButton} onPress={handleGoogleAuth}>
                    <Ionicons name="logo-google" size={20} color="#4285F4" />
                    <Text style={styles.socialButtonText}>Google</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.socialButton} onPress={handleYandexAuth}>
                    <Ionicons name="logo-yahoo" size={20} color="#FF0000" />
                    <Text style={styles.socialButtonText}>Яндекс</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.socialButton} onPress={handleAppleAuth}>
                    <Ionicons name="logo-apple" size={20} color="#000000" />
                    <Text style={styles.socialButtonText}>Apple</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Разделитель */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>или</Text>
                <View style={styles.dividerLine} />
              </View>
            </>
          )}

          {/* Форма */}
          <View style={styles.formSection}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Email *</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="example@email.com"
                placeholderTextColor={THEME.muted}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Пароль *</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Введите пароль"
                placeholderTextColor={THEME.muted}
                secureTextEntry
              />
            </View>

            {(mode === 'register' || mode === 'register-center') && (
              <View style={styles.formGroup}>
                <Text style={styles.label}>Подтвердите пароль *</Text>
                <TextInput
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Подтвердите пароль"
                  placeholderTextColor={THEME.muted}
                  secureTextEntry
                />
              </View>
            )}

            <View style={styles.formGroup}>
              <Text style={styles.label}>Имя *</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Введите ваше имя"
                placeholderTextColor={THEME.muted}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Телефон</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="+7 (999) 123-45-67"
                placeholderTextColor={THEME.muted}
                keyboardType="phone-pad"
              />
            </View>

            {mode === 'register-center' && (
              <>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Название центра *</Text>
                  <TextInput
                    style={styles.input}
                    value={centerName}
                    onChangeText={setCenterName}
                    placeholder="Название реабилитационного центра"
                    placeholderTextColor={THEME.muted}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Адрес центра *</Text>
                  <TextInput
                    style={styles.input}
                    value={centerAddress}
                    onChangeText={setCenterAddress}
                    placeholder="Адрес центра"
                    placeholderTextColor={THEME.muted}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Описание центра</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={centerDescription}
                    onChangeText={setCenterDescription}
                    placeholder="Краткое описание центра"
                    placeholderTextColor={THEME.muted}
                    multiline
                    numberOfLines={3}
                  />
                </View>
              </>
            )}

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>{getSubmitText()}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
});

AuthModal.displayName = 'AuthModal';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  closeButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  socialSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    gap: 8,
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e9ecef',
  },
  dividerText: {
    marginHorizontal: 15,
    fontSize: 14,
    color: THEME.muted,
  },
  formSection: {
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: THEME.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AuthModal;
