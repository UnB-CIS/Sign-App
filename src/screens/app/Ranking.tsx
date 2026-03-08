import React from 'react';
import { View, Text, Image, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// 1. Mock Data
const PLAYERS = [
  { id: '1', name: 'Antonio Lima', score: 12597, avatar: 'https://i.pravatar.cc/150?u=1', rank: 1 },
  { id: '2', name: 'Fernanda Araujo', score: 12001, avatar: 'https://i.pravatar.cc/150?u=2', rank: 2 },
  { id: '3', name: 'Valdilene Carvalho', score: 11123, avatar: 'https://i.pravatar.cc/150?u=3', rank: 3 },
  { id: '4', name: 'Antonieta Pereira', score: 10002, avatar: 'https://i.pravatar.cc/150?u=4', rank: 4 },
  { id: '5', name: 'Rafael Pereira', score: 5245, avatar: 'https://i.pravatar.cc/150?u=5', rank: 5 },
  { id: '6', name: 'Hugo Souza', score: 4569, avatar: 'https://i.pravatar.cc/150?u=6', rank: 6 },
  { id: '7', name: 'Fernando Lima', score: 3254, avatar: 'https://i.pravatar.cc/150?u=7', rank: 7 },
  { id: '8', name: 'Rafael Pereira', score: 2688, avatar: 'https://i.pravatar.cc/150?u=8', rank: 8 },
];

// 2. Podium Item Component (Top 3)
const PodiumItem = ({ item, size }) => {
  const isFirst = item.rank === 1;
  const isSecond = item.rank === 2;
  const isThird = item.rank === 3;

  // Dynamic styles based on rank
  const barHeight = isFirst ? 140 : isSecond ? 100 : 80;
  const barColor = '#7F00FF'; // Purple
  const iconName = isFirst ? 'trophy' : 'medal';

  return (
    <View style={styles.podiumContainer}>
      {/* Avatar Group */}
      <View style={styles.avatarContainer}>
        <View style={[styles.avatarBorder, { borderColor: isFirst ? '#FFD700' : '#E0E0E0' }]}>
          <Image source={{ uri: item.avatar }} style={styles.podiumAvatar} />
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText} numberOfLines={1}>{item.name}</Text>
        </View>
      </View>

      {/* Purple Bar */}
      <View style={[styles.bar, { height: barHeight, backgroundColor: barColor }]}>
        <MaterialCommunityIcons name={iconName} size={30} color="white" />
        <Text style={styles.rankNumber}>{item.rank}</Text>
      </View>

      {/* Score */}
      <Text style={styles.podiumScore}>{item.score}</Text>
    </View>
  );
};

// 3. List Item Component (Rank 4+)
const ListItem = ({ item }) => (
  <View style={styles.card}>
    <Text style={styles.rankText}>{item.rank}</Text>
    <Image source={{ uri: item.avatar }} style={styles.listAvatar} />
    <Text style={styles.listName}>{item.name}</Text>
    <Text style={styles.listScore}>{item.score}</Text>
  </View>
);

export default function EventosScreen() {
  // Sort data so top 3 are extracted correctly
  const topThree = [PLAYERS[1], PLAYERS[0], PLAYERS[2]]; // Order: 2nd, 1st, 3rd (Visual layout)
  const restOfList = PLAYERS.slice(3);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ranking</Text>
      </View>

      <FlatList
        data={restOfList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ListItem item={item} />}
        contentContainerStyle={styles.listContent}
        // The Header contains the Podium
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
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2B4CDE', // Blue title
  },
  // Podium Styles
  podiumWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginTop: 20,
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  podiumContainer: {
    alignItems: 'center',
    marginHorizontal: 8,
    width: 90,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: -15, // Pull avatar down slightly over bar
    zIndex: 1,
  },
  avatarBorder: {
    borderWidth: 3,
    borderRadius: 40,
    padding: 2,
    backgroundColor: '#fff',
  },
  podiumAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  badge: {
    backgroundColor: '#1E3A8A', // Dark blue badge
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 10,
    marginTop: -10,
    maxWidth: 85,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  bar: {
    width: '100%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10, // Added rounded bottom for floating effect
    borderBottomRightRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
  },
  rankNumber: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
  },
  podiumScore: {
    color: '#2B4CDE',
    fontWeight: 'bold',
    marginTop: 5,
    fontSize: 16,
  },
  // List Styles
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#6C9EFF', // Light blue border
  },
  rankText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#9CA3AF',
    width: 30,
    textAlign: 'center',
  },
  listAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 15,
  },
  listName: {
    flex: 1,
    fontSize: 16,
    color: '#4B5563',
  },
  listScore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5476FF',
  },
});