import React, { useState } from 'react';
import { Text, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { colors, spacing, typography } from '../theme';
import BrandHeader from '../components/BrandHeader';
import AppTextInput from '../components/AppTextInput';
import PrimaryButton from '../components/PrimaryButton';
import KeyboardAvoidingScreen from '../components/KeyboardAvoidingScreen';
import { ScreenProps } from '../types';
import { registrar } from '../services/authService';
import { ApiError } from '../services/api';
import { useToast } from '../context/ToastContext';

export default function CadastroScreen({ navigate }: ScreenProps) {
  const [nome, setNome] = useState('');
  const [contato, setContato] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
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
    if (senha.length < 6) {
      showToast('error', 'A senha deve ter ao menos 6 caracteres.');
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

  return (
    <SafeAreaView style={styles.container}>
      <BrandHeader />
      <KeyboardAvoidingScreen contentContainerStyle={styles.form}>
        <TouchableOpacity onPress={() => navigate('Login')} accessibilityLabel="Voltar" style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Cadastrar-se</Text>

        <AppTextInput label="Nome" placeholder="Seu nome completo" value={nome} onChangeText={setNome} />
        <AppTextInput label="E-mail" placeholder="exemplo@email.com" value={contato} onChangeText={setContato} />
        <AppTextInput label="Senha" secure value={senha} onChangeText={setSenha} />
        <AppTextInput label="Confirmar Senha" secure value={confirmarSenha} onChangeText={setConfirmarSenha} />

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

