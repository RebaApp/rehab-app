import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import { 
  responsiveWidth, 
  responsiveHeight, 
  responsiveFontSize, 
  responsivePadding 
} from '../utils/responsive';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Определение типа устройства
const getDeviceType = () => {
  if (screenWidth < 375) return 'small'; // iPhone SE, mini
  if (screenWidth < 414) return 'medium'; // iPhone 12, 13, 14
  if (screenWidth < 430) return 'large'; // iPhone 15 Pro, 15 Pro Max
  return 'xlarge'; // iPad, большие экраны
};

const ResponsiveTestScreen = () => {
  const deviceType = getDeviceType();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Информация об экране */}
          <View style={styles.infoSection}>
            <Text style={styles.title}>Тест адаптивности</Text>
            <Text style={styles.subtitle}>
              Размеры экрана: {screenWidth} x {screenHeight}
            </Text>
            <Text style={styles.subtitle}>
              Тип устройства: {deviceType}
            </Text>
          </View>

          {/* Тестовые элементы */}
          <View style={styles.testSection}>
            <Text style={styles.sectionTitle}>Адаптивные размеры</Text>
            
            {/* Тест шрифтов */}
            <View style={styles.testItem}>
              <Text style={styles.testLabel}>Шрифты:</Text>
              <Text style={[styles.testText, { fontSize: responsiveFontSize(12) }]}>
                Маленький (12px)
              </Text>
              <Text style={[styles.testText, { fontSize: responsiveFontSize(16) }]}>
                Средний (16px)
              </Text>
              <Text style={[styles.testText, { fontSize: responsiveFontSize(24) }]}>
                Большой (24px)
              </Text>
            </View>

            {/* Тест отступов */}
            <View style={styles.testItem}>
              <Text style={styles.testLabel}>Отступы:</Text>
              <View style={[styles.paddingTest, { padding: responsivePadding(8) }]}>
                <Text style={styles.testText}>Маленький отступ (8px)</Text>
              </View>
              <View style={[styles.paddingTest, { padding: responsivePadding(16) }]}>
                <Text style={styles.testText}>Средний отступ (16px)</Text>
              </View>
              <View style={[styles.paddingTest, { padding: responsivePadding(24) }]}>
                <Text style={styles.testText}>Большой отступ (24px)</Text>
              </View>
            </View>

            {/* Тест размеров */}
            <View style={styles.testItem}>
              <Text style={styles.testLabel}>Размеры элементов:</Text>
              <View style={[styles.sizeTest, { 
                width: responsiveWidth(50), 
                height: responsiveHeight(50) 
              }]}>
                <Text style={styles.testText}>50x50</Text>
              </View>
              <View style={[styles.sizeTest, { 
                width: responsiveWidth(100), 
                height: responsiveHeight(100) 
              }]}>
                <Text style={styles.testText}>100x100</Text>
              </View>
              <View style={[styles.sizeTest, { 
                width: responsiveWidth(150), 
                height: responsiveHeight(150) 
              }]}>
                <Text style={styles.testText}>150x150</Text>
              </View>
            </View>

            {/* Тест карточек */}
            <View style={styles.testItem}>
              <Text style={styles.testLabel}>Адаптивные карточки:</Text>
              <View style={styles.cardTest}>
                <View style={[styles.card, { 
                  padding: responsivePadding(16),
                  borderRadius: responsiveWidth(12),
                  marginBottom: responsivePadding(12)
                }]}>
                  <Text style={[styles.cardTitle, { fontSize: responsiveFontSize(18) }]}>
                    Карточка 1
                  </Text>
                  <Text style={[styles.cardText, { fontSize: responsiveFontSize(14) }]}>
                    Адаптивный контент с responsive размерами
                  </Text>
                </View>
                <View style={[styles.card, { 
                  padding: responsivePadding(20),
                  borderRadius: responsiveWidth(16),
                  marginBottom: responsivePadding(16)
                }]}>
                  <Text style={[styles.cardTitle, { fontSize: responsiveFontSize(20) }]}>
                    Карточка 2
                  </Text>
                  <Text style={[styles.cardText, { fontSize: responsiveFontSize(16) }]}>
                    Больше отступов и размеров для планшетов
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: responsivePadding(20),
  },
  infoSection: {
    marginBottom: responsivePadding(32),
    alignItems: 'center',
  },
  title: {
    fontSize: responsiveFontSize(28),
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: responsivePadding(8),
  },
  subtitle: {
    fontSize: responsiveFontSize(16),
    color: '#666',
    textAlign: 'center',
    marginBottom: responsivePadding(4),
  },
  testSection: {
    marginBottom: responsivePadding(32),
  },
  sectionTitle: {
    fontSize: responsiveFontSize(22),
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: responsivePadding(20),
  },
  testItem: {
    marginBottom: responsivePadding(24),
  },
  testLabel: {
    fontSize: responsiveFontSize(18),
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: responsivePadding(12),
  },
  testText: {
    color: '#666',
    marginBottom: responsivePadding(8),
  },
  paddingTest: {
    backgroundColor: '#e3f2fd',
    borderRadius: responsiveWidth(8),
    marginBottom: responsivePadding(8),
  },
  sizeTest: {
    backgroundColor: '#81D4FA',
    borderRadius: responsiveWidth(8),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: responsivePadding(8),
  },
  cardTest: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: responsiveHeight(2) },
    shadowOpacity: 0.1,
    shadowRadius: responsiveWidth(8),
    elevation: 3,
    width: '48%',
  },
  cardTitle: {
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: responsivePadding(8),
  },
  cardText: {
    color: '#666',
    lineHeight: responsiveFontSize(20),
  },
});

export default ResponsiveTestScreen;
