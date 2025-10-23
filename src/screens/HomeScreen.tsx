import React, { memo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { THEME } from '../utils/constants';

interface HomeScreenProps {
  onArticlePress: (article: any) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = memo(() => {
  return (
    <LinearGradient
      colors={[THEME.bgTop, THEME.bgMid, THEME.bgBottom]}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Заголовок */}
        <View style={styles.header}>
          <Text style={styles.title}>РЕБА</Text>
          <Text style={styles.subtitle}>Реабилитационные центры</Text>
          <Text style={styles.description}>
            Находим подходящие центры для лечения зависимостей
          </Text>
        </View>

        {/* Быстрые окна */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => console.log('Найти центр')}
            activeOpacity={0.7}
          >
            <Ionicons name="search" size={32} color={THEME.primary} />
            <Text style={styles.quickActionTitle}>Найти центр</Text>
            <Text style={styles.quickActionDescription}>
              Поиск по городу и типу лечения
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => console.log('Консультация')}
            activeOpacity={0.7}
          >
            <Ionicons name="call" size={32} color={THEME.primary} />
            <Text style={styles.quickActionTitle}>Консультация</Text>
            <Text style={styles.quickActionDescription}>
              Бесплатная консультация специалиста
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => console.log('Статьи')}
            activeOpacity={0.7}
          >
            <Ionicons name="book" size={32} color={THEME.primary} />
            <Text style={styles.quickActionTitle}>Статьи</Text>
            <Text style={styles.quickActionDescription}>
              Полезная информация о лечении
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => console.log('Поддержка')}
            activeOpacity={0.7}
          >
            <Ionicons name="heart" size={32} color={THEME.primary} />
            <Text style={styles.quickActionTitle}>Поддержка</Text>
            <Text style={styles.quickActionDescription}>
              Группы поддержки и сообщество
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: THEME.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: THEME.textSecondary,
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: THEME.muted,
    textAlign: 'center',
    lineHeight: 22,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.textPrimary,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  quickActionDescription: {
    fontSize: 14,
    color: THEME.muted,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default HomeScreen;