import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors, Spacing, BorderRadius, FontSize } from '../../theme';
import { ThemeColors } from '../../theme/colors';
import { useThemeColors, useFontScale } from '../../contexts/AccessibilityContext';

type TipoNotificacao = 'lembrete' | 'conquista' | 'social' | 'sistema';

type Notificacao = {
  id: string;
  tipo: TipoNotificacao;
  titulo: string;
  mensagem: string;
  tempo: string;
  lida: boolean;
};

const FILTROS = ['Todas', 'Lembretes', 'Conquistas', 'Social'] as const;

// Configuração visual e de ação por tipo de notificação.
// Centraliza ícone, cor e o botão de ação próprio de cada tipo.
const CONFIG_TIPO: Record<
  TipoNotificacao,
  { icone: string; cor: string; acaoLabel: string; acaoIcone: string }
> = {
  lembrete: {
    icone: 'alarm',
    cor: Colors.warning,
    acaoLabel: 'Praticar agora',
    acaoIcone: 'play-circle-outline',
  },
  conquista: {
    icone: 'trophy',
    cor: Colors.gold,
    acaoLabel: 'Ver conquista',
    acaoIcone: 'ribbon-outline',
  },
  social: {
    icone: 'people',
    cor: Colors.primary,
    acaoLabel: 'Ver ranking',
    acaoIcone: 'podium-outline',
  },
  sistema: {
    icone: 'information-circle',
    cor: Colors.primaryDark,
    acaoLabel: 'Saber mais',
    acaoIcone: 'open-outline',
  },
};

