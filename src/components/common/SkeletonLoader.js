import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

const SkeletonLoader = ({ 
  width = '100%', 
  height = 20, 
  borderRadius = 4,
  style,
  children,
  loading = true,
  shimmer = true
}) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (shimmer && loading) {
      const shimmerAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(shimmerAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          })
        ])
      );
      shimmerAnimation.start();
      return () => shimmerAnimation.stop();
    }
  }, [loading, shimmer]);

  if (!loading) {
    return children;
  }

  return (
    <View style={[styles.container, { width, height, borderRadius }, style]}>
      <Animated.View
        style={[
          styles.shimmer,
          {
            opacity: shimmerAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.3, 0.7]
            })
          }
        ]}
      />
    </View>
  );
};

// Специализированные скелетоны
export const CenterCardSkeleton = () => (
  <View style={styles.centerCardSkeleton}>
    <SkeletonLoader width={112} height={100} borderRadius={12} />
    <View style={styles.centerCardContent}>
      <SkeletonLoader width="80%" height={16} style={{ marginBottom: 8 }} />
      <SkeletonLoader width="60%" height={12} style={{ marginBottom: 8 }} />
      <SkeletonLoader width="90%" height={12} style={{ marginBottom: 8 }} />
      <View style={styles.centerCardBottom}>
        <SkeletonLoader width="40%" height={14} />
        <SkeletonLoader width="20%" height={14} />
      </View>
    </View>
  </View>
);

export const ArticleCardSkeleton = () => (
  <View style={styles.articleCardSkeleton}>
    <SkeletonLoader width="100%" height={150} borderRadius={0} />
    <View style={styles.articleCardContent}>
      <SkeletonLoader width="90%" height={18} style={{ marginBottom: 8 }} />
      <SkeletonLoader width="100%" height={14} style={{ marginBottom: 4 }} />
      <SkeletonLoader width="80%" height={14} style={{ marginBottom: 4 }} />
      <SkeletonLoader width="60%" height={14} />
    </View>
  </View>
);

export const ListSkeleton = ({ count = 5 }) => (
  <View style={styles.listSkeleton}>
    {Array.from({ length: count }, (_, index) => (
      <View key={index} style={styles.listItemSkeleton}>
        <SkeletonLoader width={50} height={50} borderRadius={25} />
        <View style={styles.listItemContent}>
          <SkeletonLoader width="70%" height={16} style={{ marginBottom: 8 }} />
          <SkeletonLoader width="50%" height={12} />
        </View>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0',
    overflow: 'hidden',
    position: 'relative'
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#e0e0e0'
  },
  centerCardSkeleton: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  centerCardContent: {
    flex: 1,
    paddingLeft: 12,
    justifyContent: 'space-between'
  },
  centerCardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  articleCardSkeleton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  articleCardContent: {
    padding: 12
  },
  listSkeleton: {
    padding: 12
  },
  listItemSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  listItemContent: {
    flex: 1,
    marginLeft: 12
  }
});

export default SkeletonLoader;
