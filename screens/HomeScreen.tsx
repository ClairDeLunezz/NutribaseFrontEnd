import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { colors, spacing, radius, typography } from '../theme';
import AppHeader from '../components/AppHeader';
import { ScreenProps } from '../types';

interface HistoricoItem {
  id: string;
  nome: string;
  seguro: boolean;
}

const historico: HistoricoItem[] = [];

export default function HomeScreen({ navigate }: ScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigate('Perfil')} activeOpacity={0.8}>
        <AppHeader title="Início" showAvatar />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Histórico</Text>

        {historico.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>Nenhum registro ainda</Text>
            <Text style={styles.emptyText}>
              Escaneie o rótulo de um produto para começar a construir seu histórico de consultas.
            </Text>
          </View>
        ) : (
          historico.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={[styles.cardBar, { backgroundColor: item.seguro ? colors.safeGreen : colors.dangerRed }]} />
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>{item.nome}</Text>
                <View style={styles.statusRow}>
                  <Text style={{ color: item.seguro ? colors.safeGreen : colors.dangerRed, fontSize: 18 }}>
                    {item.seguro ? '✓' : '⚠'}
                  </Text>
                  <Text style={[styles.statusText, { color: item.seguro ? colors.safeGreen : colors.dangerRed }]}>
                    {item.seguro ? 'Produto Seguro' : 'Produto Prejudicial'}
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <TouchableOpacity onPress={() => navigate('Escaneamento')} accessibilityLabel="Escanear rótulo" style={styles.fab}>
        <Image source={require('../assets/icon-camera.png')} style={styles.fabIcon} resizeMode="contain" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: 120 },
  sectionTitle: { ...typography.h1, color: colors.textDark, marginBottom: spacing.lg },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
    paddingHorizontal: spacing.lg,
  },
  emptyIcon: { fontSize: 40, marginBottom: spacing.md },
  emptyTitle: { ...typography.h2, color: colors.textDark, marginBottom: spacing.sm },
  emptyText: { ...typography.body, color: colors.textMuted, textAlign: 'center' },
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: radius.card,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  cardBar: { height: 10, width: '100%' },
  cardBody: { padding: spacing.lg },
  cardTitle: { ...typography.label, color: colors.textDark, marginBottom: spacing.lg },
  statusRow: { flexDirection: 'row', alignItems: 'center' },
  statusText: { ...typography.body, marginLeft: spacing.sm, fontWeight: '600' },
  fab: {
    position: 'absolute',
    bottom: 32,
    alignSelf: 'center',
  },
  fabIcon: { width: 68, height: 68 },
});
