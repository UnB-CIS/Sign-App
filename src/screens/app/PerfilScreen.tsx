import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { auth } from '../../services/firebase';
import { getCurrentUserById, UserProfile } from '../../services/models/user';
import { signOutUser } from '../../services/auth';
import { Spacing, FontSize, BorderRadius } from '../../theme';
import { ThemeColors } from '../../theme/colors';
import { useThemeColors, useFontScale } from '../../contexts/AccessibilityContext';

function ProfileInfoRow({
  label,
  value,
  colors,
  fontScale,
}: {
  label: string;
  value: string;
  colors: ThemeColors;
  fontScale: number;
}) {
  const styles = useStyles(colors, fontScale);
  return (
    <View style={styles.infoRow} accessibilityLabel={`${label}: ${value}`}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

export default function PerfilScreen() {
  const colors = useThemeColors();
  const fontScale = useFontScale();
  const styles = useStyles(colors, fontScale);
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
          {profile?.profilePictureUrl ? (
            <Image
              source={{ uri: profile.profilePictureUrl }}
              style={styles.avatarImage}
              accessibilityLabel={`Foto de perfil de ${name}`}
            />
          ) : (
            <Ionicons name="person" size={48} color={colors.textOnPrimary} />
          )}
        </View>
        <Text style={styles.name} accessibilityRole="header">
          {name}
        </Text>
        <Text style={styles.email}>{email}</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox} accessibilityLabel={`${profile?.xp ?? 0} XP total`}>
          <Text style={styles.statValue}>{profile?.xp ?? 0}</Text>
          <Text style={styles.statLabel}>XP Total</Text>
        </View>
        <View
          style={styles.statBox}
          accessibilityLabel={`Ofensiva de ${profile?.streak?.current ?? 0} dias`}
        >
          <Text style={styles.statValue}>{profile?.streak?.current ?? 0}</Text>
          <Text style={styles.statLabel}>Ofensiva</Text>
        </View>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle} accessibilityRole="header">
          Informações pessoais
        </Text>
        <ProfileInfoRow label="Telefone" value={phone} colors={colors} fontScale={fontScale} />
        <ProfileInfoRow label="Gênero" value={gender} colors={colors} fontScale={fontScale} />
        <ProfileInfoRow label="Nascimento" value={birthDate} colors={colors} fontScale={fontScale} />
      </View>

      <View style={styles.menuSection}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('EditProfile')}
          accessibilityRole="button"
          accessibilityLabel="Editar Perfil"
          accessibilityHint="Abre a tela de edição do perfil"
        >
          <Ionicons name="create-outline" size={22} color={colors.primary} />
          <Text style={styles.menuText}>Editar Perfil</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('ChangePassword')}
          accessibilityRole="button"
          accessibilityLabel="Alterar Senha"
          accessibilityHint="Abre a tela de alteração de senha"
        >
          <Ionicons name="lock-closed-outline" size={22} color={colors.primary} />
          <Text style={styles.menuText}>Alterar Senha</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('BugReport')}
          accessibilityRole="button"
          accessibilityLabel="Reportar Bug"
          accessibilityHint="Abre a tela para reportar um problema"
        >
          <Ionicons name="bug-outline" size={22} color={colors.primary} />
          <Text style={styles.menuText}>Reportar Bug</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          accessibilityRole="button"
          accessibilityLabel="Sair"
          accessibilityHint="Encerra a sessão e volta para a tela de login"
        >
          <Ionicons name="log-out-outline" size={22} color={colors.error} />
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
          backgroundColor: colors.primary,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: Spacing.md,
          overflow: 'hidden',
        },
        avatarImage: {
          width: '100%',
          height: '100%',
        },
        name: {
          fontSize: FontSize.xl * fontScale,
          fontWeight: 'bold',
          color: colors.text,
        },
        email: {
          fontSize: FontSize.md * fontScale,
          color: colors.textSecondary,
          marginTop: Spacing.xs,
        },
        statsRow: {
          flexDirection: 'row',
          justifyContent: 'space-around',
          backgroundColor: colors.surface,
          borderRadius: BorderRadius.lg,
          padding: Spacing.base,
          marginBottom: Spacing.xl,
        },
        statBox: {
          alignItems: 'center',
        },
        statValue: {
          fontSize: FontSize.xxl * fontScale,
          fontWeight: 'bold',
          color: colors.primary,
        },
        statLabel: {
          fontSize: FontSize.sm * fontScale,
          color: colors.textSecondary,
          marginTop: Spacing.xs,
        },
        menuSection: {
          gap: Spacing.sm,
        },
        infoCard: {
          backgroundColor: colors.card,
          borderRadius: BorderRadius.lg,
          borderWidth: 1,
          borderColor: colors.border,
          padding: Spacing.base,
          marginBottom: Spacing.xl,
          gap: Spacing.sm,
        },
        infoTitle: {
          fontSize: FontSize.base * fontScale,
          fontWeight: '600',
          color: colors.text,
          marginBottom: Spacing.xs,
        },
        infoRow: {
          gap: Spacing.xs,
        },
        infoLabel: {
          fontSize: FontSize.sm * fontScale,
          color: colors.textSecondary,
        },
        infoValue: {
          fontSize: FontSize.base * fontScale,
          color: colors.text,
          fontWeight: '500',
        },
        menuItem: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.card,
          borderRadius: BorderRadius.lg,
          borderWidth: 1,
          borderColor: colors.border,
          padding: Spacing.base,
          gap: Spacing.md,
        },
        menuText: {
          flex: 1,
          fontSize: FontSize.base * fontScale,
          color: colors.text,
        },
        logoutButton: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.card,
          borderRadius: BorderRadius.lg,
          borderWidth: 1,
          borderColor: colors.error,
          padding: Spacing.base,
          gap: Spacing.md,
          marginTop: Spacing.md,
        },
        logoutText: {
          flex: 1,
          fontSize: FontSize.base * fontScale,
          color: colors.error,
          fontWeight: '600',
        },
      }),
    [colors, fontScale],
  );
}
