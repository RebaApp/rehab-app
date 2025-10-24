import React, { memo, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Упрощенный интерфейс для тестирования
interface SimpleRehabCenter {
  id: string;
  name: string;
  location: string;
  priceFrom?: number | undefined;
  rating?: number | undefined;
}

interface SimpleCardProps {
  center: SimpleRehabCenter;
  onOpen: (centerId: string) => void;
}

const SimpleCardRehabCenter: React.FC<SimpleCardProps> = memo(({
  center,
  onOpen,
}) => {
  const handlePress = useCallback(() => {
    onOpen(center.id);
  }, [center.id, onOpen]);

  const formattedPrice = center.priceFrom 
    ? `от ${center.priceFrom.toLocaleString('ru-RU')} ₽`
    : 'По запросу';

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <Text style={styles.name}>{center.name}</Text>
        <Text style={styles.location}>{center.location}</Text>
        <Text style={styles.price}>{formattedPrice}</Text>
        {center.rating && (
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}>{center.rating.toFixed(1)}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
});

SimpleCardRehabCenter.displayName = 'SimpleCardRehabCenter';

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    overflow: 'hidden',
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0A84FF',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
});

export default SimpleCardRehabCenter;
