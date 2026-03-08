import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ModuleDetailScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Detalhe do Módulo</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 18 },
});
