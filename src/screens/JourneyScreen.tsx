import React, { memo, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { responsiveWidth, responsiveHeight, responsivePadding } from '../utils/responsive';

interface JourneyScreenProps {
  // Пока пустой интерфейс, будем добавлять функционал позже
}

const JourneyScreen: React.FC<JourneyScreenProps> = memo(() => {
  // Анимации
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Начальные анимации (fade, slide, scale) - только один раз
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 40,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Бесконечная плавная анимация вращения
    const startRotation = () => {
      rotateAnim.setValue(0);
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 8000, // 8 секунд на полный оборот - очень медленно
          useNativeDriver: true,
        }),
        { iterations: -1 } // бесконечно
      ).start();
    };

    // Запускаем вращение с небольшой задержкой после появления
    setTimeout(startRotation, 1200);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>

        {/* Coming Soon Section */}
        <Animated.View style={[styles.comingSoonSection, { 
          opacity: fadeAnim, 
          transform: [{ scale: scaleAnim }] 
        }]}>
          <BlurView intensity={20} tint="light" style={styles.comingSoonBlur}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)']}
              style={styles.comingSoonGradient}
            >
              <View style={styles.comingSoonContent}>
                <Animated.View style={[styles.comingSoonIconContainer, {
                  transform: [{
                    rotate: rotateAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '360deg']
                    })
                  }]
                }]}>
                  <LinearGradient
                    colors={['#45B7D1', '#4ECDC4', '#96CEB4', '#FFEAA7', '#FF6B6B']}
                    style={styles.comingSoonIconGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Ionicons name="trending-up" size={48} color="#FFFFFF" />
                  </LinearGradient>
                </Animated.View>
                
                <Text style={styles.comingSoonTitle}>Скоро здесь</Text>
                <Text style={styles.comingSoonText}>
                  Мы работаем над созданием персональной программы восстановления для вас
                </Text>
              </View>
            </LinearGradient>
          </BlurView>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  comingSoonSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  comingSoonBlur: {
    borderRadius: responsiveWidth(24),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: responsiveHeight(4) },
    shadowOpacity: 0.15,
    shadowRadius: responsiveWidth(16),
    elevation: 8,
  },
  comingSoonGradient: {
    padding: responsivePadding(32),
  },
  comingSoonContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  comingSoonIconContainer: {
    marginBottom: 24,
  },
  comingSoonIconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  comingSoonTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  comingSoonText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
  },
});

export default JourneyScreen;
