import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { colors, spacing, typography } from '../theme';
import AppHeader from '../components/AppHeader';
import PrimaryButton from '../components/PrimaryButton';
import { ScreenProps } from '../types';


export default function PerfilScreen({ navigate }: ScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <AppHeader showBack onBack={() => navigate('Home')} title="Perfil" />

      <View style={styles.content}>
        <View style={styles.infoRow}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarIcon}>🙂</Text>
          </View>
          <View style={styles.infoText}>
            <Text style={styles.name}>Maria Silva</Text>
            <Text style={styles.detail}>maria.silva@email.com</Text>
            <Text style={styles.detail}>(11) 99999-0000</Text>
          </View>
        </View>

        <PrimaryButton label="Editar Perfil" onPress={() => navigate('EditarPerfil')} style={{ marginTop: spacing.xl }} />
        <PrimaryButton
          label="Fazer Logoff"
          onPress={() => navigate('Login')}
          color={colors.inputBg}
          textColor={colors.textDark}
          style={{ marginTop: spacing.md }}
        />
        <PrimaryButton
          label="Excluir Conta"
          onPress={() => navigate('Login')}
          color={colors.dangerRed}
          style={{ marginTop: spacing.md }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingTop: spacing.xl },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
  avatarLarge: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.inputBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.lg,
  },
  avatarIcon: { fontSize: 40 },
  infoText: { flex: 1 },
  name: { ...typography.h2, color: colors.textDark, marginBottom: spacing.xs },
  detail: { ...typography.body, color: colors.textDark },
});
