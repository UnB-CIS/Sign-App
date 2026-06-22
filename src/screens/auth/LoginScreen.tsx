import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { AuthScreenProps } from '../../@types/navigation';
import { signInWithEmail } from '../../services/models/user';
import { isUserAuthenticated } from '../../services/auth';
import { Spacing, FontSize, BorderRadius } from '../../theme';
import { ThemeColors } from '../../theme/colors';
import { useThemeColors, useFontScale } from '../../contexts/AccessibilityContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

function getLoginErrorMessage(error: unknown) {
  const code =
    typeof error === 'object' && error !== null && 'code' in error
      ? String((error as { code?: string }).code)
      : '';

  if (
    code === 'auth/invalid-credential'
    || code === 'auth/wrong-password'
    || code === 'auth/user-not-found'
    || code === 'auth/invalid-email'
  ) {
    return 'Email ou senha inválidos.';
  }

  return 'Não foi possível realizar o login. Tente novamente.';
}

export default function LoginScreen({ navigation }: AuthScreenProps<'Login'>) {
  const colors = useThemeColors();
  const fontScale = useFontScale();
  const styles = useStyles(colors, fontScale);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmail(email, password);
      if (!isUserAuthenticated()) {
        Alert.alert('Erro no Login', 'Não foi possível realizar o login.');
      }
    } catch (error) {
      Alert.alert('Erro no Login', getLoginErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <Text style={styles.title} accessibilityRole="header">
            Login
          </Text>

          {/* Social buttons */}
          <View style={styles.socialRow}>
            <TouchableOpacity
              style={styles.socialButton}
              accessibilityRole="button"
              accessibilityLabel="Entrar com Facebook"
            >
              <Ionicons name="logo-facebook" size={22} color="#1877F2" />
              <Text style={styles.socialText}>Facebook</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialButton}
              accessibilityRole="button"
              accessibilityLabel="Entrar com Google"
            >
              <Ionicons name="logo-google" size={22} color="#EA4335" />
              <Text style={styles.socialText}>Google</Text>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Ou</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Email */}
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={colors.textSecondary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            accessibilityLabel="Email"
            accessibilityHint="Digite seu endereço de email"
          />

          {/* Password */}
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Senha"
              placeholderTextColor={colors.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              accessibilityLabel="Senha"
              accessibilityHint="Digite sua senha"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
              accessibilityRole="button"
              accessibilityLabel={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              <Ionicons
                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                size={22}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {/* Forgot password */}
          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.forgotRow}
            accessibilityRole="button"
            accessibilityLabel="Esqueceu a senha?"
          >
            <Text style={styles.forgotText}>Esqueceu a senha?</Text>
          </TouchableOpacity>

          {/* Login button */}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel="Entrar"
            accessibilityState={{ disabled: loading, busy: loading }}
          >
            {loading ? (
              <ActivityIndicator color={colors.textOnPrimary} />
            ) : (
              <Text style={styles.buttonText}>Log In</Text>
            )}
          </TouchableOpacity>

          {/* Register link */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
            accessibilityRole="button"
            accessibilityLabel="Não tem uma conta? Cadastre-se"
          >
            <Text style={styles.registerText}>
              Não tem uma conta?{' '}
              <Text style={styles.registerLink}>Cadastre-se</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function useStyles(colors: ThemeColors, fontScale: number) {
  return useMemo(
    () =>
      StyleSheet.create({
        flex: { flex: 1, backgroundColor: colors.background },
        scroll: { flexGrow: 1 },
        container: {
          flex: 1,
          paddingHorizontal: Spacing.xl,
          paddingTop: Spacing.xxxl + Spacing.xl,
          paddingBottom: Spacing.xxl,
        },
        title: {
          fontSize: FontSize.title * fontScale,
          fontWeight: 'bold',
          color: colors.accent,
          marginBottom: 80,
        },
        socialRow: {
          flexDirection: 'row',
          gap: Spacing.md,
          marginBottom: Spacing.xl,
        },
        socialButton: {
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: Spacing.sm,
          backgroundColor: colors.surface,
          paddingVertical: Spacing.md,
          borderRadius: BorderRadius.lg,
        },
        socialText: {
          fontSize: FontSize.base * fontScale,
          color: colors.text,
          fontWeight: '500',
        },
        divider: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: Spacing.xl,
        },
        dividerLine: {
          flex: 1,
          height: 1,
          backgroundColor: colors.border,
        },
        dividerText: {
          marginHorizontal: Spacing.md,
          color: colors.textSecondary,
          fontSize: FontSize.base * fontScale,
        },
        input: {
          backgroundColor: colors.surface,
          borderRadius: BorderRadius.lg,
          paddingHorizontal: Spacing.base,
          paddingVertical: Spacing.md,
          fontSize: FontSize.base * fontScale,
          color: colors.text,
          marginBottom: Spacing.md,
          height: 56,
        },
        passwordContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.surface,
          borderRadius: BorderRadius.lg,
          height: 56,
          paddingHorizontal: Spacing.base,
        },
        passwordInput: {
          flex: 1,
          fontSize: FontSize.base * fontScale,
          color: colors.text,
        },
        eyeIcon: {
          padding: Spacing.xs,
        },
        forgotRow: {
          alignSelf: 'flex-end',
          marginTop: Spacing.sm,
          marginBottom: Spacing.xl,
        },
        forgotText: {
          fontSize: FontSize.sm * fontScale,
          color: colors.textSecondary,
        },
        button: {
          backgroundColor: colors.accent,
          borderRadius: 14,
          height: 60,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: Spacing.xl,
        },
        buttonDisabled: { opacity: 0.7 },
        buttonText: {
          color: colors.textOnPrimary,
          fontSize: FontSize.base * fontScale,
          fontWeight: '700',
        },
        registerText: {
          textAlign: 'center',
          fontSize: FontSize.base * fontScale,
          color: colors.text,
        },
        registerLink: {
          color: colors.accent,
          fontWeight: '600',
        },
      }),
    [colors, fontScale],
  );
}
