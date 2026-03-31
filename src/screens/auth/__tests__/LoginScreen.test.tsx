import React from 'react';
import { Alert } from 'react-native';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { signInWithEmail } from '../../../services/models/user';
import { isUserAuthenticated } from '../../../services/auth';
import LoginScreen from '../LoginScreen';

jest.mock('react-native-vector-icons/Ionicons', () => 'Ionicons');

jest.mock('../../../services/models/user', () => ({
  signInWithEmail: jest.fn(),
}));

jest.mock('../../../services/auth', () => ({
  isUserAuthenticated: jest.fn(),
}));

describe('LoginScreen', () => {
  const mockedSignInWithEmail = signInWithEmail as jest.MockedFunction<typeof signInWithEmail>;
  const mockedIsUserAuthenticated = isUserAuthenticated as jest.MockedFunction<typeof isUserAuthenticated>;
  const navigation = {
    navigate: jest.fn(),
  } as never;

  beforeEach(() => {
    mockedSignInWithEmail.mockResolvedValue({
      authUser: { uid: 'user-123' } as never,
      profile: null,
    });
    mockedIsUserAuthenticated.mockReturnValue(true);
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('shows invalid credentials only for auth credential errors', async () => {
    mockedSignInWithEmail.mockRejectedValue({ code: 'auth/invalid-credential' });

    render(<LoginScreen navigation={navigation} route={{} as never} />);

    fireEvent.changeText(screen.getByPlaceholderText('Email'), 'maria@example.com');
    fireEvent.changeText(screen.getByPlaceholderText('Senha'), 'senhaerrada');
    fireEvent.press(screen.getByText('Log In'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Erro no Login', 'Email ou senha inválidos.');
    });
  });

  it('shows a generic login error for non-auth failures', async () => {
    mockedSignInWithEmail.mockRejectedValue(new Error('Missing or insufficient permissions.'));

    render(<LoginScreen navigation={navigation} route={{} as never} />);

    fireEvent.changeText(screen.getByPlaceholderText('Email'), 'maria@example.com');
    fireEvent.changeText(screen.getByPlaceholderText('Senha'), 'password123');
    fireEvent.press(screen.getByText('Log In'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Erro no Login',
        'Não foi possível realizar o login. Tente novamente.',
      );
    });
  });
});
