import React, { memo, useCallback, useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME, ARTICLE_RUBRICS } from '../../utils/constants';
import RichTextEditor from './RichTextEditor';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  body: string;
  image: string;
  author?: string;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
  views?: number;
  likes?: number;
}

interface EditArticleModalProps {
  visible: boolean;
  article: Article | null;
  onClose: () => void;
  onSave: (article: {
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
  }) => void;
}

const EditArticleModal: React.FC<EditArticleModalProps> = memo(({
  visible,
  article,
  onClose,
  onSave
}) => {
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState('');
  const [authorName, setAuthorName] = useState('Команда РЕБА');
  const [authorCredentials, setAuthorCredentials] = useState('Специалисты центра');
  const [rubric, setRubric] = useState('Восстановление');
  const [articleType, setArticleType] = useState<'media' | 'integration'>('media');
  const [centerId, setCenterId] = useState('');

  // Заполняем форму данными статьи при открытии
  useEffect(() => {
    if (article) {
      setTitle(article.title || '');
      setExcerpt(article.excerpt || '');
      setBody(article.body || '');
      setImage(article.image || '');
      setAuthorName(article.author?.split(' - ')[0] || 'Команда РЕБА');
      setAuthorCredentials(article.author?.split(' - ')[1] || 'Специалисты центра');
      setRubric(article.category || 'Восстановление');
      setArticleType('media'); // По умолчанию
      setCenterId('');
    }
  }, [article]);

  const handleSave = useCallback(() => {
    if (!article?.id) return;
    
    if (!title.trim() || !excerpt.trim() || !body.trim()) {
      Alert.alert('Ошибка', 'Заполните все обязательные поля');
      return;
    }

    onSave({
      id: article.id,
      title: title.trim(),
      excerpt: excerpt.trim(),
      body: body.trim(),
      image: image.trim() || 'https://via.placeholder.com/400x300?text=Article+Image',
      authorName: authorName.trim(),
      authorCredentials: authorCredentials.trim(),
      rubric: rubric.trim(),
      articleType,
      centerId: centerId.trim() || undefined,
    });

    onClose();
  }, [article, title, excerpt, body, image, authorName, authorCredentials, rubric, articleType, centerId, onSave, onClose]);

  const handleCancel = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!article) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={handleCancel}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
            <Ionicons name="close" size={24} color={THEME.muted} />
          </TouchableOpacity>
          <Text style={styles.title}>Редактировать статью</Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Сохранить</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Статистика статьи */}
          <View style={styles.statsContainer}>
            <Text style={styles.statsTitle}>Статистика статьи</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Ionicons name="eye" size={16} color={THEME.primary} />
                <Text style={styles.statText}>{article.views || 0} просмотров</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="heart" size={16} color={THEME.primary} />
                <Text style={styles.statText}>{article.likes || 0} лайков</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="calendar" size={16} color={THEME.primary} />
                <Text style={styles.statText}>
                  {article.createdAt ? new Date(article.createdAt).toLocaleDateString('ru-RU') : 'Неизвестно'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Заголовок статьи *</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Введите заголовок статьи"
              placeholderTextColor={THEME.muted}
              multiline
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Краткое описание *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={excerpt}
              onChangeText={setExcerpt}
              placeholder="Краткое описание статьи (2-3 предложения)"
              placeholderTextColor={THEME.muted}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>URL изображения</Text>
            <TextInput
              style={styles.input}
              value={image}
              onChangeText={setImage}
              placeholder="https://example.com/image.jpg"
              placeholderTextColor={THEME.muted}
              keyboardType="url"
            />
            <Text style={styles.helpText}>
              Оставьте пустым для использования изображения по умолчанию
            </Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>ФИО автора</Text>
            <TextInput
              style={styles.input}
              value={authorName}
              onChangeText={setAuthorName}
              placeholder="Команда РЕБА"
              placeholderTextColor={THEME.muted}
            />
            <Text style={styles.helpText}>
              Например: "Команда РЕБА", "Иванов Иван Иванович", "Петрова Анна Сергеевна"
            </Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Регалии автора</Text>
            <TextInput
              style={styles.input}
              value={authorCredentials}
              onChangeText={setAuthorCredentials}
              placeholder="Специалисты центра"
              placeholderTextColor={THEME.muted}
            />
            <Text style={styles.helpText}>
              Например: "Врач центра Возрождения", "Психолог-консультант", "Специалист по реабилитации"
            </Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Рубрика статьи</Text>
            <View style={styles.rubricSelector}>
              {ARTICLE_RUBRICS.map((rubricItem) => (
                <TouchableOpacity
                  key={rubricItem}
                  style={[
                    styles.rubricButton,
                    rubric === rubricItem && styles.rubricButtonActive
                  ]}
                  onPress={() => setRubric(rubricItem)}
                >
                  <Text style={[
                    styles.rubricButtonText,
                    rubric === rubricItem && styles.rubricButtonTextActive
                  ]}>
                    {rubricItem}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.helpText}>
              Выберите направление статьи, чтобы читатели могли найти нужную тему
            </Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Тип статьи</Text>
            <View style={styles.typeSelector}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  articleType === 'media' && styles.typeButtonActive
                ]}
                onPress={() => setArticleType('media')}
              >
                <Ionicons 
                  name="newspaper-outline" 
                  size={20} 
                  color={articleType === 'media' ? '#fff' : THEME.primary} 
                />
                <Text style={[
                  styles.typeButtonText,
                  articleType === 'media' && styles.typeButtonTextActive
                ]}>
                  Медиа-статья
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  articleType === 'integration' && styles.typeButtonActive
                ]}
                onPress={() => setArticleType('integration')}
              >
                <Ionicons 
                  name="trending-up-outline" 
                  size={20} 
                  color={articleType === 'integration' ? '#fff' : THEME.primary} 
                />
                <Text style={[
                  styles.typeButtonText,
                  articleType === 'integration' && styles.typeButtonTextActive
                ]}>
                  Интеграция
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.helpText}>
              Медиа-статья: информационная, для бренда. Интеграция: для привлечения клиентов
            </Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Текст статьи *</Text>
            <RichTextEditor
              value={body}
              onChangeText={setBody}
              placeholder="Полный текст статьи с форматированием..."
              style={styles.richTextEditor}
            />
          </View>

          <View style={styles.previewSection}>
            <Text style={styles.label}>Предварительный просмотр</Text>
            <View style={styles.previewCard}>
              {image ? (
                <View style={styles.previewImage}>
                  <Text style={styles.previewImageText}>Изображение</Text>
                </View>
              ) : null}
              <View style={styles.previewContent}>
                <Text style={styles.previewTitle} numberOfLines={2}>
                  {title || 'Заголовок статьи'}
                </Text>
                <Text style={styles.previewExcerpt} numberOfLines={3}>
                  {excerpt || 'Краткое описание статьи'}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
});

