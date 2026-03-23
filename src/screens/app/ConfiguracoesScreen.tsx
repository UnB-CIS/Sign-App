import React, { useState } from 'react';
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

function SettingToggle({ label, value, onToggle }: { label: string; value: boolean; onToggle: (v: boolean) => void }) {
  return (
    <View style={styles.toggleRow}>
      <Text style={styles.toggleLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#E0E0E0', true: '#6200EE' }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}

function SettingOption({ icon, label, value, onPress }: { icon: string; label: string; value?: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.optionRow} onPress={onPress} activeOpacity={0.7}>
      <Ionicons name={icon} size={22} color="#7A869A" />
      <Text style={styles.optionLabel}>{label}</Text>
      <View style={styles.optionRight}>
        {value && <Text style={styles.optionValue}>{value}</Text>}
        <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
      </View>
    </TouchableOpacity>
  );
}

export default function ConfiguracoesScreen() {
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
          <Text style={styles.secaoTitulo}>Notificações</Text>
          <SettingToggle
            label="Lembretes de prática"
            value={lembretes}
            onToggle={setLembretes}
          />
          <SettingToggle
            label="Atualizações de amigos"
            value={amigos}
            onToggle={setAmigos}
          />
          <SettingToggle
            label="Conquistas e medalhas"
            value={conquistas}
            onToggle={setConquistas}
          />
        </View>

        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>Aparência</Text>
          <SettingToggle
            label="Tema escuro"
            value={temaEscuro}
            onToggle={setTemaEscuro}
          />
        </View>

        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>Vídeo e Armazenamento</Text>
          <SettingOption
            icon="videocam"
            label="Qualidade de vídeo"
            value="Média"
            onPress={handleVideoQuality}
          />
          <SettingOption
            icon="trash"
            label="Limpar cache"
            onPress={handleClearCache}
          />
        </View>

        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>Acessibilidade</Text>
          <SettingOption
            icon="text"
            label="Tamanho da fonte"
            value="Normal"
            onPress={() => {}}
          />
          <SettingOption
            icon="contrast"
            label="Alto contraste"
            onPress={() => {}}
          />
        </View>

        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>Sobre</Text>
          <SettingOption
            icon="information-circle"
            label="Versão do app"
            value="1.0.0"
            onPress={() => {}}
          />
          <SettingOption
            icon="document-text"
            label="Termos de uso"
            onPress={() => {}}
          />
          <SettingOption
            icon="shield-checkmark"
            label="Política de privacidade"
            onPress={() => {}}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    paddingBottom: 40,
  },
  secao: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  secaoTitulo: {
    fontSize: 13,
    fontWeight: '600',
    color: '#7A869A',
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
    borderBottomColor: '#F0F2F5',
  },
  toggleLabel: {
    fontSize: 16,
    color: '#1A1A1A',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F5',
  },
  optionLabel: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A1A',
    marginLeft: 12,
  },
  optionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  optionValue: {
    fontSize: 14,
    color: '#7A869A',
  },
});
