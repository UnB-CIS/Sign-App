import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

type QuizParams = {
  Quiz: {
    lessonId: string;
    moduleId: string;
    questions: {
      id: string;
      prompt: string;
      options?: string[];
      correctAnswer?: string;
      type: string;
    }[];
  };
};

export default function QuizScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<QuizParams, 'Quiz'>>();
  const { questions, lessonId, moduleId } = route.params;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);

  const question = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;
  const isCorrect = selectedOption === question?.correctAnswer;

  const handleSelect = (option: string) => {
    if (answered) return;
    setSelectedOption(option);
    setAnswered(true);
    if (option === question.correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (isLast) {
      const correctAnswers = score;
      const finalScore = Math.round((correctAnswers / questions.length) * 100);
      navigation.navigate('LessonComplete' as never, {
        lessonId,
        moduleId,
        score: finalScore,
        xpEarned: correctAnswers * 20,
      } as never);
      return;
    }
    setCurrentIndex((prev) => prev + 1);
    setSelectedOption(null);
    setAnswered(false);
  };

  if (!question) return null;

  const getOptionStyle = (option: string) => {
    if (!answered) {
      return option === selectedOption ? styles.optionSelected : styles.option;
    }
    if (option === question.correctAnswer) return styles.optionCorrect;
    if (option === selectedOption && !isCorrect) return styles.optionWrong;
    return styles.option;
  };

  const getOptionTextStyle = (option: string) => {
    if (!answered) {
      return option === selectedOption ? styles.optionTextSelected : styles.optionText;
    }
    if (option === question.correctAnswer) return styles.optionTextCorrect;
    if (option === selectedOption && !isCorrect) return styles.optionTextWrong;
    return styles.optionText;
  };

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

        {question.options?.map((option) => (
          <TouchableOpacity
            key={option}
            style={getOptionStyle(option)}
            onPress={() => handleSelect(option)}
            activeOpacity={0.7}
          >
            <Text style={getOptionTextStyle(option)}>{option}</Text>
          </TouchableOpacity>
        ))}

        {answered && (
          <View style={styles.feedbackContainer}>
            <Text style={[styles.feedbackText, isCorrect ? styles.correctText : styles.wrongText]}>
              {isCorrect ? 'Correto!' : `Incorreto. Resposta: ${question.correctAnswer}`}
            </Text>
          </View>
        )}
      </ScrollView>

      {answered && (
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {isLast ? 'Ver Resultado' : 'Próxima'}
          </Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#F0F2F5',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2D4CC8',
    borderRadius: 3,
  },
  counter: {
    textAlign: 'center',
    color: '#7A869A',
    fontSize: 14,
    marginTop: 8,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  prompt: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 24,
    lineHeight: 28,
  },
  option: {
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  optionSelected: {
    borderWidth: 1.5,
    borderColor: '#2D4CC8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#EEF1FF',
  },
  optionCorrect: {
    borderWidth: 1.5,
    borderColor: '#00C853',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#E8F5E9',
  },
  optionWrong: {
    borderWidth: 1.5,
    borderColor: '#FF3B30',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#FFEBEE',
  },
  optionText: {
    fontSize: 16,
    color: '#1A1A1A',
  },
  optionTextSelected: {
    fontSize: 16,
    color: '#2D4CC8',
    fontWeight: '500',
  },
  optionTextCorrect: {
    fontSize: 16,
    color: '#00C853',
    fontWeight: '500',
  },
  optionTextWrong: {
    fontSize: 16,
    color: '#FF3B30',
    fontWeight: '500',
  },
  feedbackContainer: {
    marginTop: 8,
    padding: 12,
    borderRadius: 8,
  },
  feedbackText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  correctText: {
    color: '#00C853',
  },
  wrongText: {
    color: '#FF3B30',
  },
  nextButton: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: '#2D4CC8',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
