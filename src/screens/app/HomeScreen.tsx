import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { MODULES } from '../../data/modules';
import { Colors, Spacing, FontSize, BorderRadius } from '../../theme';
import type { Module } from '../../data/types';

interface CourseCardProps {
  title: string;
  progress: number;
  locked: boolean;
  onPress: () => void;
}

function CourseCard({ title, progress, locked, onPress }: CourseCardProps) {
  const isCompleted = progress >= 100;

  return (
    <TouchableOpacity
      style={[styles.cardContainer, locked && styles.cardLocked]}
      activeOpacity={locked ? 1 : 0.7}
      onPress={locked ? undefined : onPress}
    >
      <View style={styles.headerRow}>
        <Text style={styles.titleText}>{title}</Text>
        {locked ? (
          <Ionicons name="lock-closed" size={18} color={Colors.textLight} />
        ) : (
          <Text style={styles.percentageText}>{progress}%</Text>
        )}
      </View>

      <View style={styles.progressBarTrack}>
        <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
      </View>

      <View style={styles.footer}>
        {isCompleted ? (
          <View style={styles.completedContainer}>
            <Text style={styles.completedText}>Concluído</Text>
            <Text style={styles.checkIcon}> ✓</Text>
          </View>
        ) : locked ? (
          <Text style={styles.lockedText}>Bloqueado</Text>
        ) : (
          <Text style={styles.continueText}>Continuar</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const [modules, setModules] = useState<(Module & { progress: number; locked: boolean })[]>([]);
  const [streak, setStreak] = useState(0);
  const navigation = useNavigation();

  useEffect(() => {
    const mapped = MODULES.map((mod, index) => ({
      ...mod,
      progress: index === 0 ? 75 : index === 1 ? 30 : 0,
      locked: index > 2,
    }));
    setModules(mapped);
    setStreak(5);
  }, []);

  const handleCardPress = (moduleId: string) => {
    navigation.navigate('ModuleDetail', { moduleId });
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.streakContainer}>
        <Ionicons name="flame" size={24} color={Colors.streak} />
        <Text style={styles.streakText}>{streak} dias de ofensiva</Text>
      </View>

      <Text style={styles.title}>Módulos</Text>

      <FlatList
        data={modules}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CourseCard
            title={item.title}
            progress={item.progress}
            locked={item.locked}
            onPress={() => handleCardPress(item.id)}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.lg,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.base,
    gap: Spacing.sm,
  },
  streakText: {
    fontSize: FontSize.base,
    fontWeight: '600',
    color: Colors.streak,
  },
  title: {
    fontSize: FontSize.title,
    fontWeight: 'bold',
    color: Colors.accent,
    marginBottom: Spacing.lg,
  },
  cardContainer: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    borderWidth: 1.5,
    borderColor: '#6379F2',
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardLocked: {
    opacity: 0.5,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  titleText: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  percentageText: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: Colors.progressTrack,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.base,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.progressFill,
    borderRadius: BorderRadius.sm,
  },
  footer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueText: {
    fontSize: FontSize.base,
    fontWeight: 'bold',
    color: Colors.primaryDark,
  },
  lockedText: {
    fontSize: FontSize.base,
    color: Colors.textLight,
  },
  completedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  completedText: {
    fontSize: FontSize.base,
    fontWeight: 'bold',
    color: Colors.primaryDark,
  },
  checkIcon: {
    fontSize: FontSize.lg,
    fontWeight: 'bold',
    color: Colors.success,
    marginLeft: 6,
  },
});
