import React, { memo, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../../utils/constants';

interface AdminModalProps {
  visible: boolean;
  onClose: () => void;
  onCreateArticle: () => void;
  onCreateCenter: () => void;
  onManageArticles: () => void;
}

const AdminModal: React.FC<AdminModalProps> = memo(({
  visible,
  onClose,
  onCreateArticle,
  onCreateCenter,
  onManageArticles
}) => {
  const handleCreateArticle = useCallback(() => {
    onClose();
    onCreateArticle();
  }, [onClose, onCreateArticle]);

  const handleCreateCenter = useCallback(() => {
    onClose();
    onCreateCenter();
  }, [onClose, onCreateCenter]);

  const handleManageArticles = useCallback(() => {
    onClose();
    onManageArticles();
  }, [onClose, onManageArticles]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Админ панель</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={THEME.muted} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.subtitle}>Что вы хотите создать?</Text>
          
          <View style={styles.optionsContainer}>
            <TouchableOpacity 
              style={styles.optionButton} 
              onPress={handleCreateArticle}
            >
              <View style={styles.optionIcon}>
                <Ionicons name="document-text" size={32} color={THEME.primary} />
              </View>
              <Text style={styles.optionTitle}>Новая статья</Text>
              <Text style={styles.optionDescription}>
                Создать статью о реабилитации и зависимостях
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.optionButton} 
              onPress={handleManageArticles}
            >
              <View style={styles.optionIcon}>
                <Ionicons name="list" size={32} color={THEME.primary} />
              </View>
              <Text style={styles.optionTitle}>Управление статьями</Text>
              <Text style={styles.optionDescription}>
                Редактировать существующие статьи и просматривать статистику
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.optionButton} 
              onPress={handleCreateCenter}
            >
              <View style={styles.optionIcon}>
                <Ionicons name="business" size={32} color={THEME.primary} />
              </View>
              <Text style={styles.optionTitle}>Новый центр</Text>
              <Text style={styles.optionDescription}>
                Добавить реабилитационный центр в каталог
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
});

AdminModal.displayName = 'AdminModal';

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  subtitle: {
    fontSize: 16,
    color: THEME.muted,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  optionsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 16,
  },
  optionButton: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  optionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: THEME.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 14,
    color: THEME.muted,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default AdminModal;
