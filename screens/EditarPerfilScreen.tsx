import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { colors, spacing, typography } from '../theme';
import AppHeader from '../components/AppHeader';
import AppTextInput from '../components/AppTextInput';
import PrimaryButton from '../components/PrimaryButton';
import { ScreenProps } from '../types';


export default function EditarPerfilScreen({ navigate }: ScreenProps) {
  const [nome, setNome] = useState('Maria Silva');
  const [email, setEmail] = useState('maria.silva@email.com');
  const [telefone, setTelefone] = useState('(11) 99999-0000');
  const [senha, setSenha] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader showBack onBack={() => navigate('Perfil')} title="Editar Perfil" />

      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.avatarLarge} accessibilityLabel="Alterar foto de perfil">
          <Text style={styles.avatarIcon}>🙂</Text>
          <View style={styles.editBadge}>
            <Text style={styles.editBadgeIcon}>✎</Text>
          </View>
        </TouchableOpacity>

        <AppTextInput label="Nome" value={nome} onChangeText={setNome} />
        <AppTextInput label="E-mail" value={email} onChangeText={setEmail} />
        <AppTextInput label="Telefone" value={telefone} onChangeText={setTelefone} />
        <AppTextInput label="Confirme sua senha" secure value={senha} onChangeText={setSenha} />

        <PrimaryButton label="Confirmar" onPress={() => navigate('Perfil')} style={{ marginTop: spacing.lg }} />
      </ScrollView>
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
});
