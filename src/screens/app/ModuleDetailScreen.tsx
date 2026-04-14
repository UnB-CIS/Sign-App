import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { MODULES } from '../../data/modules';
import { Colors, Spacing, FontSize, BorderRadius } from '../../theme';
import type { AppStackScreenProps } from '../../@types/navigation';
import { auth } from '../../services/firebase';
import { getModuleLessonProgress } from '../../services/models/userProgress';

export default function ModuleDetailScreen() {
  const route = useRoute<AppStackScreenProps<'ModuleDetail'>['route']>();
  const navigation = useNavigation();
  const { moduleId } = route.params;
  const [lessonStatus, setLessonStatus] = useState<Record<string, { completed: boolean; locked: boolean }>>({});

  const mod = MODULES.find((m) => m.id === moduleId);

  useFocusEffect(
    useCallback(() => {
      const uid = auth.currentUser?.uid;

      if (!uid) {
        setLessonStatus({});
        return;
      }

      getModuleLessonProgress(uid, moduleId)
        .then((items) => {
          setLessonStatus(
            Object.fromEntries(items.map((item) => [item.lessonId, { completed: item.completed, locked: item.locked }]))
          );
        })
        .catch((error) => {
          console.error(error);
          setLessonStatus({});
        });
    }, [moduleId])
  );

  if (!mod) {
    return (
      <View style={styles.container}>
        <Text>Módulo não encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{mod.title}</Text>
      <Text style={styles.description}>{mod.description}</Text>

      <View style={styles.objectiveBox}>
        <Ionicons name="flag" size={18} color={Colors.primary} />
        <Text style={styles.objectiveText}>Objetivo: {mod.objective}</Text>
      </View>

      <Text style={styles.sectionTitle}>Lições</Text>

      <FlatList
        data={mod.lessons}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={[styles.lessonCard, lessonStatus[item.id]?.locked && styles.lessonCardLocked]}
            disabled={lessonStatus[item.id]?.locked}
            onPress={() =>
              navigation.navigate('SignTeaching', { lessonId: item.id, moduleId: mod.id })
            }
          >
            <View style={styles.lessonNumber}>
              <Text style={styles.lessonNumberText}>{index + 1}</Text>
            </View>
            <View style={styles.lessonInfo}>
              <Text style={styles.lessonTitle}>{item.title}</Text>
              <Text style={styles.lessonDesc}>{item.description}</Text>
              <Text style={styles.xpText}>{item.xpReward} XP</Text>
            </View>
            {lessonStatus[item.id]?.completed ? (
              <Ionicons name="checkmark-circle" size={22} color={Colors.success} />
            ) : lessonStatus[item.id]?.locked ? (
              <Ionicons name="lock-closed" size={20} color={Colors.textLight} />
            ) : (
              <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
            )}
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.lg,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  description: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginBottom: Spacing.base,
  },
  objectiveBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  objectiveText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  lessonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.base,
    marginBottom: Spacing.md,
  },
  lessonCardLocked: {
    opacity: 0.5,
  },
  lessonNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  lessonNumberText: {
    color: Colors.textOnPrimary,
    fontWeight: 'bold',
    fontSize: FontSize.md,
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: FontSize.base,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  lessonDesc: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  xpText: {
    fontSize: FontSize.xs,
    color: Colors.success,
    fontWeight: '600',
  },
});
