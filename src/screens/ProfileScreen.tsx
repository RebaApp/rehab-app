import React, { memo, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Animated,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { User } from '../types';
import { THEME } from '../utils/constants';
import { responsiveWidth, responsiveHeight, responsivePadding } from '../utils/responsive';

interface ProfileScreenProps {
  user: User | null;
  isAuthenticated: boolean;
  onLogoutPress: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = memo(({
  user,
  isAuthenticated,
  onLogoutPress
}) => {
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

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[THEME.bgTop, THEME.bgMid, THEME.bgBottom]}
        style={styles.gradient}
      >
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
                    
                    <TouchableOpacity 
                      style={styles.logoutButton} 
                      onPress={onLogoutPress}
                      activeOpacity={0.7}
                    >
                      <LinearGradient
                        colors={['#81D4FA', '#42A5F5']}
                        style={styles.buttonGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                      >
                        <Ionicons name="log-out-outline" size={16} color="#fff" />
                        <Text style={styles.buttonText}>Выйти из аккаунта</Text>
                      </LinearGradient>
                    </TouchableOpacity>
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
                      <View style={styles.authIconContainer}>
                        <LinearGradient
                          colors={['#81D4FA', '#42A5F5']}
                          style={styles.authIconGradient}
                        >
                          <Ionicons name="person-outline" size={48} color="#FFFFFF" />
                        </LinearGradient>
                      </View>
                      
                      <View style={styles.authTextContainer}>
                        <Text style={styles.authTitle}>Войдите в систему</Text>
                        <Text style={styles.authSubtitle}>
                          Для доступа к полному функционалу приложения
                        </Text>
                      </View>
                      
                      <View style={styles.authButtons}>
                        <TouchableOpacity 
                          style={styles.authButton}
                          onPress={() => console.log('Login pressed')}
                          activeOpacity={0.7}
                        >
                          <LinearGradient
                            colors={['#81D4FA', '#42A5F5']}
                            style={styles.buttonGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                          >
                            <Ionicons name="log-in-outline" size={16} color="#fff" />
                            <Text style={styles.buttonText}>Вход</Text>
                          </LinearGradient>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                          style={styles.authButton}
                          onPress={() => console.log('Register pressed')}
                          activeOpacity={0.7}
                        >
                          <LinearGradient
                            colors={['#81D4FA', '#42A5F5']}
                            style={styles.buttonGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                          >
                            <Ionicons name="person-add-outline" size={16} color="#fff" />
                            <Text style={styles.buttonText}>Регистрация</Text>
                          </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity 
                          style={styles.authButton}
                          onPress={() => console.log('Register center pressed')}
                          activeOpacity={0.7}
                        >
                          <LinearGradient
                            colors={['#81D4FA', '#42A5F5']}
                            style={styles.buttonGradient}
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
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
  },
  gradient: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: responsivePadding(100),
  },
  content: {
    flex: 1,
    paddingHorizontal: responsivePadding(20),
    paddingTop: responsivePadding(40),
  },
  
  // Секция пользователя
  userSection: {
    marginBottom: responsivePadding(24),
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
    padding: responsivePadding(32),
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: responsivePadding(24),
  },
  userDetails: {
    alignItems: 'center',
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
  logoutButton: {
    borderRadius: responsiveWidth(12),
    overflow: 'hidden',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: responsivePadding(12),
    paddingHorizontal: responsivePadding(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: responsiveHeight(2) },
    shadowOpacity: 0.1,
    shadowRadius: responsiveWidth(8),
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: responsiveWidth(16),
    fontWeight: '600',
    marginLeft: responsivePadding(8),
  },

  // Секция авторизации
  authSection: {
    marginBottom: responsivePadding(24),
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
    padding: responsivePadding(32),
  },
  authContent: {
    alignItems: 'center',
  },
  authIconContainer: {
    marginBottom: responsivePadding(24),
  },
  authIconGradient: {
    width: responsiveWidth(80),
    height: responsiveWidth(80),
    borderRadius: responsiveWidth(40),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: responsiveHeight(2) },
    shadowOpacity: 0.2,
    shadowRadius: responsiveWidth(8),
    elevation: 4,
  },
  authTextContainer: {
    alignItems: 'center',
    marginBottom: responsivePadding(32),
  },
  authTitle: {
    fontSize: responsiveWidth(24),
    fontWeight: '800',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: responsivePadding(8),
  },
  authSubtitle: {
    fontSize: responsiveWidth(16),
    color: '#666',
    textAlign: 'center',
    lineHeight: responsiveWidth(22),
  },
  authButtons: {
    width: '100%',
  },
  authButton: {
    marginBottom: responsivePadding(16),
    borderRadius: responsiveWidth(12),
    overflow: 'hidden',
  },
});

export default ProfileScreen;