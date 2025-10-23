import React, { memo, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { THEME } from '../utils/constants';
import { responsiveWidth, responsiveHeight, responsivePadding } from '../utils/responsive';

interface SearchScreenProps {
  onCenterPress: (center: any) => void;
  onToggleFavorite: (centerId: string) => void;
  isFavorite: (centerId: string) => boolean;
}

const SearchScreen: React.FC<SearchScreenProps> = memo(() => {
  // Анимации в стиле JourneyScreen
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Начальные анимации в стиле JourneyScreen (без slideAnim)
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Бесконечная плавная анимация вращения в стиле JourneyScreen
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
      <LinearGradient
        colors={[THEME.bgTop, THEME.bgMid, THEME.bgBottom]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Animated.View style={[
            styles.mainSection,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}>
            {/* Крутящийся значок поиска */}
            <View style={styles.iconSection}>
              <BlurView intensity={20} tint="light" style={styles.iconBlur}>
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)']}
                  style={styles.iconGradient}
                >
                  <Animated.View style={[styles.iconContainer, {
                    transform: [{
                      rotate: rotateAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '360deg']
                      })
                    }]
                  }]}>
                    <LinearGradient
                      colors={['#81D4FA', '#42A5F5', '#81D4FA', '#B0E0E6', '#E0F6FF']}
                      style={styles.iconGradientInner}
                    >
                      <Ionicons name="search" size={64} color="#FFFFFF" />
                    </LinearGradient>
                  </Animated.View>
                </LinearGradient>
              </BlurView>
            </View>

            {/* Заголовок и описание */}
            <View style={styles.textSection}>
              <Text style={styles.title}>Поиск центров</Text>
              <Text style={styles.subtitle}>Скоро здесь будет поиск реабилитационных центров</Text>
            </View>

            {/* Описание в BlurView */}
            <View style={styles.descriptionSection}>
              <BlurView intensity={15} tint="light" style={styles.descriptionBlur}>
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)']}
                  style={styles.descriptionGradient}
                >
                  <View style={styles.descriptionContent}>
                    <Ionicons name="information-circle-outline" size={24} color="#81D4FA" />
                    <Text style={styles.descriptionText}>
                      Мы работаем над созданием удобного поиска с фильтрами по городу, типу лечения и другим параметрам.
                    </Text>
                  </View>
                </LinearGradient>
              </BlurView>
            </View>
          </Animated.View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: responsivePadding(20),
  },
  mainSection: {
    alignItems: 'center',
    width: '100%',
  },
  
  // Секция значка
  iconSection: {
    marginBottom: responsivePadding(40),
  },
  iconBlur: {
    borderRadius: responsiveWidth(24),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: responsiveHeight(4) },
    shadowOpacity: 0.15,
    shadowRadius: responsiveWidth(16),
    elevation: 8,
  },
  iconGradient: {
    padding: responsivePadding(32),
    alignItems: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconGradientInner: {
    width: responsiveWidth(120),
    height: responsiveWidth(120),
    borderRadius: responsiveWidth(60),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#81D4FA',
    shadowOffset: { width: 0, height: responsiveHeight(4) },
    shadowOpacity: 0.3,
    shadowRadius: responsiveWidth(12),
    elevation: 6,
  },

  // Секция текста
  textSection: {
    alignItems: 'center',
    marginBottom: responsivePadding(32),
  },
  title: {
    fontSize: responsiveWidth(32),
    fontWeight: '800',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: responsivePadding(12),
    letterSpacing: responsiveWidth(-0.5),
  },
  subtitle: {
    fontSize: responsiveWidth(18),
    fontWeight: '500',
    color: '#666',
    textAlign: 'center',
    lineHeight: responsiveWidth(24),
  },

  // Секция описания
  descriptionSection: {
    width: '100%',
  },
  descriptionBlur: {
    borderRadius: responsiveWidth(20),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: responsiveHeight(4) },
    shadowOpacity: 0.1,
    shadowRadius: responsiveWidth(16),
    elevation: 8,
  },
  descriptionGradient: {
    padding: responsivePadding(24),
  },
  descriptionContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  descriptionText: {
    flex: 1,
    fontSize: responsiveWidth(16),
    color: '#666',
    lineHeight: responsiveWidth(22),
    marginLeft: responsivePadding(12),
  },
});

export default SearchScreen;