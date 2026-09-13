import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { colors, spacing, typography } from '../theme';
import BrandHeader from '../components/BrandHeader';
import AppTextInput from '../components/AppTextInput';
import PrimaryButton from '../components/PrimaryButton';
import { ScreenProps } from '../types';

export default function EsqueciSenhaScreen({ navigate }: ScreenProps) {
  const [contato, setContato] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <BrandHeader />
      <View style={styles.form}>
        <TouchableOpacity onPress={() => navigate('Login')} accessibilityLabel="Voltar" style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Recuperar Senha</Text>

        <AppTextInput label="E-mail/Telefone" placeholder="exemplo" value={contato} onChangeText={setContato} />
        <PrimaryButton label="Enviar E-mail" onPress={() => navigate('Login')} style={{ marginTop: spacing.lg }} />
      </View>
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
