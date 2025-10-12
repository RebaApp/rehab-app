import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TestComponent = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>🚀 REBA работает!</Text>
      <Text style={styles.subtext}>Оптимизированная версия 2.0.0</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    padding: 20,
  },
  text: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtext: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
});

export default TestComponent;
