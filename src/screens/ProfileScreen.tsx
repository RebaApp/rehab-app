import React, { memo, useCallback, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Article } from '../types';
import { THEME } from '../utils/constants';
import AdminPanel from './admin/AdminPanel';
import AuthModal from '../components/common/AuthModal';
import useAppStore from '../store/useAppStore';
import Constants from 'expo-constants';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface ProfileScreenProps {
  user: User | null;
  isAuthenticated: boolean;
  onLoginPress: () => void;
  onRegisterPress: () => void;
  onLogoutPress: () => void;
  onSettingsPress: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = memo(({
  user,
  isAuthenticated,
  onLoginPress,
  onRegisterPress,
  onLogoutPress,
  onSettingsPress
}) => {
  const [adminPanelVisible, setAdminPanelVisible] = useState(false);
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'register-center'>('login');
  const handleAboutPress = useCallback(() => {
    Alert.alert(
      'О нас',
      'РЕБА - агрегатор реабилитационных центров в России. Мы помогаем найти подходящий центр для лечения зависимостей.'
    );
  }, []);

  const handleAgreementsPress = useCallback(() => {
    Alert.alert(
      'Соглашения',
      'Пользовательское соглашение и политика конфиденциальности'
    );
  }, []);

  const handlePricingPress = useCallback(() => {
    Alert.alert(
      'Тарифы',
      'Информация о тарифах для центров'
    );
  }, []);

  const handleContactsPress = useCallback(() => {
    Alert.alert(
      'Контакты',
      'Свяжитесь с нами: support@reba.ru'
    );
  }, []);

  const handleInvestorsPress = useCallback(() => {
    Alert.alert(
      'Для инвесторов',
      'Информация для инвесторов'
    );
  }, []);

  const handleCareerPress = useCallback(() => {
    Alert.alert(
      'Карьера в РЕБА',
      'Вакансии в нашей команде'
    );
  }, []);

  // Админ функции
  const handleAdminPress = useCallback(() => {
    setAdminPanelVisible(true);
  }, []);

  // Аутентификация
  const handleLoginPress = useCallback(() => {
    setAuthMode('login');
    setAuthModalVisible(true);
  }, []);

  const handleRegisterPress = useCallback(() => {
    setAuthMode('register');
    setAuthModalVisible(true);
  }, []);

  const handleRegisterCenterPress = useCallback(() => {
    setAuthMode('register-center');
    setAuthModalVisible(true);
  }, []);

  const handleAuthSuccess = useCallback((userData: any) => {
    Alert.alert('Успех', 'Вы успешно вошли в систему!');
    // Здесь будет реальная аутентификация
  }, []);

  return (
    <LinearGradient
      colors={[THEME.bgTop, THEME.bgMid, THEME.bgBottom]}
      style={styles.container}
    >
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Пользовательская информация */}
        {isAuthenticated && user ? (
          <View style={styles.userSection}>
            <View style={styles.userInfo}>
              <View style={styles.avatarContainer}>
                <Ionicons name="person" size={40} color={THEME.primary} />
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
                <Text style={styles.userType}>
                  {user.userType === 'USER' ? 'Пользователь' : 
                   user.userType === 'CENTER_OWNER' ? 'Владелец центра' : 'Администратор'}
                </Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.logoutButton} 
              onPress={onLogoutPress}
              activeOpacity={0.7}
            >
              <Ionicons name="log-out-outline" size={20} color="#fff" />
              <Text style={styles.logoutButtonText}>Выйти из аккаунта</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.authSection}>
            <TouchableOpacity 
              style={styles.loginButton} 
              onPress={handleLoginPress}
              activeOpacity={0.7}
            >
              <Ionicons name="log-in-outline" size={20} color={THEME.primary} />
              <Text style={styles.loginButtonText}>Вход</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.registerButton} 
              onPress={handleRegisterPress}
              activeOpacity={0.7}
            >
              <Ionicons name="person-add-outline" size={20} color="#fff" />
              <Text style={styles.registerButtonText}>Регистрация</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.registerCenterButton} 
              onPress={handleRegisterCenterPress}
              activeOpacity={0.7}
            >
              <Ionicons name="business-outline" size={20} color="#fff" />
              <Text style={styles.registerCenterButtonText}>Регистрация центра</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {/* Меню - каждый пункт отдельная кнопка */}
        <View style={styles.menuContainer}>
          <TouchableOpacity 
            style={styles.menuButton} 
            onPress={handleAboutPress}
            activeOpacity={0.6}
          >
            <View style={styles.menuButtonContent}>
              <Ionicons name="information-circle-outline" size={24} color={THEME.primary} />
              <Text style={styles.menuButtonText}>О нас</Text>
              <Ionicons name="chevron-forward" size={18} color={THEME.muted} />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuButton} 
            onPress={handleAgreementsPress}
            activeOpacity={0.6}
          >
            <View style={styles.menuButtonContent}>
              <Ionicons name="document-text-outline" size={24} color={THEME.primary} />
              <Text style={styles.menuButtonText}>Соглашения</Text>
              <Ionicons name="chevron-forward" size={18} color={THEME.muted} />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuButton} 
            onPress={handlePricingPress}
            activeOpacity={0.6}
          >
            <View style={styles.menuButtonContent}>
              <Ionicons name="card-outline" size={24} color={THEME.primary} />
              <Text style={styles.menuButtonText}>Тарифы</Text>
              <Ionicons name="chevron-forward" size={18} color={THEME.muted} />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuButton} 
            onPress={handleContactsPress}
            activeOpacity={0.6}
          >
            <View style={styles.menuButtonContent}>
              <Ionicons name="mail-outline" size={24} color={THEME.primary} />
              <Text style={styles.menuButtonText}>Контакты</Text>
              <Ionicons name="chevron-forward" size={18} color={THEME.muted} />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuButton} 
            onPress={handleInvestorsPress}
            activeOpacity={0.6}
          >
            <View style={styles.menuButtonContent}>
              <Ionicons name="trending-up-outline" size={24} color={THEME.primary} />
              <Text style={styles.menuButtonText}>Для инвесторов</Text>
              <Ionicons name="chevron-forward" size={18} color={THEME.muted} />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuButton} 
            onPress={handleCareerPress}
            activeOpacity={0.6}
          >
            <View style={styles.menuButtonContent}>
              <Ionicons name="briefcase-outline" size={24} color={THEME.primary} />
              <Text style={styles.menuButtonText}>Карьера в РЕБА</Text>
              <Ionicons name="chevron-forward" size={18} color={THEME.muted} />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuButton} 
            onPress={onSettingsPress}
            activeOpacity={0.6}
          >
            <View style={styles.menuButtonContent}>
              <Ionicons name="settings-outline" size={24} color={THEME.primary} />
              <Text style={styles.menuButtonText}>Настройки</Text>
              <Ionicons name="chevron-forward" size={18} color={THEME.muted} />
            </View>
          </TouchableOpacity>
          
          {/* Админ панель - показываем только в dev режиме или если включена в настройках */}
          {(__DEV__ || Constants.expoConfig?.extra?.enableAdminPanel) && (
            <TouchableOpacity 
              style={[styles.menuButton, styles.adminMenuButton]} 
              onPress={handleAdminPress}
              activeOpacity={0.6}
            >
              <View style={styles.menuButtonContent}>
                <Ionicons name="construct-outline" size={24} color="#ff6b35" />
                <Text style={[styles.menuButtonText, styles.adminMenuButtonText]}>
                  Админ панель {__DEV__ ? '(DEV)' : '(PROD)'}
                </Text>
                <Ionicons name="chevron-forward" size={18} color="#ff6b35" />
              </View>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Админ панель - только в dev режиме или если включена в настройках */}
      {(__DEV__ || Constants.expoConfig?.extra?.enableAdminPanel) && (
        <AdminPanel
          visible={adminPanelVisible}
          onClose={() => setAdminPanelVisible(false)}
        />
      )}

      {/* Модальное окно аутентификации */}
      <AuthModal
        visible={authModalVisible}
        mode={authMode}
        onClose={() => setAuthModalVisible(false)}
        onSuccess={handleAuthSuccess}
      />
    </LinearGradient>
  );
});

