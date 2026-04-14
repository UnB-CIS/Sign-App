import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { auth } from '../../../services/firebase';
import { getModuleLessonProgress } from '../../../services/models/userProgress';
import ModuleDetailScreen from '../ModuleDetailScreen';

jest.mock('react-native-vector-icons/Ionicons', () => 'Ionicons');

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: jest.fn(),
  useNavigation: jest.fn(),
  useRoute: jest.fn(),
}));

jest.mock('../../../services/firebase', () => ({
  auth: {
    currentUser: { uid: 'user-123' },
  },
}));

jest.mock('../../../services/models/userProgress', () => ({
  getModuleLessonProgress: jest.fn(),
}));

describe('ModuleDetailScreen', () => {
  const mockedUseFocusEffect = useFocusEffect as jest.MockedFunction<typeof useFocusEffect>;
  const mockedUseNavigation = useNavigation as jest.MockedFunction<typeof useNavigation>;
  const mockedUseRoute = useRoute as jest.MockedFunction<typeof useRoute>;
  const mockedGetModuleLessonProgress = getModuleLessonProgress as jest.MockedFunction<typeof getModuleLessonProgress>;

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    mockedUseNavigation.mockReturnValue({ navigate: jest.fn() } as never);
    mockedUseRoute.mockReturnValue({
      params: {
        moduleId: 'mod-1',
      },
    } as never);
    mockedUseFocusEffect.mockImplementation((callback) => {
      callback();
    });
    mockedGetModuleLessonProgress.mockResolvedValue([
      { lessonId: 'les-1-1', completed: true, locked: false },
      { lessonId: 'les-1-2', completed: false, locked: true },
    ] as never);
    auth.currentUser = { uid: 'user-123' } as never;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the module interface and lesson metadata', async () => {
    render(<ModuleDetailScreen />);

    await waitFor(() => {
      expect(mockedGetModuleLessonProgress).toHaveBeenCalledWith('user-123', 'mod-1');
    });

    expect(screen.getByText('Saudações')).toBeTruthy();
    expect(screen.getByText('Objetivo: Comunicar cumprimentos e apresentações simples.')).toBeTruthy();
    expect(screen.getByText('Olá e Tchau')).toBeTruthy();
    expect(screen.getByText('Apresentações Pessoais')).toBeTruthy();
    expect(screen.getByText('50 XP')).toBeTruthy();
    expect(screen.getByText('60 XP')).toBeTruthy();
  });
});
