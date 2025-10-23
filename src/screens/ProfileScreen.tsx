import React, { memo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { User } from '../types';
import { THEME } from '../utils/constants';

const { width: screenWidth } = Dimensions.get('window');

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
              onPress={() => console.log('Login pressed')}
              activeOpacity={0.7}
            >
              <Ionicons name="log-in-outline" size={20} color={THEME.primary} />
              <Text style={styles.loginButtonText}>Вход</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.registerButton} 
              onPress={() => console.log('Register pressed')}
              activeOpacity={0.7}
            >
              <Ionicons name="person-add-outline" size={20} color="#fff" />
              <Text style={styles.registerButtonText}>Регистрация</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.registerCenterButton} 
              onPress={() => console.log('Register center pressed')}
              activeOpacity={0.7}
            >
              <Ionicons name="business-outline" size={20} color="#fff" />
              <Text style={styles.registerCenterButtonText}>Регистрация центра</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

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
  authText: {
    fontSize: 16,
    color: THEME.muted,
    textAlign: 'center',
    padding: 20,
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