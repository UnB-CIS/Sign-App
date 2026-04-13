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
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { auth } from '../../services/firebase';
import { createBugReport, BugType } from '../../services/models/bugReports';
import { Colors, Spacing, FontSize, BorderRadius } from '../../theme';
import { launchImageLibrary } from 'react-native-image-picker';
import { MAX_BUG_REPORT_IMAGES, UploadableImage, validateBugReportImages } from '../../services/storage';

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
  const [images, setImages] = useState<UploadableImage[]>([]);

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
        images,
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

  const handleAddImage = async () => {
    if (images.length >= MAX_BUG_REPORT_IMAGES) {
      Alert.alert('Limite', `Máximo de ${MAX_BUG_REPORT_IMAGES} imagens.`);
      return;
    }

    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: MAX_BUG_REPORT_IMAGES - images.length,
      includeBase64: false,
    });

    if (result.didCancel) {
      return;
    }

    if (result.errorMessage) {
      Alert.alert('Erro', 'Não foi possível selecionar as imagens.');
      return;
    }

    const nextImages = [
      ...images,
      ...(result.assets ?? []).flatMap((asset) => (asset.uri ? [{
        uri: asset.uri,
        fileName: asset.fileName,
        type: asset.type,
        fileSize: asset.fileSize,
      }] : [])),
    ];

    try {
      validateBugReportImages(nextImages);
      setImages(nextImages);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Não foi possível selecionar as imagens.';
      Alert.alert('Erro', message);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((current) => current.filter((_, currentIndex) => currentIndex !== index));
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

        <Text style={styles.sectionTitle}>Imagens ({images.length}/{MAX_BUG_REPORT_IMAGES})</Text>
        <TouchableOpacity style={styles.imageButton} onPress={handleAddImage}>
          <Ionicons name="camera-outline" size={24} color={Colors.primary} />
          <Text style={styles.imageButtonText}>Adicionar imagem</Text>
        </TouchableOpacity>
        {images.length ? (
          <View style={styles.previewList}>
            {images.map((image, index) => (
              <View key={`${image.uri}-${index}`} style={styles.previewCard}>
                <Image source={{ uri: image.uri }} style={styles.previewImage} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => handleRemoveImage(index)}
                >
                  <Ionicons name="close-circle" size={20} color={Colors.error} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : null}
        <Text style={styles.imageHint}>Ate 3 imagens de ate 5 MB cada.</Text>

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
  previewList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  previewCard: {
    width: 92,
    height: 92,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: Colors.background,
    borderRadius: 10,
  },
  imageHint: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
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
