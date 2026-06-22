import React from 'react';
import { Text } from 'react-native';
import { act, render, screen, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AccessibilityProvider,
  useAccessibility,
} from '../AccessibilityContext';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

const mockedAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

let controle: ReturnType<typeof useAccessibility>;

function Sonda() {
  controle = useAccessibility();
  return (
    <Text>
      {controle.fontScaleLabel}-{controle.highContrast ? 'alto' : 'normal'}
    </Text>
  );
}

function renderizar() {
  return render(
    <AccessibilityProvider>
      <Sonda />
    </AccessibilityProvider>,
  );
}

describe('AccessibilityContext', () => {
  beforeEach(() => {
    mockedAsyncStorage.getItem.mockResolvedValue(null);
    mockedAsyncStorage.setItem.mockResolvedValue();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('usa os valores padrão quando não há nada persistido', async () => {
    renderizar();

    await waitFor(() => {
      expect(screen.getByText('Normal-normal')).toBeTruthy();
    });
    expect(controle.fontScaleFactor).toBe(1);
  });

  it('persiste a escolha de alto contraste', async () => {
    renderizar();
    await waitFor(() => expect(controle).toBeDefined());

    await act(async () => {
      await controle.setHighContrast(true);
    });

    expect(mockedAsyncStorage.setItem).toHaveBeenCalledWith(
      '@App:acessibilidade:highContrast',
      'true',
    );
    expect(controle.highContrast).toBe(true);
  });

  it('cicla o tamanho da fonte e persiste', async () => {
    renderizar();
    await waitFor(() => expect(controle).toBeDefined());

    await act(async () => {
      await controle.cycleFontScale();
    });

    expect(controle.fontScale).toBe('grande');
    expect(controle.fontScaleFactor).toBeGreaterThan(1);
    expect(mockedAsyncStorage.setItem).toHaveBeenCalledWith(
      '@App:acessibilidade:fontScale',
      'grande',
    );
  });

  it('carrega preferências previamente persistidas', async () => {
    mockedAsyncStorage.getItem.mockImplementation(async (chave: string) => {
      if (chave === '@App:acessibilidade:fontScale') return 'maior';
      if (chave === '@App:acessibilidade:highContrast') return 'true';
      return null;
    });

    renderizar();

    await waitFor(() => {
      expect(screen.getByText('Maior-alto')).toBeTruthy();
    });
    expect(controle.colors.background).toBeTruthy();
  });
});
