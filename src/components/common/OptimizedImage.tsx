import React, { memo, useMemo } from 'react';
import { Image } from 'expo-image';
import { View, StyleSheet, Platform, Image as RNImage } from 'react-native';
import { THEME } from '../../utils/constants';

interface OptimizedImageProps {
  uri: string | any; // Может быть строка URL или объект require()
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
  // Определяем, является ли uri строкой URL или объектом require()
  const isUrl = typeof uri === 'string';
  const imageSource = useMemo(() => {
    if (isUrl) {
      return {
        uri: uri || fallback,
        headers: {
          'Cache-Control': 'max-age=31536000', // 1 год кэширования
        }
      };
    } else {
      // Для объектов require() используем как есть
      return uri;
    }
  }, [uri, fallback, isUrl]);

  const placeholderSource = useMemo(() => ({
    uri: placeholder
  }), [placeholder]);

  return (
    <View style={[styles.container, style]}>
      {Platform.OS === 'web' ? (
        <RNImage
          source={isUrl ? { uri: uri || fallback } : uri}
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
          onError={() => {
            // В production можно логировать ошибки загрузки изображений
            // console.warn('Failed to load image:', uri);
          }}
        />
      ) : (
        <Image
          source={imageSource}
          placeholder={isUrl ? placeholderSource : undefined}
          contentFit={contentFit}
          transition={transition}
          priority={priority ? 'high' : 'normal'}
          cachePolicy={cachePolicy}
          recyclingKey={isUrl ? uri : undefined}
          style={StyleSheet.absoluteFillObject}
          onError={() => {
            // В production можно логировать ошибки загрузки изображений
            // console.warn('Failed to load image:', uri);
          }}
        />
      )}
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
