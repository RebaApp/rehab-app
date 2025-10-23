import React, { memo, useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { THEME } from '../../utils/constants';
import { QuickHelpItem } from '../../types';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface FloatingActionButtonProps {
  onItemPress: (item: QuickHelpItem) => void;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = memo(({
  onItemPress
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const quickHelpItems: QuickHelpItem[] = [
    {
      id: 'crisis',
      title: 'Кризис',
      icon: '🚨',
      action: 'crisis'
    },
    {
      id: 'motivation',
      title: 'Мотивация',
      icon: '💪',
      action: 'motivation'
    },
    {
      id: 'contacts',
      title: 'Контакты',
      icon: '📞',
      action: 'contacts'
    },
    {
      id: 'video',
      title: 'Видео',
      icon: '🎥',
      action: 'video'
    }
  ];

  const handlePress = useCallback(() => {
    setIsExpanded(!isExpanded);
    
    scale.value = withSpring(isExpanded ? 1 : 1.1);
    rotation.value = withTiming(isExpanded ? 0 : 45, { duration: 200 });
  }, [isExpanded]);

  const handleItemPress = useCallback((item: QuickHelpItem) => {
    onItemPress(item);
    setIsExpanded(false);
    scale.value = withSpring(1);
    rotation.value = withTiming(0, { duration: 200 });
  }, [onItemPress]);

  const fabStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` }
    ]
  }));

  const getItemStyle = useCallback((index: number) => {
    return useAnimatedStyle(() => {
      const translateY = interpolate(
        scale.value,
        [1, 1.1],
        [0, -(index + 1) * 60],
        'clamp'
      );

      const opacity = interpolate(
        scale.value,
        [1, 1.1],
        [0, 1],
        'clamp'
      );

      return {
        transform: [{ translateY }],
        opacity,
      };
    });
  }, []);

  return (
    <>
      <View style={styles.fabContainer}>
        {/* Expanded menu items */}
        {isExpanded && (
          <View style={styles.expandedMenu}>
            {quickHelpItems.map((item, index) => (
              <Animated.View
                key={item.id}
                style={[styles.menuItem, getItemStyle(index)]}
              >
                <TouchableOpacity
                  style={styles.menuItemButton}
                  onPress={() => handleItemPress(item)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.menuItemIcon}>{item.icon}</Text>
                  <Text style={styles.menuItemText}>{item.title}</Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        )}

        {/* Main FAB */}
        <Animated.View style={[styles.fab, fabStyle]}>
          <TouchableOpacity
            style={styles.fabButton}
            onPress={handlePress}
            activeOpacity={0.8}
            onLongPress={() => {
              // Long press for emergency
              handleItemPress(quickHelpItems[0]); // Crisis item
            }}
          >
            <Ionicons name="chatbubble" size={24} color="#fff" />
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Modal for expanded view */}
      <Modal
        visible={isExpanded}
        transparent
        animationType="fade"
        onRequestClose={() => setIsExpanded(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsExpanded(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Быстрая помощь</Text>
            <View style={styles.modalItems}>
              {quickHelpItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.modalItem}
                  onPress={() => handleItemPress(item)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.modalItemIcon}>{item.icon}</Text>
                  <Text style={styles.modalItemText}>{item.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
});

FloatingActionButton.displayName = 'FloatingActionButton';

const styles = StyleSheet.create({
  fabContainer: {
    position: 'absolute',
    bottom: THEME.spacing[6],
    right: THEME.spacing[4],
    zIndex: 1000,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: THEME.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...THEME.shadow,
  },
  fabButton: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  expandedMenu: {
    position: 'absolute',
    bottom: 70,
    right: 0,
    alignItems: 'flex-end',
  },
  menuItem: {
    marginBottom: THEME.spacing[2],
  },
  menuItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.card,
    paddingHorizontal: THEME.spacing[3],
    paddingVertical: THEME.spacing[2],
    borderRadius: THEME.radiusMedium,
    ...THEME.shadowSmall,
  },
  menuItemIcon: {
    fontSize: 20,
    marginRight: THEME.spacing[2],
  },
  menuItemText: {
    fontSize: THEME.fontSize.sm,
    fontWeight: '600',
    color: THEME.text,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: THEME.card,
    borderRadius: THEME.radiusLarge,
    padding: THEME.spacing[6],
    width: screenWidth * 0.8,
    maxWidth: 400,
    ...THEME.shadow,
  },
  modalTitle: {
    fontSize: THEME.fontSize.xl,
    fontWeight: '700',
    color: THEME.text,
    textAlign: 'center',
    marginBottom: THEME.spacing[4],
  },
  modalItems: {
    gap: THEME.spacing[3],
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: THEME.spacing[3],
    paddingHorizontal: THEME.spacing[4],
    backgroundColor: THEME.backgroundSecondary,
    borderRadius: THEME.radiusMedium,
  },
  modalItemIcon: {
    fontSize: 24,
    marginRight: THEME.spacing[3],
  },
  modalItemText: {
    fontSize: THEME.fontSize.base,
    fontWeight: '600',
    color: THEME.text,
  },
});

export default FloatingActionButton;
