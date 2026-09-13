import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { colors, spacing, typography } from '../theme';
import AppTextInput from '../components/AppTextInput';
import PrimaryButton from '../components/PrimaryButton';
import BrandHeader from '../components/BrandHeader';
import { ScreenProps } from '../types';


export default function LoginScreen({ navigate }: ScreenProps) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <BrandHeader />

      <View style={styles.form}>
        <AppTextInput label="Usuário/E-mail" placeholder="exemplo" value={email} onChangeText={setEmail} />
        <AppTextInput label="Senha" secure value={senha} onChangeText={setSenha} />

        <TouchableOpacity onPress={() => navigate('EsqueciSenha')}>
          <Text style={styles.link}>Esqueceu a senha?</Text>
        </TouchableOpacity>

        <PrimaryButton label="Fazer Login" onPress={() => navigate('Home')} style={{ marginTop: spacing.lg }} />

        <TouchableOpacity onPress={() => navigate('Cadastro')}>
          <Text style={styles.linkCenter}>Ainda não possui uma conta?</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  form: { flex: 1, justifyContent: 'center', paddingHorizontal: spacing.lg },
  link: { fontSize: 14, color: colors.textDark, marginTop: spacing.xs, marginBottom: spacing.lg },
  linkCenter: { fontSize: 14, color: colors.textDark, textAlign: 'center', marginTop: spacing.lg },
});
