import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { MODULES } from '../../data/modules';
import { Colors, Spacing, FontSize, BorderRadius } from '../../theme';
import type { AppStackScreenProps } from '../../@types/navigation';

export default function SignTeachingScreen() {
  const route = useRoute<AppStackScreenProps<'SignTeaching'>['route']>();
  const navigation = useNavigation();
  const { lessonId, moduleId } = route.params;
  const [isPlaying, setIsPlaying] = useState(false);

  const mod = MODULES.find((m) => m.id === moduleId);
  const lesson = mod?.lessons.find((l) => l.id === lessonId);

  if (!lesson) {
    return (
      <View style={styles.container}>
        <Text>Lição não encontrada.</Text>
      </View>
    );
  }

  const currentVocab = lesson.vocabulary[0];

  const handleContinue = () => {
    const hasVideoQuestion = lesson.activities.some((a) =>
      a.questions.some((q) => q.type === 'video_record')
    );

    if (hasVideoQuestion) {
      const videoQ = lesson.activities
        .flatMap((a) => a.questions)
        .find((q) => q.type === 'video_record');
      if (videoQ) {
        navigation.navigate('SignRecording', { lessonId, questionId: videoQ.id });
        return;
      }
    }

    navigation.navigate('LessonComplete', {
      lessonId,
      moduleId,
      score: 85,
      xpEarned: lesson.xpReward,
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{currentVocab?.word}</Text>

      <View style={styles.videoArea}>
        <TouchableOpacity
          style={styles.playButton}
          onPress={() => setIsPlaying(!isPlaying)}
        >
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={48}
            color={Colors.textOnPrimary}
          />
        </TouchableOpacity>
        <Text style={styles.videoLabel}>
          {isPlaying ? 'Reproduzindo...' : 'Toque para reproduzir'}
        </Text>
      </View>

      <View style={styles.descriptionBox}>
        <Text style={styles.descriptionTitle}>Como fazer o sinal</Text>
        <Text style={styles.descriptionText}>{currentVocab?.translation}</Text>
      </View>

      {lesson.vocabulary.length > 1 && (
        <View style={styles.vocabSection}>
          <Text style={styles.sectionTitle}>Vocabulário da lição</Text>
          {lesson.vocabulary.map((v) => (
            <View key={v.id} style={styles.vocabItem}>
              <Text style={styles.vocabWord}>{v.word}</Text>
              <Text style={styles.vocabTranslation}>{v.translation}</Text>
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueText}>Continuar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.lg,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  videoArea: {
    width: '100%',
    height: 250,
    backgroundColor: '#1A1A2E',
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  videoLabel: {
    color: '#ccc',
    fontSize: FontSize.sm,
  },
  descriptionBox: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.xl,
  },
  descriptionTitle: {
    fontSize: FontSize.base,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  descriptionText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  vocabSection: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  vocabItem: {
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  vocabWord: {
    fontSize: FontSize.base,
    fontWeight: '600',
    color: Colors.primary,
  },
  vocabTranslation: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  continueButton: {
    width: '100%',
    height: 50,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueText: {
    color: Colors.textOnPrimary,
    fontSize: FontSize.base,
    fontWeight: '600',
  },
});
