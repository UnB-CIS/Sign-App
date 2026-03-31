import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { auth } from '../../services/firebase';
import { getCurrentUserById, UserProfile } from '../../services/models/user';
import { signOutUser } from '../../services/auth';
import { Colors, Spacing, FontSize, BorderRadius } from '../../theme';

function ProfileInfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

export default function PerfilScreen() {
  const navigation = useNavigation();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useFocusEffect(
    useCallback(() => {
      const uid = auth.currentUser?.uid;
      if (uid) {
        getCurrentUserById(uid).then(setProfile).catch(console.error);
      }
    }, [])
  );

  const handleLogout = async () => {
    await signOutUser();
  };

  const name = profile?.name || auth.currentUser?.displayName || 'Usuário';
  const email = profile?.email || auth.currentUser?.email || '';
  const phone = profile?.phone || 'Não informado';
  const gender = profile?.gender || 'Não informado';
  const birthDate = profile?.birth_date || 'Não informado';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={48} color={Colors.textOnPrimary} />
        </View>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.email}>{email}</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{profile?.xp ?? 0}</Text>
          <Text style={styles.statLabel}>XP Total</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{profile?.streak?.current ?? 0}</Text>
          <Text style={styles.statLabel}>Ofensiva</Text>
        </View>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Informações pessoais</Text>
        <ProfileInfoRow label="Telefone" value={phone} />
        <ProfileInfoRow label="Gênero" value={gender} />
        <ProfileInfoRow label="Nascimento" value={birthDate} />
      </View>

      <View style={styles.menuSection}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Ionicons name="create-outline" size={22} color={Colors.primary} />
          <Text style={styles.menuText}>Editar Perfil</Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('ChangePassword')}
        >
          <Ionicons name="lock-closed-outline" size={22} color={Colors.primary} />
          <Text style={styles.menuText}>Alterar Senha</Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('BugReport')}
        >
          <Ionicons name="bug-outline" size={22} color={Colors.primary} />
          <Text style={styles.menuText}>Reportar Bug</Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color={Colors.error} />
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.lg,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  name: {
    fontSize: FontSize.xl,
    fontWeight: 'bold',
    color: Colors.text,
  },
  email: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.xl,
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: FontSize.xxl,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  menuSection: {
    gap: Spacing.sm,
  },
  infoCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.base,
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  infoTitle: {
    fontSize: FontSize.base,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  infoRow: {
    gap: Spacing.xs,
  },
  infoLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  infoValue: {
    fontSize: FontSize.base,
    color: Colors.text,
    fontWeight: '500',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.base,
    gap: Spacing.md,
  },
  menuText: {
    flex: 1,
    fontSize: FontSize.base,
    color: Colors.text,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.error,
    padding: Spacing.base,
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  logoutText: {
    flex: 1,
    fontSize: FontSize.base,
    color: Colors.error,
    fontWeight: '600',
  },
});
