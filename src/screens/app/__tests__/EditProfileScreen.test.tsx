import React from 'react';
import { Alert } from 'react-native';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../../../services/firebase';
import { getCurrentUserById, updateUserProfile } from '../../../services/models/user';
import EditProfileScreen from '../EditProfileScreen';
import { launchImageLibrary } from 'react-native-image-picker';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('../../../services/firebase', () => ({
  auth: {
    currentUser: { uid: 'user-123' },
  },
}));

jest.mock('../../../services/models/user', () => ({
  getCurrentUserById: jest.fn(),
  updateUserProfile: jest.fn(),
}));

jest.mock('../../../services/storage', () => ({
  validateImageAsset: jest.fn(),
}));

jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: jest.fn(),
}));

describe('EditProfileScreen', () => {
  const mockGoBack = jest.fn();
  const mockedUseNavigation = useNavigation as jest.MockedFunction<typeof useNavigation>;
  const mockedGetCurrentUserById = getCurrentUserById as jest.MockedFunction<typeof getCurrentUserById>;
  const mockedUpdateUserProfile = updateUserProfile as jest.MockedFunction<typeof updateUserProfile>;
  const mockedLaunchImageLibrary = launchImageLibrary as jest.MockedFunction<typeof launchImageLibrary>;

  beforeEach(() => {
    mockedUseNavigation.mockReturnValue({ goBack: mockGoBack } as never);
    mockedGetCurrentUserById.mockResolvedValue({
      _id: 'user-123',
      username: 'maria',
      email: 'maria@example.com',
      name: 'Maria',
      phone: '(61) 99999-9999',
      gender: 'Feminino',
      birth_date: '31/12/2000',
    });
    mockedUpdateUserProfile.mockResolvedValue(undefined);
    mockedLaunchImageLibrary.mockResolvedValue({ didCancel: true } as never);
    auth.currentUser = { uid: 'user-123' } as never;
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('loads the persisted profile fields into the form', async () => {
    render(<EditProfileScreen />);

    await waitFor(() => {
      expect(mockedGetCurrentUserById).toHaveBeenCalledWith('user-123');
    });

    expect(screen.getByDisplayValue('Maria')).toBeTruthy();
    expect(screen.getByDisplayValue('(61) 99999-9999')).toBeTruthy();
    expect(screen.getByText('Feminino')).toBeTruthy();
    expect(screen.getByDisplayValue('31/12/2000')).toBeTruthy();
  });

  it('saves all supported fields with trimmed values', async () => {
    render(<EditProfileScreen />);

    await waitFor(() => {
      expect(mockedGetCurrentUserById).toHaveBeenCalled();
    });

    fireEvent.changeText(screen.getByPlaceholderText('Seu nome'), '  Maria Silva  ');
    fireEvent.changeText(screen.getByPlaceholderText('(00) 00000-0000'), '61988887777');
    fireEvent.press(screen.getByText('Feminino'));
    fireEvent.press(screen.getByText('Outro'));
    fireEvent.changeText(screen.getByPlaceholderText('DD/MM/AAAA'), '01012001');
    fireEvent.press(screen.getByText('Salvar'));

    await waitFor(() => {
      expect(mockedUpdateUserProfile).toHaveBeenCalledWith('user-123', {
        name: 'Maria Silva',
        phone: '(61) 98888-7777',
        gender: 'Outro',
        birth_date: '01/01/2001',
      });
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      'Sucesso',
      'Perfil atualizado!',
      expect.any(Array),
    );
  });

  it('blocks save when the phone is invalid', async () => {
    render(<EditProfileScreen />);

    await waitFor(() => {
      expect(mockedGetCurrentUserById).toHaveBeenCalled();
    });

    fireEvent.changeText(screen.getByPlaceholderText('(00) 00000-0000'), '12345');
    fireEvent.press(screen.getByText('Salvar'));

    expect(Alert.alert).toHaveBeenCalledWith(
      'Erro',
      'Informe um telefone com 10 ou 11 dígitos.',
    );
    expect(mockedUpdateUserProfile).not.toHaveBeenCalled();
  });

  it('blocks save when the birth date is invalid', async () => {
    render(<EditProfileScreen />);

    await waitFor(() => {
      expect(mockedGetCurrentUserById).toHaveBeenCalled();
    });

    fireEvent.changeText(screen.getByPlaceholderText('DD/MM/AAAA'), '31022000');
    fireEvent.press(screen.getByText('Salvar'));

    expect(Alert.alert).toHaveBeenCalledWith(
      'Erro',
      'Informe a data de nascimento no formato DD/MM/AAAA.',
    );
    expect(mockedUpdateUserProfile).not.toHaveBeenCalled();
  });

  it('blocks save when there is no authenticated user', async () => {
    auth.currentUser = null;

    render(<EditProfileScreen />);

    fireEvent.press(screen.getByText('Salvar'));

    expect(Alert.alert).toHaveBeenCalledWith(
      'Erro',
      'Você precisa estar logado.',
    );
    expect(mockedUpdateUserProfile).not.toHaveBeenCalled();
  });

  it('formats phone and birth date while typing', async () => {
    render(<EditProfileScreen />);

    await waitFor(() => {
      expect(mockedGetCurrentUserById).toHaveBeenCalled();
    });

    fireEvent.changeText(screen.getByPlaceholderText('(00) 00000-0000'), '61988887777');
    fireEvent.changeText(screen.getByPlaceholderText('DD/MM/AAAA'), '01012001');

    expect(screen.getByDisplayValue('(61) 98888-7777')).toBeTruthy();
    expect(screen.getByDisplayValue('01/01/2001')).toBeTruthy();
  });

  it('uploads the selected avatar together with the profile data', async () => {
    mockedLaunchImageLibrary.mockResolvedValue({
      assets: [{
        uri: 'file:///avatar.jpg',
        fileName: 'avatar.jpg',
        type: 'image/jpeg',
        fileSize: 1024,
      }],
    } as never);

    render(<EditProfileScreen />);

    await waitFor(() => {
      expect(mockedGetCurrentUserById).toHaveBeenCalled();
    });

    fireEvent.press(screen.getByText('Escolher foto'));
    await waitFor(() => {
      expect(mockedLaunchImageLibrary).toHaveBeenCalled();
    });
    fireEvent.press(screen.getByText('Salvar'));

    await waitFor(() => {
      expect(mockedUpdateUserProfile).toHaveBeenCalledWith('user-123', expect.objectContaining({
        profileImage: expect.objectContaining({
          uri: 'file:///avatar.jpg',
          fileName: 'avatar.jpg',
        }),
      }));
    });
  });
});
