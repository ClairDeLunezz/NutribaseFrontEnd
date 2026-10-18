import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors, spacing, typography } from '../theme';
import AppHeader from '../components/AppHeader';
import AppTextInput from '../components/AppTextInput';
import PrimaryButton from '../components/PrimaryButton';
import KeyboardAvoidingScreen from '../components/KeyboardAvoidingScreen';
import { ScreenProps } from '../types';
import { buscarPerfil, atualizarPerfil } from '../services/userService';
import { ApiError } from '../services/api';
import { useToast } from '../context/ToastContext';
import { buildAssetUrl } from '../utils/buildAssetUrl';
import Avatar from '../components/Avatar';

export default function EditarPerfilScreen({ navigate }: ScreenProps) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [fotoAtualUrl, setFotoAtualUrl] = useState<string | null>(null);
  const [fotoSelecionada, setFotoSelecionada] = useState<ImagePicker.ImagePickerAsset | null>(null);

  const [carregandoPerfil, setCarregandoPerfil] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        const usuario = await buscarPerfil();
        setNome(usuario.nome);
        setEmail(usuario.email);
        setFotoAtualUrl(buildAssetUrl(usuario.foto_perfil));
      } catch (e) {
        const mensagem = e instanceof ApiError ? e.message : 'Não foi possível carregar seus dados.';
        showToast('error', mensagem);
      } finally {
        setCarregandoPerfil(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEscolherFoto = async () => {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      showToast('error', 'Precisamos de acesso às suas fotos para trocar a imagem de perfil.');
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!resultado.canceled && resultado.assets.length > 0) {
      setFotoSelecionada(resultado.assets[0]);
    }
  };

  const handleConfirmar = async () => {
    if (!senha) {
      showToast('error', 'Digite sua senha atual para confirmar a alteração.');
      return;
    }

    setSalvando(true);
    try {
      await atualizarPerfil({
        senhaAtual: senha,
        nome: nome.trim(),
        foto: fotoSelecionada
          ? {
              uri: fotoSelecionada.uri,
              name: fotoSelecionada.fileName || 'foto-perfil.jpg',
              type: fotoSelecionada.mimeType || 'image/jpeg',
            }
          : undefined,
      });
      showToast('success', 'Perfil atualizado com sucesso!');
      navigate('Perfil');
    } catch (e) {
      const mensagem = e instanceof ApiError ? e.message : 'Não foi possível atualizar o perfil.';
      showToast('error', mensagem);
    } finally {
      setSalvando(false);
    }
  };

  if (carregandoPerfil) {
    return (
      <SafeAreaView style={styles.container}>
        <AppHeader showBack onBack={() => navigate('Perfil')} title="Editar Perfil" />
        <ActivityIndicator color={colors.buttonBg} style={{ marginTop: spacing.xl }} />
      </SafeAreaView>
    );
  }

  const fotoParaExibir = fotoSelecionada?.uri || fotoAtualUrl;

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader showBack onBack={() => navigate('Perfil')} title="Editar Perfil" />

      <KeyboardAvoidingScreen contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.avatarLarge} accessibilityLabel="Alterar foto de perfil" onPress={handleEscolherFoto}>
          {fotoParaExibir ? (
            <Image source={{ uri: fotoParaExibir }} style={styles.avatarImage} />
          ) : (
           <Avatar name={nome} photoUri={fotoParaExibir} size={96} />
          )}
          <View style={styles.editBadge}>
            <Text style={styles.editBadgeIcon}>✎</Text>
          </View>
        </TouchableOpacity>

        <AppTextInput label="Nome" value={nome} onChangeText={setNome} />

        <Text style={styles.readOnlyLabel}>E-mail</Text>
        <Text style={styles.readOnlyValue}>{email}</Text>

        <AppTextInput label="Confirme sua senha" secure value={senha} onChangeText={setSenha} />

        {salvando ? (
          <ActivityIndicator color={colors.buttonBg} style={{ marginTop: spacing.lg }} />
        ) : (
          <PrimaryButton label="Confirmar" onPress={handleConfirmar} style={{ marginTop: spacing.lg }} />
        )}
      </KeyboardAvoidingScreen>
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
    overflow: 'hidden',
  },
  avatarImage: { width: '100%', height: '100%' },
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
  readOnlyLabel: { ...typography.label, color: colors.textDark, marginBottom: spacing.sm },
  readOnlyValue: {
    ...typography.body,
    color: colors.textMuted,
    backgroundColor: colors.cardBg,
    borderRadius: 28,
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
});
