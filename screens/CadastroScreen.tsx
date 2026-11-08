import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
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
import { consumirRascunho, guardarRascunho } from '../utils/rascunhoCadastro';

export default function CadastroScreen({ navigate }: ScreenProps) {
  const rascunho = useRef(consumirRascunho()).current;
  const [nome, setNome] = useState(rascunho?.nome ?? '');
  const [contato, setContato] = useState(rascunho?.contato ?? '');
  const [senha, setSenha] = useState(rascunho?.senha ?? '');
  const [confirmarSenha, setConfirmarSenha] = useState(rascunho?.confirmarSenha ?? '');
  const [carregando, setCarregando] = useState(false);
  const [revelar, setRevelar] = useState(0);
  const [aceitou, setAceitou] = useState(rascunho?.aceitou ?? false);
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

    if (!aceitou) {
      showToast('error', 'Aceite a Política de Privacidade para criar a conta.');
      return;
    }

    setCarregando(true);
    try {
      await registrar(nome.trim(), contato.trim().toLowerCase(), senha, confirmarSenha, aceitou);
      showToast('success', 'Cadastro realizado com sucesso! Faça login para continuar.');
      navigate('Login');
    } catch (e) {
      const mensagem = e instanceof ApiError ? e.message : 'Não foi possível concluir o cadastro. Tente novamente.';
      showToast('error', mensagem);
    } finally {
      setCarregando(false);
    }
  };

  const abrirPolitica = () => {
    guardarRascunho({ nome, contato, senha, confirmarSenha, aceitou });
    navigate('Politica', { origem: 'Cadastro' });
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

        <TouchableOpacity
          style={styles.checkRow}
          onPress={() => setAceitou((v) => !v)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: aceitou }}
          activeOpacity={0.8}
        >
          <View style={[styles.checkbox, aceitou && styles.checkboxMarcado]}>
            {aceitou && <Text style={styles.checkMark}>✓</Text>}
          </View>
          <Text style={styles.checkText}>
            Li e aceito a{' '}
            <Text style={styles.link} onPress={abrirPolitica}>
              Política de Privacidade
            </Text>
            .
          </Text>
        </TouchableOpacity>

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
  checkRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.lg },
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
  link: { color: colors.buttonBg, textDecorationLine: 'underline', fontWeight: '600' },
  errorText: { color: colors.dangerRed, fontSize: 14, marginTop: spacing.sm },
});

