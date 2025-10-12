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

interface CreateCenterModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (center: {
    name: string;
    city: string;
    address: string;
    phone: string;
    email: string;
    description: string;
    services: string[];
    price: string;
    rating: number;
  }) => void;
}

const CreateCenterModal: React.FC<CreateCenterModalProps> = memo(({
  visible,
  onClose,
  onSave
}) => {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [services, setServices] = useState('');
  const [price, setPrice] = useState('');
  const [rating, setRating] = useState('4.5');

  const handleSave = useCallback(() => {
    if (!name.trim() || !city.trim() || !address.trim() || !phone.trim() || !email.trim() || !description.trim()) {
      Alert.alert('Ошибка', 'Заполните все обязательные поля');
      return;
    }

    const servicesArray = services.split(',').map(s => s.trim()).filter(s => s.length > 0);
    if (servicesArray.length === 0) {
      Alert.alert('Ошибка', 'Укажите хотя бы одну услугу');
      return;
    }

    onSave({
      name: name.trim(),
      city: city.trim(),
      address: address.trim(),
      phone: phone.trim(),
      email: email.trim(),
      description: description.trim(),
      services: servicesArray,
      price: price.trim() || 'от 40,000 ₽/месяц',
      rating: parseFloat(rating) || 4.5,
    });

    // Очищаем форму
    setName('');
    setCity('');
    setAddress('');
    setPhone('');
    setEmail('');
    setDescription('');
    setServices('');
    setPrice('');
    setRating('4.5');
    onClose();
  }, [name, city, address, phone, email, description, services, price, rating, onSave, onClose]);

  const handleCancel = useCallback(() => {
    setName('');
    setCity('');
    setAddress('');
    setPhone('');
    setEmail('');
    setDescription('');
    setServices('');
    setPrice('');
    setRating('4.5');
    onClose();
  }, [onClose]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={handleCancel}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
            <Ionicons name="close" size={24} color={THEME.muted} />
          </TouchableOpacity>
          <Text style={styles.title}>Создать центр</Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Сохранить</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Название центра *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Название реабилитационного центра"
              placeholderTextColor={THEME.muted}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Город *</Text>
            <TextInput
              style={styles.input}
              value={city}
              onChangeText={setCity}
              placeholder="Москва"
              placeholderTextColor={THEME.muted}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Адрес *</Text>
            <TextInput
              style={styles.input}
              value={address}
              onChangeText={setAddress}
              placeholder="ул. Примерная, 123"
              placeholderTextColor={THEME.muted}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Телефон *</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="+7 (495) 123-45-67"
              placeholderTextColor={THEME.muted}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="info@center.ru"
              placeholderTextColor={THEME.muted}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Описание *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Краткое описание центра и его услуг"
              placeholderTextColor={THEME.muted}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Услуги *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={services}
              onChangeText={setServices}
              placeholder="Алкоголизм, Наркомания, Игромания"
              placeholderTextColor={THEME.muted}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
            <Text style={styles.helpText}>
              Укажите услуги через запятую
            </Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Цена</Text>
            <TextInput
              style={styles.input}
              value={price}
              onChangeText={setPrice}
              placeholder="от 40,000 ₽/месяц"
              placeholderTextColor={THEME.muted}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Рейтинг</Text>
            <TextInput
              style={styles.input}
              value={rating}
              onChangeText={setRating}
              placeholder="4.5"
              placeholderTextColor={THEME.muted}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.previewSection}>
            <Text style={styles.label}>Предварительный просмотр</Text>
            <View style={styles.previewCard}>
              <Text style={styles.previewTitle} numberOfLines={1}>
                {name || 'Название центра'}
              </Text>
              <View style={styles.previewLocation}>
                <Ionicons name="location-outline" size={14} color={THEME.muted} />
                <Text style={styles.previewLocationText}>
                  {city || 'Город'}
                </Text>
              </View>
              <Text style={styles.previewDescription} numberOfLines={3}>
                {description || 'Описание центра'}
              </Text>
              <View style={styles.previewServices}>
                {services.split(',').slice(0, 2).map((service, index) => (
                  <View key={index} style={styles.serviceTag}>
                    <Text style={styles.serviceText}>{service.trim()}</Text>
                  </View>
                ))}
                {services.split(',').length > 2 && (
                  <Text style={styles.moreServices}>
                    +{services.split(',').length - 2}
                  </Text>
                )}
              </View>
              <Text style={styles.previewPrice}>
                {price || 'от 40,000 ₽/месяц'}
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
});

CreateCenterModal.displayName = 'CreateCenterModal';

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
  cancelButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  saveButton: {
    backgroundColor: THEME.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
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
  helpText: {
    fontSize: 12,
    color: THEME.muted,
    marginTop: 4,
  },
  previewSection: {
    marginTop: 20,
  },
  previewCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  previewLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  previewLocationText: {
    fontSize: 14,
    color: THEME.muted,
    marginLeft: 4,
  },
  previewDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  previewServices: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  serviceTag: {
    backgroundColor: THEME.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  serviceText: {
    fontSize: 12,
    color: THEME.primary,
    fontWeight: '600',
  },
  moreServices: {
    fontSize: 12,
    color: THEME.muted,
    alignSelf: 'center',
  },
  previewPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.primary,
  },
});

export default CreateCenterModal;
