import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { auth } from '../../../services/firebase';
import { getModuleLessonProgress } from '../../../services/models/userProgress';
import { getModuleDetail } from '../../../services/models/courseContent';
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

jest.mock('../../../services/models/courseContent', () => ({
  getModuleDetail: jest.fn(),
}));

describe('ModuleDetailScreen', () => {
  const mockedUseFocusEffect = useFocusEffect as jest.MockedFunction<typeof useFocusEffect>;
  const mockedUseNavigation = useNavigation as jest.MockedFunction<typeof useNavigation>;
  const mockedUseRoute = useRoute as jest.MockedFunction<typeof useRoute>;
  const mockedGetModuleLessonProgress = getModuleLessonProgress as jest.MockedFunction<typeof getModuleLessonProgress>;
  const mockedGetModuleDetail = getModuleDetail as jest.MockedFunction<typeof getModuleDetail>;

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
    mockedGetModuleDetail.mockResolvedValue({
      id: 'mod-1',
      title: 'Saudações',
      description: 'Aprenda os sinais básicos de saudações em Libras.',
      objective: 'Comunicar cumprimentos e apresentações simples.',
      iconName: 'hand-wave',
      order: 1,
      lessons: [
        { id: 'les-1-1', title: 'Olá e Tchau', description: 'Sinais para cumprimentar.', order: 1, xpReward: 50 },
        { id: 'les-1-2', title: 'Apresentações Pessoais', description: 'Aprenda a se apresentar.', order: 2, xpReward: 60 },
      ],
    } as never);
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
