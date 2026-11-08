import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { colors, spacing, radius, typography } from '../theme';
import AppHeader from '../components/AppHeader';
import { ScreenProps } from '../types';
import { POLITICA_SECOES, POLITICA_ATUALIZADA_EM } from '../utils/politicaPrivacidade';


export default function PoliticaPrivacidadeScreen({ navigate, origem }: ScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <AppHeader showBack onBack={() => navigate(origem ?? 'Perfil')} title="Política de Privacidade" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.data}>Última atualização: {POLITICA_ATUALIZADA_EM}</Text>
        {POLITICA_SECOES.map((s) => (
          <View key={s.titulo} style={styles.secao}>
            <Text style={styles.secaoTitulo}>{s.titulo}</Text>
            <Text style={styles.secaoTexto}>{s.texto}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  data: { ...typography.body, color: colors.textDark, marginBottom: spacing.md },
  secao: { backgroundColor: colors.cardBg, borderRadius: radius.card, padding: spacing.lg, marginBottom: spacing.md },
  secaoTitulo: { ...typography.label, color: colors.textDark, marginBottom: spacing.sm },
  secaoTexto: { ...typography.body, color: colors.textDark, lineHeight: 22 },
});
