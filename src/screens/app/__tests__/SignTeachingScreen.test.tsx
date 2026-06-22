import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getLessonContent } from '../../../services/models/courseContent';
import SignTeachingScreen from '../SignTeachingScreen';

jest.mock('react-native-vector-icons/Ionicons', () => 'Ionicons');

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
  useRoute: jest.fn(),
}));

jest.mock('../../../services/models/courseContent', () => ({
  getLessonContent: jest.fn(),
}));

describe('SignTeachingScreen', () => {
  const mockNavigate = jest.fn();
  const mockedUseNavigation = useNavigation as jest.MockedFunction<typeof useNavigation>;
  const mockedUseRoute = useRoute as jest.MockedFunction<typeof useRoute>;
  const mockedGetLessonContent = getLessonContent as jest.MockedFunction<typeof getLessonContent>;

  beforeEach(() => {
    mockNavigate.mockReset();
    mockedUseNavigation.mockReturnValue({ navigate: mockNavigate } as never);
    mockedUseRoute.mockReturnValue({
      params: {
        lessonId: 'les-1-1',
        moduleId: 'mod-1',
      },
    } as never);
    mockedGetLessonContent.mockResolvedValue({
      id: 'les-1-1',
      title: 'Olá e Tchau',
      description: 'Sinais para cumprimentar.',
      order: 1,
      xpReward: 50,
      vocabulary: [
        { id: 'v-1-1-1', word: 'Olá', translation: 'Sinal de saudação com a mão aberta' },
        { id: 'v-1-1-2', word: 'Tchau', translation: 'Sinal de despedida acenando a mão' },
      ],
      expressions: ['Olá, tudo bem?'],
      questions: [
        {
          id: 'q-1-1-1',
          type: 'multiple_choice',
          prompt: 'Qual é o sinal de "Olá" em Libras?',
          options: ['Mão aberta acenando', 'Punho fechado'],
          correctAnswer: 'Mão aberta acenando',
        },
      ],
    } as never);
  });

  it('renders the lesson introduction interface', async () => {
    render(<SignTeachingScreen />);

    await waitFor(() => {
      expect(screen.getAllByText('Olá').length).toBeGreaterThan(0);
    });
    expect(screen.getByText('Como fazer o sinal')).toBeTruthy();
    expect(screen.getAllByText('Sinal de saudação com a mão aberta').length).toBeGreaterThan(0);
    expect(screen.getByText('Vocabulário da lição')).toBeTruthy();
    expect(screen.getByText('Continuar')).toBeTruthy();
  });

  it('navigates to Quiz with lesson questions when continuing', async () => {
    render(<SignTeachingScreen />);

    await waitFor(() => {
      expect(screen.getByText('Continuar')).toBeTruthy();
    });
    fireEvent.press(screen.getByText('Continuar'));

    expect(mockNavigate).toHaveBeenCalledWith('Quiz', expect.objectContaining({
      lessonId: 'les-1-1',
      moduleId: 'mod-1',
      xpReward: 50,
      questions: expect.any(Array),
    }));
  });
});
