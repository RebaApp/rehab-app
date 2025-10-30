import React, { memo, useRef, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { User } from '../types';
import { responsiveWidth, responsiveHeight, responsivePadding } from '../utils/responsive';
import AuthModal from '../components/auth/AuthModal';

interface ProfileScreenProps {
  user: User | null;
  isAuthenticated: boolean;
  onLogoutPress: () => void;
  onLogin?: (email: string, password: string) => Promise<any>;
  onRegister?: (email: string, password: string, userData: any) => Promise<any>;
  onYandexSignIn?: () => Promise<any>;
}

const ProfileScreen: React.FC<ProfileScreenProps> = memo(({
  user,
  isAuthenticated,
  onLogoutPress,
  onLogin,
  onRegister,
  onYandexSignIn
}) => {
  // Состояние модального окна авторизации
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'registerCenter'>('login');

  // Анимации
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    // Начальные анимации (fade, slide, scale) - только один раз
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 40,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Обработчики для кнопок авторизации
  const handleLoginPress = () => {
    setAuthMode('login');
    setAuthModalVisible(true);
  };

  const handleRegisterPress = () => {
    setAuthMode('register');
    setAuthModalVisible(true);
  };

  const handleRegisterCenterPress = () => {
    setAuthMode('registerCenter');
    setAuthModalVisible(true);
  };

  const handleAuthSuccess = (user: User) => {
    setAuthModalVisible(false);
    console.log('✅ Авторизация успешна:', user);
  };

  const handleAuthClose = () => {
    setAuthModalVisible(false);
  };

  const handleSwitchMode = (mode: 'login' | 'register' | 'registerCenter') => {
    setAuthMode(mode);
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        <Animated.View style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim }
            ]
          }
        ]}>
          {/* Секция пользователя или авторизации */}
          {isAuthenticated && user ? (
            <View style={styles.userSection}>
              <BlurView intensity={20} tint="light" style={styles.userBlur}>
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)']}
                  style={styles.userGradient}
                >
                  <View style={styles.userInfo}>
                    <View style={styles.userDetails}>
                      <Text style={styles.userName}>{user.name}</Text>
                      <Text style={styles.userEmail}>{user.email}</Text>
                      <Text style={styles.userType}>
                        {user.userType === 'USER' ? 'Пользователь' : 'Центр'}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.logoutButtonContainer}>
                    <TouchableOpacity 
                      style={styles.commonButton} 
                      onPress={onLogoutPress}
                      activeOpacity={0.7}
                    >
                      <LinearGradient
                        colors={['#81D4FA', '#42A5F5']}
                        style={styles.commonButtonGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                      >
                        <Ionicons name="log-out-outline" size={16} color="#fff" />
                        <Text style={styles.buttonText}>Выйти из аккаунта</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
              </BlurView>
            </View>
          ) : (
            <View style={styles.authSection}>
              <BlurView intensity={20} tint="light" style={styles.authBlur}>
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)']}
                  style={styles.authGradient}
                >
                  <View style={styles.authContent}>
                    <View style={styles.authTextContainer}>
                      <Text style={styles.authTitle}>Войдите в систему</Text>
                      <Text style={styles.authSubtitle}>
                        Для доступа к полному функционалу приложения
                      </Text>
                    </View>
                    
                    <View style={styles.authButtons}>
                      <TouchableOpacity 
                        style={styles.commonButton}
                        onPress={handleLoginPress}
                        activeOpacity={0.7}
                      >
                        <LinearGradient
                          colors={['#81D4FA', '#42A5F5']}
                          style={styles.commonButtonGradient}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                        >
                          <Ionicons name="log-in-outline" size={16} color="#fff" />
                          <Text style={styles.buttonText}>Вход</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={styles.commonButton}
                        onPress={handleRegisterPress}
                        activeOpacity={0.7}
                      >
                        <LinearGradient
                          colors={['#81D4FA', '#42A5F5']}
                          style={styles.commonButtonGradient}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                        >
                          <Ionicons name="person-add-outline" size={16} color="#fff" />
                          <Text style={styles.buttonText}>Регистрация</Text>
                        </LinearGradient>
                      </TouchableOpacity>

                      <TouchableOpacity 
                        style={styles.commonButton}
                        onPress={handleRegisterCenterPress}
                        activeOpacity={0.7}
                      >
                        <LinearGradient
                          colors={['#81D4FA', '#42A5F5']}
                          style={styles.commonButtonGradient}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                        >
                          <Ionicons name="business-outline" size={16} color="#fff" />
                          <Text style={styles.buttonText}>Регистрация центра</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  </View>
                </LinearGradient>
              </BlurView>
            </View>
          )}

          {/* Дополнительные кнопки - показываются для всех */}
          <View style={styles.additionalSections}>
            <BlurView intensity={20} tint="light" style={styles.additionalBlur}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)']}
                style={styles.additionalGradient}
              >
                <View style={styles.additionalButtonsContainer}>
                  {/* О нас */}
                  <TouchableOpacity 
                    style={styles.commonButton}
                    onPress={() => console.log('О нас pressed')}
                    activeOpacity={0.7}
                  >
                    <LinearGradient
                      colors={['#81D4FA', '#42A5F5']}
                      style={styles.commonButtonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      <Ionicons name="information-circle-outline" size={16} color="#fff" />
                      <Text style={styles.buttonText}>О нас</Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  {/* Контакты */}
                  <TouchableOpacity 
                    style={styles.commonButton}
                    onPress={() => console.log('Контакты pressed')}
                    activeOpacity={0.7}
                  >
                    <LinearGradient
                      colors={['#81D4FA', '#42A5F5']}
                      style={styles.commonButtonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      <Ionicons name="call-outline" size={16} color="#fff" />
                      <Text style={styles.buttonText}>Контакты</Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  {/* Для инвесторов */}
                  <TouchableOpacity 
                    style={styles.commonButton}
                    onPress={() => console.log('Для инвесторов pressed')}
                    activeOpacity={0.7}
                  >
                    <LinearGradient
                      colors={['#81D4FA', '#42A5F5']}
                      style={styles.commonButtonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      <Ionicons name="trending-up-outline" size={16} color="#fff" />
                      <Text style={styles.buttonText}>Для инвесторов</Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  {/* Карьера в РЕБА */}
                  <TouchableOpacity 
                    style={styles.commonButton}
                    onPress={() => console.log('Карьера в РЕБА pressed')}
                    activeOpacity={0.7}
                  >
                    <LinearGradient
                      colors={['#81D4FA', '#42A5F5']}
                      style={styles.commonButtonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      <Ionicons name="briefcase-outline" size={16} color="#fff" />
                      <Text style={styles.buttonText}>Карьера в РЕБА</Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  {/* Настройки */}
                  <TouchableOpacity 
                    style={styles.commonButton}
                    onPress={() => console.log('Настройки pressed')}
                    activeOpacity={0.7}
                  >
                    <LinearGradient
                      colors={['#81D4FA', '#42A5F5']}
                      style={styles.commonButtonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      <Ionicons name="settings-outline" size={16} color="#fff" />
                      <Text style={styles.buttonText}>Настройки</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </BlurView>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Модальное окно авторизации */}
      <AuthModal
        visible={authModalVisible}
        mode={authMode}
        onClose={handleAuthClose}
        onSuccess={handleAuthSuccess}
        onSwitchMode={handleSwitchMode}
        onYandexSignIn={onYandexSignIn || (() => Promise.resolve())}
        onEmailLogin={onLogin || (() => Promise.resolve())}
        onEmailRegister={onRegister || (() => Promise.resolve())}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: responsivePadding(50), // Отступ для статус-бара
    alignSelf: 'stretch', // гарантия полной ширины при центрировании родителя
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignSelf: 'stretch',
  },
  scrollContent: {
    paddingBottom: responsivePadding(100),
  },
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
  },
  
  // Общие стили кнопок
  commonButton: {
    marginBottom: responsivePadding(16),
    borderRadius: responsiveWidth(12),
    overflow: 'hidden',
  },
  commonButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: responsivePadding(12),
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: responsiveHeight(2) },
    shadowOpacity: 0.1,
    shadowRadius: responsiveWidth(8),
    elevation: 4,
  },

  // Секция пользователя
  userSection: {
    marginBottom: responsivePadding(16),
  },
  userBlur: {
    borderRadius: responsiveWidth(24),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: responsiveHeight(4) },
    shadowOpacity: 0.15,
    shadowRadius: responsiveWidth(16),
    elevation: 8,
  },
  userGradient: {
    paddingHorizontal: 16,
    paddingVertical: responsivePadding(16),
  },
  userInfo: {
    alignItems: 'flex-start',
    marginBottom: responsivePadding(32),
  },
  userDetails: {
    alignItems: 'flex-start',
  },
  logoutButtonContainer: {
    width: '100%',
  },
  userName: {
    fontSize: responsiveWidth(20),
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: responsivePadding(4),
  },
  userEmail: {
    fontSize: responsiveWidth(16),
    color: '#666',
    marginBottom: responsivePadding(4),
  },
  userType: {
    fontSize: responsiveWidth(14),
    color: '#81D4FA',
    fontWeight: '600',
  },
  buttonText: {
    color: '#fff',
    fontSize: responsiveWidth(16),
    fontWeight: '600',
    marginLeft: responsivePadding(8),
  },

  // Секция авторизации
  authSection: {
    marginBottom: responsivePadding(16),
  },
  authBlur: {
    borderRadius: responsiveWidth(24),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: responsiveHeight(4) },
    shadowOpacity: 0.15,
    shadowRadius: responsiveWidth(16),
    elevation: 8,
  },
  authGradient: {
    paddingHorizontal: 16,
    paddingVertical: responsivePadding(16),
  },
  authContent: {
    alignItems: 'flex-start',
  },
  authTextContainer: {
    alignItems: 'flex-start',
    marginBottom: responsivePadding(32),
  },
  authTitle: {
    fontSize: responsiveWidth(24),
    fontWeight: '800',
    color: '#1a1a1a',
    textAlign: 'left',
    marginBottom: responsivePadding(8),
  },
  authSubtitle: {
    fontSize: responsiveWidth(16),
    color: '#666',
    textAlign: 'left',
    lineHeight: responsiveWidth(22),
  },
  authButtons: {
    width: '100%',
  },

  // Дополнительные секции
  additionalSections: {
    marginTop: responsivePadding(16),
  },
  additionalBlur: {
    borderRadius: responsiveWidth(24),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: responsiveHeight(4) },
    shadowOpacity: 0.15,
    shadowRadius: responsiveWidth(16),
    elevation: 8,
  },
  additionalGradient: {
    paddingHorizontal: 16,
  },
  additionalButtonsContainer: {
    width: '100%',
  },
});

export default ProfileScreen;