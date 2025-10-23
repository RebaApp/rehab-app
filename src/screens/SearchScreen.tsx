import React, { memo } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { THEME } from '../utils/constants';

interface SearchScreenProps {
  onCenterPress: (center: any) => void;
  onToggleFavorite: (centerId: string) => void;
  isFavorite: (centerId: string) => boolean;
}

const SearchScreen: React.FC<SearchScreenProps> = memo(() => {
  return (
    <LinearGradient
      colors={[THEME.bgTop, THEME.bgMid, THEME.bgBottom]}
      style={styles.container}
    >
      <View style={styles.content}>
        <Ionicons name="search-outline" size={80} color={THEME.primary} />
        <Text style={styles.title}>Поиск центров</Text>
        <Text style={styles.subtitle}>Скоро здесь будет поиск реабилитационных центров</Text>
        <Text style={styles.description}>
          Мы работаем над созданием удобного поиска с фильтрами по городу, типу лечения и другим параметрам.
        </Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: THEME.textPrimary,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: THEME.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: THEME.muted,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default SearchScreen;