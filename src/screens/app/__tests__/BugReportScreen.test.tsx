import React from 'react';
import { Alert } from 'react-native';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../../../services/firebase';
import { createBugReport } from '../../../services/models/bugReports';
import { launchImageLibrary } from 'react-native-image-picker';
import BugReportScreen from '../BugReportScreen';

jest.mock('react-native-vector-icons/Ionicons', () => 'Ionicons');

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('../../../services/firebase', () => ({
  auth: {
    currentUser: { uid: 'user-123' },
  },
}));

jest.mock('../../../services/models/bugReports', () => ({
  createBugReport: jest.fn(),
}));

jest.mock('../../../services/storage', () => ({
  MAX_BUG_REPORT_IMAGES: 3,
  validateBugReportImages: jest.fn(),
}));

jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: jest.fn(),
}));

describe('BugReportScreen', () => {
  const mockGoBack = jest.fn();
  const mockedUseNavigation = useNavigation as jest.MockedFunction<typeof useNavigation>;
  const mockedCreateBugReport = createBugReport as jest.MockedFunction<typeof createBugReport>;
  const mockedLaunchImageLibrary = launchImageLibrary as jest.MockedFunction<typeof launchImageLibrary>;

  beforeEach(() => {
    mockedUseNavigation.mockReturnValue({ goBack: mockGoBack } as never);
    mockedCreateBugReport.mockResolvedValue('bug-123');
    mockedLaunchImageLibrary.mockResolvedValue({ didCancel: true } as never);
    auth.currentUser = { uid: 'user-123' } as never;
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('selects an image and submits the bug report with uploaded assets', async () => {
    mockedLaunchImageLibrary.mockResolvedValue({
      assets: [{
        uri: 'file:///bug-1.jpg',
        fileName: 'bug-1.jpg',
        type: 'image/jpeg',
        fileSize: 1024,
      }],
    } as never);

    render(<BugReportScreen />);

    fireEvent.press(screen.getByText('Interface (UI)'));
    fireEvent.changeText(screen.getByPlaceholderText('Descreva o problema encontrado...'), 'Botão desalinhado');
    fireEvent.press(screen.getByText('Adicionar imagem'));
    await waitFor(() => {
      expect(mockedLaunchImageLibrary).toHaveBeenCalled();
    });
    fireEvent.press(screen.getByText('Enviar Report'));

    await waitFor(() => {
      expect(mockedCreateBugReport).toHaveBeenCalledWith({
        userId: 'user-123',
        type: 'ui',
        description: 'Botão desalinhado',
        images: [expect.objectContaining({ uri: 'file:///bug-1.jpg' })],
      });
    });
  });

  it('blocks submission when the user is not authenticated', () => {
    auth.currentUser = null;

    render(<BugReportScreen />);

    fireEvent.press(screen.getByText('Interface (UI)'));
    fireEvent.changeText(screen.getByPlaceholderText('Descreva o problema encontrado...'), 'Botão desalinhado');
    fireEvent.press(screen.getByText('Enviar Report'));

    expect(Alert.alert).toHaveBeenCalledWith('Erro', 'Você precisa estar logado.');
    expect(mockedCreateBugReport).not.toHaveBeenCalled();
  });
});
