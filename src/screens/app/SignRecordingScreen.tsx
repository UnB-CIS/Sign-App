import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors, Spacing, FontSize, BorderRadius } from '../../theme';
import type { AppStackScreenProps } from '../../@types/navigation';

type RecordingState = 'idle' | 'recording' | 'recorded';

export default function SignRecordingScreen() {
  const route = useRoute<AppStackScreenProps<'SignRecording'>['route']>();
  const navigation = useNavigation();
  const { lessonId, questionId } = route.params;
  const [state, setState] = useState<RecordingState>('idle');
  const [statusMessage, setStatusMessage] = useState('Posicione-se na frente da câmera');

  const handleStartRecording = () => {
    setState('recording');
    setStatusMessage('Gravando... Execute o sinal agora');
    setTimeout(() => {
      setState('recorded');
      setStatusMessage('Gravação concluída!');
    }, 3000);
  };

  const handleRetry = () => {
    setState('idle');
    setStatusMessage('Posicione-se na frente da câmera');
  };

  const handleVerify = () => {
    Alert.alert(
      'Verificando sinal...',
      'A verificação via DTW será implementada em breve.',
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.cameraArea}>
        <View style={styles.framingOverlay}>
          <View style={styles.cornerTL} />
          <View style={styles.cornerTR} />
          <View style={styles.cornerBL} />
          <View style={styles.cornerBR} />
        </View>

        <Ionicons name="camera-outline" size={64} color="#555" />
        <Text style={styles.cameraText}>Câmera</Text>

        {state === 'recording' && (
          <View style={styles.recordingIndicator}>
            <View style={styles.recordingDot} />
            <Text style={styles.recordingText}>REC</Text>
          </View>
        )}
      </View>

      <Text style={styles.statusText}>{statusMessage}</Text>

      <View style={styles.controls}>
        {state === 'idle' && (
          <TouchableOpacity style={styles.primaryButton} onPress={handleStartRecording}>
            <Ionicons name="videocam" size={24} color={Colors.textOnPrimary} />
            <Text style={styles.primaryButtonText}>Iniciar Gravação</Text>
          </TouchableOpacity>
        )}

        {state === 'recording' && (
          <View style={styles.recordingPulse}>
            <Ionicons name="radio-button-on" size={48} color={Colors.error} />
          </View>
        )}

        {state === 'recorded' && (
          <>
            <TouchableOpacity style={styles.secondaryButton} onPress={handleRetry}>
              <Ionicons name="refresh" size={20} color={Colors.primary} />
              <Text style={styles.secondaryButtonText}>Repetir</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.primaryButton} onPress={handleVerify}>
              <Ionicons name="checkmark-circle" size={24} color={Colors.textOnPrimary} />
              <Text style={styles.primaryButtonText}>Verificar Sinal</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.lg,
  },
  cameraArea: {
    flex: 1,
    backgroundColor: '#2A2A2A',
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    position: 'relative',
    overflow: 'hidden',
  },
  framingOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  cornerTL: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 40,
    height: 40,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: Colors.success,
    borderTopLeftRadius: 8,
  },
  cornerTR: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 40,
    height: 40,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: Colors.success,
    borderTopRightRadius: 8,
  },
  cornerBL: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    width: 40,
    height: 40,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: Colors.success,
    borderBottomLeftRadius: 8,
  },
  cornerBR: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 40,
    height: 40,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: Colors.success,
    borderBottomRightRadius: 8,
  },
  cameraText: {
    color: '#777',
    fontSize: FontSize.md,
    marginTop: Spacing.sm,
  },
  recordingIndicator: {
    position: 'absolute',
    top: Spacing.lg,
    right: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  recordingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.error,
  },
  recordingText: {
    color: Colors.error,
    fontWeight: 'bold',
    fontSize: FontSize.sm,
  },
  statusText: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  primaryButton: {
    flex: 1,
    height: 50,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  primaryButtonText: {
    color: Colors.textOnPrimary,
    fontSize: FontSize.base,
    fontWeight: '600',
  },
  secondaryButton: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  secondaryButtonText: {
    color: Colors.primary,
    fontSize: FontSize.base,
    fontWeight: '600',
  },
  recordingPulse: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
