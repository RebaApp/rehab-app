import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Animated,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Center, SubscriptionPlan } from '../types';
import { responsiveWidth, responsivePadding, responsiveFontSize } from '../utils/responsive';
import apiService from '../services/apiService';

interface SubscriptionScreenProps {
  center: Center;
  onClose: () => void;
  onSuccess?: (center: Center) => void;
}

const SubscriptionScreen: React.FC<SubscriptionScreenProps> = ({ center, onClose, onSuccess }) => {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>('1month');
  const [loading, setLoading] = useState(false);

  // Анимации
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const plans = [
    {
      id: '1month' as SubscriptionPlan,
      name: '1 месяц',
      price: 5000,
      discount: 0,
      popular: false,
    },
    {
      id: '6months' as SubscriptionPlan,
      name: '6 месяцев',
      price: 25000,
      discount: 17, // Экономия 5000 (5000*6 = 30000, но 25000)
      popular: true,
    },
    {
      id: '12months' as SubscriptionPlan,
      name: '12 месяцев',
      price: 45000,
      discount: 25, // Экономия 15000 (5000*12 = 60000, но 45000)
      popular: false,
    },
  ];

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const result = await apiService.subscribeToCenter(center.id, selectedPlan);
      
      if (result.success && result.data) {
        Alert.alert(
          'Успех',
          'Подписка активирована! Ваш центр теперь отображается в поиске.',
          [
            {
              text: 'OK',
              onPress: () => {
                if (onSuccess) {
                  onSuccess(result.data!);
                }
                onClose();
              },
            },
          ]
        );
      } else {
        Alert.alert('Ошибка', result.error || 'Не удалось активировать подписку');
      }
    } catch (error) {
      console.error('Ошибка активации подписки:', error);
      Alert.alert('Ошибка', 'Произошла ошибка при активации подписки');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Заголовок */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={24} color="#1a1a1a" />
            </TouchableOpacity>
            <Text style={styles.title}>Оплата подписки</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Информация о центре */}
          <View style={styles.centerInfo}>
            <Text style={styles.centerName}>{center.name}</Text>
            <Text style={styles.centerCity}>{center.city}</Text>
            <View style={styles.approvedBadge}>
              <Ionicons name="checkmark-circle" size={16} color="#34A853" />
              <Text style={styles.approvedText}>Центр одобрен модерацией</Text>
            </View>
          </View>

          {/* Выбор плана */}
          <View style={styles.plansContainer}>
            <Text style={styles.plansTitle}>Выберите план подписки</Text>
            <Text style={styles.plansSubtitle}>
              После оплаты ваш центр будет отображаться в поиске
            </Text>

            {plans.map((plan) => (
              <TouchableOpacity
                key={plan.id}
                style={[
                  styles.planCard,
                  selectedPlan === plan.id && styles.planCardSelected,
                  plan.popular && styles.planCardPopular,
                ]}
                onPress={() => setSelectedPlan(plan.id)}
                activeOpacity={0.7}
              >
                {plan.popular && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularText}>Популярный</Text>
                  </View>
                )}
                <View style={styles.planHeader}>
                  <View style={styles.planInfo}>
                    <Text style={styles.planName}>{plan.name}</Text>
                    {plan.discount > 0 && (
                      <Text style={styles.planDiscount}>Экономия {plan.discount}%</Text>
                    )}
                  </View>
                  <View style={styles.planPrice}>
                    <Text style={styles.planPriceValue}>{plan.price.toLocaleString('ru-RU')}</Text>
                    <Text style={styles.planPriceCurrency}>₽</Text>
                  </View>
                </View>
                {selectedPlan === plan.id && (
                  <View style={styles.selectedIndicator}>
                    <Ionicons name="checkmark-circle" size={20} color="#42A5F5" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Кнопка оплаты */}
          <TouchableOpacity
            style={[styles.payButton, loading && styles.payButtonDisabled]}
            onPress={handleSubscribe}
            disabled={loading}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={loading ? ['#ccc', '#aaa'] : ['#81D4FA', '#42A5F5']}
              style={styles.payButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Ionicons name="card" size={20} color="#fff" />
                  <Text style={styles.payButtonText}>
                    Оплатить {plans.find(p => p.id === selectedPlan)?.price.toLocaleString('ru-RU')} ₽
                  </Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Информация */}
          <View style={styles.infoContainer}>
            <Ionicons name="information-circle-outline" size={20} color="#666" />
            <Text style={styles.infoText}>
              После оплаты центр будет отображаться в поиске до окончания подписки. 
              Вы получите уведомление за 7 дней до окончания.
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: responsivePadding(50),
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: responsivePadding(100),
  },
  content: {
    flex: 1,
    paddingHorizontal: responsivePadding(16),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: responsivePadding(24),
  },
  closeButton: {
    padding: responsivePadding(8),
    borderRadius: responsiveWidth(20),
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  title: {
    fontSize: responsiveFontSize(20),
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
    flex: 1,
  },
  placeholder: {
    width: responsiveWidth(40),
  },
  centerInfo: {
    marginBottom: responsivePadding(24),
    padding: responsivePadding(16),
    backgroundColor: '#F5F5F5',
    borderRadius: responsiveWidth(12),
  },
  centerName: {
    fontSize: responsiveFontSize(18),
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: responsivePadding(4),
  },
  centerCity: {
    fontSize: responsiveFontSize(14),
    color: '#666',
    marginBottom: responsivePadding(8),
  },
  approvedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsivePadding(4),
  },
  approvedText: {
    fontSize: responsiveFontSize(12),
    color: '#34A853',
    fontWeight: '600',
  },
  plansContainer: {
    marginBottom: responsivePadding(24),
  },
  plansTitle: {
    fontSize: responsiveFontSize(18),
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: responsivePadding(4),
  },
  plansSubtitle: {
    fontSize: responsiveFontSize(14),
    color: '#666',
    marginBottom: responsivePadding(16),
  },
  planCard: {
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: responsiveWidth(12),
    padding: responsivePadding(16),
    marginBottom: responsivePadding(12),
    backgroundColor: '#fff',
    position: 'relative',
  },
  planCardSelected: {
    borderColor: '#42A5F5',
    backgroundColor: '#F0F8FF',
  },
  planCardPopular: {
    borderColor: '#FF9800',
  },
  popularBadge: {
    position: 'absolute',
    top: responsivePadding(8),
    right: responsivePadding(8),
    backgroundColor: '#FF9800',
    paddingHorizontal: responsivePadding(8),
    paddingVertical: responsivePadding(4),
    borderRadius: responsiveWidth(8),
  },
  popularText: {
    fontSize: responsiveFontSize(10),
    color: '#fff',
    fontWeight: '700',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: responsiveFontSize(16),
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: responsivePadding(4),
  },
  planDiscount: {
    fontSize: responsiveFontSize(12),
    color: '#34A853',
    fontWeight: '600',
  },
  planPrice: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  planPriceValue: {
    fontSize: responsiveFontSize(24),
    fontWeight: '700',
    color: '#1a1a1a',
  },
  planPriceCurrency: {
    fontSize: responsiveFontSize(16),
    color: '#666',
    marginLeft: responsivePadding(4),
  },
  selectedIndicator: {
    marginTop: responsivePadding(8),
    alignItems: 'flex-end',
  },
  payButton: {
    borderRadius: responsiveWidth(12),
    overflow: 'hidden',
    marginBottom: responsivePadding(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  payButtonDisabled: {
    opacity: 0.6,
  },
  payButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: responsivePadding(16),
    paddingHorizontal: responsivePadding(24),
  },
  payButtonText: {
    color: '#fff',
    fontSize: responsiveFontSize(16),
    fontWeight: '600',
    marginLeft: responsivePadding(8),
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: responsivePadding(16),
    backgroundColor: '#F5F5F5',
    borderRadius: responsiveWidth(12),
    gap: responsivePadding(8),
  },
  infoText: {
    flex: 1,
    fontSize: responsiveFontSize(12),
    color: '#666',
    lineHeight: responsiveFontSize(18),
  },
});

export default SubscriptionScreen;

