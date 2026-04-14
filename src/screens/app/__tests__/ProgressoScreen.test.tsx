import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
import { useFocusEffect } from '@react-navigation/native';
import { auth } from '../../../services/firebase';
import { getCourseModulesOverview } from '../../../services/models/courseOverview';
import { getCurrentUserById } from '../../../services/models/user';
import ProgressoScreen from '../ProgressoScreen';

jest.mock('react-native-vector-icons/Ionicons', () => 'Ionicons');

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: jest.fn(),
}));

jest.mock('../../../services/firebase', () => ({
  auth: {
    currentUser: { uid: 'user-123' },
  },
}));

jest.mock('../../../services/models/user', () => ({
  getCurrentUserById: jest.fn(),
}));

jest.mock('../../../services/models/courseOverview', () => ({
  getCourseModulesOverview: jest.fn(),
}));

describe('ProgressoScreen', () => {
  const mockedUseFocusEffect = useFocusEffect as jest.MockedFunction<typeof useFocusEffect>;
  const mockedGetCourseModulesOverview = getCourseModulesOverview as jest.MockedFunction<typeof getCourseModulesOverview>;
  const mockedGetCurrentUserById = getCurrentUserById as jest.MockedFunction<typeof getCurrentUserById>;

  beforeEach(() => {
    mockedUseFocusEffect.mockImplementation((callback) => {
      callback();
    });
    mockedGetCurrentUserById.mockResolvedValue({
      _id: 'user-123',
      username: 'maria',
      email: 'maria@example.com',
      streak: { current: 11, longest: 15 },
      xp: 450,
    });
    mockedGetCourseModulesOverview.mockResolvedValue([
      {
        id: 'mod-1',
        title: 'Saudações',
        description: 'Aprenda saudações.',
        objective: 'Cumprimentar pessoas.',
        iconName: 'hand-wave',
        order: 1,
        totalLessons: 2,
        completedLessons: 1,
        progress: 50,
        locked: false,
      },
    ]);
    auth.currentUser = { uid: 'user-123' } as never;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders xp and streak from Firestore', async () => {
    render(<ProgressoScreen />);

    await waitFor(() => {
      expect(mockedGetCurrentUserById).toHaveBeenCalledWith('user-123');
    });

    expect(screen.getByText('450')).toBeTruthy();
    expect(screen.getByText('11 dias')).toBeTruthy();
    expect(screen.getByText('Saudações')).toBeTruthy();
    expect(screen.getByText('1/2 lições')).toBeTruthy();
  });
});
