import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { auth } from '../../../services/firebase';
import { completeLessonProgress } from '../../../services/models/userProgress';
import LessonCompleteScreen from '../LessonCompleteScreen';

jest.mock('react-native-vector-icons/Ionicons', () => 'Ionicons');

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
  useRoute: jest.fn(),
}));

jest.mock('../../../services/firebase', () => ({
  auth: {
    currentUser: { uid: 'user-123' },
  },
}));

jest.mock('../../../services/models/userProgress', () => ({
  completeLessonProgress: jest.fn(),
}));

describe('LessonCompleteScreen', () => {
  const mockedUseNavigation = useNavigation as jest.MockedFunction<typeof useNavigation>;
  const mockedUseRoute = useRoute as jest.MockedFunction<typeof useRoute>;
  const mockedCompleteLessonProgress = completeLessonProgress as jest.MockedFunction<typeof completeLessonProgress>;

  beforeEach(() => {
    mockedUseNavigation.mockReturnValue({ navigate: jest.fn() } as never);
    mockedUseRoute.mockReturnValue({
      params: {
        lessonId: 'les-1-1',
        moduleId: 'mod-1',
        score: 100,
        xpEarned: 50,
      },
    } as never);
    mockedCompleteLessonProgress.mockResolvedValue({
      alreadyCompleted: false,
      unlockedModules: ['mod-1'],
      completedLessons: ['les-1-1'],
    } as never);
    auth.currentUser = { uid: 'user-123' } as never;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('persists lesson completion when the screen mounts', async () => {
    render(<LessonCompleteScreen />);

    await waitFor(() => {
      expect(mockedCompleteLessonProgress).toHaveBeenCalledWith({
        userId: 'user-123',
        lessonId: 'les-1-1',
        moduleId: 'mod-1',
        score: 100,
        xpEarned: 50,
      });
    });
  });
});
