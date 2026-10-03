import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { colors, spacing } from '../theme';
import AppTextInput from '../components/AppTextInput';
import PrimaryButton from '../components/PrimaryButton';
import BrandHeader from '../components/BrandHeader';
import KeyboardAvoidingScreen from '../components/KeyboardAvoidingScreen';
import { ScreenProps } from '../types';
import { login } from '../services/authService';
import { ApiError } from '../services/api';
import { useToast } from '../context/ToastContext';

export default function LoginScreen({ navigate }: ScreenProps) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const { showToast } = useToast();

  const handleLogin = async () => {
    if (!email.trim() || !senha) {
      showToast('error', 'Preencha e-mail e senha.');
      return;
    }

    setCarregando(true);
    try {
      await login(email.trim().toLowerCase(), senha);
      showToast('success', 'Login realizado com sucesso!');
      navigate('Home');
    } catch (e) {
      const mensagem = e instanceof ApiError ? e.message : 'Não foi possível fazer login. Tente novamente.';
      showToast('error', mensagem);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <BrandHeader />

      <KeyboardAvoidingScreen contentContainerStyle={styles.form}>
        <AppTextInput label="Usuário/E-mail" placeholder="exemplo" value={email} onChangeText={setEmail} />
        <AppTextInput label="Senha" secure value={senha} onChangeText={setSenha} />

        <TouchableOpacity onPress={() => navigate('EsqueciSenha')}>
          <Text style={styles.link}>Esqueceu a senha?</Text>
        </TouchableOpacity>

        {carregando ? (
          <ActivityIndicator color={colors.buttonBg} style={{ marginTop: spacing.lg }} />
        ) : (
          <PrimaryButton label="Fazer Login" onPress={handleLogin} style={{ marginTop: spacing.lg }} />
        )}

        <TouchableOpacity onPress={() => navigate('Cadastro')}>
          <Text style={styles.linkCenter}>Ainda não possui uma conta?</Text>
        </TouchableOpacity>
      </KeyboardAvoidingScreen>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  form: { justifyContent: 'center', flexGrow: 1, paddingHorizontal: spacing.lg },
  link: { fontSize: 14, color: colors.textDark, marginTop: spacing.xs, marginBottom: spacing.lg },
  linkCenter: { fontSize: 14, color: colors.textDark, textAlign: 'center', marginTop: spacing.lg },
  errorText: { color: colors.dangerRed, fontSize: 14, marginTop: spacing.sm },
});
