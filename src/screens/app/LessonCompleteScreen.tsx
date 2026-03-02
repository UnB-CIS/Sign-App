import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors, Spacing, FontSize, BorderRadius } from '../../theme';
import type { AppStackScreenProps } from '../../@types/navigation';

export default function LessonCompleteScreen() {
  const route = useRoute<AppStackScreenProps<'LessonComplete'>['route']>();
  const navigation = useNavigation();
  const { score, xpEarned } = route.params;

  return (
    <View style={styles.container}>
      <Ionicons name="trophy" size={80} color={Colors.gold} />
      <Text style={styles.title}>Parabéns!</Text>
      <Text style={styles.subtitle}>Você completou a lição!</Text>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{score}%</Text>
          <Text style={styles.statLabel}>Pontuação</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>+{xpEarned}</Text>
          <Text style={styles.statLabel}>XP</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('MainTabs', { screen: 'Home' })}
      >
        <Text style={styles.buttonText}>Voltar aos Módulos</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: Spacing.lg,
  },
  title: {
    fontSize: FontSize.title,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: Spacing.lg,
  },
  subtitle: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xxl,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: Spacing.xxl,
    marginBottom: Spacing.xxxl,
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: FontSize.title,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.textOnPrimary,
    fontSize: FontSize.base,
    fontWeight: '600',
  },
});
