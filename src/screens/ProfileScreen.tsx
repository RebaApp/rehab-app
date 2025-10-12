import React, { memo, useCallback, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { User } from '../types';
import { THEME } from '../utils/constants';
import AdminModal from '../components/common/AdminModal';
import CreateArticleModal from '../components/common/CreateArticleModal';
import CreateCenterModal from '../components/common/CreateCenterModal';
import useAppStore from '../store/useAppStore';

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
  const [adminModalVisible, setAdminModalVisible] = useState(false);
  const [createArticleModalVisible, setCreateArticleModalVisible] = useState(false);
  const [createCenterModalVisible, setCreateCenterModalVisible] = useState(false);
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
    setAdminModalVisible(true);
  }, []);

  const handleCreateArticle = useCallback(() => {
    setCreateArticleModalVisible(true);
  }, []);

  const handleCreateCenter = useCallback(() => {
    setCreateCenterModalVisible(true);
  }, []);

  const handleSaveArticle = useCallback((article: any) => {
    const { addArticle } = useAppStore.getState();
    try {
      const newArticle = addArticle(article);
      console.log('Article saved:', newArticle);
      Alert.alert('Успех', `Статья "${article.title}" добавлена в рубрику "${article.rubric}"!`);
    } catch (error) {
      console.error('Error saving article:', error);
      Alert.alert('Ошибка', 'Не удалось сохранить статью');
    }
  }, []);

  const handleSaveCenter = useCallback((center: any) => {
    console.log('Saving center:', center);
    Alert.alert('Успех', 'Центр сохранен! (Пока только в консоли)');
    // TODO: Отправить на сервер
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Профиль</Text>
      
      {isAuthenticated && user ? (
        <View style={styles.authenticatedContainer}>
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
          
          <TouchableOpacity style={styles.logoutButton} onPress={onLogoutPress}>
            <Ionicons name="log-out-outline" size={20} color="#fff" />
            <Text style={styles.logoutButtonText}>Выйти из аккаунта</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.unauthenticatedContainer}>
          <View style={styles.authButtons}>
            <TouchableOpacity style={styles.loginButton} onPress={onLoginPress}>
              <Ionicons name="log-in-outline" size={20} color={THEME.primary} />
              <Text style={styles.loginButtonText}>Вход</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.registerButton} onPress={onRegisterPress}>
              <Ionicons name="person-add-outline" size={20} color="#fff" />
              <Text style={styles.registerButtonText}>Регистрация</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      <View style={styles.menuSection}>
        <TouchableOpacity style={styles.menuItem} onPress={handleAboutPress}>
          <Ionicons name="information-circle-outline" size={20} color={THEME.muted} />
          <Text style={styles.menuItemText}>О нас</Text>
          <Ionicons name="chevron-forward" size={16} color={THEME.muted} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={handleAgreementsPress}>
          <Ionicons name="document-text-outline" size={20} color={THEME.muted} />
          <Text style={styles.menuItemText}>Соглашения</Text>
          <Ionicons name="chevron-forward" size={16} color={THEME.muted} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={handlePricingPress}>
          <Ionicons name="card-outline" size={20} color={THEME.muted} />
          <Text style={styles.menuItemText}>Тарифы</Text>
          <Ionicons name="chevron-forward" size={16} color={THEME.muted} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={handleContactsPress}>
          <Ionicons name="mail-outline" size={20} color={THEME.muted} />
          <Text style={styles.menuItemText}>Контакты</Text>
          <Ionicons name="chevron-forward" size={16} color={THEME.muted} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={handleInvestorsPress}>
          <Ionicons name="trending-up-outline" size={20} color={THEME.muted} />
          <Text style={styles.menuItemText}>Для инвесторов</Text>
          <Ionicons name="chevron-forward" size={16} color={THEME.muted} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={handleCareerPress}>
          <Ionicons name="briefcase-outline" size={20} color={THEME.muted} />
          <Text style={styles.menuItemText}>Карьера в РЕБА</Text>
          <Ionicons name="chevron-forward" size={16} color={THEME.muted} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={onSettingsPress}>
          <Ionicons name="settings-outline" size={20} color={THEME.muted} />
          <Text style={styles.menuItemText}>Настройки</Text>
          <Ionicons name="chevron-forward" size={16} color={THEME.muted} />
        </TouchableOpacity>
        
        {/* Админ панель - показываем всем для разработки */}
        <TouchableOpacity style={[styles.menuItem, styles.adminMenuItem]} onPress={handleAdminPress}>
          <Ionicons name="construct-outline" size={20} color={THEME.primary} />
          <Text style={[styles.menuItemText, styles.adminMenuItemText]}>Админ панель</Text>
          <Ionicons name="chevron-forward" size={16} color={THEME.primary} />
        </TouchableOpacity>
      </View>

      {/* Модальные окна */}
      <AdminModal
        visible={adminModalVisible}
        onClose={() => setAdminModalVisible(false)}
        onCreateArticle={handleCreateArticle}
        onCreateCenter={handleCreateCenter}
      />

      <CreateArticleModal
        visible={createArticleModalVisible}
        onClose={() => setCreateArticleModalVisible(false)}
        onSave={handleSaveArticle}
      />

      <CreateCenterModal
        visible={createCenterModalVisible}
        onClose={() => setCreateCenterModalVisible(false)}
        onSave={handleSaveCenter}
      />
    </ScrollView>
  );
});

ProfileScreen.displayName = 'ProfileScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    padding: 12
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#333',
    marginBottom: 20
  },
  authenticatedContainer: {
    marginBottom: 24
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    ...THEME.shadow
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
    ...THEME.shadow
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8
  },
  unauthenticatedContainer: {
    marginBottom: 24
  },
  authButtons: {
    gap: 12
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: THEME.primary,
    ...THEME.shadow
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
    ...THEME.shadow
  },
  registerButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8
  },
  menuSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    ...THEME.shadow
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 12
  },
  adminMenuItem: {
    backgroundColor: THEME.primary + '10',
    borderLeftWidth: 3,
    borderLeftColor: THEME.primary,
  },
  adminMenuItemText: {
    color: THEME.primary,
    fontWeight: '600',
  }
});

export default ProfileScreen;