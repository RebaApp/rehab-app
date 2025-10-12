import React, { memo, useCallback, useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../../utils/constants';

interface RichTextEditorProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
  numberOfLines?: number;
  style?: any;
}

interface FormatAction {
  type: 'bold' | 'italic' | 'underline' | 'heading' | 'list' | 'quote';
  label: string;
  icon: string;
  markdown: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = memo(({
  value,
  onChangeText,
  placeholder = 'Введите текст...',
  multiline = true,
  numberOfLines = 10,
  style
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const textInputRef = useRef<TextInput>(null);

  const formatActions: FormatAction[] = [
    { type: 'bold', label: 'Жирный', icon: 'text', markdown: '**текст**' },
    { type: 'italic', label: 'Курсив', icon: 'text-outline', markdown: '*текст*' },
    { type: 'underline', label: 'Подчеркнутый', icon: 'create-outline', markdown: '<u>текст</u>' },
    { type: 'heading', label: 'Заголовок', icon: 'text', markdown: '## Заголовок' },
    { type: 'list', label: 'Список', icon: 'list', markdown: '- Элемент списка' },
    { type: 'quote', label: 'Цитата', icon: 'chatbubble-outline', markdown: '> Цитата' },
  ];

  const insertFormatting = useCallback((action: FormatAction) => {
    const textInput = textInputRef.current;
    if (!textInput) return;

    const { selectionStart, selectionEnd } = textInput as any;
    const selectedText = value.substring(selectionStart || 0, selectionEnd || 0);
    
    let formattedText = '';
    
    switch (action.type) {
      case 'bold':
        formattedText = selectedText ? `**${selectedText}**` : '**жирный текст**';
        break;
      case 'italic':
        formattedText = selectedText ? `*${selectedText}*` : '*курсив*';
        break;
      case 'underline':
        formattedText = selectedText ? `<u>${selectedText}</u>` : '<u>подчеркнутый</u>';
        break;
      case 'heading':
        formattedText = selectedText ? `## ${selectedText}` : '## Заголовок';
        break;
      case 'list':
        formattedText = selectedText ? `- ${selectedText}` : '- Элемент списка';
        break;
      case 'quote':
        formattedText = selectedText ? `> ${selectedText}` : '> Цитата';
        break;
    }

    const newText = 
      value.substring(0, selectionStart || 0) + 
      formattedText + 
      value.substring(selectionEnd || 0);

    onChangeText(newText);
    
    // Устанавливаем курсор после вставленного текста
    setTimeout(() => {
      const newCursorPos = (selectionStart || 0) + formattedText.length;
      textInput.setSelection?.(newCursorPos, newCursorPos);
    }, 100);
  }, [value, onChangeText]);

  const renderMarkdownPreview = useCallback((text: string) => {
    // Простой парсер Markdown для предпросмотра
    const lines = text.split('\n');
    
    return lines.map((line, index) => {
      // Заголовки
      if (line.startsWith('## ')) {
        return (
          <Text key={index} style={styles.previewHeading}>
            {line.substring(3)}
          </Text>
        );
      }
      
      // Списки
      if (line.startsWith('- ')) {
        return (
          <View key={index} style={styles.previewListItem}>
            <Text style={styles.previewBullet}>•</Text>
            <Text style={styles.previewListText}>
              {line.substring(2)}
            </Text>
          </View>
        );
      }
      
      // Цитаты
      if (line.startsWith('> ')) {
        return (
          <View key={index} style={styles.previewQuote}>
            <Text style={styles.previewQuoteText}>
              {line.substring(2)}
            </Text>
          </View>
        );
      }
      
      // Обычный текст с форматированием
      if (line.trim()) {
        return (
          <Text key={index} style={styles.previewText}>
            {line
              .replace(/\*\*(.*?)\*\*/g, '**$1**') // Жирный
              .replace(/\*(.*?)\*/g, '*$1*') // Курсив
              .replace(/<u>(.*?)<\/u>/g, 'U$1U') // Подчеркнутый
            }
          </Text>
        );
      }
      
      return <View key={index} style={styles.previewEmptyLine} />;
    });
  }, []);

  const renderFormattedText = useCallback((text: string) => {
    // Более продвинутый рендеринг с форматированием
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|<u>.*?<\/u>)/);
    
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <Text key={index} style={styles.previewBold}>
            {part.slice(2, -2)}
          </Text>
        );
      }
      
      if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**')) {
        return (
          <Text key={index} style={styles.previewItalic}>
            {part.slice(1, -1)}
          </Text>
        );
      }
      
