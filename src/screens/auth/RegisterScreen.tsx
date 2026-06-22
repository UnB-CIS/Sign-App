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
import { registerUserWithEmail } from '../../services/models/user';
import { validatePasswordStrength, PasswordStrength } from '../../services/auth';
import { Colors, Spacing, FontSize, BorderRadius } from '../../theme';
import { ThemeColors } from '../../theme/colors';
import { useThemeColors, useFontScale } from '../../contexts/AccessibilityContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

const FORCA_CONFIG: Record<PasswordStrength, { rotulo: string; cor: string; preenchimento: number }> = {
  fraca: { rotulo: 'Fraca', cor: Colors.error, preenchimento: 0.33 },
  media: { rotulo: 'Média', cor: Colors.warning, preenchimento: 0.66 },
  forte: { rotulo: 'Forte', cor: Colors.success, preenchimento: 1 },
};

export default function RegisterScreen({ navigation }: AuthScreenProps<'Register'>) {
  const colors = useThemeColors();
  const fontScale = useFontScale();
  const styles = useStyles(colors, fontScale);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const validacaoSenha = validatePasswordStrength(password);
  const forcaConfig = FORCA_CONFIG[validacaoSenha.forca];

  const handleRegister = async () => {
    if (!name.trim()) {
      Alert.alert('Erro', 'Preencha seu nome.');
      return;
    }
    if (!email.trim()) {
      Alert.alert('Erro', 'Preencha seu email.');
      return;
    }
    const resultadoSenha = validatePasswordStrength(password);
    if (!resultadoSenha.valido) {
      Alert.alert('Senha inválida', resultadoSenha.erros.join('\n'));
      return;
    }
    if (!acceptedTerms) {
      Alert.alert('Erro', 'Você precisa aceitar os termos de uso.');
      return;
    }

    setLoading(true);
    try {
      await registerUserWithEmail({
        email,
        password,
        username: email.split('@')[0],
        name: name.trim(),
      });
      Alert.alert(
        'Conta criada',
        'Enviamos um e-mail de verificação para você. Confira sua caixa de entrada e verifique o e-mail antes de entrar.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }],
      );
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Não foi possível criar a conta.';
      Alert.alert('Erro no Cadastro', msg);
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
            Cadastro
          </Text>

          {/* Social buttons */}
          <View style={styles.socialRow}>
            <TouchableOpacity
              style={styles.socialButton}
              accessibilityRole="button"
              accessibilityLabel="Cadastrar com Facebook"
            >
              <Ionicons name="logo-facebook" size={22} color="#1877F2" />
              <Text style={styles.socialText}>Facebook</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialButton}
              accessibilityRole="button"
              accessibilityLabel="Cadastrar com Google"
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

          {/* Form */}
          <TextInput
            style={styles.input}
            placeholder="Nome"
            placeholderTextColor={colors.textSecondary}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            accessibilityLabel="Nome"
            accessibilityHint="Digite seu nome completo"
          />
          <TextInput
            style={styles.input}
            placeholder="Email/Telefone"
            placeholderTextColor={colors.textSecondary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            accessibilityLabel="Email ou telefone"
            accessibilityHint="Digite seu email ou telefone"
          />
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Senha"
              placeholderTextColor={colors.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              accessibilityLabel="Senha"
              accessibilityHint="Crie uma senha forte"
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

          {/* Indicador de força da senha */}
          {password.length > 0 && (
            <View style={styles.strengthContainer}>
              <View style={styles.strengthBarTrack}>
                <View
                  style={[
                    styles.strengthBarFill,
                    { width: `${forcaConfig.preenchimento * 100}%`, backgroundColor: forcaConfig.cor },
                  ]}
                />
              </View>
              <Text style={[styles.strengthLabel, { color: forcaConfig.cor }]}>
                Força: {forcaConfig.rotulo}
              </Text>
              {validacaoSenha.erros.length > 0 && (
                <View style={styles.strengthHints}>
                  {validacaoSenha.erros.map((erro) => (
                    <Text key={erro} style={styles.strengthHint}>
                      • {erro}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          )}

          {/* Terms checkbox */}
          <TouchableOpacity
            style={styles.termsRow}
            onPress={() => setAcceptedTerms(!acceptedTerms)}
            activeOpacity={0.7}
            accessibilityRole="checkbox"
            accessibilityLabel="Eu concordo com os Termos de Serviço e Política de Privacidade"
            accessibilityState={{ checked: acceptedTerms }}
          >
            <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
              {acceptedTerms && <Ionicons name="checkmark" size={14} color={colors.textOnPrimary} />}
            </View>
            <Text style={styles.termsText}>
              Eu concordo com os{' '}
              <Text style={styles.termsLink}>Termos de Serviço</Text>
              {' '}e{' '}
              <Text style={styles.termsLink}>Politica de Privacidade</Text>
            </Text>
          </TouchableOpacity>

          {/* Submit button */}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel="Criar Conta"
            accessibilityState={{ disabled: loading, busy: loading }}
          >
            {loading ? (
              <ActivityIndicator color={colors.textOnPrimary} />
            ) : (
              <Text style={styles.buttonText}>Criar Conta</Text>
            )}
          </TouchableOpacity>

          {/* Login link */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            accessibilityRole="button"
            accessibilityLabel="Já tem uma conta? Entrar"
          >
            <Text style={styles.loginText}>
              Já tem uma conta?{' '}
              <Text style={styles.loginLink}>Entrar</Text>
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
          marginBottom: Spacing.xxxl,
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
          marginBottom: Spacing.base,
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
        strengthContainer: {
          marginBottom: Spacing.base,
        },
        strengthBarTrack: {
          height: 6,
          borderRadius: BorderRadius.round,
          backgroundColor: colors.progressTrack,
          overflow: 'hidden',
        },
        strengthBarFill: {
          height: '100%',
          borderRadius: BorderRadius.round,
        },
        strengthLabel: {
          marginTop: Spacing.xs,
          fontSize: FontSize.sm * fontScale,
          fontWeight: '600',
        },
        strengthHints: {
          marginTop: Spacing.xs,
          gap: 2,
        },
        strengthHint: {
          fontSize: FontSize.sm * fontScale,
          color: colors.textSecondary,
          lineHeight: 18 * fontScale,
        },
        termsRow: {
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: Spacing.md,
          marginBottom: Spacing.xl,
        },
        checkbox: {
          width: 22,
          height: 22,
          borderRadius: BorderRadius.sm,
          borderWidth: 1.5,
          borderColor: colors.border,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 2,
          flexShrink: 0,
        },
        checkboxChecked: {
          backgroundColor: colors.accent,
          borderColor: colors.accent,
        },
        termsText: {
          flex: 1,
          fontSize: FontSize.sm * fontScale,
          color: colors.text,
          lineHeight: 20 * fontScale,
        },
        termsLink: {
          color: colors.accent,
          fontWeight: '500',
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
        loginText: {
          textAlign: 'left',
          fontSize: FontSize.base * fontScale,
          color: colors.text,
        },
        loginLink: {
          color: colors.accent,
          fontWeight: '600',
        },
      }),
    [colors, fontScale],
  );
}