EditArticleModal.displayName = 'EditArticleModal';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  cancelButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  saveButton: {
    backgroundColor: THEME.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statsContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 14,
    color: THEME.muted,
    fontWeight: '500',
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  helpText: {
    fontSize: 12,
    color: THEME.muted,
    marginTop: 4,
  },
  richTextEditor: {
    minHeight: 250,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: THEME.primary,
    backgroundColor: '#fff',
  },
  typeButtonActive: {
    backgroundColor: THEME.primary,
  },
  typeButtonText: {
    fontSize: 14,
    color: THEME.primary,
    fontWeight: '500',
    marginLeft: 8,
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  rubricSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  rubricButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: THEME.primary,
    backgroundColor: '#fff',
  },
  rubricButtonActive: {
    backgroundColor: THEME.primary,
  },
  rubricButtonText: {
    fontSize: 12,
    color: THEME.primary,
    fontWeight: '500',
  },
  rubricButtonTextActive: {
    color: '#fff',
  },
  previewSection: {
    marginTop: 20,
  },
  previewCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  previewImage: {
    height: 120,
    backgroundColor: '#e9ecef',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  previewImageText: {
    color: THEME.muted,
    fontSize: 14,
  },
  previewContent: {
    // Стили для контента
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  previewExcerpt: {
    fontSize: 14,
    color: THEME.muted,
    lineHeight: 20,
  },
});

export default EditArticleModal;