ProfileScreen.displayName = 'ProfileScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  
  // Секция пользователя
  userSection: {
    marginLeft: Math.max(16, screenWidth * 0.04),
    marginRight: Math.max(16, screenWidth * 0.04),
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: THEME.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16
  },
  userDetails: {
    flex: 1
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4
  },
  userEmail: {
    fontSize: 14,
    color: THEME.muted,
    marginBottom: 4
  },
  userType: {
    fontSize: 12,
    color: THEME.primary,
    fontWeight: '600'
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff4444',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8
  },

  // Секция аутентификации
  authSection: {
    marginLeft: Math.max(16, screenWidth * 0.04),
    marginRight: Math.max(16, screenWidth * 0.04),
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 20,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: THEME.primary,
    marginBottom: 12,
  },
  loginButtonText: {
    color: THEME.primary,
    fontWeight: '600',
    marginLeft: 8
  },
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.primary,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  registerButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8
  },
  registerCenterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#28a745',
    padding: 16,
    borderRadius: 12,
  },
  registerCenterButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8
  },

  // Контейнер меню
  menuContainer: {
    marginLeft: Math.max(16, screenWidth * 0.04),
    marginRight: Math.max(16, screenWidth * 0.04),
    marginBottom: 20,
  },

  // Кнопки меню - каждая отдельная кнопка
  menuButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    marginBottom: 8,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  menuButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  menuButtonText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    fontWeight: '500',
  },
  adminMenuButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ff6b35',
  },
  adminMenuButtonText: {
    color: '#ff6b35',
    fontWeight: '600',
  }
});

export default ProfileScreen;