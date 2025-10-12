import React, { useRef, useCallback } from 'react';
import { RefreshControl, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  withTiming,
  runOnJS
} from 'react-native-reanimated';

const PullToRefresh = ({ 
  children, 
  onRefresh, 
  refreshing = false,
  colors = ['#1a84ff'],
  tintColor = '#1a84ff',
  title = 'Обновление...',
  titleColor = '#666',
  style
}) => {
  const scrollY = useSharedValue(0);
  const isRefreshing = useSharedValue(false);
  const scrollViewRef = useRef(null);

  const handleScroll = useCallback((event) => {
    scrollY.value = event.nativeEvent.contentOffset.y;
  }, []);

  const handleRefresh = useCallback(async () => {
    if (isRefreshing.value) return;
    
    isRefreshing.value = true;
    await onRefresh();
    isRefreshing.value = false;
  }, [onRefresh]);

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = scrollY.value > 0 ? withTiming(1) : withTiming(0);
    const scale = scrollY.value > 50 ? withSpring(1.1) : withSpring(1);
    
    return {
      opacity,
      transform: [{ scale }]
    };
  });

  return (
    <ScrollView
      ref={scrollViewRef}
      style={[styles.container, style]}
      contentContainerStyle={styles.content}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={colors}
          tintColor={tintColor}
          title={title}
          titleColor={titleColor}
          progressBackgroundColor="#fff"
        />
      }
    >
      {children}
      
      {/* Custom refresh indicator */}
      <Animated.View style={[styles.refreshIndicator, animatedStyle]}>
        <Ionicons 
          name="refresh" 
          size={20} 
          color={tintColor} 
          style={styles.refreshIcon}
        />
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    flexGrow: 1
  },
  refreshIndicator: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  refreshIcon: {
    // Стили для иконки
  }
});

export default PullToRefresh;
