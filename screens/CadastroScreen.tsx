import React, { useState } from 'react';
import { Text, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { colors, spacing, typography } from '../theme';
import BrandHeader from '../components/BrandHeader';
import AppTextInput from '../components/AppTextInput';
import PrimaryButton from '../components/PrimaryButton';
import PasswordStrength from '../components/PasswordStrength';
import KeyboardAvoidingScreen from '../components/KeyboardAvoidingScreen';
import { ScreenProps } from '../types';
import { registrar } from '../services/authService';
import { ApiError } from '../services/api';
import { useToast } from '../context/ToastContext';
import { gerarSenha, validarSenha } from '../utils/senha';

export default function CadastroScreen({ navigate }: ScreenProps) {
  const [nome, setNome] = useState('');
  const [contato, setContato] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [revelar, setRevelar] = useState(0);
  const { showToast } = useToast();

  const handleCadastro = async () => {
    if (!nome.trim() || !contato.trim() || !senha || !confirmarSenha) {
      showToast('error', 'Preencha todos os campos.');
      return;
    }
    if (senha !== confirmarSenha) {
      showToast('error', 'As senhas não coincidem.');
      return;
    }
    const erroSenha = validarSenha(senha);
    if (erroSenha) {
      showToast('error', erroSenha);
      return;
    }

    setCarregando(true);
    try {
      await registrar(nome.trim(), contato.trim().toLowerCase(), senha, confirmarSenha);
      showToast('success', 'Cadastro realizado com sucesso! Faça login para continuar.');
      navigate('Login');
    } catch (e) {
      const mensagem = e instanceof ApiError ? e.message : 'Não foi possível concluir o cadastro. Tente novamente.';
      showToast('error', mensagem);
    } finally {
      setCarregando(false);
    }
  };

  const handleGerarSenha = () => {
    const nova = gerarSenha();
    setSenha(nova);
    setConfirmarSenha(nova);
    setRevelar((n) => n + 1);
    showToast('success', 'Senha gerada. Anote-a em um lugar seguro antes de continuar.');
  };

  const senhasDiferentes = confirmarSenha.length > 0 && senha !== confirmarSenha;

  return (
    <SafeAreaView style={styles.container}>
      <BrandHeader />
      <KeyboardAvoidingScreen contentContainerStyle={styles.form}>
        <TouchableOpacity onPress={() => navigate('Login')} accessibilityLabel="Voltar" style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Cadastrar-se</Text>

        <AppTextInput
          label="Nome"
          placeholder="Seu nome completo"
          value={nome}
          onChangeText={setNome}
          autoCapitalize="words"
          autoComplete="name"
          maxLength={120}
        />
        <AppTextInput
          label="E-mail"
          placeholder="exemplo@email.com"
          value={contato}
          onChangeText={setContato}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          maxLength={150}
        />
        <AppTextInput label="Senha" secure value={senha} onChangeText={setSenha} autoComplete="new-password" revelar={revelar} />
        <PasswordStrength senha={senha} onGerar={handleGerarSenha} />
        <AppTextInput
          label="Confirmar Senha"
          secure
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          autoComplete="new-password"
          revelar={revelar}
        />
        {senhasDiferentes && <Text style={styles.errorText}>As senhas não coincidem.</Text>}

        {carregando ? (
          <ActivityIndicator color={colors.buttonBg} style={{ marginTop: spacing.lg }} />
        ) : (
          <PrimaryButton label="Fazer Cadastro" onPress={handleCadastro} style={{ marginTop: spacing.lg }} />
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
  title: { ...typography.h1, fontSize: 32, color: colors.textDark, marginBottom: spacing.xl },
  errorText: { color: colors.dangerRed, fontSize: 14, marginTop: spacing.sm },
});

