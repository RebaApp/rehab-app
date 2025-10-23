import React, { memo, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { THEME } from '../utils/constants';
import { responsiveWidth, responsiveHeight, responsivePadding } from '../utils/responsive';

interface HomeScreenProps {
  onArticlePress: (article: any) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = memo(() => {
  // Анимации
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Начальные анимации
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Непрерывное вращение значка
    const startRotation = () => {
      rotateAnim.setValue(0);
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000, // 20 секунд на полный оборот (медленнее)
        useNativeDriver: true,
      }).start(() => startRotation()); // Зацикливаем
    };
    startRotation();
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
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim }
              ]
            }
          ]}>
            {/* Крутящийся значок */}
            <View style={styles.iconSection}>
              <BlurView intensity={25} tint="light" style={styles.iconBlur}>
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0.2)']}
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
                      <Text style={styles.iconText}>*</Text>
                    </LinearGradient>
                  </Animated.View>
                </LinearGradient>
              </BlurView>
            </View>

            {/* Название и слоган */}
            <View style={styles.textSection}>
              <Text style={styles.title}>РЕБА</Text>
              <Text style={styles.slogan}>помощь ближе чем кажется</Text>
            </View>

            {/* Быстрые действия */}
            <View style={styles.actionsSection}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => console.log('Найти центр')}
                activeOpacity={0.7}
              >
                <BlurView intensity={20} tint="light" style={styles.actionBlur}>
                  <LinearGradient
                    colors={['rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0.2)']}
                    style={styles.actionGradient}
                  >
                    <Ionicons name="search" size={24} color="#81D4FA" />
                    <Text style={styles.actionText}>Найти центр</Text>
                  </LinearGradient>
                </BlurView>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => console.log('Консультация')}
                activeOpacity={0.7}
              >
                <BlurView intensity={20} tint="light" style={styles.actionBlur}>
                  <LinearGradient
                    colors={['rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0.2)']}
                    style={styles.actionGradient}
                  >
                    <Ionicons name="call" size={24} color="#81D4FA" />
                    <Text style={styles.actionText}>Консультация</Text>
                  </LinearGradient>
                </BlurView>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => console.log('Статьи')}
                activeOpacity={0.7}
              >
                <BlurView intensity={20} tint="light" style={styles.actionBlur}>
                  <LinearGradient
                    colors={['rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0.2)']}
                    style={styles.actionGradient}
                  >
                    <Ionicons name="book" size={24} color="#81D4FA" />
                    <Text style={styles.actionText}>Статьи</Text>
                  </LinearGradient>
                </BlurView>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => console.log('Поддержка')}
                activeOpacity={0.7}
              >
                <BlurView intensity={20} tint="light" style={styles.actionBlur}>
                  <LinearGradient
                    colors={['rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0.2)']}
                    style={styles.actionGradient}
                  >
                    <Ionicons name="heart" size={24} color="#81D4FA" />
                    <Text style={styles.actionText}>Поддержка</Text>
                  </LinearGradient>
                </BlurView>
              </TouchableOpacity>
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
  iconText: {
    fontSize: responsiveWidth(80),
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
  },

  // Секция текста
  textSection: {
    alignItems: 'center',
    marginBottom: responsivePadding(48),
  },
  title: {
    fontSize: responsiveWidth(48),
    fontWeight: '900',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: responsivePadding(12),
    letterSpacing: responsiveWidth(-1),
  },
  slogan: {
    fontSize: responsiveWidth(18),
    fontWeight: '500',
    color: '#666',
    textAlign: 'center',
    letterSpacing: responsiveWidth(0.5),
  },

  // Секция действий
  actionsSection: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    marginBottom: responsivePadding(16),
    borderRadius: responsiveWidth(16),
    overflow: 'hidden',
  },
  actionBlur: {
    borderRadius: responsiveWidth(16),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: responsiveHeight(2) },
    shadowOpacity: 0.1,
    shadowRadius: responsiveWidth(8),
    elevation: 4,
  },
  actionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: responsivePadding(16),
    paddingHorizontal: responsivePadding(12),
  },
  actionText: {
    color: '#1a1a1a',
    fontSize: responsiveWidth(16),
    fontWeight: '600',
    marginLeft: responsivePadding(8),
  },
});

export default HomeScreen;