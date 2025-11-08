import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Animated,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { responsiveWidth, responsivePadding, responsiveFontSize } from '../utils/responsive';

interface SettingsScreenProps {
  onClose: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onClose }) => {
  // Состояния для настроек
  const [pushNotifications, setPushNotifications] = useState(true);
  const [sounds, setSounds] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

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

  const handleSave = () => {
    // Здесь будет сохранение настроек в AsyncStorage или backend
    Alert.alert('Успех', 'Настройки сохранены', [
      {
        text: 'OK',
        onPress: onClose,
      },
    ]);
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
            <Text style={styles.title}>Настройки</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Настройки */}
          <View style={styles.settingsContainer}>
            <BlurView intensity={20} tint="light" style={styles.settingsBlur}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)']}
                style={styles.settingsGradient}
              >
                {/* Push уведомления */}
                <View style={styles.settingItem}>
                  <View style={styles.settingLeft}>
                    <Ionicons name="notifications-outline" size={24} color="#42A5F5" />
                    <View style={styles.settingTextContainer}>
                      <Text style={styles.settingTitle}>Push уведомления</Text>
                      <Text style={styles.settingDescription}>
                        Получать уведомления о новых центрах и акциях
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={pushNotifications}
                    onValueChange={setPushNotifications}
                    trackColor={{ false: '#ccc', true: '#81D4FA' }}
                    thumbColor={pushNotifications ? '#42A5F5' : '#f4f3f4'}
                  />
                </View>

                {/* Звуки */}
                <View style={styles.settingItem}>
                  <View style={styles.settingLeft}>
                    <Ionicons name="volume-high-outline" size={24} color="#42A5F5" />
                    <View style={styles.settingTextContainer}>
                      <Text style={styles.settingTitle}>Звуки</Text>
                      <Text style={styles.settingDescription}>
                        Воспроизводить звуки при уведомлениях
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={sounds}
                    onValueChange={setSounds}
                    trackColor={{ false: '#ccc', true: '#81D4FA' }}
                    thumbColor={sounds ? '#42A5F5' : '#f4f3f4'}
                  />
                </View>

                {/* Email уведомления */}
                <View style={styles.settingItem}>
                  <View style={styles.settingLeft}>
                    <Ionicons name="mail-outline" size={24} color="#42A5F5" />
                    <View style={styles.settingTextContainer}>
                      <Text style={styles.settingTitle}>Email уведомления</Text>
                      <Text style={styles.settingDescription}>
                        Получать уведомления на email
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={emailNotifications}
                    onValueChange={setEmailNotifications}
                    trackColor={{ false: '#ccc', true: '#81D4FA' }}
                    thumbColor={emailNotifications ? '#42A5F5' : '#f4f3f4'}
                  />
                </View>

                {/* Темная тема */}
                <View style={styles.settingItem}>
                  <View style={styles.settingLeft}>
                    <Ionicons name="moon-outline" size={24} color="#42A5F5" />
                    <View style={styles.settingTextContainer}>
                      <Text style={styles.settingTitle}>Темная тема</Text>
                      <Text style={styles.settingDescription}>
                        Использовать темную тему приложения
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={darkMode}
                    onValueChange={setDarkMode}
                    trackColor={{ false: '#ccc', true: '#81D4FA' }}
                    thumbColor={darkMode ? '#42A5F5' : '#f4f3f4'}
                  />
                </View>
              </LinearGradient>
            </BlurView>

            {/* Кнопка сохранения */}
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={['#81D4FA', '#42A5F5']}
                style={styles.saveButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                <Text style={styles.saveButtonText}>Сохранить настройки</Text>
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
  settingsContainer: {
    flex: 1,
  },
  settingsBlur: {
    borderRadius: responsiveWidth(16),
    overflow: 'hidden',
    marginBottom: responsivePadding(24),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  settingsGradient: {
    padding: responsivePadding(16),
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: responsivePadding(16),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: responsivePadding(16),
  },
  settingTextContainer: {
    marginLeft: responsivePadding(12),
    flex: 1,
  },
  settingTitle: {
    fontSize: responsiveFontSize(16),
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: responsivePadding(4),
  },
  settingDescription: {
    fontSize: responsiveFontSize(12),
    color: '#666',
  },
  saveButton: {
    borderRadius: responsiveWidth(12),
    overflow: 'hidden',
    marginTop: responsivePadding(24),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
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

export default SettingsScreen;

