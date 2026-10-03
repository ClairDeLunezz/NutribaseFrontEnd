import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { colors, spacing, typography } from '../theme';
import AppHeader from '../components/AppHeader';
import PrimaryButton from '../components/PrimaryButton';
import PasswordConfirmModal from '../components/PasswordConfirmModal';
import { ScreenProps } from '../types';
import { buscarPerfil, excluirConta } from '../services/userService';
import { logout, Usuario } from '../services/authService';
import { ApiError } from '../services/api';
import { useToast } from '../context/ToastContext';
import { buildAssetUrl } from '../utils/buildAssetUrl';

export default function PerfilScreen({ navigate }: ScreenProps) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregandoPerfil, setCarregandoPerfil] = useState(true);
  const [erroPerfil, setErroPerfil] = useState<string | null>(null);

  const [modalVisivel, setModalVisivel] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const [erroExclusao, setErroExclusao] = useState<string | null>(null);

  const { showToast } = useToast();

  useEffect(() => {
    carregarPerfil();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const carregarPerfil = async () => {
    setCarregandoPerfil(true);
    setErroPerfil(null);
    try {
      const dados = await buscarPerfil();
      setUsuario(dados);
    } catch (e) {
      const mensagem = e instanceof ApiError ? e.message : 'Não foi possível carregar o perfil.';
      setErroPerfil(mensagem);
      showToast('error', mensagem);
    } finally {
      setCarregandoPerfil(false);
    }
  };

  const handleLogoff = async () => {
    await logout(); // já limpa o token localmente mesmo se a chamada à API falhar
    showToast('success', 'Sessão encerrada.');
    navigate('Login');
  };

  const handleConfirmarExclusao = async (senha: string) => {
    if (!senha) {
      setErroExclusao('Digite sua senha para confirmar.');
      return;
    }
    setExcluindo(true);
    setErroExclusao(null);
    try {
      await excluirConta(senha);
      setModalVisivel(false);
      showToast('success', 'Conta excluída com sucesso.');
      navigate('Login');
    } catch (e) {
      const mensagem = e instanceof ApiError ? e.message : 'Não foi possível excluir a conta.';
      setErroExclusao(mensagem);
    } finally {
      setExcluindo(false);
    }
  };

  const fotoUrl = buildAssetUrl(usuario?.foto_perfil);

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader showBack onBack={() => navigate('Home')} title="Perfil" />

      <View style={styles.content}>
        {carregandoPerfil ? (
          <ActivityIndicator color={colors.buttonBg} style={{ marginTop: spacing.xl }} />
        ) : erroPerfil ? (
          <Text style={styles.errorText}>{erroPerfil}</Text>
        ) : (
          <View style={styles.infoRow}>
            <View style={styles.avatarLarge}>
              {fotoUrl ? (
                <Image source={{ uri: fotoUrl }} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarIcon}>🙂</Text>
              )}
            </View>
            <View style={styles.infoText}>
              <Text style={styles.name}>{usuario?.nome}</Text>
              <Text style={styles.detail}>{usuario?.email}</Text>
            </View>
          </View>
        )}

        <PrimaryButton label="Editar Perfil" onPress={() => navigate('EditarPerfil')} style={{ marginTop: spacing.xl }} />
        <PrimaryButton
          label="Fazer Logoff"
          onPress={handleLogoff}
          color={colors.inputBg}
          textColor={colors.textDark}
          style={{ marginTop: spacing.md }}
        />
        <PrimaryButton
          label="Excluir Conta"
          onPress={() => setModalVisivel(true)}
          color={colors.dangerRed}
          style={{ marginTop: spacing.md }}
        />
      </View>

      <PasswordConfirmModal
        visible={modalVisivel}
        title="Excluir conta"
        message="Essa ação é permanente e vai apagar seu histórico. Digite sua senha para confirmar."
        confirmLabel="Excluir"
        confirmColor={colors.dangerRed}
        loading={excluindo}
        errorMessage={erroExclusao}
        onCancel={() => {
          setModalVisivel(false);
          setErroExclusao(null);
        }}
        onConfirm={handleConfirmarExclusao}
      />
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
    overflow: 'hidden',
  },
  avatarImage: { width: '100%', height: '100%' },
  avatarIcon: { fontSize: 40 },
  infoText: { flex: 1 },
  name: { ...typography.h2, color: colors.textDark, marginBottom: spacing.xs },
  detail: { ...typography.body, color: colors.textDark },
  errorText: { color: colors.dangerRed, ...typography.body, marginTop: spacing.lg },
});
