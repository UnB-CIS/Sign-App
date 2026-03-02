import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { AuthScreenProps } from '../../@types/navigation';
import { signInWithEmail } from '../../services/models/user';
import { isUserAuthenticated } from '../../services/auth';
import { Colors, Spacing, FontSize, BorderRadius } from '../../theme';

export default function LoginScreen({ navigation }: AuthScreenProps<'Login'>) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert('Erro', 'Digite um email válido.');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmail(email, password);
      if (!isUserAuthenticated()) {
        Alert.alert('Erro no Login', 'Não foi possível realizar o login.');
      }
    } catch (error) {
      Alert.alert('Erro no Login', 'Email ou senha inválidos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Fazer Login</Text>
        <Text style={styles.subtitle}>Bem-vindo de volta!</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgotText}>Esqueci minha senha</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.textOnPrimary} />
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.linkText}>Ainda não possui uma conta? Fazer Cadastro</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.base,
    fontSize: FontSize.base,
    backgroundColor: Colors.background,
  },
  forgotText: {
    color: Colors.primary,
    fontSize: FontSize.sm,
    alignSelf: 'flex-end',
    marginBottom: Spacing.lg,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: {
    color: Colors.textOnPrimary,
    fontSize: FontSize.base,
    fontWeight: '600',
  },
  linkText: {
    color: Colors.primary,
    marginTop: Spacing.lg,
    fontSize: FontSize.md,
  },
});