// Fonte de dados mock isolada. Substituir por busca no Firebase numa fase posterior
// implementando uma função com a mesma assinatura (ex.: buscarNotificacoes).
function buscarNotificacoesMock(): Notificacao[] {
  return [
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
}

type CartaoProps = {
  item: Notificacao;
  onLer: (id: string) => void;
  onAcao: (item: Notificacao) => void;
  onMarcarLida: (id: string) => void;
  onExcluir: (id: string) => void;
  colors: ThemeColors;
  fontScale: number;
};

function CartaoNotificacao({
  item,
  onLer,
  onAcao,
  onMarcarLida,
  onExcluir,
  colors,
  fontScale,
}: CartaoProps) {
  const config = CONFIG_TIPO[item.tipo];
  const styles = useStyles(colors, fontScale);

  return (
    <TouchableOpacity
      style={[styles.notificacao, !item.lida && styles.notificacaoNaoLida]}
      onPress={() => onLer(item.id)}
      onLongPress={() => onExcluir(item.id)}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`${item.lida ? 'Lida' : 'Não lida'}. ${item.titulo}. ${item.mensagem}. ${item.tempo}`}
      accessibilityHint="Toque para marcar como lida. Pressione e segure para excluir."
    >
      <View style={styles.linhaTopo}>
        <View style={[styles.iconeContainer, { backgroundColor: config.cor + '1A' }]}>
          <Ionicons name={config.icone} size={22} color={config.cor} />
        </View>
        <View style={styles.notificacaoInfo}>
          <View style={styles.notificacaoHeader}>
            <Text
              style={[styles.notificacaoTitulo, !item.lida && styles.textoNaoLido]}
              numberOfLines={1}
            >
              {item.titulo}
            </Text>
            <Text style={styles.tempo}>{item.tempo}</Text>
          </View>
          <Text style={styles.mensagem} numberOfLines={2}>
            {item.mensagem}
          </Text>
        </View>
        {!item.lida && (
          <View style={styles.indicadorNaoLido} accessibilityLabel="Não lida" />
        )}
      </View>

      <View style={styles.acoes}>
        <TouchableOpacity
          style={[styles.botaoAcaoPrincipal, { backgroundColor: config.cor + '1A' }]}
          onPress={() => onAcao(item)}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={config.acaoLabel}
        >
          <Ionicons name={config.acaoIcone} size={16} color={config.cor} />
          <Text style={[styles.botaoAcaoTexto, { color: config.cor }]}>
            {config.acaoLabel}
          </Text>
        </TouchableOpacity>

        <View style={styles.acoesSecundarias}>
          {!item.lida && (
            <TouchableOpacity
              style={styles.botaoSecundario}
              onPress={() => onMarcarLida(item.id)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Marcar como lida"
            >
              <Ionicons name="checkmark-done-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.botaoSecundarioTexto}>Marcar como lida</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.botaoSecundario}
            onPress={() => onExcluir(item.id)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Excluir notificação"
          >
            <Ionicons name="trash-outline" size={16} color={colors.error} />
            <Text style={[styles.botaoSecundarioTexto, { color: colors.error }]}>
              Excluir
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function NotificationScreen() {
  const colors = useThemeColors();
  const fontScale = useFontScale();
  const styles = useStyles(colors, fontScale);
  const [filtro, setFiltro] = useState<(typeof FILTROS)[number]>('Todas');
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>(buscarNotificacoesMock);

  const filtradas = useMemo(
    () =>
      notificacoes.filter((n) => {
        if (filtro === 'Todas') return true;
        if (filtro === 'Lembretes') return n.tipo === 'lembrete';
        if (filtro === 'Conquistas') return n.tipo === 'conquista';
        if (filtro === 'Social') return n.tipo === 'social';
        return true;
      }),
    [notificacoes, filtro]
  );

  const naoLidas = useMemo(
    () => notificacoes.filter((n) => !n.lida).length,
    [notificacoes]
  );

  const marcarComoLida = useCallback((id: string) => {
    setNotificacoes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, lida: true } : n))
    );
  }, []);

  const marcarTodasLidas = useCallback(() => {
    setNotificacoes((prev) => prev.map((n) => ({ ...n, lida: true })));
  }, []);

  const excluir = useCallback((id: string) => {
    setNotificacoes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // Ação própria por tipo. A navegação real será ligada numa fase posterior;
  // por ora marca como lida ao acionar.
  const executarAcao = useCallback(
    (item: Notificacao) => {
      marcarComoLida(item.id);
    },
    [marcarComoLida]
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerActions}>
        {naoLidas > 0 && (
          <TouchableOpacity
            onPress={marcarTodasLidas}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Marcar todas como lidas"
          >
            <Text style={styles.marcarTodas}>Marcar todas como lidas</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filtrosWrapper}>
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
              activeOpacity={0.7}
              accessibilityRole="tab"
              accessibilityLabel={`Filtro ${item}`}
              accessibilityState={{ selected: filtro === item }}
            >
              <Text
                style={[styles.filtroTexto, filtro === item && styles.filtroTextoAtivo]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <FlatList
        data={filtradas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separador} />}
        ListEmptyComponent={
          <View style={styles.vazio}>
            <Ionicons name="notifications-off-outline" size={48} color={colors.border} />
            <Text style={styles.vazioTexto}>Nenhuma notificação</Text>
          </View>
        }
        renderItem={({ item }) => (
          <CartaoNotificacao
            item={item}
            onLer={marcarComoLida}
            onAcao={executarAcao}
            onMarcarLida={marcarComoLida}
            onExcluir={excluir}
            colors={colors}
            fontScale={fontScale}
          />
        )}
      />
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
        headerActions: {
          flexDirection: 'row',
          justifyContent: 'flex-end',
          paddingHorizontal: Spacing.base,
          paddingTop: Spacing.sm,
        },
        marcarTodas: {
          fontSize: FontSize.sm * fontScale,
          color: colors.primary,
          fontWeight: '600',
        },
        filtrosWrapper: {
          borderBottomWidth: 1,
          borderBottomColor: colors.borderLight,
        },
        filtros: {
          paddingHorizontal: Spacing.base,
          paddingVertical: Spacing.md,
          gap: Spacing.sm,
        },
        filtroChip: {
          paddingHorizontal: Spacing.base,
          paddingVertical: Spacing.sm,
          borderRadius: BorderRadius.round,
          backgroundColor: colors.surface,
          marginRight: Spacing.sm,
        },
        filtroChipAtivo: {
          backgroundColor: colors.primary,
        },
        filtroTexto: {
          fontSize: FontSize.md * fontScale,
          color: colors.textSecondary,
          fontWeight: '500',
        },
        filtroTextoAtivo: {
          color: colors.textOnPrimary,
        },
        lista: {
          padding: Spacing.base,
          paddingBottom: Spacing.lg,
        },
        separador: {
          height: Spacing.md,
        },
        notificacao: {
          backgroundColor: colors.card,
          borderRadius: BorderRadius.lg,
          borderWidth: 1,
          borderColor: colors.borderLight,
          padding: Spacing.base,
        },
        notificacaoNaoLida: {
          backgroundColor: colors.surface,
          borderColor: colors.borderAccent,
        },
        linhaTopo: {
          flexDirection: 'row',
          alignItems: 'center',
        },
        iconeContainer: {
          width: 44,
          height: 44,
          borderRadius: BorderRadius.lg,
          justifyContent: 'center',
          alignItems: 'center',
        },
        notificacaoInfo: {
          flex: 1,
          marginLeft: Spacing.md,
        },
        notificacaoHeader: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        },
        notificacaoTitulo: {
          flex: 1,
          fontSize: FontSize.base * fontScale,
          fontWeight: '500',
          color: colors.text,
        },
        textoNaoLido: {
          fontWeight: '700',
        },
        tempo: {
          fontSize: FontSize.sm * fontScale,
          color: colors.textLight,
          marginLeft: Spacing.sm,
        },
        mensagem: {
          fontSize: FontSize.md * fontScale,
          color: colors.textSecondary,
          marginTop: Spacing.xs,
          lineHeight: 18 * fontScale,
        },
        indicadorNaoLido: {
          width: 8,
          height: 8,
          borderRadius: BorderRadius.round,
          backgroundColor: colors.primary,
          marginLeft: Spacing.sm,
        },
        acoes: {
          marginTop: Spacing.md,
          paddingTop: Spacing.md,
          borderTopWidth: 1,
          borderTopColor: colors.borderLight,
          gap: Spacing.sm,
        },
        botaoAcaoPrincipal: {
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'flex-start',
          gap: Spacing.xs,
          paddingHorizontal: Spacing.md,
          paddingVertical: Spacing.sm,
          borderRadius: BorderRadius.md,
        },
        botaoAcaoTexto: {
          fontSize: FontSize.md * fontScale,
          fontWeight: '600',
        },
        acoesSecundarias: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: Spacing.base,
        },
        botaoSecundario: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: Spacing.xs,
          paddingVertical: Spacing.xs,
        },
        botaoSecundarioTexto: {
          fontSize: FontSize.sm * fontScale,
          color: colors.textSecondary,
          fontWeight: '500',
        },
        vazio: {
          alignItems: 'center',
          paddingTop: Spacing.xxxl + Spacing.lg,
        },
        vazioTexto: {
          fontSize: FontSize.base * fontScale,
          color: colors.textSecondary,
          marginTop: Spacing.md,
        },
      }),
    [colors, fontScale],
  );
}
