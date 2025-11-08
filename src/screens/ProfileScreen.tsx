import React, { memo, useRef, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Animated,
  Modal,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { User } from '../types';
import { responsiveWidth, responsiveHeight, responsivePadding } from '../utils/responsive';
import AuthModal from '../components/auth/AuthModal';
import EditProfileScreen from './EditProfileScreen';
import SettingsScreen from './SettingsScreen';
import AddEditCenterScreen from './AddEditCenterScreen';
import SubscriptionScreen from './SubscriptionScreen';
import { Center } from '../types';
import apiService from '../services/apiService';

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
  
  // Состояние экрана редактирования профиля
  const [editProfileVisible, setEditProfileVisible] = useState(false);
  // Состояние экрана настроек
  const [settingsVisible, setSettingsVisible] = useState(false);
  // Состояние экрана добавления/редактирования центра
  const [addEditCenterVisible, setAddEditCenterVisible] = useState(false);
  const [editingCenter, setEditingCenter] = useState<Center | undefined>(undefined);
  // Состояние экрана оплаты подписки
  const [subscriptionVisible, setSubscriptionVisible] = useState(false);
  const [subscriptionCenter, setSubscriptionCenter] = useState<Center | undefined>(undefined);
  // Состояние центров пользователя
  const [userCenters, setUserCenters] = useState<Center[]>([]);
  const [loadingCenters, setLoadingCenters] = useState(false);

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

  // Загрузка центров пользователя (для владельцев центров)
  useEffect(() => {
    if (isAuthenticated && user && (user.userType === 'CENTER_OWNER' || user.userType === 'ADMIN')) {
      loadUserCenters();
    }
  }, [isAuthenticated, user]);

  const loadUserCenters = async () => {
    setLoadingCenters(true);
    try {
      const result = await apiService.getUserCenters();
      if (result.success && result.data) {
        setUserCenters(result.data);
      }
    } catch (error) {
      console.error('Ошибка загрузки центров пользователя:', error);
    } finally {
      setLoadingCenters(false);
    }
  };

  const handleAddCenter = () => {
    setEditingCenter(undefined);
    setAddEditCenterVisible(true);
  };

  const handleEditCenter = (center: Center) => {
    setEditingCenter(center);
    setAddEditCenterVisible(true);
  };

  const handleCenterSuccess = () => {
    setAddEditCenterVisible(false);
    setEditingCenter(undefined);
    loadUserCenters(); // Перезагружаем список центров
  };

  const handleSubscriptionSuccess = () => {
    setSubscriptionVisible(false);
    setSubscriptionCenter(undefined);
    loadUserCenters(); // Перезагружаем список центров
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
            <>
              <View style={styles.userSection}>
                <BlurView intensity={20} tint="light" style={styles.userBlur}>
                  <LinearGradient
                    colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)']}
                    style={styles.userGradient}
                  >
                    <View style={styles.userInfo}>
                      <View style={styles.userDetails}>
                        {(user.avatar || user.photo) && (
                          <Image 
                            source={{ uri: user.avatar || user.photo }} 
                            style={styles.userAvatar}
                          />
                        )}
                        <Text style={styles.userName}>{user.name}</Text>
                        <Text style={styles.userEmail}>{user.email}</Text>
                        {user.phone && <Text style={styles.userPhone}>{user.phone}</Text>}
                        {user.age && <Text style={styles.userAge}>Возраст: {user.age} лет</Text>}
                        <Text style={styles.userType}>
                          {user.userType === 'USER' ? 'Пользователь' : 'Центр'}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.actionsContainer}>
                      <TouchableOpacity 
                        style={styles.commonButton} 
                        onPress={() => setEditProfileVisible(true)}
                        activeOpacity={0.7}
                      >
                        <LinearGradient
                          colors={['#81D4FA', '#42A5F5']}
                          style={styles.commonButtonGradient}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                        >
                          <Ionicons name="create-outline" size={16} color="#fff" />
                          <Text style={styles.buttonText}>Редактировать профиль</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={styles.commonButton} 
                        onPress={onLogoutPress}
                        activeOpacity={0.7}
                      >
                        <LinearGradient
                          colors={['#FF6B6B', '#EE5A6F']}
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

              {/* Секция центров - только список для владельцев */}
              {(user.userType === 'CENTER_OWNER' || user.userType === 'ADMIN') && (
              <View style={styles.centersSection}>
                <BlurView intensity={20} tint="light" style={styles.centersBlur}>
                  <LinearGradient
                    colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)']}
                    style={styles.centersGradient}
                  >
                    {/* Список центров для владельцев */}
                    <>
                      {loadingCenters ? (
                        <Text style={styles.centersLoading}>Загрузка...</Text>
                      ) : userCenters.length > 0 ? (
                        <View style={styles.centersList}>
                          {userCenters.map((center) => (
                          <TouchableOpacity
                            key={center.id}
                            style={styles.centerItem}
                            onPress={() => {
                              // Если центр одобрен, но подписка неактивна - показываем оплату
                              if (center.moderationStatus === 'APPROVED' && center.subscriptionStatus !== 'ACTIVE') {
                                setSubscriptionCenter(center);
                                setSubscriptionVisible(true);
                              } else {
                                handleEditCenter(center);
                              }
                            }}
                            activeOpacity={0.7}
                          >
                              {center.photos && center.photos.length > 0 && (
                                <Image
                                  source={{ uri: typeof center.photos[0] === 'string' ? center.photos[0] : String(center.photos[0]) }}
                                  style={styles.centerImage}
                                />
                              )}
                              <View style={styles.centerInfo}>
                                <Text style={styles.centerName}>{center.name}</Text>
                                <Text style={styles.centerCity}>{center.city}</Text>
                                
                                {/* Статус модерации */}
                                {center.moderationStatus === 'PENDING' && (
                                  <View style={styles.statusBadge}>
                                    <Ionicons name="time-outline" size={14} color="#FF9800" />
                                    <Text style={styles.statusTextPending}>На модерации</Text>
                                  </View>
                                )}
                                {center.moderationStatus === 'REJECTED' && (
                                  <View style={styles.statusBadge}>
                                    <Ionicons name="close-circle" size={14} color="#F44336" />
                                    <Text style={styles.statusTextRejected}>Отклонен</Text>
                                  </View>
                                )}
                                {center.moderationStatus === 'APPROVED' && center.subscriptionStatus !== 'ACTIVE' && (
                                  <View style={styles.statusBadge}>
                                    <Ionicons name="card-outline" size={14} color="#42A5F5" />
                                    <Text style={styles.statusTextApproved}>Одобрен, требуется оплата</Text>
                                  </View>
                                )}
                                {center.moderationStatus === 'APPROVED' && center.subscriptionStatus === 'ACTIVE' && (
                                  <View style={styles.statusBadge}>
                                    <Ionicons name="checkmark-circle" size={14} color="#34A853" />
                                    <Text style={styles.statusTextActive}>Активен в поиске</Text>
                                  </View>
                                )}
                                
                                {center.verified && (
                                  <View style={styles.verifiedBadge}>
                                    <Ionicons name="shield-checkmark" size={14} color="#34A853" />
                                    <Text style={styles.verifiedText}>Верифицирован</Text>
                                  </View>
                                )}
                              </View>
                              <Ionicons name="chevron-forward" size={20} color="#999" />
                            </TouchableOpacity>
                          ))}
                        </View>
                      ) : null}
                    </>
                  </LinearGradient>
                </BlurView>
              </View>
              )}
            </>
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
                  {/* Регистрация центра - для авторизованных */}
                  {isAuthenticated && (
                    <TouchableOpacity 
                      style={styles.commonButton}
                      onPress={handleAddCenter}
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
                  )}

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

                  {/* Настройки - доступны для всех */}
                  <TouchableOpacity 
                    style={styles.commonButton}
                    onPress={() => setSettingsVisible(true)}
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

      {/* Модальное окно редактирования профиля */}
      {isAuthenticated && user && (
        <Modal
          visible={editProfileVisible}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setEditProfileVisible(false)}
        >
          <EditProfileScreen
            user={user}
            onClose={() => setEditProfileVisible(false)}
            onSuccess={(updatedUser) => {
              // Обновляем пользователя в store через setUser
              // Это будет сделано автоматически через updateProfile в store
              setEditProfileVisible(false);
            }}
          />
        </Modal>
      )}

      {/* Модальное окно настроек */}
      {isAuthenticated && (
        <Modal
          visible={settingsVisible}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setSettingsVisible(false)}
        >
          <SettingsScreen onClose={() => setSettingsVisible(false)} />
        </Modal>
      )}

      {/* Модальное окно добавления/редактирования центра */}
      {isAuthenticated && (
        <Modal
          visible={addEditCenterVisible}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => {
            setAddEditCenterVisible(false);
            setEditingCenter(undefined);
          }}
        >
          <AddEditCenterScreen
            center={editingCenter}
            onClose={() => {
              setAddEditCenterVisible(false);
              setEditingCenter(undefined);
            }}
            onSuccess={handleCenterSuccess}
          />
        </Modal>
      )}

      {/* Модальное окно оплаты подписки */}
      {isAuthenticated && subscriptionCenter && (
        <Modal
          visible={subscriptionVisible}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => {
            setSubscriptionVisible(false);
            setSubscriptionCenter(undefined);
          }}
        >
          <SubscriptionScreen
            center={subscriptionCenter}
            onClose={() => {
              setSubscriptionVisible(false);
              setSubscriptionCenter(undefined);
            }}
            onSuccess={handleSubscriptionSuccess}
          />
        </Modal>
      )}
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
    width: '100%',
  },
  userAvatar: {
    width: responsiveWidth(80),
    height: responsiveWidth(80),
    borderRadius: responsiveWidth(40),
    marginBottom: responsivePadding(12),
    backgroundColor: '#E3F2FD',
  },
  actionsContainer: {
    width: '100%',
    gap: responsivePadding(12),
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
  userPhone: {
    fontSize: responsiveWidth(14),
    color: '#666',
    marginBottom: responsivePadding(2),
  },
  userAge: {
    fontSize: responsiveWidth(14),
    color: '#666',
    marginBottom: responsivePadding(2),
  },
  userType: {
    fontSize: responsiveWidth(14),
    color: '#81D4FA',
    fontWeight: '600',
  },
  // Секция центров
  centersSection: {
    marginTop: responsivePadding(16),
  },
  centersBlur: {
    borderRadius: responsiveWidth(24),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: responsiveHeight(4) },
    shadowOpacity: 0.15,
    shadowRadius: responsiveWidth(16),
    elevation: 8,
  },
  centersGradient: {
    paddingHorizontal: 16,
    paddingVertical: responsivePadding(16),
  },
  centersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: responsivePadding(16),
  },
  centersTitle: {
    fontSize: responsiveWidth(18),
    fontWeight: '700',
    color: '#1a1a1a',
  },
  addCenterButton: {
    padding: responsivePadding(4),
  },
  centersLoading: {
    fontSize: responsiveWidth(14),
    color: '#666',
    textAlign: 'center',
    paddingVertical: responsivePadding(16),
  },
  centersEmpty: {
    fontSize: responsiveWidth(14),
    color: '#999',
    textAlign: 'center',
    marginBottom: responsivePadding(16),
  },
  emptyCentersContainer: {
    alignItems: 'center',
    paddingVertical: responsivePadding(16),
  },
  addCenterButtonLarge: {
    borderRadius: responsiveWidth(12),
    overflow: 'hidden',
    marginTop: responsivePadding(12),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  addCenterButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: responsivePadding(12),
    paddingHorizontal: responsivePadding(24),
  },
  addCenterButtonText: {
    color: '#fff',
    fontSize: responsiveWidth(14),
    fontWeight: '600',
    marginLeft: responsivePadding(8),
  },
  becomeOwnerContainer: {
    alignItems: 'center',
    paddingVertical: responsivePadding(24),
  },
  becomeOwnerTitle: {
    fontSize: responsiveWidth(18),
    fontWeight: '700',
    color: '#1a1a1a',
    marginTop: responsivePadding(16),
    marginBottom: responsivePadding(8),
  },
  becomeOwnerText: {
    fontSize: responsiveWidth(14),
    color: '#666',
    textAlign: 'center',
    marginBottom: responsivePadding(24),
    paddingHorizontal: responsivePadding(16),
  },
  becomeOwnerButton: {
    borderRadius: responsiveWidth(12),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  becomeOwnerButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: responsivePadding(14),
    paddingHorizontal: responsivePadding(32),
  },
  becomeOwnerButtonText: {
    color: '#fff',
    fontSize: responsiveWidth(16),
    fontWeight: '600',
    marginLeft: responsivePadding(8),
  },
  centersList: {
    gap: responsivePadding(12),
  },
  centerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: responsiveWidth(12),
    padding: responsivePadding(12),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  centerImage: {
    width: responsiveWidth(60),
    height: responsiveWidth(60),
    borderRadius: responsiveWidth(8),
    marginRight: responsivePadding(12),
  },
  centerInfo: {
    flex: 1,
  },
  centerName: {
    fontSize: responsiveWidth(16),
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: responsivePadding(4),
  },
  centerCity: {
    fontSize: responsiveWidth(14),
    color: '#666',
    marginBottom: responsivePadding(4),
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsivePadding(4),
  },
  verifiedText: {
    fontSize: responsiveWidth(12),
    color: '#34A853',
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