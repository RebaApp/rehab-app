import React, { memo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { THEME } from '../../utils/constants';
import { QuickHelpItem } from '../../types';

const { width: screenWidth } = Dimensions.get('window');

interface QuickHelpStripProps {
  items: QuickHelpItem[];
  onItemPress: (item: QuickHelpItem) => void;
}

const QuickHelpStrip: React.FC<QuickHelpStripProps> = memo(({
  items,
  onItemPress
}) => {
  const scrollX = useSharedValue(0);

  const handleItemPress = useCallback((item: QuickHelpItem) => {
    onItemPress(item);
  }, [onItemPress]);

  const getActionIcon = useCallback((action: string) => {
    switch (action) {
      case 'crisis':
        return 'warning';
      case 'motivation':
        return 'heart';
      case 'contacts':
        return 'call';
      case 'video':
        return 'play';
      default:
        return 'help';
    }
  }, []);

  const getActionColor = useCallback((action: string) => {
    switch (action) {
      case 'crisis':
        return THEME.error;
      case 'motivation':
        return '#4DD0E1'; // Soft mint
      case 'contacts':
        return THEME.primary;
      case 'video':
        return '#FF6B65'; // Coral
      default:
        return THEME.muted;
    }
  }, []);

  const renderItem = useCallback((item: QuickHelpItem, index: number) => {
    const animatedStyle = useAnimatedStyle(() => {
      const inputRange = [index - 1, index, index + 1];
      const outputRange = [0.9, 1, 0.9];
      
      const scale = interpolate(
        scrollX.value,
        inputRange,
        outputRange,
        Extrapolate.CLAMP
      );

      return {
        transform: [{ scale }],
      };
    });

    return (
      <Animated.View
        key={item.id}
        style={[styles.itemContainer, animatedStyle]}
      >
        <TouchableOpacity
          style={[
            styles.itemCard,
            { borderColor: getActionColor(item.action) }
          ]}
          onPress={() => handleItemPress(item)}
          activeOpacity={0.8}
        >
          <View style={[
            styles.iconContainer,
            { backgroundColor: getActionColor(item.action) + '20' }
          ]}>
            <Ionicons
              name={getActionIcon(item.action)}
              size={24}
              color={getActionColor(item.action)}
            />
          </View>
          
          <Text style={[
            styles.itemTitle,
            { color: getActionColor(item.action) }
          ]}>
            {item.title}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }, [handleItemPress, getActionIcon, getActionColor, scrollX]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📚 Быстрая помощь</Text>
      </View>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={(event) => {
          scrollX.value = event.nativeEvent.contentOffset.x;
        }}
        scrollEventThrottle={16}
      >
        {items.map((item, index) => renderItem(item, index))}
      </ScrollView>
    </View>
  );
});

QuickHelpStrip.displayName = 'QuickHelpStrip';

const styles = StyleSheet.create({
  container: {
    marginVertical: THEME.spacing[4],
  },
  header: {
    paddingHorizontal: THEME.spacing[4],
    marginBottom: THEME.spacing[2],
  },
  title: {
    fontSize: THEME.fontSize.lg,
    fontWeight: '600',
    color: THEME.text,
  },
  scrollContent: {
    paddingHorizontal: THEME.spacing[4],
  },
  itemContainer: {
    marginRight: THEME.spacing[3],
  },
  itemCard: {
    width: 100,
    backgroundColor: THEME.card,
    borderRadius: THEME.radiusMedium,
    padding: THEME.spacing[3],
    alignItems: 'center',
    borderWidth: 1,
    ...THEME.shadowSmall,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: THEME.spacing[2],
  },
  itemTitle: {
    fontSize: THEME.fontSize.sm,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default QuickHelpStrip;
