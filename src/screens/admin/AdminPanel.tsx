import React, { memo, useCallback, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../../utils/constants';
import AdminHomeScreen from './AdminHomeScreen';
import AdminArticlesScreen from './AdminArticlesScreen';
import AdminCentersScreen from './AdminCentersScreen';
import AdminUsersScreen from './AdminUsersScreen';
import AdminAnalyticsScreen from './AdminAnalyticsScreen';
import CreateArticleModal from '../../components/common/CreateArticleModal';
import EditArticleModal from '../../components/common/EditArticleModal';
import CreateCenterModal from '../../components/common/CreateCenterModal';
import useAppStore from '../../store/useAppStore';
import { Article, Center } from '../../types';

interface AdminPanelProps {
  visible: boolean;
  onClose: () => void;
}

type AdminScreen = 'home' | 'articles-list' | 'create-article' | 'centers-list' | 'create-center' | 'users-list' | 'analytics-overview';

const AdminPanel: React.FC<AdminPanelProps> = memo(({ visible, onClose }) => {
  const [currentScreen, setCurrentScreen] = useState<AdminScreen>('home');
  const [createArticleModalVisible, setCreateArticleModalVisible] = useState(false);
  const [editArticleModalVisible, setEditArticleModalVisible] = useState(false);
  const [createCenterModalVisible, setCreateCenterModalVisible] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedCenter, setSelectedCenter] = useState<Center | null>(null);

  const { addArticle, updateArticle } = useAppStore();

  const handleNavigate = useCallback((screen: AdminScreen) => {
    setCurrentScreen(screen);
  }, []);

  const handleBackToHome = useCallback(() => {
    setCurrentScreen('home');
  }, []);

  const handleEditArticle = useCallback((article: Article) => {
    setSelectedArticle(article);
    setEditArticleModalVisible(true);
  }, []);

  const handleEditCenter = useCallback((center: Center) => {
    setSelectedCenter(center);
    // TODO: Implement center editing modal
    console.log('Edit center:', center);
  }, []);

  const handleSaveArticle = useCallback((article: {
    title: string;
    excerpt: string;
    body: string;
    image: string;
    authorName: string;
    authorCredentials: string;
    rubric: string;
    articleType: 'media' | 'integration';
    centerId?: string;
  }) => {
    try {
      const newArticle = addArticle(article);
      console.log('Article saved:', newArticle);
      setCreateArticleModalVisible(false);
    } catch (error) {
      console.error('Error saving article:', error);
    }
  }, [addArticle]);

  const handleUpdateArticle = useCallback((article: {
    id: string;
    title: string;
    excerpt: string;
    body: string;
    image: string;
    authorName: string;
    authorCredentials: string;
    rubric: string;
    articleType: 'media' | 'integration';
    centerId?: string;
  }) => {
    try {
      updateArticle(article.id, {
        title: article.title,
        excerpt: article.excerpt,
        body: article.body,
        image: article.image,
        author: `${article.authorName} - ${article.authorCredentials}`,
        category: article.rubric,
        updatedAt: new Date().toISOString(),
      });
      console.log('Article updated:', article);
      setEditArticleModalVisible(false);
      setSelectedArticle(null);
    } catch (error) {
      console.error('Error updating article:', error);
    }
  }, [updateArticle]);

  const handleSaveCenter = useCallback((center: any) => {
    console.log('Saving center:', center);
    setCreateCenterModalVisible(false);
  }, []);

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <AdminHomeScreen onNavigate={handleNavigate} onClose={onClose} />;
      case 'articles-list':
        return (
          <AdminArticlesScreen 
            onNavigate={handleNavigate}
            onEditArticle={handleEditArticle}
          />
        );
      case 'centers-list':
        return (
          <AdminCentersScreen 
            onNavigate={handleNavigate}
            onEditCenter={handleEditCenter}
          />
        );
      case 'create-article':
        setCreateArticleModalVisible(true);
        setCurrentScreen('articles-list');
        return null;
      case 'users-list':
        return <AdminUsersScreen onBack={() => handleNavigate('home')} />;
      case 'analytics-overview':
        return <AdminAnalyticsScreen onBack={() => handleNavigate('home')} />;
    }
  };

  const getScreenTitle = () => {
    switch (currentScreen) {
      case 'home':
        return 'Админ панель';
      case 'articles-list':
        return 'Управление статьями';
      case 'centers-list':
        return 'Управление центрами';
      case 'users-list':
        return 'Управление пользователями';
      case 'analytics-overview':
        return 'Аналитика';
      default:
        return 'Админ панель';
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Заголовок с навигацией - только для главного экрана */}
        {currentScreen === 'home' && (
          <View style={styles.header}>
            <View style={styles.backButton} />
            <Text style={styles.title}>{getScreenTitle()}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
            >
              <Ionicons name="close" size={24} color={THEME.muted} />
            </TouchableOpacity>
          </View>
        )}

        {/* Контент */}
        <View style={styles.content}>
          {renderCurrentScreen()}
        </View>

        {/* Модальные окна */}
        <CreateArticleModal
          visible={createArticleModalVisible}
          onClose={() => setCreateArticleModalVisible(false)}
          onSave={handleSaveArticle}
        />

        <EditArticleModal
          visible={editArticleModalVisible}
          article={selectedArticle}
          onClose={() => {
            setEditArticleModalVisible(false);
            setSelectedArticle(null);
          }}
          onSave={handleUpdateArticle}
        />

        <CreateCenterModal
          visible={createCenterModalVisible}
          onClose={() => setCreateCenterModalVisible(false)}
          onSave={handleSaveCenter}
        />
      </View>
    </Modal>
  );
});

AdminPanel.displayName = 'AdminPanel';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
});

export default AdminPanel;
