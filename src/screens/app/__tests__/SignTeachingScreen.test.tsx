import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import SignTeachingScreen from '../SignTeachingScreen';

jest.mock('react-native-vector-icons/Ionicons', () => 'Ionicons');

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
  useRoute: jest.fn(),
}));

describe('SignTeachingScreen', () => {
  const mockNavigate = jest.fn();
  const mockedUseNavigation = useNavigation as jest.MockedFunction<typeof useNavigation>;
  const mockedUseRoute = useRoute as jest.MockedFunction<typeof useRoute>;

  beforeEach(() => {
    mockNavigate.mockReset();
    mockedUseNavigation.mockReturnValue({ navigate: mockNavigate } as never);
    mockedUseRoute.mockReturnValue({
      params: {
        lessonId: 'les-1-1',
        moduleId: 'mod-1',
      },
    } as never);
  });

  it('renders the lesson introduction interface', () => {
    render(<SignTeachingScreen />);

    expect(screen.getAllByText('Olá').length).toBeGreaterThan(0);
    expect(screen.getByText('Como fazer o sinal')).toBeTruthy();
    expect(screen.getAllByText('Sinal de saudação com a mão aberta').length).toBeGreaterThan(0);
    expect(screen.getByText('Vocabulário da lição')).toBeTruthy();
    expect(screen.getByText('Continuar')).toBeTruthy();
  });

  it('navigates to Quiz with lesson questions when continuing', () => {
    render(<SignTeachingScreen />);

    fireEvent.press(screen.getByText('Continuar'));

    expect(mockNavigate).toHaveBeenCalledWith('Quiz', expect.objectContaining({
      lessonId: 'les-1-1',
      moduleId: 'mod-1',
      xpReward: 50,
      questions: expect.any(Array),
    }));
  });
});
