import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

type Notificacao = {
  id: string;
  tipo: 'lembrete' | 'conquista' | 'social' | 'sistema';
  titulo: string;
  mensagem: string;
  tempo: string;
  lida: boolean;
};

const FILTROS = ['Todas', 'Lembretes', 'Conquistas', 'Social'];

const NOTIFICACOES_MOCK: Notificacao[] = [
  {
    id: '1',
    tipo: 'lembrete',
    titulo: 'Hora de praticar!',
    mensagem: 'Você não pratica há 2 dias. Mantenha sua ofensiva!',
    tempo: '5 min',
    lida: false,
  },
  {
    id: '2',
    tipo: 'conquista',
    titulo: 'Nova conquista!',
    mensagem: 'Você completou o módulo Saudações. +50 XP!',
    tempo: '1h',
    lida: false,
  },
  {
    id: '3',
    tipo: 'social',
    titulo: 'Novo no ranking',
    mensagem: 'Você subiu para a posição #5 no ranking semanal.',
    tempo: '3h',
    lida: true,
  },
  {
    id: '4',
    tipo: 'conquista',
    titulo: 'Ofensiva de 7 dias!',
    mensagem: 'Parabéns! Você manteve sua ofensiva por 7 dias consecutivos.',
    tempo: '1d',
    lida: true,
  },
  {
    id: '5',
    tipo: 'lembrete',
    titulo: 'Lição disponível',
    mensagem: 'A lição "Frutas e Verduras" está esperando por você.',
    tempo: '2d',
    lida: true,
  },
  {
    id: '6',
    tipo: 'sistema',
    titulo: 'Atualização do app',
    mensagem: 'Nova versão disponível com melhorias de desempenho.',
    tempo: '3d',
    lida: true,
  },
];

function getIcone(tipo: string): { nome: string; cor: string } {
  switch (tipo) {
    case 'lembrete': return { nome: 'alarm', cor: '#FF9500' };
    case 'conquista': return { nome: 'trophy', cor: '#FFD700' };
    case 'social': return { nome: 'people', cor: '#6200EE' };
    case 'sistema': return { nome: 'information-circle', cor: '#2D4CC8' };
    default: return { nome: 'notifications', cor: '#7A869A' };
  }
}

export default function NotificationScreen() {
  const [filtro, setFiltro] = useState('Todas');
  const [notificacoes, setNotificacoes] = useState(NOTIFICACOES_MOCK);

  const filtradas = notificacoes.filter((n) => {
    if (filtro === 'Todas') return true;
    if (filtro === 'Lembretes') return n.tipo === 'lembrete';
    if (filtro === 'Conquistas') return n.tipo === 'conquista';
    if (filtro === 'Social') return n.tipo === 'social';
    return true;
  });

  const marcarComoLida = (id: string) => {
    setNotificacoes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, lida: true } : n))
    );
  };

  const marcarTodasLidas = () => {
    setNotificacoes((prev) => prev.map((n) => ({ ...n, lida: true })));
  };

  const deletar = (id: string) => {
    setNotificacoes((prev) => prev.filter((n) => n.id !== id));
  };

  const naoLidas = notificacoes.filter((n) => !n.lida).length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerActions}>
        {naoLidas > 0 && (
          <TouchableOpacity onPress={marcarTodasLidas}>
            <Text style={styles.marcarTodas}>Marcar todas como lidas</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        horizontal
        data={FILTROS}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtros}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.filtroChip, filtro === item && styles.filtroChipAtivo]}
            onPress={() => setFiltro(item)}
          >
            <Text style={[styles.filtroTexto, filtro === item && styles.filtroTextoAtivo]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      <FlatList
        data={filtradas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={
          <View style={styles.vazio}>
            <Ionicons name="notifications-off-outline" size={48} color="#E0E0E0" />
            <Text style={styles.vazioTexto}>Nenhuma notificação</Text>
          </View>
        }
        renderItem={({ item }) => {
          const icone = getIcone(item.tipo);
          return (
            <TouchableOpacity
              style={[styles.notificacao, !item.lida && styles.notificacaoNaoLida]}
              onPress={() => marcarComoLida(item.id)}
              onLongPress={() => deletar(item.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconeContainer, { backgroundColor: icone.cor + '15' }]}>
                <Ionicons name={icone.nome} size={22} color={icone.cor} />
              </View>
              <View style={styles.notificacaoInfo}>
                <View style={styles.notificacaoHeader}>
                  <Text style={[styles.notificacaoTitulo, !item.lida && styles.textoNaoLido]}>
                    {item.titulo}
                  </Text>
                  <Text style={styles.tempo}>{item.tempo}</Text>
                </View>
                <Text style={styles.mensagem} numberOfLines={2}>{item.mensagem}</Text>
              </View>
              {!item.lida && <View style={styles.indicadorNaoLido} />}
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  marcarTodas: {
    fontSize: 13,
    color: '#6200EE',
    fontWeight: '500',
  },
  filtros: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  filtroChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginRight: 8,
  },
  filtroChipAtivo: {
    backgroundColor: '#6200EE',
  },
  filtroTexto: {
    fontSize: 14,
    color: '#7A869A',
    fontWeight: '500',
  },
  filtroTextoAtivo: {
    color: '#FFFFFF',
  },
  lista: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  notificacao: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F5',
  },
  notificacaoNaoLida: {
    backgroundColor: '#FAFAFE',
  },
  iconeContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificacaoInfo: {
    flex: 1,
    marginLeft: 12,
  },
  notificacaoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificacaoTitulo: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  textoNaoLido: {
    fontWeight: '700',
  },
  tempo: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  mensagem: {
    fontSize: 13,
    color: '#7A869A',
    marginTop: 3,
    lineHeight: 18,
  },
  indicadorNaoLido: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6200EE',
    marginLeft: 8,
  },
  vazio: {
    alignItems: 'center',
    paddingTop: 60,
  },
  vazioTexto: {
    fontSize: 16,
    color: '#7A869A',
    marginTop: 12,
  },
});
