import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, HighContrastColors, ThemeColors } from '../theme/colors';

export type FontScale = 'normal' | 'grande' | 'maior';

// Multiplicador aplicado à tipografia conforme a preferência do usuário.
export const FONT_SCALE_FACTOR: Record<FontScale, number> = {
  normal: 1,
  grande: 1.2,
  maior: 1.4,
};

const FONT_SCALE_LABEL: Record<FontScale, string> = {
  normal: 'Normal',
  grande: 'Grande',
  maior: 'Maior',
};

const STORAGE_KEY_FONTE = '@App:acessibilidade:fontScale';
const STORAGE_KEY_CONTRASTE = '@App:acessibilidade:highContrast';

const ORDEM_FONTE: FontScale[] = ['normal', 'grande', 'maior'];

interface AccessibilityContextData {
  fontScale: FontScale;
  fontScaleFactor: number;
  fontScaleLabel: string;
  highContrast: boolean;
  isLoading: boolean;
  colors: ThemeColors;
  setFontScale(escala: FontScale): Promise<void>;
  cycleFontScale(): Promise<void>;
  setHighContrast(ativo: boolean): Promise<void>;
  toggleHighContrast(): Promise<void>;
}

const AccessibilityContext = createContext<AccessibilityContextData>(
  {} as AccessibilityContextData,
);

interface AccessibilityProviderProps {
  children: ReactNode;
}

export const AccessibilityProvider = ({ children }: AccessibilityProviderProps) => {
  const [fontScale, setFontScaleState] = useState<FontScale>('normal');
  const [highContrast, setHighContrastState] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function carregarPreferencias() {
      try {
        const [fonteSalva, contrasteSalvo] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY_FONTE),
          AsyncStorage.getItem(STORAGE_KEY_CONTRASTE),
        ]);
        if (fonteSalva && fonteSalva in FONT_SCALE_FACTOR) {
          setFontScaleState(fonteSalva as FontScale);
        }
        if (contrasteSalvo === 'true') {
          setHighContrastState(true);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    carregarPreferencias();
  }, []);

  const setFontScale = useCallback(async (escala: FontScale) => {
    setFontScaleState(escala);
    try {
      await AsyncStorage.setItem(STORAGE_KEY_FONTE, escala);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const cycleFontScale = useCallback(async () => {
    const indiceAtual = ORDEM_FONTE.indexOf(fontScale);
    const proxima = ORDEM_FONTE[(indiceAtual + 1) % ORDEM_FONTE.length];
    await setFontScale(proxima);
  }, [fontScale, setFontScale]);

  const setHighContrast = useCallback(async (ativo: boolean) => {
    setHighContrastState(ativo);
    try {
      await AsyncStorage.setItem(STORAGE_KEY_CONTRASTE, ativo ? 'true' : 'false');
    } catch (error) {
      console.error(error);
    }
  }, []);

  const toggleHighContrast = useCallback(async () => {
    await setHighContrast(!highContrast);
  }, [highContrast, setHighContrast]);

  const value = useMemo<AccessibilityContextData>(
    () => ({
      fontScale,
      fontScaleFactor: FONT_SCALE_FACTOR[fontScale],
      fontScaleLabel: FONT_SCALE_LABEL[fontScale],
      highContrast,
      isLoading,
      colors: highContrast ? HighContrastColors : Colors,
      setFontScale,
      cycleFontScale,
      setHighContrast,
      toggleHighContrast,
    }),
    [
      fontScale,
      highContrast,
      isLoading,
      setFontScale,
      cycleFontScale,
      setHighContrast,
      toggleHighContrast,
    ],
  );

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export function useAccessibility(): AccessibilityContextData {
  return useContext(AccessibilityContext);
}

// Retorna a paleta ativa conforme a preferência de contraste.
// Faz fallback para a paleta padrão fora do Provider.
export function useThemeColors(): ThemeColors {
  const ctx = useContext(AccessibilityContext);
  return ctx?.colors ?? Colors;
}

// Retorna o multiplicador de fonte ativo, com fallback seguro (1).
export function useFontScale(): number {
  const ctx = useContext(AccessibilityContext);
  return ctx?.fontScaleFactor ?? 1;
}

export default AccessibilityContext;
