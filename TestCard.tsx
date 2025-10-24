// Тестовый файл для проверки компонентов
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CardRehabCenter from './src/components/common/CardRehabCenter';
import { mockRehabCenters } from './src/data/mockCenters';

// Простой тест компонента
const TestCard = () => {
  const testCenter = mockRehabCenters[0]; // Берем первый центр для теста
  
  const handleOpen = (centerId: string) => {
    console.log('Тест: Открыть центр', centerId);
  };
  
  const handleCall = (phone: string) => {
    console.log('Тест: Позвонить', phone);
  };
  
  const handleToggleFavorite = (centerId: string) => {
    console.log('Тест: Переключить избранное', centerId);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Тест карточки центра</Text>
      <CardRehabCenter
        center={testCenter}
        onOpen={handleOpen}
        onCall={handleCall}
        onToggleFavorite={handleToggleFavorite}
        isFavorite={false}
        showDistance={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F0F8FF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#0A84FF',
  },
});

export default TestCard;
