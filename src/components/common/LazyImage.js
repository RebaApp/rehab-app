import React, { useEffect, useRef, useState } from 'react';
import { View, Image, Animated, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const THEME = {
  muted: "#5f6b75",
  primary: "#1a84ff"
};

const LazyImage = ({ source, style, fallback = "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop&crop=center", priority = false }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [shouldLoad, setShouldLoad] = useState(priority);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Простая ленивая загрузка без Intersection Observer
  useEffect(() => {
    if (priority) {
      setShouldLoad(true);
      return;
    }
    
    // Задержка для ленивой загрузки
    const timer = setTimeout(() => {
      setShouldLoad(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [priority]);

  const handleLoad = () => {
    setLoading(false);
    setError(false);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleError = () => {
    console.log(`Image load error for: ${source}, retry: ${retryCount}`);
    setError(true);
    setLoading(false);
    
    // Попробуем перезагрузить изображение до 3 раз
    if (retryCount < 3) {
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
        setError(false);
        setLoading(true);
      }, 1000 * (retryCount + 1)); // Увеличиваем задержку с каждой попыткой
    } else {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <View style={style}>
      {loading && (
        <View style={[style, styles.imagePlaceholder]}>
          <Ionicons name="image-outline" size={40} color={THEME.muted} />
          {retryCount > 0 && (
            <Text style={{ color: THEME.muted, fontSize: 12, marginTop: 4 }}>
              Повторная загрузка...
            </Text>
          )}
        </View>
      )}
      {shouldLoad && (
        <Animated.View style={{ opacity: fadeAnim, position: loading ? 'absolute' : 'relative' }}>
          <Image
            source={{ uri: error ? fallback : source }}
            style={style}
            onLoad={handleLoad}
            onError={handleError}
            resizeMode="cover"
            cache="force-cache"
            defaultSource={{ uri: fallback }}
          />
        </Animated.View>
      )}
    </View>
  );
};

const styles = {
  imagePlaceholder: {
    backgroundColor: "#f8fbff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e7f3ff",
    borderStyle: "dashed"
  }
};

export default LazyImage;
