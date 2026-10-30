import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { colors, spacing, radius, typography } from '../theme';
import AppHeader from '../components/AppHeader';
import PrimaryButton from '../components/PrimaryButton';
import { ScreenProps } from '../types';
import { buscarPerfil } from '../services/userService';
import { logout } from '../services/authService';
import { ApiError } from '../services/api';
import { useToast } from '../context/ToastContext';
import { registrarAceiteDisclaimer } from '../utils/disclaimer';

const AVISOS = [
  {
    titulo: 'Não confie cegamente no resultado',
    texto:
      'O Nutribase é uma ferramenta de apoio e pode errar. Antes de consumir qualquer produto, confira sempre a lista de ingredientes na embalagem.',
  },
  {
    titulo: 'A leitura do rótulo pode falhar',
    texto:
      'O texto é lido pela câmera. Letras pequenas, reflexo, pouca luz ou fundos de baixo contraste podem fazer com que parte do rótulo não seja lida.',
  },
  {
    titulo: '“Produto Seguro” não é uma garantia',
    texto:
      'Significa apenas que nenhum termo ligado à lactose foi encontrado no texto lido. Continue atento aos avisos da embalagem, como “pode conter”.',
  },
  {
    titulo: 'Não substitui orientação profissional',
    texto:
      'O app trata apenas de lactose. Em caso de intolerância severa ou alergia, inclusive à proteína do leite, consulte um médico ou nutricionista.',
  },
  {
    titulo: 'Projeto acadêmico',
    texto: 'O Nutribase foi desenvolvido como Trabalho de Graduação e é oferecido sem garantias.',
  },
];

export default function DisclaimerScreen({ navigate }: ScreenProps) {
  const [marcado, setMarcado] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const { showToast } = useToast();

  const handleAceitar = async () => {
    if (!marcado) {
      showToast('error', 'Marque a caixa para confirmar que leu o aviso.');
      return;
    }

    setSalvando(true);
    try {
      const usuario = await buscarPerfil();
      await registrarAceiteDisclaimer(usuario.id);
      navigate('Home');
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        showToast('error', 'Sua sessão expirou. Faça login novamente.');
        navigate('Login');
        return;
      }
      showToast('error', e instanceof ApiError ? e.message : 'Não foi possível continuar. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  };

  const handleRecusar = async () => {
    try {
      await logout();
    } catch {
    
    }
    showToast('error', 'Para usar o Nutribase é preciso aceitar o aviso.');
    navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="Antes de começar" />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.intro}>Para usar o Nutribase com segurança, leia os avisos abaixo.</Text>

        {AVISOS.map((aviso, i) => (
          <View key={aviso.titulo} style={styles.aviso}>
            <Text style={styles.avisoTitulo}>
              {i + 1}. {aviso.titulo}
            </Text>
            <Text style={styles.avisoTexto}>{aviso.texto}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.checkRow}
          onPress={() => setMarcado((v) => !v)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: marcado }}
          activeOpacity={0.8}
        >
          <View style={[styles.checkbox, marcado && styles.checkboxMarcado]}>
            {marcado && <Text style={styles.checkMark}>✓</Text>}
          </View>
          <Text style={styles.checkText}>Li e entendi que não devo confiar cegamente nos resultados do Nutribase.</Text>
        </TouchableOpacity>

        {salvando ? (
          <ActivityIndicator color={colors.buttonBg} style={{ marginVertical: spacing.md }} />
        ) : (
          <PrimaryButton
            label="Aceitar e continuar"
            onPress={handleAceitar}
            color={marcado ? undefined : colors.textMuted}
          />
        )}

        <TouchableOpacity onPress={handleRecusar} disabled={salvando}>
          <Text style={styles.recusar}>Não aceito</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  intro: { ...typography.body, color: colors.textDark, marginBottom: spacing.lg },
  aviso: { backgroundColor: colors.cardBg, borderRadius: radius.card, padding: spacing.lg, marginBottom: spacing.md },
  avisoTitulo: { ...typography.label, color: colors.textDark, marginBottom: spacing.sm },
  avisoTexto: { ...typography.body, color: colors.textDark, lineHeight: 22 },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.inputBg,
    backgroundColor: colors.background,
  },
  checkRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.buttonBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    backgroundColor: colors.background,
  },
  checkboxMarcado: { backgroundColor: colors.buttonBg },
  checkMark: { color: colors.white, fontSize: 16, fontWeight: '700' },
  checkText: { ...typography.body, color: colors.textDark, flex: 1 },
  recusar: {
    ...typography.body,
    color: colors.textDark,
    textAlign: 'center',
    marginTop: spacing.lg,
    textDecorationLine: 'underline',
  },
});