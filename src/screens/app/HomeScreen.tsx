import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Spacing, FontSize, BorderRadius } from '../../theme';
import { ThemeColors } from '../../theme/colors';
import { useThemeColors, useFontScale } from '../../contexts/AccessibilityContext';
import { auth } from '../../services/firebase';
import { getCurrentUserById } from '../../services/models/user';
import { getCourseModulesOverview, ModuleOverview } from '../../services/models/courseOverview';

interface CourseCardProps {
  title: string;
  progress: number;
  locked: boolean;
  onPress: () => void;
  colors: ThemeColors;
  fontScale: number;
}

function CourseCard({ title, progress, locked, onPress, colors, fontScale }: CourseCardProps) {
  const isCompleted = progress >= 100;
  const styles = useStyles(colors, fontScale);

  const estado = locked
    ? 'Bloqueado'
    : isCompleted
    ? 'Concluído'
    : `${progress}% concluído`;

  return (
    <TouchableOpacity
      style={[styles.cardContainer, locked && styles.cardLocked]}
      activeOpacity={locked ? 1 : 0.7}
      onPress={locked ? undefined : onPress}
      accessibilityRole="button"
      accessibilityLabel={`Módulo ${title}, ${estado}`}
      accessibilityHint={locked ? 'Módulo bloqueado' : 'Toque para abrir o módulo'}
      accessibilityState={{ disabled: locked }}
    >
      <View style={styles.headerRow}>
        <Text style={styles.titleText}>{title}</Text>
        {locked ? (
          <Ionicons name="lock-closed" size={18} color={colors.textLight} />
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
  const colors = useThemeColors();
  const fontScale = useFontScale();
  const styles = useStyles(colors, fontScale);
  const [modules, setModules] = useState<ModuleOverview[]>([]);
  const [streak, setStreak] = useState(0);
  const navigation = useNavigation();

  useEffect(() => {
    setModules([]);
  }, []);

  useFocusEffect(
    useCallback(() => {
      const uid = auth.currentUser?.uid;

      if (!uid) {
        setStreak(0);
        setModules([]);
        return;
      }

      getCourseModulesOverview(uid)
        .then(setModules)
        .catch((error) => {
          console.error(error);
          setModules([]);
        });

      getCurrentUserById(uid)
        .then((profile) => {
          setStreak(profile?.streak?.current ?? 0);
        })
        .catch((error) => {
          console.error(error);
          setStreak(0);
        });
    }, [])
  );

  const handleCardPress = (moduleId: string) => {
    navigation.navigate('ModuleDetail', { moduleId });
  };

  return (
    <View style={styles.screenContainer}>
      <View
        style={styles.streakContainer}
        accessibilityRole="text"
        accessibilityLabel={`${streak} dias de ofensiva`}
      >
        <Ionicons name="flame" size={24} color={colors.streak} />
        <Text style={styles.streakText}>{streak} dias de ofensiva</Text>
      </View>

      <Text style={styles.title} accessibilityRole="header">
        Módulos
      </Text>

      <FlatList
        data={modules}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CourseCard
            title={item.title}
            progress={item.progress}
            locked={item.locked}
            onPress={() => handleCardPress(item.id)}
            colors={colors}
            fontScale={fontScale}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

function useStyles(colors: ThemeColors, fontScale: number) {
  return useMemo(
    () =>
      StyleSheet.create({
        screenContainer: {
          flex: 1,
          backgroundColor: colors.background,
          padding: Spacing.lg,
        },
        streakContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: Spacing.base,
          gap: Spacing.sm,
        },
        streakText: {
          fontSize: FontSize.base * fontScale,
          fontWeight: '600',
          color: colors.streak,
        },
        title: {
          fontSize: FontSize.title * fontScale,
          fontWeight: 'bold',
          color: colors.accent,
          marginBottom: Spacing.lg,
        },
        cardContainer: {
          backgroundColor: colors.card,
          borderRadius: BorderRadius.xl,
          borderWidth: 1.5,
          borderColor: colors.borderAccent,
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
          fontSize: FontSize.base * fontScale,
          color: colors.textSecondary,
          fontWeight: '500',
        },
        percentageText: {
          fontSize: FontSize.base * fontScale,
          color: colors.textSecondary,
          fontWeight: '500',
        },
        progressBarTrack: {
          height: 8,
          backgroundColor: colors.progressTrack,
          borderRadius: BorderRadius.sm,
          marginBottom: Spacing.base,
          overflow: 'hidden',
        },
        progressBarFill: {
          height: '100%',
          backgroundColor: colors.progressFill,
          borderRadius: BorderRadius.sm,
        },
        footer: {
          alignItems: 'center',
          justifyContent: 'center',
        },
        continueText: {
          fontSize: FontSize.base * fontScale,
          fontWeight: 'bold',
          color: colors.primaryDark,
        },
        lockedText: {
          fontSize: FontSize.base * fontScale,
          color: colors.textLight,
        },
        completedContainer: {
          flexDirection: 'row',
          alignItems: 'center',
        },
        completedText: {
          fontSize: FontSize.base * fontScale,
          fontWeight: 'bold',
          color: colors.primaryDark,
        },
        checkIcon: {
          fontSize: FontSize.lg * fontScale,
          fontWeight: 'bold',
          color: colors.success,
          marginLeft: 6,
        },
      }),
    [colors, fontScale],
  );
}
