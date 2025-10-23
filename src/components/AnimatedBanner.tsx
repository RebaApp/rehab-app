import React, { memo, useRef, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { responsiveWidth, responsiveHeight, responsivePadding, responsiveFontSize } from '../utils/responsive';
import { BANNER_CONFIG } from '../config/bannerConfig';

interface AnimatedBannerProps {
  scrollY: Animated.Value;
  isVisible: boolean;
}

const AnimatedBanner: React.FC<AnimatedBannerProps> = memo(({ scrollY, isVisible }) => {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  
  // Состояние для рандомных кружков
  const [randomCircles, setRandomCircles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    opacity: Animated.Value;
    scale: Animated.Value;
  }>>([]);

  // Функции для рандомных кружков
  const createRandomCircle = () => {
    const { sizeRange } = BANNER_CONFIG.decorativeElements.randomCircles;
    const size = Math.random() * (sizeRange.max - sizeRange.min) + sizeRange.min;
    const x = Math.random() * 200 + 50; // Отступы от краев
    const y = Math.random() * 80 + 20; // Отступы от верха/низа
    
    return {
      id: Date.now() + Math.random(),
      x,
      y,
      size,
      opacity: new Animated.Value(0),
      scale: new Animated.Value(0.5),
    };
  };

  const animateRandomCircle = (circle: typeof randomCircles[0]) => {
    const { animationDuration, fadeDuration } = BANNER_CONFIG.decorativeElements.randomCircles;
    const duration = Math.random() * (animationDuration.max - animationDuration.min) + animationDuration.min;
    const fadeTime = Math.random() * (fadeDuration.max - fadeDuration.min) + fadeDuration.min;

    // Появление
    Animated.parallel([
      Animated.timing(circle.opacity, {
        toValue: 0.6,
        duration: fadeTime,
        useNativeDriver: true,
      }),
      Animated.spring(circle.scale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Исчезновение через случайное время
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(circle.opacity, {
          toValue: 0,
          duration: fadeTime,
          useNativeDriver: true,
        }),
        Animated.timing(circle.scale, {
          toValue: 0.5,
          duration: fadeTime,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Удаляем кружок и создаем новый
        setRandomCircles(prev => prev.filter(c => c.id !== circle.id));
        if (BANNER_CONFIG.decorativeElements.randomCircles.enabled) {
          const newCircle = createRandomCircle();
          setRandomCircles(prev => [...prev, newCircle]);
          animateRandomCircle(newCircle);
        }
      });
    }, duration);
  };

  useEffect(() => {
    // Начальные анимации
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: BANNER_CONFIG.animations.fadeInDuration,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: BANNER_CONFIG.animations.scaleTension,
        friction: BANNER_CONFIG.animations.scaleFriction,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 40,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Бесконечная анимация вращения для декоративных элементов
    const startRotation = () => {
      rotateAnim.setValue(0);
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: BANNER_CONFIG.animations.rotationSpeed,
          useNativeDriver: true,
        }),
        { iterations: -1 }
      ).start();
    };
    startRotation();

    // Инициализация рандомных кружков
    if (BANNER_CONFIG.decorativeElements.randomCircles.enabled) {
      const initialCircles = Array.from({ length: BANNER_CONFIG.decorativeElements.randomCircles.count }, () => {
        const circle = createRandomCircle();
        setTimeout(() => animateRandomCircle(circle), Math.random() * 2000);
        return circle;
      });
      setRandomCircles(initialCircles);
    }
  }, []);

  // Анимация исчезновения при скроллинге
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -100],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  if (!isVisible) return null;

  return (
    <Animated.View style={[
      styles.bannerContainer,
      {
        transform: [
          { translateY: headerTranslateY },
          { scale: scaleAnim },
          { translateY: slideAnim }
        ],
        opacity: headerOpacity,
      }
    ]}>
      <BlurView intensity={BANNER_CONFIG.bannerStyle.blurIntensity} tint="light" style={styles.bannerBlur}>
        <LinearGradient
          colors={BANNER_CONFIG.gradientColors}
          style={styles.bannerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Декоративные элементы */}
          {BANNER_CONFIG.decorativeElements.enabled && (
            <View style={styles.decorativeElements}>
              <Animated.View style={[styles.decorativeCircle1, {
                transform: [{
                  rotate: rotateAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg']
                  })
                }]
              }]}>
                <LinearGradient
                  colors={BANNER_CONFIG.decorativeElements.circle1.colors}
                  style={styles.decorativeGradient}
                />
              </Animated.View>
              
              <Animated.View style={[styles.decorativeCircle2, {
                transform: [{
                  rotate: rotateAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['360deg', '0deg']
                  })
                }]
              }]}>
                <LinearGradient
                  colors={BANNER_CONFIG.decorativeElements.circle2.colors}
                  style={styles.decorativeGradient}
                />
              </Animated.View>

              {/* Рандомные кружки */}
              {BANNER_CONFIG.decorativeElements.randomCircles.enabled && 
                randomCircles.map((circle) => (
                  <Animated.View
                    key={circle.id}
                    style={[
                      styles.randomCircle,
                      {
                        left: responsiveWidth(circle.x),
                        top: responsiveHeight(circle.y),
                        width: responsiveWidth(circle.size),
                        height: responsiveWidth(circle.size),
                        borderRadius: responsiveWidth(circle.size / 2),
                        opacity: circle.opacity,
                        transform: [{ scale: circle.scale }],
                      }
                    ]}
                  >
                    <LinearGradient
                      colors={BANNER_CONFIG.decorativeElements.randomCircles.colors}
                      style={styles.randomCircleGradient}
                    />
                  </Animated.View>
                ))
              }
            </View>
          )}

          {/* Основной контент баннера */}
          <View style={styles.bannerContent}>
            <Animated.Text style={[styles.appTitle, { opacity: fadeAnim }]}>
              {BANNER_CONFIG.appTitle}
            </Animated.Text>
            <Animated.Text style={[styles.appSlogan, { opacity: fadeAnim }]}>
              {BANNER_CONFIG.appSlogan}
            </Animated.Text>
          </View>
        </LinearGradient>
      </BlurView>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  bannerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingTop: responsiveHeight(50), // Отступ от верха экрана
    paddingHorizontal: responsivePadding(16),
  },
  bannerBlur: {
    borderRadius: responsiveWidth(BANNER_CONFIG.bannerStyle.borderRadius),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: responsiveHeight(6) },
    shadowOpacity: BANNER_CONFIG.bannerStyle.shadowOpacity,
    shadowRadius: responsiveWidth(BANNER_CONFIG.bannerStyle.shadowRadius),
    elevation: BANNER_CONFIG.bannerStyle.elevation,
  },
  bannerGradient: {
    padding: responsivePadding(24),
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    minHeight: responsiveHeight(120),
  },
  decorativeElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  decorativeCircle1: {
    position: 'absolute',
    top: responsiveHeight(BANNER_CONFIG.decorativeElements.circle1.position.top),
    right: responsiveWidth(BANNER_CONFIG.decorativeElements.circle1.position.right),
    width: responsiveWidth(BANNER_CONFIG.decorativeElements.circle1.size),
    height: responsiveWidth(BANNER_CONFIG.decorativeElements.circle1.size),
    borderRadius: responsiveWidth(BANNER_CONFIG.decorativeElements.circle1.size / 2),
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: responsiveHeight(BANNER_CONFIG.decorativeElements.circle2.position.bottom),
    left: responsiveWidth(BANNER_CONFIG.decorativeElements.circle2.position.left),
    width: responsiveWidth(BANNER_CONFIG.decorativeElements.circle2.size),
    height: responsiveWidth(BANNER_CONFIG.decorativeElements.circle2.size),
    borderRadius: responsiveWidth(BANNER_CONFIG.decorativeElements.circle2.size / 2),
  },
  decorativeGradient: {
    flex: 1,
    borderRadius: responsiveWidth(20),
    opacity: 0.3,
  },
  randomCircle: {
    position: 'absolute',
  },
  randomCircleGradient: {
    flex: 1,
    borderRadius: responsiveWidth(20),
    opacity: 0.4,
  },
  bannerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  appTitle: {
    fontSize: responsiveFontSize(BANNER_CONFIG.titleStyle.fontSize),
    fontWeight: BANNER_CONFIG.titleStyle.fontWeight,
    color: BANNER_CONFIG.titleStyle.color,
    textAlign: 'center',
    marginBottom: responsivePadding(8),
    letterSpacing: responsiveWidth(BANNER_CONFIG.titleStyle.letterSpacing),
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: responsiveHeight(2) },
    textShadowRadius: responsiveWidth(4),
  },
  appSlogan: {
    fontSize: responsiveFontSize(BANNER_CONFIG.sloganStyle.fontSize),
    fontWeight: BANNER_CONFIG.sloganStyle.fontWeight,
    color: BANNER_CONFIG.sloganStyle.color,
    textAlign: 'center',
    letterSpacing: responsiveWidth(BANNER_CONFIG.sloganStyle.letterSpacing),
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: responsiveHeight(1) },
    textShadowRadius: responsiveWidth(2),
  },
});

export default AnimatedBanner;
