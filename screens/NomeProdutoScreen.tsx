import React, { useState } from 'react';
import { Image, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { colors, spacing } from '../theme';
import AppHeader from '../components/AppHeader';
import AppTextInput from '../components/AppTextInput';
import PrimaryButton from '../components/PrimaryButton';
import KeyboardAvoidingScreen from '../components/KeyboardAvoidingScreen';
import { ScreenProps } from '../types';
import { analisarEscaneamento } from '../services/scanService';
import { ApiError } from '../services/api';
import { useToast } from '../context/ToastContext';

export default function NomeProdutoScreen({ navigate, photoUri, ocrText }: ScreenProps) {
  const [nome, setNome] = useState('');
  const [analisando, setAnalisando] = useState(false);
  const { showToast } = useToast();

  const confirmar = async () => {
    if (!nome.trim()) {
      showToast('error', 'Informe o nome do produto.');
      return;
    }
    if (!ocrText) {
      showToast('error', 'Nenhum texto foi lido do rótulo. Volte e escaneie novamente.');
      return;
    }

    setAnalisando(true);
    try {
      const resposta = await analisarEscaneamento(ocrText, nome.trim());
      const proxima = resposta.resultado === 'prejudicial' ? 'ResultadoPrejudicial' : 'ResultadoSeguro';
      navigate(proxima, {
        photoUri,
        productName: nome.trim(),
        termosEncontrados: resposta.termos_encontrados,
      });
    } catch (e) {
      const mensagem = e instanceof ApiError ? e.message : 'Não foi possível analisar o produto. Tente novamente.';
      showToast('error', mensagem);
    } finally {
      setAnalisando(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader showBack onBack={() => navigate('Escaneamento')} title="Nome do Produto" />

      <KeyboardAvoidingScreen contentContainerStyle={styles.content}>
        {photoUri && <Image source={{ uri: photoUri }} style={styles.photoThumb} />}

        <AppTextInput
          label="Qual é o nome do produto?"
          placeholder="Ex: Biscoito Cookie Original 100g"
          value={nome}
          onChangeText={setNome}
        />

        {analisando ? (
          <ActivityIndicator color={colors.buttonBg} style={{ marginTop: spacing.lg }} />
        ) : (
          <PrimaryButton label="Analisar produto" onPress={confirmar} style={{ marginTop: spacing.lg }} />
        )}
      </KeyboardAvoidingScreen>
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