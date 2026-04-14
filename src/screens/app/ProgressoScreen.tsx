import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { auth } from '../../services/firebase';
import { getCurrentUserById, UserProfile } from '../../services/models/user';
import { getCourseModulesOverview, ModuleOverview } from '../../services/models/courseOverview';

const STATIC_STATS = {
  licoesCompletas: 5,
  precisao: 82,
  tempoEstudo: '3h 20min',
};

const SEMANA = [
  { dia: 'Seg', xp: 80 },
  { dia: 'Ter', xp: 45 },
  { dia: 'Qua', xp: 60 },
  { dia: 'Qui', xp: 0 },
  { dia: 'Sex', xp: 90 },
  { dia: 'Sáb', xp: 30 },
  { dia: 'Dom', xp: 0 },
];

function StatCard({ icon, valor, label, cor }: { icon: string; valor: string; label: string; cor: string }) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: cor + '15' }]}>
        <Ionicons name={icon} size={22} color={cor} />
      </View>
      <Text style={styles.statValor}>{valor}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function getWeeklyBarStyle(xp: number, maxXp: number) {
  return {
    height: `${(xp / maxXp) * 100}%` as `${number}%`,
    backgroundColor: xp > 0 ? '#2D4CC8' : '#F0F2F5',
  };
}

export default function ProgressoScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [modules, setModules] = useState<ModuleOverview[]>([]);

  useFocusEffect(
    useCallback(() => {
      const uid = auth.currentUser?.uid;

      if (!uid) {
        setProfile(null);
        setModules([]);
        return;
      }

      getCourseModulesOverview(uid)
        .then(setModules)
        .catch((error) => {
          console.error(error);
          setModules([]);
        });

      getCurrentUserById(uid)
        .then(setProfile)
        .catch((error) => {
          console.error(error);
          setProfile(null);
        });
    }, [])
  );

  const maxXp = Math.max(...SEMANA.map((d) => d.xp), 1);
  const stats = useMemo(() => ({
    xpTotal: profile?.xp ?? 0,
    ofensiva: profile?.streak?.current ?? 0,
    licoesCompletas: STATIC_STATS.licoesCompletas,
    precisao: STATIC_STATS.precisao,
    tempoEstudo: STATIC_STATS.tempoEstudo,
  }), [profile]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.titulo}>Meu Progresso</Text>

        <View style={styles.statsGrid}>
          <StatCard icon="flash" valor={`${stats.xpTotal}`} label="XP Total" cor="#6200EE" />
          <StatCard icon="flame" valor={`${stats.ofensiva} dias`} label="Ofensiva" cor="#FF6B00" />
          <StatCard icon="checkmark-circle" valor={`${stats.licoesCompletas}`} label="Lições" cor="#00C853" />
          <StatCard icon="analytics" valor={`${stats.precisao}%`} label="Precisão" cor="#2D4CC8" />
        </View>

        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>Atividade Semanal</Text>
          <View style={styles.graficoContainer}>
            {SEMANA.map((dia) => (
              <View key={dia.dia} style={styles.barraContainer}>
                <View style={styles.barraFundo}>
                  <View
                    style={[styles.barraPreenchida, getWeeklyBarStyle(dia.xp, maxXp)]}
                  />
                </View>
                <Text style={styles.barraDia}>{dia.dia}</Text>
                <Text style={styles.barraXp}>{dia.xp}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>Progresso por Módulo</Text>
          {modules.map((modulo) => (
            <View key={modulo.id} style={styles.moduloItem}>
              <View style={styles.moduloHeader}>
                <Text style={styles.moduloTitulo}>{modulo.title}</Text>
                <Text style={styles.moduloInfo}>
                  {modulo.completedLessons}/{modulo.totalLessons} lições
                </Text>
              </View>
              <View style={styles.progressTrack}>
                <View
                  style={[styles.progressFill, { width: `${modulo.progress}%` }]}
                />
              </View>
            </View>
          ))}
        </View>

        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>Tempo de Estudo</Text>
          <View style={styles.tempoCard}>
            <Ionicons name="time" size={28} color="#2D4CC8" />
            <Text style={styles.tempoValor}>{stats.tempoEstudo}</Text>
            <Text style={styles.tempoLabel}>esta semana</Text>
          </View>
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
    padding: 20,
    paddingBottom: 40,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F0F2F5',
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValor: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  statLabel: {
    fontSize: 13,
    color: '#7A869A',
    marginTop: 2,
  },
  secao: {
    marginBottom: 24,
  },
  secaoTitulo: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  graficoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 16,
  },
  barraContainer: {
    alignItems: 'center',
    flex: 1,
  },
  barraFundo: {
    width: 24,
    height: 80,
    backgroundColor: '#F0F2F5',
    borderRadius: 4,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barraPreenchida: {
    width: '100%',
    borderRadius: 4,
  },
  barraDia: {
    fontSize: 11,
    color: '#7A869A',
    marginTop: 6,
  },
  barraXp: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 2,
  },
  moduloItem: {
    marginBottom: 14,
  },
  moduloHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  moduloTitulo: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  moduloInfo: {
    fontSize: 13,
    color: '#7A869A',
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#F0F2F5',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2D4CC8',
    borderRadius: 4,
  },
  tempoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  tempoValor: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  tempoLabel: {
    fontSize: 14,
    color: '#7A869A',
  },
});
