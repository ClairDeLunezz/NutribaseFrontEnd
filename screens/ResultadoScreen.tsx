import React from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView } from 'react-native';
import { colors, spacing, radius, typography } from '../theme';
import PrimaryButton from '../components/PrimaryButton';
import { ScreenProps } from '../types';

interface ResultadoScreenProps extends ScreenProps {
  status: 'seguro' | 'prejudicial';
}


export default function ResultadoScreen({ navigate, status, photoUri, productName }: ResultadoScreenProps) {
  const isSafe = status === 'seguro';

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ height: 90, backgroundColor: colors.headerBg }} />

      <View style={styles.body}>
        {photoUri && <Image source={{ uri: photoUri }} style={styles.photoThumb} />}

        <View style={[styles.banner, { backgroundColor: isSafe ? colors.safeGreen : colors.dangerRed }]}>
          <Text style={styles.bannerIcon}>{isSafe ? '✓' : '⚠'}</Text>
          <Text style={styles.bannerText}>{isSafe ? 'Produto Seguro' : 'Produto Prejudicial'}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.productName}>
            {productName || 'Produto sem nome informado'}
          </Text>

          {!isSafe && (
            <Text style={styles.warningMessage}>
              Este produto contém lactose em sua fórmula e pode não ser adequado para pessoas com
              intolerância. Verifique a lista de ingredientes antes de consumir.
            </Text>
          )}
        </View>

        <PrimaryButton label="Retornar" onPress={() => navigate('Home')} style={{ marginTop: spacing.xl }} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  body: { flex: 1, padding: spacing.lg, justifyContent: 'center' },
  photoThumb: {
    width: '100%',
    height: 160,
    borderRadius: radius.card,
    marginBottom: spacing.lg,
    backgroundColor: colors.cardBg,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderTopLeftRadius: radius.card,
    borderTopRightRadius: radius.card,
  },
  bannerIcon: { color: colors.white, fontSize: 20, marginRight: spacing.sm },
  bannerText: { ...typography.label, color: colors.white },
  card: {
    backgroundColor: colors.cardBg,
    padding: spacing.xl,
    borderBottomLeftRadius: radius.card,
    borderBottomRightRadius: radius.card,
    minHeight: 220,
  },
  productName: { ...typography.h2, color: colors.textDark, marginBottom: spacing.md },
  warningMessage: { ...typography.body, color: colors.textDark, lineHeight: 22 },
});