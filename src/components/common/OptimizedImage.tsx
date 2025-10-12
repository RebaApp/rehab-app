import React, { memo, useMemo } from 'react';
import { Image } from 'expo-image';
import { View, StyleSheet } from 'react-native';
import { THEME } from '../../utils/constants';

interface OptimizedImageProps {
  uri: string;
  style?: object;
  placeholder?: string;
  fallback?: string;
  priority?: boolean;
  cachePolicy?: 'memory' | 'disk' | 'none';
  contentFit?: 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';
  transition?: number;
}

const OptimizedImage: React.FC<OptimizedImageProps> = memo(({
  uri,
  style,
  placeholder = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop&crop=center',
  fallback = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop&crop=center',
  priority = false,
  cachePolicy = 'memory',
  contentFit = 'cover',
  transition = 200
}) => {
  const imageSource = useMemo(() => ({
    uri: uri || fallback,
    headers: {
      'Cache-Control': 'max-age=31536000', // 1 год кэширования
    }
  }), [uri, fallback]);

  const placeholderSource = useMemo(() => ({
    uri: placeholder
  }), [placeholder]);

  return (
    <View style={[styles.container, style]}>
      <Image
        source={imageSource}
        placeholder={placeholderSource}
        contentFit={contentFit}
        transition={transition}
        priority={priority ? 'high' : 'normal'}
        cachePolicy={cachePolicy}
        recyclingKey={uri}
        style={StyleSheet.absoluteFillObject}
        onError={() => {
          // В production можно логировать ошибки загрузки изображений
          // console.warn('Failed to load image:', uri);
        }}
      />
    </View>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

const styles = StyleSheet.create({
  container: {
    backgroundColor: THEME.bgTop,
    overflow: 'hidden',
  },
});

export default OptimizedImage;
