import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { colors, spacing, typography } from '../theme';
import BrandHeader from '../components/BrandHeader';
import AppTextInput from '../components/AppTextInput';
import PrimaryButton from '../components/PrimaryButton';
import { ScreenProps } from '../types';

export default function CadastroScreen({ navigate }: ScreenProps) {
  const [nome, setNome] = useState('');
  const [contato, setContato] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <BrandHeader />
      <ScrollView contentContainerStyle={styles.form}>
        <TouchableOpacity onPress={() => navigate('Login')} accessibilityLabel="Voltar" style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Cadastrar-se</Text>

        <AppTextInput label="Nome" placeholder="Seu nome completo" value={nome} onChangeText={setNome} />
        <AppTextInput label="E-mail/Telefone" placeholder="exemplo" value={contato} onChangeText={setContato} />
        <AppTextInput label="Senha" secure value={senha} onChangeText={setSenha} />
        <AppTextInput label="Confirmar Senha" secure value={confirmarSenha} onChangeText={setConfirmarSenha} />

        <PrimaryButton label="Fazer Cadastro" onPress={() => navigate('Login')} style={{ marginTop: spacing.lg }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  form: { padding: spacing.lg, paddingTop: spacing.lg },
  backButton: { marginBottom: spacing.lg },
  backIcon: { fontSize: 24, color: colors.textDark },
  title: { ...typography.h1, fontSize: 32, color: colors.textDark, marginBottom: spacing.xl },
});
