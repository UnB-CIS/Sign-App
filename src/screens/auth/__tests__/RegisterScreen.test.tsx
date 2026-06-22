import React from 'react';
import { Alert } from 'react-native';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { registerUserWithEmail } from '../../../services/models/user';
import RegisterScreen from '../RegisterScreen';

jest.mock('react-native-vector-icons/Ionicons', () => 'Ionicons');

jest.mock('../../../services/firebase', () => ({
  auth: {},
}));

jest.mock('firebase/auth', () => ({
  signOut: jest.fn(),
  sendEmailVerification: jest.fn(),
}));

jest.mock('../../../services/models/user', () => ({
  registerUserWithEmail: jest.fn(),
}));

describe('RegisterScreen', () => {
  const mockedRegister = registerUserWithEmail as jest.MockedFunction<typeof registerUserWithEmail>;
  const navigation = {
    navigate: jest.fn(),
  } as never;

  const preencherFormulario = (senha: string) => {
    fireEvent.changeText(screen.getByPlaceholderText('Nome'), 'Maria');
    fireEvent.changeText(screen.getByPlaceholderText('Email/Telefone'), 'maria@example.com');
    fireEvent.changeText(screen.getByPlaceholderText('Senha'), senha);
    fireEvent.press(screen.getByText(/Eu concordo com os/));
  };

  beforeEach(() => {
    mockedRegister.mockResolvedValue('user-123');
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('bloqueia o cadastro com senha fraca e mostra mensagens em pt-BR', async () => {
    render(<RegisterScreen navigation={navigation} route={{} as never} />);

    preencherFormulario('abc');
    fireEvent.press(screen.getByText('Criar Conta'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Senha inválida',
        expect.stringContaining('A senha deve ter no mínimo 8 caracteres.'),
      );
    });
    expect(mockedRegister).not.toHaveBeenCalled();
  });

  it('cria a conta e informa para verificar o e-mail quando a senha é forte', async () => {
    render(<RegisterScreen navigation={navigation} route={{} as never} />);

    preencherFormulario('SenhaForte@2024');
    fireEvent.press(screen.getByText('Criar Conta'));

    await waitFor(() => {
      expect(mockedRegister).toHaveBeenCalledTimes(1);
    });
    expect(Alert.alert).toHaveBeenCalledWith(
      'Conta criada',
      expect.stringContaining('e-mail de verificação'),
      expect.anything(),
    );
  });
});
