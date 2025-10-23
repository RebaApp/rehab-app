import React, { memo, useCallback, useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { User } from '../types';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface ProfileScreenWebProps {
  user: User | null;
  isAuthenticated: boolean;
  onLoginPress: () => void;
  onRegisterPress: () => void;
  onLogoutPress: () => void;
  onSettingsPress: () => void;
}

const ProfileScreenWeb: React.FC<ProfileScreenWebProps> = memo(({
  user,
  isAuthenticated,
  onLoginPress,
  onRegisterPress,
  onLogoutPress,
  onSettingsPress
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'settings' | 'help' | 'admin'>('profile');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(100)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
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
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleTabPress = useCallback((tab: 'profile' | 'settings' | 'help' | 'admin') => {
    setActiveTab(tab);
  }, []);

  const renderProfileTab = () => (
    <Animated.View style={[styles.tabContent, { 
      opacity: fadeAnim, 
      transform: [
        { translateY: slideAnim },
        { scale: scaleAnim }
      ] 
    }]}>
      {/* Hero Section with Glassmorphism */}
      <View style={styles.heroSection}>
        <BlurView intensity={20} tint="light" style={styles.heroBlur}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.1)']}
            style={styles.heroGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.profileHeader}>
              <View style={styles.avatarSection}>
                <Animated.View style={[styles.avatarContainer, {
                  transform: [{
                    rotate: rotateAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '360deg']
                    })
                  }]
                }]}>
                  <LinearGradient
                    colors={['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7']}
                    style={styles.avatarGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={styles.avatarText}>
                      {user ? user.name.charAt(0).toUpperCase() : '?'}
                    </Text>
                  </LinearGradient>
                  <View style={styles.statusIndicator}>
                    <View style={styles.statusPulse} />
                  </View>
                </Animated.View>
              </View>
              
              <View style={styles.userInfoSection}>
                <Text style={styles.userName}>
                  {user ? user.name : 'Добро пожаловать в будущее'}
                </Text>
                <Text style={styles.userEmail}>
                  {user ? user.email : 'Войдите в аккаунт для продолжения'}
                </Text>
                <View style={styles.userBadge}>
                  <Ionicons name="sparkles" size={16} color="#FFD700" />
                  <Text style={styles.badgeText}>
                    {user ? 'Premium пользователь' : 'Гость'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Progress Section with Glassmorphism */}
            <View style={styles.progressSection}>
              <View style={styles.progressContainer}>
                <View style={styles.progressRing}>
                  <Animated.View style={[styles.progressFill, {
                    transform: [{
                      rotate: rotateAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '360deg']
                      })
                    }]
                  }]} />
                  <View style={styles.progressCenter}>
                    <Text style={styles.progressText}>85%</Text>
                    <Text style={styles.progressLabel}>Прогресс</Text>
                  </View>
                </View>
                <View style={styles.progressInfo}>
                  <Text style={styles.progressTitle}>Ваш путь к выздоровлению</Text>
                  <Text style={styles.progressDescription}>
                    Вы прошли 17 из 20 этапов программы восстановления
                  </Text>
                  <View style={styles.progressBar}>
                    <View style={styles.progressBarFill} />
                  </View>
                </View>
              </View>
            </View>
          </LinearGradient>
        </BlurView>
      </View>

      {/* Stats Cards with Glassmorphism */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Статистика</Text>
        <View style={styles.statsGrid}>
          <BlurView intensity={15} tint="light" style={styles.statCard}>
            <LinearGradient
              colors={['rgba(255, 107, 107, 0.2)', 'rgba(255, 107, 107, 0.1)']}
              style={styles.statGradient}
            >
              <View style={styles.statIconContainer}>
                <Ionicons name="calendar" size={24} color="#FF6B6B" />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statNumber}>24</Text>
                <Text style={styles.statLabel}>Дней в программе</Text>
                <Text style={styles.statChange}>+5 на этой неделе</Text>
              </View>
            </LinearGradient>
          </BlurView>
          
          <BlurView intensity={15} tint="light" style={styles.statCard}>
            <LinearGradient
              colors={['rgba(78, 205, 196, 0.2)', 'rgba(78, 205, 196, 0.1)']}
              style={styles.statGradient}
            >
              <View style={styles.statIconContainer}>
                <Ionicons name="checkmark-circle" size={24} color="#4ECDC4" />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statNumber}>18</Text>
                <Text style={styles.statLabel}>Выполнено задач</Text>
                <Text style={styles.statChange}>90% успешности</Text>
              </View>
            </LinearGradient>
          </BlurView>
          
          <BlurView intensity={15} tint="light" style={styles.statCard}>
            <LinearGradient
              colors={['rgba(255, 234, 167, 0.2)', 'rgba(255, 234, 167, 0.1)']}
              style={styles.statGradient}
            >
              <View style={styles.statIconContainer}>
                <Ionicons name="trophy" size={24} color="#FFEAA7" />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statNumber}>7</Text>
                <Text style={styles.statLabel}>Достижения</Text>
                <Text style={styles.statChange}>Новое: "Мастер"</Text>
              </View>
            </LinearGradient>
          </BlurView>
        </View>
      </View>

      {/* Quick Actions with Glassmorphism */}
      <View style={styles.actionsSection}>
        <Text style={styles.sectionTitle}>Быстрые действия</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionCard}>
            <BlurView intensity={10} tint="light" style={styles.actionBlur}>
              <LinearGradient
                colors={['rgba(69, 183, 209, 0.3)', 'rgba(69, 183, 209, 0.1)']}
                style={styles.actionGradient}
              >
                <View style={styles.actionIconContainer}>
                  <Ionicons name="calendar" size={20} color="#45B7D1" />
                </View>
                <Text style={styles.actionTitle}>Расписание</Text>
                <Text style={styles.actionSubtitle}>Сегодня в 15:00</Text>
                <View style={styles.actionBadge}>
                  <Text style={styles.actionBadgeText}>Новое</Text>
                </View>
              </LinearGradient>
            </BlurView>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionCard}>
            <BlurView intensity={10} tint="light" style={styles.actionBlur}>
              <LinearGradient
                colors={['rgba(150, 206, 180, 0.3)', 'rgba(150, 206, 180, 0.1)']}
                style={styles.actionGradient}
              >
                <View style={styles.actionIconContainer}>
                  <Ionicons name="book" size={20} color="#96CEB4" />
                </View>
                <Text style={styles.actionTitle}>Материалы</Text>
                <Text style={styles.actionSubtitle}>8 новых статей</Text>
                <View style={styles.actionBadge}>
                  <Text style={styles.actionBadgeText}>+8</Text>
                </View>
              </LinearGradient>
            </BlurView>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionCard}>
            <BlurView intensity={10} tint="light" style={styles.actionBlur}>
              <LinearGradient
                colors={['rgba(255, 107, 107, 0.3)', 'rgba(255, 107, 107, 0.1)']}
                style={styles.actionGradient}
              >
                <View style={styles.actionIconContainer}>
                  <Ionicons name="people" size={20} color="#FF6B6B" />
                </View>
                <Text style={styles.actionTitle}>Сообщество</Text>
                <Text style={styles.actionSubtitle}>Активно</Text>
                <View style={styles.actionBadge}>
                  <Text style={styles.actionBadgeText}>Live</Text>
                </View>
              </LinearGradient>
            </BlurView>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionCard}>
            <BlurView intensity={10} tint="light" style={styles.actionBlur}>
              <LinearGradient
                colors={['rgba(255, 234, 167, 0.3)', 'rgba(255, 234, 167, 0.1)']}
                style={styles.actionGradient}
              >
                <View style={styles.actionIconContainer}>
                  <Ionicons name="trophy" size={20} color="#FFEAA7" />
                </View>
                <Text style={styles.actionTitle}>Достижения</Text>
                <Text style={styles.actionSubtitle}>7 из 15</Text>
                <View style={styles.actionBadge}>
                  <Text style={styles.actionBadgeText}>47%</Text>
                </View>
              </LinearGradient>
            </BlurView>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Activity with Glassmorphism */}
      <View style={styles.activitySection}>
        <Text style={styles.sectionTitle}>Недавняя активность</Text>
        <BlurView intensity={15} tint="light" style={styles.activityContainer}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)']}
            style={styles.activityGradient}
          >
            <View style={styles.activityItem}>
              <View style={styles.activityIconContainer}>
                <Ionicons name="checkmark-circle" size={16} color="#4ECDC4" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Выполнена утренняя медитация</Text>
                <Text style={styles.activityDescription}>Сессия длилась 25 минут</Text>
                <Text style={styles.activityTime}>2 часа назад</Text>
              </View>
              <View style={styles.activityBadge}>
                <Text style={styles.activityBadgeText}>+15</Text>
              </View>
            </View>
            
            <View style={styles.activityItem}>
              <View style={styles.activityIconContainer}>
                <Ionicons name="book" size={16} color="#45B7D1" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Прочитана статья "Стресс и восстановление"</Text>
                <Text style={styles.activityDescription}>Время чтения: 12 минут</Text>
                <Text style={styles.activityTime}>Вчера</Text>
              </View>
              <View style={styles.activityBadge}>
                <Text style={styles.activityBadgeText}>+8</Text>
              </View>
            </View>
            
            <View style={styles.activityItem}>
              <View style={styles.activityIconContainer}>
                <Ionicons name="people" size={16} color="#FF6B6B" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Участие в групповой сессии</Text>
                <Text style={styles.activityDescription}>Тема: "Управление тревогой"</Text>
                <Text style={styles.activityTime}>3 дня назад</Text>
              </View>
              <View style={styles.activityBadge}>
                <Text style={styles.activityBadgeText}>+20</Text>
              </View>
            </View>
          </LinearGradient>
        </BlurView>
      </View>
    </Animated.View>
  );

  const renderSettingsTab = () => (
    <Animated.View style={[styles.tabContent, { 
      opacity: fadeAnim, 
      transform: [
        { translateY: slideAnim },
        { scale: scaleAnim }
      ] 
    }]}>
      {/* Settings with Glassmorphism */}
      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Настройки</Text>
        <BlurView intensity={15} tint="light" style={styles.settingsContainer}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)']}
            style={styles.settingsGradient}
          >
            <View style={styles.settingItem}>
              <View style={styles.settingIconContainer}>
                <Ionicons name="person" size={20} color="#45B7D1" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Личная информация</Text>
                <Text style={styles.settingDescription}>Имя, контакты, дата рождения</Text>
              </View>
              <View style={styles.settingBadge}>
                <Text style={styles.settingBadgeText}>Обновлено</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#C7C7CC" />
            </View>
            
            <View style={styles.settingItem}>
              <View style={styles.settingIconContainer}>
                <Ionicons name="shield-checkmark" size={20} color="#4ECDC4" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Безопасность</Text>
                <Text style={styles.settingDescription}>Пароль, двухфакторная аутентификация</Text>
              </View>
              <View style={styles.settingBadge}>
                <Text style={styles.settingBadgeText}>Активно</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#C7C7CC" />
            </View>
            
            <View style={styles.settingItem}>
              <View style={styles.settingIconContainer}>
                <Ionicons name="card" size={20} color="#FFEAA7" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Платежи</Text>
                <Text style={styles.settingDescription}>Способы оплаты, история платежей</Text>
              </View>
              <View style={styles.settingBadge}>
                <Text style={styles.settingBadgeText}>3 карты</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#C7C7CC" />
            </View>
          </LinearGradient>
        </BlurView>
      </View>
    </Animated.View>
  );

  const renderHelpTab = () => (
    <Animated.View style={[styles.tabContent, { 
      opacity: fadeAnim, 
      transform: [
        { translateY: slideAnim },
        { scale: scaleAnim }
      ] 
    }]}>
      {/* Emergency Help with Glassmorphism */}
      <View style={styles.emergencySection}>
        <Text style={styles.sectionTitle}>Экстренная помощь</Text>
        <BlurView intensity={20} tint="light" style={styles.emergencyContainer}>
          <LinearGradient
            colors={['rgba(255, 107, 107, 0.3)', 'rgba(255, 107, 107, 0.1)']}
            style={styles.emergencyGradient}
          >
            <View style={styles.emergencyHeader}>
              <View style={styles.emergencyIconContainer}>
                <Ionicons name="call" size={24} color="#FF6B6B" />
              </View>
              <View style={styles.emergencyInfo}>
                <Text style={styles.emergencyTitle}>Телефон доверия</Text>
                <Text style={styles.emergencySubtitle}>Круглосуточная поддержка</Text>
              </View>
            </View>
            <Text style={styles.emergencyNumber}>8-800-200-0-200</Text>
            <Text style={styles.emergencyDescription}>
              Круглосуточная поддержка для людей в кризисной ситуации. 
              Анонимно и конфиденциально.
            </Text>
            <TouchableOpacity style={styles.emergencyButton}>
              <Ionicons name="call" size={16} color="#fff" />
              <Text style={styles.emergencyButtonText}>Позвонить сейчас</Text>
            </TouchableOpacity>
          </LinearGradient>
        </BlurView>
      </View>
    </Animated.View>
  );

  const renderAdminTab = () => (
    <Animated.View style={[styles.tabContent, { 
      opacity: fadeAnim, 
      transform: [
        { translateY: slideAnim },
        { scale: scaleAnim }
      ] 
    }]}>
      {/* Admin Panel with Glassmorphism */}
      <View style={styles.adminSection}>
        <Text style={styles.sectionTitle}>Панель администратора</Text>
        <View style={styles.adminGrid}>
          <BlurView intensity={15} tint="light" style={styles.adminCard}>
            <LinearGradient
              colors={['rgba(69, 183, 209, 0.2)', 'rgba(69, 183, 209, 0.1)']}
              style={styles.adminGradient}
            >
              <View style={styles.adminIconContainer}>
                <Ionicons name="people" size={24} color="#45B7D1" />
              </View>
              <Text style={styles.adminTitle}>Пользователи</Text>
              <Text style={styles.adminDescription}>Управление пользователями</Text>
              <View style={styles.adminStats}>
                <Text style={styles.adminStatNumber}>2,847</Text>
                <Text style={styles.adminStatLabel}>активных</Text>
              </View>
            </LinearGradient>
          </BlurView>
          
          <BlurView intensity={15} tint="light" style={styles.adminCard}>
            <LinearGradient
              colors={['rgba(78, 205, 196, 0.2)', 'rgba(78, 205, 196, 0.1)']}
              style={styles.adminGradient}
            >
              <View style={styles.adminIconContainer}>
                <Ionicons name="business" size={24} color="#4ECDC4" />
              </View>
              <Text style={styles.adminTitle}>Центры</Text>
              <Text style={styles.adminDescription}>Управление центрами</Text>
              <View style={styles.adminStats}>
                <Text style={styles.adminStatNumber}>156</Text>
                <Text style={styles.adminStatLabel}>центров</Text>
              </View>
            </LinearGradient>
          </BlurView>
        </View>
      </View>
    </Animated.View>
  );

  const renderAuthSection = () => (
    <Animated.View style={[styles.authSection, { 
      opacity: fadeAnim, 
      transform: [{ scale: scaleAnim }] 
    }]}>
      <BlurView intensity={25} tint="light" style={styles.authContainer}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)']}
          style={styles.authGradient}
        >
          <View style={styles.authHeader}>
            <View style={styles.authIconContainer}>
              <Ionicons name="person-circle" size={80} color="#45B7D1" />
            </View>
            <Text style={styles.authTitle}>Добро пожаловать в будущее!</Text>
            <Text style={styles.authSubtitle}>
              Войдите в аккаунт, чтобы получить персональную программу восстановления
            </Text>
          </View>
          
          <View style={styles.authButtons}>
            <TouchableOpacity style={styles.loginButton} onPress={onLoginPress}>
              <LinearGradient
                colors={['#45B7D1', '#4ECDC4']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Ionicons name="log-in" size={20} color="#fff" />
                <Text style={styles.buttonText}>Войти</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.registerButton} onPress={onRegisterPress}>
              <LinearGradient
                colors={['#4ECDC4', '#96CEB4']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Ionicons name="person-add" size={20} color="#fff" />
                <Text style={styles.buttonText}>Регистрация</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.registerCenterButton} onPress={onRegisterPress}>
              <Ionicons name="business" size={16} color="#FFEAA7" />
              <Text style={styles.registerCenterButtonText}>Регистрация центра</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </BlurView>
    </Animated.View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Профиль</Text>
          {isAuthenticated && (
            <TouchableOpacity style={styles.logoutButton} onPress={onLogoutPress}>
              <Ionicons name="log-out" size={16} color="#FF6B6B" />
              <Text style={styles.logoutText}>Выйти</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Auth Section or Profile Content */}
        {!isAuthenticated ? (
          renderAuthSection()
        ) : (
          <>
            {/* Tab Navigation */}
            <View style={styles.tabNavigation}>
              <TouchableOpacity 
                style={[styles.tabButton, activeTab === 'profile' && styles.tabButtonActive]}
                onPress={() => handleTabPress('profile')}
              >
                <Text style={[styles.tabButtonText, activeTab === 'profile' && styles.tabButtonTextActive]}>
                  Профиль
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.tabButton, activeTab === 'settings' && styles.tabButtonActive]}
                onPress={() => handleTabPress('settings')}
              >
                <Text style={[styles.tabButtonText, activeTab === 'settings' && styles.tabButtonTextActive]}>
                  Настройки
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.tabButton, activeTab === 'help' && styles.tabButtonActive]}
                onPress={() => handleTabPress('help')}
              >
                <Text style={[styles.tabButtonText, activeTab === 'help' && styles.tabButtonTextActive]}>
                  Помощь
                </Text>
              </TouchableOpacity>
              {user?.userType === 'ADMIN' && (
                <TouchableOpacity 
                  style={[styles.tabButton, activeTab === 'admin' && styles.tabButtonActive]}
                  onPress={() => handleTabPress('admin')}
                >
                  <Text style={[styles.tabButtonText, activeTab === 'admin' && styles.tabButtonTextActive]}>
                    Админ
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Tab Content */}
            {activeTab === 'profile' && renderProfileTab()}
            {activeTab === 'settings' && renderSettingsTab()}
            {activeTab === 'help' && renderHelpTab()}
            {activeTab === 'admin' && renderAdminTab()}
          </>
        )}
      </View>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 42,
    fontWeight: '800',
    color: '#1a1a1a',
    letterSpacing: -1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
  },
  logoutText: {
    fontSize: 16,
    color: '#FF6B6B',
    marginLeft: 8,
    fontWeight: '600',
  },
  tabNavigation: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
    padding: 6,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: 'rgba(69, 183, 209, 0.2)',
    shadowColor: '#45B7D1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  tabButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  tabButtonTextActive: {
    color: '#45B7D1',
    fontWeight: '700',
  },
  tabContent: {
    flex: 1,
  },
  heroSection: {
    marginBottom: 32,
  },
  heroBlur: {
    borderRadius: 32,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
  heroGradient: {
    padding: 32,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarSection: {
    marginRight: 24,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#4ECDC4',
  },
  statusPulse: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4ECDC4',
  },
  userInfoSection: {
    flex: 1,
  },
  userName: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  userEmail: {
    fontSize: 18,
    color: '#666',
    marginBottom: 12,
  },
  userBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 16,
    marginLeft: 8,
    color: '#FFD700',
    fontWeight: '700',
  },
  progressSection: {
    marginTop: 24,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 8,
    borderColor: 'rgba(69, 183, 209, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 24,
    position: 'relative',
  },
  progressFill: {
    position: 'absolute',
    top: -8,
    left: -8,
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 8,
    borderColor: '#45B7D1',
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    transform: [{ rotate: '-45deg' }],
  },
  progressCenter: {
    alignItems: 'center',
  },
  progressText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1a1a1a',
  },
  progressLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  progressInfo: {
    flex: 1,
  },
  progressTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  progressDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    lineHeight: 24,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(69, 183, 209, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    width: '85%',
    height: '100%',
    backgroundColor: '#45B7D1',
    borderRadius: 4,
  },
  statsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  statsGrid: {
    flexDirection: 'row',
    marginHorizontal: -12,
  },
  statCard: {
    flex: 1,
    borderRadius: 24,
    marginHorizontal: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  statGradient: {
    padding: 24,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  statContent: {
    flex: 1,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
    fontWeight: '600',
  },
  statChange: {
    fontSize: 14,
    color: '#4ECDC4',
    fontWeight: '700',
  },
  actionsSection: {
    marginBottom: 32,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -12,
  },
  actionCard: {
    width: '48%',
    marginHorizontal: 12,
    marginBottom: 20,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  actionBlur: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  actionGradient: {
    padding: 24,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  actionBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  actionBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  activitySection: {
    marginBottom: 32,
  },
  activityContainer: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  activityGradient: {
    padding: 24,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  activityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: '#999',
  },
  activityBadge: {
    backgroundColor: 'rgba(78, 205, 196, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  activityBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  settingsSection: {
    marginBottom: 32,
  },
  settingsContainer: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  settingsGradient: {
    padding: 24,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  settingIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
  },
  settingBadge: {
    backgroundColor: 'rgba(78, 205, 196, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 12,
  },
  settingBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  emergencySection: {
    marginBottom: 32,
  },
  emergencyContainer: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  emergencyGradient: {
    padding: 32,
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  emergencyIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  emergencyInfo: {
    flex: 1,
  },
  emergencyTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  emergencySubtitle: {
    fontSize: 16,
    color: '#666',
  },
  emergencyNumber: {
    fontSize: 40,
    fontWeight: '800',
    color: '#FF6B6B',
    marginBottom: 16,
    textAlign: 'center',
  },
  emergencyDescription: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 26,
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B6B',
    paddingVertical: 20,
    paddingHorizontal: 32,
    borderRadius: 16,
  },
  emergencyButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  adminSection: {
    marginBottom: 32,
  },
  adminGrid: {
    flexDirection: 'row',
    marginHorizontal: -12,
  },
  adminCard: {
    flex: 1,
    borderRadius: 24,
    marginHorizontal: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  adminGradient: {
    padding: 24,
  },
  adminIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  adminTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  adminDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  adminStats: {
    alignItems: 'center',
  },
  adminStatNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a1a1a',
  },
  adminStatLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  authSection: {
    marginTop: 60,
  },
  authContainer: {
    borderRadius: 32,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
  authGradient: {
    padding: 48,
  },
  authHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  authIconContainer: {
    marginBottom: 20,
  },
  authTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 12,
    letterSpacing: -1,
    textAlign: 'center',
  },
  authSubtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    lineHeight: 26,
  },
  authButtons: {
    width: '100%',
  },
  loginButton: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
  registerButton: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 32,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  registerCenterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 234, 167, 0.2)',
    paddingVertical: 20,
    paddingHorizontal: 32,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFEAA7',
  },
  registerCenterButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFEAA7',
    marginLeft: 12,
  },
});

export default ProfileScreenWeb;