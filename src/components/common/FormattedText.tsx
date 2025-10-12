import React, { memo, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../../utils/constants';

interface FormattedTextProps {
  text: string;
  maxLines?: number;
  style?: any;
}

const FormattedText: React.FC<FormattedTextProps> = memo(({
  text,
  maxLines = 3,
  style
}) => {
  const renderFormattedText = useCallback((text: string) => {
    // Парсим Markdown и форматируем текст
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|<u>.*?<\/u>|## .*|> .*|- .*)/);
    
    return parts.map((part, index) => {
      // Заголовки
      if (part.startsWith('## ')) {
        return (
          <Text key={index} style={[styles.heading, style]}>
            {part.substring(3)}
          </Text>
        );
      }
      
      // Жирный текст
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <Text key={index} style={[styles.bold, style]}>
            {part.slice(2, -2)}
          </Text>
        );
      }
      
      // Курсив
      if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**')) {
        return (
          <Text key={index} style={[styles.italic, style]}>
            {part.slice(1, -1)}
          </Text>
        );
      }
      
      // Подчеркнутый
      if (part.startsWith('<u>') && part.endsWith('</u>')) {
        return (
          <Text key={index} style={[styles.underline, style]}>
            {part.slice(3, -4)}
          </Text>
        );
      }
      
      // Цитаты
      if (part.startsWith('> ')) {
        return (
          <View key={index} style={styles.quoteContainer}>
            <Text style={[styles.quote, style]}>
              {part.substring(2)}
            </Text>
          </View>
        );
      }
      
      // Списки
      if (part.startsWith('- ')) {
        return (
          <View key={index} style={styles.listItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={[styles.listText, style]}>
              {part.substring(2)}
            </Text>
          </View>
        );
      }
      
      // Обычный текст
      if (part.trim()) {
        return <Text key={index} style={style}>{part}</Text>;
      }
      
      return null;
    });
  }, [style]);

  return (
    <Text numberOfLines={maxLines} style={style}>
      {renderFormattedText(text)}
    </Text>
  );
});

FormattedText.displayName = 'FormattedText';

const styles = StyleSheet.create({
  heading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginVertical: 8,
  },
  bold: {
    fontWeight: '700',
  },
  italic: {
    fontStyle: 'italic',
  },
  underline: {
    textDecorationLine: 'underline',
  },
  quoteContainer: {
    backgroundColor: '#f8f9fa',
    borderLeftWidth: 3,
    borderLeftColor: THEME.primary,
    paddingLeft: 12,
    marginVertical: 4,
  },
  quote: {
    fontStyle: 'italic',
    color: '#666',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 2,
  },
  bullet: {
    color: THEME.primary,
    marginRight: 8,
    marginTop: 2,
  },
  listText: {
    flex: 1,
  },
});

export default FormattedText;
