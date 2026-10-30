import React, { useState } from 'react';
import { Text, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { colors, spacing, typography } from '../theme';
import BrandHeader from '../components/BrandHeader';
import AppTextInput from '../components/AppTextInput';
import PrimaryButton from '../components/PrimaryButton';
import KeyboardAvoidingScreen from '../components/KeyboardAvoidingScreen';
import { ScreenProps } from '../types';
import { solicitarRecuperacaoSenha, redefinirSenha } from '../services/authService';
import { ApiError } from '../services/api';
import { useToast } from '../context/ToastContext';

type Etapa = 'email' | 'codigo';

export default function EsqueciSenhaScreen({ navigate }: ScreenProps) {
  const [etapa, setEtapa] = useState<Etapa>('email');
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const { showToast } = useToast();

  const emailNormalizado = email.trim().toLowerCase();

  const handleVoltar = () => {
    if (etapa === 'codigo') {
      setCodigo('');
      setNovaSenha('');
      setConfirmarSenha('');
      setEtapa('email');
    } else {
      navigate('Login');
    }
  };

  const enviarCodigo = async (reenvio = false) => {
    if (!emailNormalizado) {
      showToast('error', 'Informe o e-mail da sua conta.');
      return;
    }

    setCarregando(true);
    try {
      await solicitarRecuperacaoSenha(emailNormalizado);
      showToast('success', reenvio ? 'Novo código enviado.' : 'Código enviado para o seu e-mail.');
      setEtapa('codigo');
    } catch (e) {
      const mensagem = e instanceof ApiError ? e.message : 'Não foi possível enviar o código. Tente novamente.';
      showToast('error', mensagem);
    } finally {
      setCarregando(false);
    }
  };

  const handleRedefinir = async () => {
    if (codigo.length !== 6) {
      showToast('error', 'Digite o código de 6 dígitos.');
      return;
    }
    if (novaSenha.length < 6) {
      showToast('error', 'A senha deve ter ao menos 6 caracteres.');
      return;
    }
    if (novaSenha !== confirmarSenha) {
      showToast('error', 'As senhas não coincidem.');
      return;
    }

    setCarregando(true);
    try {
      await redefinirSenha(emailNormalizado, codigo, novaSenha);
      showToast('success', 'Senha redefinida com sucesso! Faça login com a nova senha.');
      navigate('Login');
    } catch (e) {
      const mensagem = e instanceof ApiError ? e.message : 'Não foi possível redefinir a senha. Tente novamente.';
      showToast('error', mensagem);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <BrandHeader />
      <KeyboardAvoidingScreen contentContainerStyle={styles.form}>
        <TouchableOpacity onPress={handleVoltar} accessibilityLabel="Voltar" style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Recuperar Senha</Text>

        {etapa === 'email' ? (
          <>
            <Text style={styles.info}>Informe o e-mail da sua conta para receber um código de recuperação.</Text>
            <AppTextInput
              label="E-mail"
              placeholder="exemplo@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {carregando ? (
              <ActivityIndicator color={colors.buttonBg} style={{ marginTop: spacing.lg }} />
            ) : (
              <PrimaryButton label="Enviar código" onPress={() => enviarCodigo()} style={{ marginTop: spacing.lg }} />
            )}
          </>
        ) : (
          <>
            <Text style={styles.info}>
              Enviamos um código de 6 dígitos para {emailNormalizado}. Ele expira em 15 minutos.
            </Text>
            <AppTextInput
              label="Código"
              placeholder="000000"
              value={codigo}
              onChangeText={(texto) => setCodigo(texto.replace(/\D/g, ''))}
              keyboardType="number-pad"
              maxLength={6}
            />
            <AppTextInput label="Nova senha" secure value={novaSenha} onChangeText={setNovaSenha} />
            <AppTextInput label="Confirmar nova senha" secure value={confirmarSenha} onChangeText={setConfirmarSenha} />

            {carregando ? (
              <ActivityIndicator color={colors.buttonBg} style={{ marginTop: spacing.lg }} />
            ) : (
              <PrimaryButton label="Redefinir senha" onPress={handleRedefinir} style={{ marginTop: spacing.lg }} />
            )}

            <TouchableOpacity onPress={() => enviarCodigo(true)} disabled={carregando}>
              <Text style={styles.link}>Não recebeu? Reenviar código</Text>
            </TouchableOpacity>
          </>
        )}
      </KeyboardAvoidingScreen>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  form: { padding: spacing.lg, paddingTop: spacing.lg },
  backButton: { marginBottom: spacing.lg },
  backIcon: { fontSize: 24, color: colors.textDark },
  title: { ...typography.h1, fontSize: 32, color: colors.textDark, marginBottom: spacing.lg },
  info: { ...typography.body, color: colors.textDark, marginBottom: spacing.lg },
  link: { ...typography.body, color: colors.textDark, textAlign: 'center', marginTop: spacing.lg, textDecorationLine: 'underline' },
});