import React, { useState, useCallback } from 'react';
import { View, Text, Image, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HorizontalMenu from '../../components/HorizontalMenu';
import { Colors, Spacing, FontSize, BorderRadius } from '../../theme';
import { auth } from '../../services/firebase';

const MOCK_PLAYERS = [
  { id: '1', name: 'Antonio Lima', score: 12597, avatar: 'https://i.pravatar.cc/150?u=1', rank: 1 },
  { id: '2', name: 'Fernanda Araujo', score: 12001, avatar: 'https://i.pravatar.cc/150?u=2', rank: 2 },
  { id: '3', name: 'Valdilene Carvalho', score: 11123, avatar: 'https://i.pravatar.cc/150?u=3', rank: 3 },
  { id: '4', name: 'Antonieta Pereira', score: 10002, avatar: 'https://i.pravatar.cc/150?u=4', rank: 4 },
  { id: '5', name: 'Rafael Pereira', score: 5245, avatar: 'https://i.pravatar.cc/150?u=5', rank: 5 },
  { id: '6', name: 'Hugo Souza', score: 4569, avatar: 'https://i.pravatar.cc/150?u=6', rank: 6 },
  { id: '7', name: 'Fernando Lima', score: 3254, avatar: 'https://i.pravatar.cc/150?u=7', rank: 7 },
  { id: '8', name: 'Rafael Pereira', score: 2688, avatar: 'https://i.pravatar.cc/150?u=8', rank: 8 },
];

const FILTER_OPTIONS = ['Pontos', 'Ofensiva', 'Progresso'];

interface Player {
  id: string;
  name: string;
  score: number;
  avatar: string;
  rank: number;
}

function PodiumItem({ item }: { item: Player }) {
  const isFirst = item.rank === 1;
  const barHeight = isFirst ? 140 : item.rank === 2 ? 100 : 80;
  const iconName = isFirst ? 'trophy' : 'medal';

  return (
    <View style={styles.podiumContainer}>
      <View style={styles.avatarContainer}>
        <View style={[styles.avatarBorder, { borderColor: isFirst ? Colors.gold : Colors.border }]}>
          <Image source={{ uri: item.avatar }} style={styles.podiumAvatar} />
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText} numberOfLines={1}>{item.name}</Text>
        </View>
      </View>
      <View style={[styles.bar, { height: barHeight, backgroundColor: Colors.podium }]}>
        <MaterialCommunityIcons name={iconName} size={30} color="white" />
        <Text style={styles.rankNumber}>{item.rank}</Text>
      </View>
      <Text style={styles.podiumScore}>{item.score}</Text>
    </View>
  );
}

function ListItem({ item, isCurrentUser }: { item: Player; isCurrentUser: boolean }) {
  return (
    <View style={[styles.card, isCurrentUser && styles.cardHighlighted]}>
      <Text style={styles.rankText}>{item.rank}</Text>
      <Image source={{ uri: item.avatar }} style={styles.listAvatar} />
      <Text style={[styles.listName, isCurrentUser && styles.listNameHighlighted]}>
        {item.name}{isCurrentUser ? ' (Você)' : ''}
      </Text>
      <Text style={styles.listScore}>{item.score}</Text>
    </View>
  );
}

export default function RankingScreen() {
  const [filter, setFilter] = useState(FILTER_OPTIONS[0]);
  const [refreshing, setRefreshing] = useState(false);
  const [players, setPlayers] = useState(MOCK_PLAYERS);
  const currentUserId = auth.currentUser?.uid;

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setPlayers(MOCK_PLAYERS);
      setRefreshing(false);
    }, 1000);
  }, []);

  const topThree = [players[1], players[0], players[2]];
  const restOfList = players.slice(3);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ranking</Text>
      </View>

      <HorizontalMenu items={FILTER_OPTIONS} selected={filter} onSelect={setFilter} />

      <FlatList
        data={restOfList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ListItem item={item} isCurrentUser={item.id === currentUserId} />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />
        }
        ListHeaderComponent={() => (
          <View style={styles.podiumWrapper}>
            {topThree.map((player) => (
              <PodiumItem key={player.id} item={player} />
            ))}
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  headerTitle: {
    fontSize: FontSize.xxxl,
    fontWeight: 'bold',
    color: Colors.accent,
  },
  podiumWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginTop: Spacing.lg,
    marginBottom: Spacing.xxxl,
    paddingHorizontal: Spacing.sm,
  },
  podiumContainer: {
    alignItems: 'center',
    marginHorizontal: Spacing.sm,
    width: 90,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: -15,
    zIndex: 1,
  },
  avatarBorder: {
    borderWidth: 3,
    borderRadius: 40,
    padding: 2,
    backgroundColor: Colors.background,
  },
  podiumAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  badge: {
    backgroundColor: '#1E3A8A',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 10,
    marginTop: -10,
    maxWidth: 85,
  },
  badgeText: {
    color: Colors.textOnPrimary,
    fontSize: FontSize.xs,
    fontWeight: 'bold',
  },
  bar: {
    width: '100%',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
  },
  rankNumber: {
    color: Colors.textOnPrimary,
    fontSize: 40,
    fontWeight: 'bold',
  },
  podiumScore: {
    color: Colors.accent,
    fontWeight: 'bold',
    marginTop: 5,
    fontSize: FontSize.base,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderAccent,
  },
  cardHighlighted: {
    backgroundColor: '#EEF2FF',
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  rankText: {
    fontSize: FontSize.lg,
    fontWeight: 'bold',
    color: Colors.textLight,
    width: 30,
    textAlign: 'center',
  },
  listAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: Spacing.base,
  },
  listName: {
    flex: 1,
    fontSize: FontSize.base,
    color: '#4B5563',
  },
  listNameHighlighted: {
    fontWeight: 'bold',
    color: Colors.primary,
  },
  listScore: {
    fontSize: FontSize.base,
    fontWeight: 'bold',
    color: '#5476FF',
  },
});
