import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../theme';
import { avaliarSenha } from '../utils/senha';

interface PasswordStrengthProps {
  senha: string;
  onGerar: () => void;
}

const COR_FORCA: Record<number, string> = {
  0: '#CFC6AE',
  1: colors.dangerRed,
  2: '#C98A00',
  3: colors.safeGreen,
  4: colors.safeGreen,
};


export default function PasswordStrength({ senha, onGerar }: PasswordStrengthProps) {
  const { requisitos, forca, rotulo } = avaliarSenha(senha);
  const cor = COR_FORCA[forca];

  return (
    <View style={styles.container}>
      <View style={styles.barRow} accessibilityLabel={`Força da senha: ${rotulo || 'não informada'}`}>
        {[1, 2, 3, 4].map((n) => (
          <View key={n} style={[styles.segment, { backgroundColor: forca >= n ? cor : COR_FORCA[0] }]} />
        ))}
      </View>
      <Text style={[styles.forcaLabel, { color: cor }]}>{rotulo ? `Senha ${rotulo.toLowerCase()}` : ' '}</Text>

      {requisitos.map((r) => (
        <View key={r.id} style={styles.reqRow}>
          <Text style={[styles.reqIcon, { color: r.ok ? colors.safeGreen : colors.textMuted }]}>{r.ok ? '✓' : '○'}</Text>
          <Text style={[styles.reqText, { color: r.ok ? colors.safeGreen : colors.textMuted }]}>{r.label}</Text>
        </View>
      ))}

      <TouchableOpacity onPress={onGerar} accessibilityRole="button" accessibilityLabel="Gerar senha forte">
        <Text style={styles.gerar}>Gerar senha forte</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.md, paddingHorizontal: spacing.sm },
  barRow: { flexDirection: 'row', gap: 6, marginBottom: spacing.xs },
  segment: { flex: 1, height: 6, borderRadius: 3 },
  forcaLabel: { ...typography.link, marginBottom: spacing.sm },
  reqRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  reqIcon: { width: 20, fontSize: 14, fontWeight: '700' },
  reqText: { fontSize: 14 },
  gerar: {
    ...typography.link,
    color: colors.textDark,
    textDecorationLine: 'underline',
    marginTop: spacing.sm,
    paddingVertical: spacing.xs,
  },
});
