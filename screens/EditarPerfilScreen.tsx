import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { colors, spacing, typography } from '../theme';
import AppHeader from '../components/AppHeader';
import AppTextInput from '../components/AppTextInput';
import PrimaryButton from '../components/PrimaryButton';
import KeyboardAvoidingScreen from '../components/KeyboardAvoidingScreen';
import { ScreenProps } from '../types';
import { buscarPerfil, atualizarPerfil } from '../services/userService';
import { ApiError } from '../services/api';

export default function EditarPerfilScreen({ navigate }: ScreenProps) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const [carregandoPerfil, setCarregandoPerfil] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const usuario = await buscarPerfil();
        setNome(usuario.nome);
        setEmail(usuario.email);
      } catch (e) {
        const mensagem = e instanceof ApiError ? e.message : 'Não foi possível carregar seus dados.';
        setErro(mensagem);
      } finally {
        setCarregandoPerfil(false);
      }
    })();
  }, []);

  const handleConfirmar = async () => {
    setErro(null);

    if (!senha) {
      setErro('Digite sua senha atual para confirmar a alteração.');
      return;
    }

    setSalvando(true);
    try {
      await atualizarPerfil({ senhaAtual: senha, nome: nome.trim() });
      navigate('Perfil');
    } catch (e) {
      const mensagem = e instanceof ApiError ? e.message : 'Não foi possível atualizar o perfil.';
      setErro(mensagem);
    } finally {
      setSalvando(false);
    }
  };

  if (carregandoPerfil) {
    return (
      <SafeAreaView style={styles.container}>
        <AppHeader showBack onBack={() => navigate('Perfil')} title="Editar Perfil" />
        <ActivityIndicator color={colors.buttonBg} style={{ marginTop: spacing.xl }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader showBack onBack={() => navigate('Perfil')} title="Editar Perfil" />

      <KeyboardAvoidingScreen contentContainerStyle={styles.content}>
        <TouchableOpacity
          style={styles.avatarLarge}
          accessibilityLabel="Alterar foto de perfil"
          onPress={() => setErro('Upload de foto ainda não está disponível nesta versão.')}
        >
          <Text style={styles.avatarIcon}>🙂</Text>
          <View style={styles.editBadge}>
            <Text style={styles.editBadgeIcon}>✎</Text>
          </View>
        </TouchableOpacity>

        <AppTextInput label="Nome" value={nome} onChangeText={setNome} />

        <Text style={styles.readOnlyLabel}>E-mail</Text>
        <Text style={styles.readOnlyValue}>{email}</Text>

        <AppTextInput label="Confirme sua senha" secure value={senha} onChangeText={setSenha} />

        {erro && <Text style={styles.errorText}>{erro}</Text>}

        {salvando ? (
          <ActivityIndicator color={colors.buttonBg} style={{ marginTop: spacing.lg }} />
        ) : (
          <PrimaryButton label="Confirmar" onPress={handleConfirmar} style={{ marginTop: spacing.lg }} />
        )}
      </KeyboardAvoidingScreen>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingTop: spacing.xl, alignItems: 'stretch' },
  avatarLarge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.inputBg,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: spacing.xl,
  },
  avatarIcon: { fontSize: 44 },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.buttonBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBadgeIcon: { color: colors.white, fontSize: 14 },
  readOnlyLabel: { ...typography.label, color: colors.textDark, marginBottom: spacing.sm },
  readOnlyValue: {
    ...typography.body,
    color: colors.textMuted,
    backgroundColor: colors.cardBg,
    borderRadius: 28,
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  errorText: { color: colors.dangerRed, fontSize: 14, marginTop: spacing.sm },
});
