import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import QuizScreen from '../QuizScreen';

jest.mock('react-native-vector-icons/Ionicons', () => 'Ionicons');

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
  useRoute: jest.fn(),
}));

describe('QuizScreen', () => {
  const mockNavigate = jest.fn();
  const mockedUseNavigation = useNavigation as jest.MockedFunction<typeof useNavigation>;
  const mockedUseRoute = useRoute as jest.MockedFunction<typeof useRoute>;

  beforeEach(() => {
    jest.useFakeTimers();
    mockedUseNavigation.mockReturnValue({ navigate: mockNavigate } as never);
    mockNavigate.mockReset();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders video plus text alternatives', () => {
    mockedUseRoute.mockReturnValue({
      params: {
        lessonId: 'les-1-1',
        moduleId: 'mod-1',
        xpReward: 50,
        questions: [
          {
            id: 'q1',
            type: 'multiple_choice',
            prompt: 'Assista ao vídeo e escolha a palavra.',
            url_video: 'https://example.com/videos/ola.mp4',
            targetWord: 'Olá',
            options: ['Olá', 'Tchau', 'Boa noite', 'Bom dia'],
            correctAnswer: 'Olá',
          },
        ],
      },
    } as never);

    render(<QuizScreen />);

    expect(screen.getByText('Vídeo do sinal')).toBeTruthy();
    expect(screen.getByText('Sinal alvo: Olá')).toBeTruthy();
    expect(screen.getByText('Tchau')).toBeTruthy();
  });

  it('renders word plus four video options', () => {
    mockedUseRoute.mockReturnValue({
      params: {
        lessonId: 'les-1-2',
        moduleId: 'mod-1',
        xpReward: 60,
        questions: [
          {
            id: 'q2',
            type: 'multiple_choice_video',
            prompt: 'Escolha o vídeo correto.',
            targetWord: 'Prazer',
            url_videos: ['a.mp4', 'b.mp4', 'c.mp4', 'd.mp4'],
            correctAnswer: 'b.mp4',
          },
        ],
      },
    } as never);

    render(<QuizScreen />);

    expect(screen.getByText('Palavra')).toBeTruthy();
    expect(screen.getByText('Prazer')).toBeTruthy();
    expect(screen.getByText('Opção A')).toBeTruthy();
    expect(screen.getByText('Opção D')).toBeTruthy();
  });

  it('renders video guided recording template', () => {
    mockedUseRoute.mockReturnValue({
      params: {
        lessonId: 'les-1-1',
        moduleId: 'mod-1',
        xpReward: 50,
        questions: [
          {
            id: 'q3',
            type: 'video_record',
            prompt: 'Repita o sinal.',
            targetWord: 'Tchau',
            url_video: 'https://example.com/videos/tchau.mp4',
            instruction: 'Observe o vídeo e depois grave.',
          },
        ],
      },
    } as never);

    render(<QuizScreen />);

    expect(screen.getByText('Vídeo de referência')).toBeTruthy();
    expect(screen.getByText('Repita o sinal de Tchau')).toBeTruthy();
    expect(screen.getByText('Iniciar Gravação')).toBeTruthy();
  });

  it('renders word based recording template and finishes the lesson flow', async () => {
    mockedUseRoute.mockReturnValue({
      params: {
        lessonId: 'les-1-2',
        moduleId: 'mod-1',
        xpReward: 60,
        questions: [
          {
            id: 'q4',
            type: 'video_record',
            prompt: 'Grave o sinal da palavra.',
            targetWord: 'Meu nome',
            instruction: 'Faça o sinal sem apoio visual.',
          },
        ],
      },
    } as never);

    render(<QuizScreen />);

    expect(screen.getByText('Palavra-alvo')).toBeTruthy();
    expect(screen.getByText('Meu nome')).toBeTruthy();

    fireEvent.press(screen.getByText('Iniciar Gravação'));
    act(() => {
      jest.advanceTimersByTime(1200);
    });

    await waitFor(() => {
      expect(screen.getByText('Ver Resultado')).toBeTruthy();
    });

    fireEvent.press(screen.getByText('Ver Resultado'));

    expect(mockNavigate).toHaveBeenCalledWith('LessonComplete', {
      lessonId: 'les-1-2',
      moduleId: 'mod-1',
      score: 100,
      xpEarned: 60,
    });
  });
});
