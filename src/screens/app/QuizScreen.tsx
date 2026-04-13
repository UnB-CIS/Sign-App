import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Colors, Spacing, FontSize, BorderRadius } from '../../theme';

type QuizQuestion = {
  id: string;
  prompt: string;
  options?: string[];
  correctAnswer?: string;
  type: string;
  url_video?: string;
  url_videos?: string[];
  targetWord?: string;
  instruction?: string;
};

type QuizParams = {
  Quiz: {
    lessonId: string;
    moduleId: string;
    xpReward: number;
    questions: QuizQuestion[];
  };
};

type RecordingState = 'idle' | 'recording' | 'recorded';

function VideoPlaceholder({
  label,
  subtitle,
}: {
  label: string;
  subtitle?: string;
}) {
  return (
    <View style={styles.videoCard}>
      <Ionicons name="play-circle" size={42} color={Colors.textOnPrimary} />
      <Text style={styles.videoCardLabel}>{label}</Text>
      {subtitle ? <Text style={styles.videoCardSubtitle}>{subtitle}</Text> : null}
    </View>
  );
}

export default function QuizScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<QuizParams, 'Quiz'>>();
  const { questions, lessonId, moduleId, xpReward } = route.params;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');

  const question = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;
  const isCorrect = selectedOption === question?.correctAnswer;
  const hasVideoOptions = question?.type === 'multiple_choice_video';
  const isRecordingQuestion = question?.type === 'video_record';

  const resetStepState = () => {
    setSelectedOption(null);
    setAnswered(false);
    setRecordingState('idle');
  };

  const handleSelect = (option: string) => {
    if (answered || isRecordingQuestion) return;

    setSelectedOption(option);
    setAnswered(true);

    if (option === question.correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleStartRecording = () => {
    if (!isRecordingQuestion) return;
    setRecordingState('recording');
    setTimeout(() => {
      setRecordingState('recorded');
      setAnswered(true);
    }, 1200);
  };

  const handleRetryRecording = () => {
    setRecordingState('idle');
    setAnswered(false);
  };

  const handleNext = () => {
    const nextScore = isRecordingQuestion && answered ? score + 1 : score;

    if (isLast) {
      const finalScore = Math.round((nextScore / questions.length) * 100);
      const xpEarned = Math.round((nextScore / questions.length) * xpReward);

      navigation.navigate('LessonComplete' as never, {
        lessonId,
        moduleId,
        score: finalScore,
        xpEarned,
      } as never);
      return;
    }

    if (isRecordingQuestion && answered) {
      setScore(nextScore);
    }

    setCurrentIndex((prev) => prev + 1);
    resetStepState();
  };

  if (!question) return null;

  const optionStyle = (option: string) => {
    if (!answered) {
      return option === selectedOption ? styles.optionSelected : styles.option;
    }
    if (option === question.correctAnswer) return styles.optionCorrect;
    if (option === selectedOption && !isCorrect) return styles.optionWrong;
    return styles.option;
  };

  const optionTextStyle = (option: string) => {
    if (!answered) {
      return option === selectedOption ? styles.optionTextSelected : styles.optionText;
    }
    if (option === question.correctAnswer) return styles.optionTextCorrect;
    if (option === selectedOption && !isCorrect) return styles.optionTextWrong;
    return styles.optionText;
  };

  const renderChoiceQuestion = () => (
    <>
      {question.url_video ? (
        <VideoPlaceholder
          label="Vídeo do sinal"
          subtitle={question.targetWord ? `Sinal alvo: ${question.targetWord}` : question.url_video}
        />
      ) : null}

      {question.targetWord && !question.url_video ? (
        <View style={styles.wordCard}>
          <Text style={styles.wordCardLabel}>Palavra</Text>
          <Text style={styles.wordCardValue}>{question.targetWord}</Text>
        </View>
      ) : null}

      {hasVideoOptions ? (
        <View style={styles.videoOptionsGrid}>
          {question.url_videos?.map((videoUrl, index) => (
            <TouchableOpacity
              key={videoUrl}
              style={optionStyle(videoUrl)}
              onPress={() => handleSelect(videoUrl)}
              activeOpacity={0.8}
            >
              <VideoPlaceholder
                label={`Opção ${String.fromCharCode(65 + index)}`}
                subtitle={videoUrl}
              />
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        question.options?.map((option) => (
          <TouchableOpacity
            key={option}
            style={optionStyle(option)}
            onPress={() => handleSelect(option)}
            activeOpacity={0.8}
          >
            <Text style={optionTextStyle(option)}>{option}</Text>
          </TouchableOpacity>
        ))
      )}

      {answered ? (
        <View style={styles.feedbackContainer}>
          <Text style={[styles.feedbackText, isCorrect ? styles.correctText : styles.wrongText]}>
            {isCorrect ? 'Correto!' : `Incorreto. Resposta: ${question.correctAnswer}`}
          </Text>
        </View>
      ) : null}
    </>
  );

  const renderRecordingQuestion = () => (
    <>
      {question.url_video ? (
        <VideoPlaceholder
          label="Vídeo de referência"
          subtitle={question.targetWord ? `Repita o sinal de ${question.targetWord}` : question.url_video}
        />
      ) : null}

      {question.targetWord ? (
        <View style={styles.wordCard}>
          <Text style={styles.wordCardLabel}>Palavra-alvo</Text>
          <Text style={styles.wordCardValue}>{question.targetWord}</Text>
        </View>
      ) : null}

      <View style={styles.recordingCard}>
        <Ionicons
          name={
            recordingState === 'recording'
              ? 'radio-button-on'
              : recordingState === 'recorded'
                ? 'checkmark-circle'
                : 'videocam'
          }
          size={44}
          color={
            recordingState === 'recording'
              ? Colors.error
              : recordingState === 'recorded'
                ? Colors.success
                : Colors.primary
          }
        />
        <Text style={styles.recordingTitle}>
          {recordingState === 'idle'
            ? 'Pronto para gravar'
            : recordingState === 'recording'
              ? 'Gravando sua resposta...'
              : 'Gravação concluída'}
        </Text>
        <Text style={styles.recordingDescription}>
          {question.instruction || 'Grave sua repetição do sinal e confirme quando terminar.'}
        </Text>

        {recordingState === 'idle' ? (
          <TouchableOpacity style={styles.inlinePrimaryButton} onPress={handleStartRecording}>
            <Text style={styles.inlinePrimaryButtonText}>Iniciar Gravação</Text>
          </TouchableOpacity>
        ) : null}

        {recordingState === 'recorded' ? (
          <TouchableOpacity style={styles.inlineSecondaryButton} onPress={handleRetryRecording}>
            <Text style={styles.inlineSecondaryButtonText}>Gravar Novamente</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {answered ? (
        <View style={styles.feedbackContainer}>
          <Text style={[styles.feedbackText, styles.correctText]}>
            Resposta registrada com sucesso.
          </Text>
        </View>
      ) : null}
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${((currentIndex + 1) / questions.length) * 100}%` },
          ]}
        />
      </View>

      <Text style={styles.counter}>
        {currentIndex + 1} / {questions.length}
      </Text>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.prompt}>{question.prompt}</Text>
        {isRecordingQuestion ? renderRecordingQuestion() : renderChoiceQuestion()}
      </ScrollView>

      {answered ? (
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {isLast ? 'Ver Resultado' : 'Próxima'}
          </Text>
        </TouchableOpacity>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.progressTrack,
    marginHorizontal: Spacing.base,
    marginTop: Spacing.sm,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.progressFill,
    borderRadius: BorderRadius.sm,
  },
  counter: {
    textAlign: 'center',
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    marginTop: Spacing.sm,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: 120,
  },
  prompt: {
    fontSize: FontSize.xl,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.lg,
    lineHeight: 30,
  },
  wordCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  wordCardLabel: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    marginBottom: Spacing.xs,
  },
  wordCardValue: {
    color: Colors.text,
    fontSize: FontSize.xl,
    fontWeight: '700',
  },
  videoCard: {
    backgroundColor: '#1A1A2E',
    borderRadius: BorderRadius.lg,
    minHeight: 180,
    padding: Spacing.base,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  videoCardLabel: {
    color: Colors.textOnPrimary,
    fontSize: FontSize.base,
    fontWeight: '600',
  },
  videoCardSubtitle: {
    color: '#C9D1E5',
    fontSize: FontSize.xs,
    textAlign: 'center',
  },
  videoOptionsGrid: {
    gap: Spacing.base,
  },
  option: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.base,
    backgroundColor: Colors.card,
  },
  optionSelected: {
    borderWidth: 1.5,
    borderColor: Colors.borderAccent,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.base,
    backgroundColor: '#EEF1FF',
  },
  optionCorrect: {
    borderWidth: 1.5,
    borderColor: Colors.success,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.base,
    backgroundColor: '#E8F5E9',
  },
  optionWrong: {
    borderWidth: 1.5,
    borderColor: Colors.error,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.base,
    backgroundColor: '#FFEBEE',
  },
  optionText: {
    fontSize: FontSize.base,
    color: Colors.text,
  },
  optionTextSelected: {
    fontSize: FontSize.base,
    color: Colors.primaryDark,
    fontWeight: '500',
  },
  optionTextCorrect: {
    fontSize: FontSize.base,
    color: Colors.success,
    fontWeight: '500',
  },
  optionTextWrong: {
    fontSize: FontSize.base,
    color: Colors.error,
    fontWeight: '500',
  },
  recordingCard: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.card,
    padding: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  recordingTitle: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.text,
  },
  recordingDescription: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  inlinePrimaryButton: {
    marginTop: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  inlinePrimaryButtonText: {
    color: Colors.textOnPrimary,
    fontWeight: '600',
    fontSize: FontSize.base,
  },
  inlineSecondaryButton: {
    marginTop: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  inlineSecondaryButtonText: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: FontSize.base,
  },
  feedbackContainer: {
    marginTop: Spacing.sm,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  feedbackText: {
    fontSize: FontSize.base,
    fontWeight: '600',
    textAlign: 'center',
  },
  correctText: {
    color: Colors.success,
  },
  wrongText: {
    color: Colors.error,
  },
  nextButton: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: Colors.primaryDark,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    alignItems: 'center',
  },
  nextButtonText: {
    color: Colors.textOnPrimary,
    fontSize: FontSize.base,
    fontWeight: '600',
  },
});
