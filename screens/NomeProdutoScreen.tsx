import React, { useState } from 'react';
import { Image, StyleSheet, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { colors, spacing } from '../theme';
import AppHeader from '../components/AppHeader';
import AppTextInput from '../components/AppTextInput';
import PrimaryButton from '../components/PrimaryButton';
import KeyboardAvoidingScreen from '../components/KeyboardAvoidingScreen';
import { ScreenProps } from '../types';
import { analisarEscaneamento, buscarHistorico, ScanRegistro } from '../services/scanService';
import { acharSimilares } from '../utils/nomeSimilar';
import { formatarData } from '../utils/formatarData';
import { infoResultado, normalizarResultado, telaResultado } from '../utils/resultado';
import { ApiError } from '../services/api';
import { useToast } from '../context/ToastContext';

type Decisao = 'adicionar' | 'ver' | 'cancelar';

/** Pergunta ao usuário o que fazer quando já há um produto parecido no histórico. */
function perguntarDuplicado(novo: string, existente: ScanRegistro): Promise<Decisao> {
  const { titulo } = infoResultado(normalizarResultado(existente.resultado));
  const quando = formatarData(existente.criado_em);
  const detalhe = `${titulo}${quando ? `, em ${quando}` : ''}`;
  return new Promise((resolve) => {
    Alert.alert(
      'Produto parecido no histórico',
      `Você já consultou "${existente.nome_produto}" (${detalhe}).\n\nDeseja adicionar "${novo}" novamente?`,
      [
        { text: 'Cancelar', style: 'cancel', onPress: () => resolve('cancelar') },
        { text: 'Ver o anterior', onPress: () => resolve('ver') },
        { text: 'Adicionar novamente', onPress: () => resolve('adicionar') },
      ],
      { cancelable: true, onDismiss: () => resolve('cancelar') },
    );
  });
}

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

      let similar: ScanRegistro | undefined;
      try {
        similar = acharSimilares(nome.trim(), await buscarHistorico(), 1)[0];
      } catch {
        similar = undefined;
      }
      if (similar) {
        const decisao = await perguntarDuplicado(nome.trim(), similar);
        if (decisao === 'cancelar') return;
        if (decisao === 'ver') {
          navigate(telaResultado(normalizarResultado(similar.resultado)), {
            photoUri: undefined,
            productName: similar.nome_produto,
            termosEncontrados: similar.detalhes?.termos_encontrados ?? [],
            advertencias: similar.detalhes?.advertencias ?? [],
          });
          return;
        }
      }

      const resposta = await analisarEscaneamento(ocrText, nome.trim());
      const status = normalizarResultado(resposta.resultado);
      navigate(telaResultado(status), {
        photoUri,
        productName: nome.trim(),
        termosEncontrados: resposta.termos_encontrados,
        advertencias: resposta.advertencias ?? [],
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