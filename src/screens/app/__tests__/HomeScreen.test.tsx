import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { auth } from '../../../services/firebase';
import { getCourseModulesOverview } from '../../../services/models/courseOverview';
import { getCurrentUserById } from '../../../services/models/user';
import HomeScreen from '../HomeScreen';

jest.mock('react-native-vector-icons/Ionicons', () => 'Ionicons');

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
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

describe('HomeScreen', () => {
  const mockedUseNavigation = useNavigation as jest.MockedFunction<typeof useNavigation>;
  const mockedUseFocusEffect = useFocusEffect as jest.MockedFunction<typeof useFocusEffect>;
  const mockedGetCourseModulesOverview = getCourseModulesOverview as jest.MockedFunction<typeof getCourseModulesOverview>;
  const mockedGetCurrentUserById = getCurrentUserById as jest.MockedFunction<typeof getCurrentUserById>;

  beforeEach(() => {
    mockedUseNavigation.mockReturnValue({ navigate: jest.fn() } as never);
    mockedUseFocusEffect.mockImplementation((callback) => {
      callback();
    });
    mockedGetCurrentUserById.mockResolvedValue({
      _id: 'user-123',
      username: 'maria',
      email: 'maria@example.com',
      streak: { current: 9, longest: 12 },
      xp: 120,
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

  it('renders the streak from Firestore', async () => {
    render(<HomeScreen />);

    await waitFor(() => {
      expect(mockedGetCurrentUserById).toHaveBeenCalledWith('user-123');
    });

    expect(screen.getByText('9 dias de ofensiva')).toBeTruthy();
    expect(screen.getByText('Saudações')).toBeTruthy();
    expect(screen.getByText('50%')).toBeTruthy();
  });
});
