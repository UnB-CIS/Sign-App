import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ThemeColors } from '../../theme/colors';
import { useAccessibility, useThemeColors, useFontScale } from '../../contexts/AccessibilityContext';

function SettingToggle({
  label,
  value,
  onToggle,
  colors,
  fontScale,
  hint,
}: {
  label: string;
  value: boolean;
  onToggle: (v: boolean) => void;
  colors: ThemeColors;
  fontScale: number;
  hint?: string;
}) {
  const styles = useStyles(colors, fontScale);
  return (
    <View style={styles.toggleRow}>
      <Text style={styles.toggleLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: colors.border, true: colors.primary }}
        thumbColor={colors.textOnPrimary}
        accessibilityRole="switch"
        accessibilityLabel={label}
        accessibilityHint={hint}
        accessibilityState={{ checked: value }}
      />
    </View>
  );
}

function SettingOption({
  icon,
  label,
  value,
  onPress,
  colors,
  fontScale,
  hint,
}: {
  icon: string;
  label: string;
  value?: string;
  onPress: () => void;
  colors: ThemeColors;
  fontScale: number;
  hint?: string;
}) {
  const styles = useStyles(colors, fontScale);
  return (
    <TouchableOpacity
      style={styles.optionRow}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={value ? `${label}, ${value}` : label}
      accessibilityHint={hint}
    >
      <Ionicons name={icon} size={22} color={colors.textSecondary} />
      <Text style={styles.optionLabel}>{label}</Text>
      <View style={styles.optionRight}>
        {value && <Text style={styles.optionValue}>{value}</Text>}
        <Ionicons name="chevron-forward" size={18} color={colors.textLight} />
      </View>
    </TouchableOpacity>
  );
}

export default function ConfiguracoesScreen() {
  const colors = useThemeColors();
  const fontScale = useFontScale();
  const styles = useStyles(colors, fontScale);
  const {
    fontScaleLabel,
    cycleFontScale,
    highContrast,
    setHighContrast,
  } = useAccessibility();

  const [lembretes, setLembretes] = useState(true);
  const [amigos, setAmigos] = useState(false);
  const [conquistas, setConquistas] = useState(true);
  const [temaEscuro, setTemaEscuro] = useState(false);

  const handleVideoQuality = () => {
    Alert.alert(
      'Qualidade de Vídeo',
      'Escolha a qualidade dos vídeos de referência',
      [
        { text: 'Baixa', onPress: () => {} },
        { text: 'Média', onPress: () => {} },
        { text: 'Alta', onPress: () => {} },
      ]
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      'Limpar Cache',
      'Isso vai remover vídeos e dados armazenados localmente. Deseja continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Limpar', style: 'destructive', onPress: () => {} },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.secao}>
          <Text style={styles.secaoTitulo} accessibilityRole="header">
            Notificações
          </Text>
          <SettingToggle
            label="Lembretes de prática"
            value={lembretes}
            onToggle={setLembretes}
            colors={colors}
            fontScale={fontScale}
          />
          <SettingToggle
            label="Atualizações de amigos"
            value={amigos}
            onToggle={setAmigos}
            colors={colors}
            fontScale={fontScale}
          />
          <SettingToggle
            label="Conquistas e medalhas"
            value={conquistas}
            onToggle={setConquistas}
            colors={colors}
            fontScale={fontScale}
          />
        </View>

        <View style={styles.secao}>
          <Text style={styles.secaoTitulo} accessibilityRole="header">
            Aparência
          </Text>
          <SettingToggle
            label="Tema escuro"
            value={temaEscuro}
            onToggle={setTemaEscuro}
            colors={colors}
            fontScale={fontScale}
          />
        </View>

        <View style={styles.secao}>
          <Text style={styles.secaoTitulo} accessibilityRole="header">
            Vídeo e Armazenamento
          </Text>
          <SettingOption
            icon="videocam"
            label="Qualidade de vídeo"
            value="Média"
            onPress={handleVideoQuality}
            colors={colors}
            fontScale={fontScale}
          />
          <SettingOption
            icon="trash"
            label="Limpar cache"
            onPress={handleClearCache}
            colors={colors}
            fontScale={fontScale}
          />
        </View>

        <View style={styles.secao}>
          <Text style={styles.secaoTitulo} accessibilityRole="header">
            Acessibilidade
          </Text>
          <SettingOption
            icon="text"
            label="Tamanho da fonte"
            value={fontScaleLabel}
            onPress={cycleFontScale}
            colors={colors}
            fontScale={fontScale}
            hint="Toque para alternar entre Normal, Grande e Maior"
          />
          <SettingToggle
            label="Alto contraste"
            value={highContrast}
            onToggle={setHighContrast}
            colors={colors}
            fontScale={fontScale}
            hint="Ativa cores de alto contraste para facilitar a leitura"
          />
        </View>

        <View style={styles.secao}>
          <Text style={styles.secaoTitulo} accessibilityRole="header">
            Sobre
          </Text>
          <SettingOption
            icon="information-circle"
            label="Versão do app"
            value="1.0.0"
            onPress={() => {}}
            colors={colors}
            fontScale={fontScale}
          />
          <SettingOption
            icon="document-text"
            label="Termos de uso"
            onPress={() => {}}
            colors={colors}
            fontScale={fontScale}
          />
          <SettingOption
            icon="shield-checkmark"
            label="Política de privacidade"
            onPress={() => {}}
            colors={colors}
            fontScale={fontScale}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function useStyles(colors: ThemeColors, fontScale: number) {
  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: colors.background,
        },
        content: {
          paddingBottom: 40,
        },
        secao: {
          paddingHorizontal: 20,
          paddingTop: 20,
        },
        secaoTitulo: {
          fontSize: 13 * fontScale,
          fontWeight: '600',
          color: colors.textSecondary,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
          marginBottom: 12,
        },
        toggleRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: colors.borderLight,
        },
        toggleLabel: {
          flex: 1,
          fontSize: 16 * fontScale,
          color: colors.text,
        },
        optionRow: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 14,
          borderBottomWidth: 1,
          borderBottomColor: colors.borderLight,
        },
        optionLabel: {
          flex: 1,
          fontSize: 16 * fontScale,
          color: colors.text,
          marginLeft: 12,
        },
        optionRight: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
        },
        optionValue: {
          fontSize: 14 * fontScale,
          color: colors.textSecondary,
        },
      }),
    [colors, fontScale],
  );
}