      if (part.startsWith('<u>') && part.endsWith('</u>')) {
        return (
          <Text key={index} style={styles.previewUnderline}>
            {part.slice(3, -4)}
          </Text>
        );
      }
      
      return <Text key={index}>{part}</Text>;
    });
  }, []);

  return (
    <View style={[styles.container, style]}>
      {/* Панель инструментов */}
      <View style={styles.toolbar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {formatActions.map((action) => (
            <TouchableOpacity
              key={action.type}
              style={styles.toolbarButton}
              onPress={() => insertFormatting(action)}
            >
              <Ionicons name={action.icon as any} size={18} color={THEME.primary} />
              <Text style={styles.toolbarButtonText}>{action.label}</Text>
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity
            style={[styles.toolbarButton, showPreview && styles.toolbarButtonActive]}
            onPress={() => setShowPreview(!showPreview)}
          >
            <Ionicons name="eye" size={18} color={showPreview ? '#fff' : THEME.primary} />
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Область редактирования */}
      {!showPreview ? (
        <TextInput
          ref={textInputRef}
          style={[styles.textInput, style]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          multiline={multiline}
          numberOfLines={numberOfLines}
          textAlignVertical="top"
          placeholderTextColor={THEME.muted}
        />
      ) : (
        <ScrollView style={styles.previewContainer}>
          <View style={styles.previewContent}>
            {renderMarkdownPreview(value)}
          </View>
        </ScrollView>
      )}

      {/* Подсказки */}
      <View style={styles.helpContainer}>
        <Text style={styles.helpText}>
          💡 Используйте кнопки выше для форматирования текста
        </Text>
        {showPreview && (
          <Text style={styles.helpText}>
            👁️ Предпросмотр: как будет выглядеть статья
          </Text>
        )}
      </View>
    </View>
  );
});

RichTextEditor.displayName = 'RichTextEditor';

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  toolbar: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#f8f9fa',
  },
  toolbarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginRight: 8,
    borderRadius: 6,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  toolbarButtonText: {
    fontSize: 12,
    color: THEME.primary,
    marginLeft: 4,
    fontWeight: '500',
  },
  toolbarButtonActive: {
    backgroundColor: THEME.primary,
  },
  textInput: {
    padding: 12,
    fontSize: 16,
    color: '#333',
    minHeight: 200,
    textAlignVertical: 'top',
  },
  previewContainer: {
    padding: 12,
    minHeight: 200,
    backgroundColor: '#f8f9fa',
  },
  previewContent: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  previewHeading: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
    marginTop: 16,
  },
  previewText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 8,
  },
  previewBold: {
    fontWeight: '700',
  },
  previewItalic: {
    fontStyle: 'italic',
  },
  previewUnderline: {
    textDecorationLine: 'underline',
  },
  previewListItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  previewBullet: {
    fontSize: 16,
    color: THEME.primary,
    marginRight: 8,
    marginTop: 2,
  },
  previewListText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    lineHeight: 24,
  },
  previewQuote: {
    backgroundColor: '#f8f9fa',
    borderLeftWidth: 4,
    borderLeftColor: THEME.primary,
    paddingLeft: 16,
    marginVertical: 8,
  },
  previewQuoteText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
    lineHeight: 24,
  },
  previewEmptyLine: {
    height: 8,
  },
  helpContainer: {
    padding: 8,
    backgroundColor: '#f8f9fa',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  helpText: {
    fontSize: 12,
    color: THEME.muted,
    textAlign: 'center',
    marginBottom: 2,
  },
});

export default RichTextEditor;
