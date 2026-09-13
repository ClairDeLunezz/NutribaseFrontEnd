import React, { useState } from 'react';
import { View, Image, StyleSheet, SafeAreaView } from 'react-native';
import { colors, spacing } from '../theme';
import AppHeader from '../components/AppHeader';
import AppTextInput from '../components/AppTextInput';
import PrimaryButton from '../components/PrimaryButton';
import { ScreenProps } from '../types';


export default function NomeProdutoScreen({ navigate, photoUri }: ScreenProps) {
  const [nome, setNome] = useState('');

  const confirmar = () => {
   
    navigate('ResultadoSeguro', { photoUri, productName: nome.trim() });
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader showBack onBack={() => navigate('Escaneamento')} title="Nome do Produto" />

      <View style={styles.content}>
        {photoUri && <Image source={{ uri: photoUri }} style={styles.photoThumb} />}

        <AppTextInput
          label="Qual é o nome do produto?"
          placeholder="Ex: Biscoito Cookie Original 100g"
          value={nome}
          onChangeText={setNome}
        />

        <PrimaryButton label="Confirmar" onPress={confirmar} style={{ marginTop: spacing.lg }} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingTop: spacing.xl },
  photoThumb: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    marginBottom: spacing.lg,
    backgroundColor: colors.cardBg,
  },
});