import React, { useState } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { auth } from '../../services/firebase';
import { createBugReport, BugType } from '../../services/models/bugReports';
import { Colors, Spacing, FontSize, BorderRadius } from '../../theme';

const BUG_TYPES: { label: string; value: BugType }[] = [
  { label: 'Interface (UI)', value: 'ui' },
  { label: 'Funcional', value: 'funcional' },
  { label: 'Desempenho', value: 'desempenho' },
  { label: 'Conteúdo', value: 'conteudo' },
  { label: 'Outro', value: 'outro' },
];

export default function BugReportScreen() {
  const navigation = useNavigation();
  const [bugType, setBugType] = useState<BugType | null>(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageCount, setImageCount] = useState(0);

  const handleSubmit = async () => {
    if (!bugType) {
      Alert.alert('Erro', 'Selecione o tipo de bug.');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Erro', 'Descreva o problema encontrado.');
      return;
    }

    const uid = auth.currentUser?.uid;
    if (!uid) {
      Alert.alert('Erro', 'Você precisa estar logado.');
      return;
    }

    setLoading(true);
    try {
      await createBugReport({
        userId: uid,
        type: bugType,
        description: description.trim(),
      });
      Alert.alert('Sucesso', 'Bug reportado! Obrigado pelo feedback.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível enviar o report.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddImage = () => {
    if (imageCount >= 3) {
      Alert.alert('Limite', 'Máximo de 3 imagens.');
      return;
    }
    setImageCount(imageCount + 1);
    Alert.alert('Em breve', 'Funcionalidade de anexo em desenvolvimento.');
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.sectionTitle}>Tipo de Bug</Text>
        <View style={styles.typeGrid}>
          {BUG_TYPES.map((type) => (
            <TouchableOpacity
              key={type.value}
              style={[styles.typeChip, bugType === type.value && styles.typeChipActive]}
              onPress={() => setBugType(type.value)}
            >
              <Text
                style={[styles.typeChipText, bugType === type.value && styles.typeChipTextActive]}
              >
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Descrição</Text>
        <TextInput
          style={styles.textArea}
          value={description}
          onChangeText={setDescription}
          placeholder="Descreva o problema encontrado..."
          multiline
          numberOfLines={6}
          textAlignVertical="top"
        />

        <Text style={styles.sectionTitle}>Imagens ({imageCount}/3)</Text>
        <TouchableOpacity style={styles.imageButton} onPress={handleAddImage}>
          <Ionicons name="camera-outline" size={24} color={Colors.primary} />
          <Text style={styles.imageButtonText}>Adicionar imagem</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.textOnPrimary} />
          ) : (
            <Text style={styles.submitText}>Enviar Report</Text>
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
  sectionTitle: {
    fontSize: FontSize.base,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  typeChip: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  typeChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  typeChipText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  typeChipTextActive: {
    color: Colors.textOnPrimary,
    fontWeight: '600',
  },
  textArea: {
    width: '100%',
    minHeight: 120,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.xl,
    fontSize: FontSize.base,
    backgroundColor: Colors.background,
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    borderRadius: BorderRadius.md,
    padding: Spacing.base,
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
    justifyContent: 'center',
  },
  imageButtonText: {
    fontSize: FontSize.md,
    color: Colors.primary,
  },
  submitButton: {
    width: '100%',
    height: 50,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitDisabled: { opacity: 0.7 },
  submitText: {
    color: Colors.textOnPrimary,
    fontSize: FontSize.base,
    fontWeight: '600',
  },
});
