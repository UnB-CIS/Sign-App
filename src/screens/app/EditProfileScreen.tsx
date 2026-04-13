import React, { useEffect, useState } from 'react';
import {
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../../services/firebase';
import { getCurrentUserById, updateUserProfile } from '../../services/models/user';
import { Colors, Spacing, FontSize, BorderRadius } from '../../theme';
import { launchImageLibrary } from 'react-native-image-picker';
import { UploadableImage, validateImageAsset } from '../../services/storage';

const BIRTH_DATE_REGEX = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
const GENDER_OPTIONS = ['Masculino', 'Feminino', 'Outro'] as const;

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11);

  if (!digits) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function formatBirthDate(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 8);

  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;

  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

function isValidBirthDate(value: string) {
  if (!BIRTH_DATE_REGEX.test(value)) return false;

  const [day, month, year] = value.split('/').map(Number);
  const date = new Date(year, month - 1, day);
  const now = new Date();

  return (
    date.getFullYear() === year
    && date.getMonth() === month - 1
    && date.getDate() === day
    && year >= 1900
    && date <= now
  );
}

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [isGenderSelectOpen, setIsGenderSelectOpen] = useState(false);
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const [profileImage, setProfileImage] = useState<UploadableImage | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (uid) {
      getCurrentUserById(uid).then((profile) => {
        if (profile) {
          setName(profile.name || '');
          setPhone(formatPhone(profile.phone || ''));
          setGender(profile.gender || '');
          setBirthDate(formatBirthDate(profile.birth_date || ''));
          setProfilePictureUrl(profile.profilePictureUrl || '');
        }
      }).catch(console.error);
    }
  }, []);

  const handleChooseAvatar = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
      includeBase64: false,
    });

    if (result.didCancel) {
      return;
    }

    if (result.errorMessage) {
      Alert.alert('Erro', 'Não foi possível selecionar a imagem.');
      return;
    }

    const asset = result.assets?.[0];
    if (!asset?.uri) {
      Alert.alert('Erro', 'Selecione uma imagem válida.');
      return;
    }

    try {
      const nextImage: UploadableImage = {
        uri: asset.uri,
        fileName: asset.fileName,
        type: asset.type,
        fileSize: asset.fileSize,
      };
      validateImageAsset(nextImage);
      setProfileImage(nextImage);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Não foi possível selecionar a imagem.';
      Alert.alert('Erro', message);
    }
  };

  const handleSave = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      Alert.alert('Erro', 'Você precisa estar logado.');
      return;
    }

    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    const trimmedGender = gender.trim();
    const trimmedBirthDate = birthDate.trim();

    if (!trimmedName) {
      Alert.alert('Erro', 'Preencha seu nome completo.');
      return;
    }

    if (trimmedPhone) {
      const digits = trimmedPhone.replace(/\D/g, '');
      if (digits.length < 10 || digits.length > 11) {
        Alert.alert('Erro', 'Informe um telefone com 10 ou 11 dígitos.');
        return;
      }
    }

    if (trimmedGender && trimmedGender.length < 2) {
      Alert.alert('Erro', 'Informe um gênero válido.');
      return;
    }

    if (trimmedBirthDate && !isValidBirthDate(trimmedBirthDate)) {
      Alert.alert('Erro', 'Informe a data de nascimento no formato DD/MM/AAAA.');
      return;
    }

    setLoading(true);
    try {
      await updateUserProfile(uid, {
        name: trimmedName,
        phone: trimmedPhone,
        gender: trimmedGender,
        birth_date: trimmedBirthDate,
        ...(profileImage ? { profileImage } : {}),
      });
      Alert.alert('Sucesso', 'Perfil atualizado!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Não foi possível atualizar o perfil.';
      Alert.alert('Erro', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.avatarSection}>
          <View style={styles.avatarPreview}>
            {profileImage?.uri || profilePictureUrl ? (
              <Image
                source={{ uri: profileImage?.uri || profilePictureUrl }}
                style={styles.avatarImage}
              />
            ) : (
              <Text style={styles.avatarInitial}>
                {(name.trim().charAt(0) || 'U').toUpperCase()}
              </Text>
            )}
          </View>
          <TouchableOpacity style={styles.avatarButton} onPress={handleChooseAvatar}>
            <Text style={styles.avatarButtonText}>Escolher foto</Text>
          </TouchableOpacity>
          <Text style={styles.avatarHint}>PNG, JPG ou WEBP com ate 5 MB</Text>
        </View>

        <Text style={styles.label}>Nome completo</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Seu nome"
          autoCapitalize="words"
        />

        <Text style={styles.label}>Telefone</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={(value) => setPhone(formatPhone(value))}
          placeholder="(00) 00000-0000"
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Gênero</Text>
        <TouchableOpacity
          style={[styles.input, styles.selectInput, isGenderSelectOpen && styles.selectInputOpen]}
          onPress={() => setIsGenderSelectOpen((current) => !current)}
          activeOpacity={0.8}
        >
          <Text style={gender ? styles.selectValue : styles.selectPlaceholder}>
            {gender || 'Selecione uma opção'}
          </Text>
          <Text style={styles.selectChevron}>{isGenderSelectOpen ? '▲' : '▼'}</Text>
        </TouchableOpacity>
        {isGenderSelectOpen ? (
          <View style={styles.selectMenu}>
            {GENDER_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.selectOption,
                  gender === option && styles.selectOptionSelected,
                ]}
                onPress={() => {
                  setGender(option);
                  setIsGenderSelectOpen(false);
                }}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.selectOptionText,
                    gender === option && styles.selectOptionTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}

        <Text style={styles.label}>Data de Nascimento</Text>
        <TextInput
          style={styles.input}
          value={birthDate}
          onChangeText={(value) => setBirthDate(formatBirthDate(value))}
          placeholder="DD/MM/AAAA"
          keyboardType="numeric"
          maxLength={10}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.textOnPrimary} />
          ) : (
            <Text style={styles.buttonText}>Salvar</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  content: {
    padding: Spacing.lg,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  avatarPreview: {
    width: 108,
    height: 108,
    borderRadius: 54,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarInitial: {
    fontSize: FontSize.xxl,
    fontWeight: '700',
    color: Colors.primary,
  },
  avatarButton: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  avatarButtonText: {
    color: Colors.primary,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  avatarHint: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
  },
  label: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    fontWeight: '600',
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
  selectInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectInputOpen: {
    borderColor: Colors.borderAccent,
  },
  selectValue: {
    color: Colors.text,
    fontSize: FontSize.base,
  },
  selectPlaceholder: {
    color: Colors.textSecondary,
    fontSize: FontSize.base,
  },
  selectChevron: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
  },
  selectMenu: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.card,
    marginTop: -Spacing.xs,
    marginBottom: Spacing.base,
    overflow: 'hidden',
  },
  selectOption: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  selectOptionSelected: {
    backgroundColor: Colors.surface,
  },
  selectOptionText: {
    color: Colors.text,
    fontSize: FontSize.base,
  },
  selectOptionTextSelected: {
    color: Colors.accent,
    fontWeight: '600',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: {
    color: Colors.textOnPrimary,
    fontSize: FontSize.base,
    fontWeight: '600',
  },
});
