import React, { useRef, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator, ScrollView } from 'react-native';
import { CameraView } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { colors, spacing, typography } from '../theme';
import { useLabelCamera } from '../hooks/useLabelCamera';
import { useToast } from '../context/ToastContext';
import { extrairTextoDoRotulo, OcrError } from '../services/ocrService';
import { medirNaTela, recortarParaMoldura } from '../utils/croptoFrame';
import { ScreenProps } from '../types';


export default function EscaneamentoScreen({ navigate }: ScreenProps) {
  const { cameraRef, permission, requestPermission, isCapturing, error, capturePhoto } = useLabelCamera();
  const [lendoRotulo, setLendoRotulo] = useState(false);
  const [lanterna, setLanterna] = useState(false);
  const partesRef = useRef<{ uri: string; texto: string }[]>([]);
  const [partes, setPartes] = useState<{ uri: string; texto: string }[]>([]);
  const atualizarPartes = (lista: { uri: string; texto: string }[]) => {
    partesRef.current = lista;
    setPartes(lista);
  };
  const cameraBoxRef = useRef<View>(null);
  const frameRef = useRef<View>(null);
  const { showToast } = useToast();

  if (!permission) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator color={colors.inputBg} />
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.permissionText}>
          {permission.canAskAgain
            ? 'Precisamos da sua permissão para usar a câmera e escanear o rótulo do produto.'
            : 'A permissão da câmera foi negada. Habilite o acesso nas configurações do dispositivo.'}
        </Text>
        {permission.canAskAgain && (
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Permitir acesso à câmera</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => navigate('Home')} style={{ marginTop: spacing.lg }}>
          <Text style={styles.backLink}>Voltar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const analisarImagem = async (uri: string) => {
    
    const primeira = partesRef.current.length === 0;
    const texto = await extrairTextoDoRotulo(uri, primeira ? undefined : 3);
    atualizarPartes([...partesRef.current, { uri, texto }]);
    showToast('success', primeira ? 'Foto lida.' : `Foto ${partesRef.current.length} lida e adicionada.`);
  };

  const continuar = () => {
    const lista = partesRef.current;
    if (lista.length === 0) return;
    navigate('NomeProduto', { photoUri: lista[0].uri, ocrText: lista.map((p) => p.texto).join('\n') });
  };

  const executar = async (tarefa: () => Promise<void>) => {
    setLendoRotulo(true);
    try {
      await tarefa();
    } catch (e) {
      showToast('error', e instanceof OcrError ? e.message : 'Erro inesperado ao ler o rótulo.');
    } finally {
      setLendoRotulo(false);
    }
  };

  const handleCapture = async () => {
    const foto = await capturePhoto();
    if (!foto) return;

    await executar(async () => {
      const [camera, moldura] = await Promise.all([medirNaTela(cameraBoxRef), medirNaTela(frameRef)]);
      const uri =
        camera && moldura ? await recortarParaMoldura(foto.uri, foto.width, foto.height, camera, moldura) : foto.uri;
      await analisarImagem(uri);
    });
  };

  const handleGaleria = async () => {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });
    if (resultado.canceled || resultado.assets.length === 0) return;
    await executar(() => analisarImagem(resultado.assets[0].uri));
  };

  const ocupado = isCapturing || lendoRotulo;

  return (
    <SafeAreaView style={styles.container}>
      <View ref={cameraBoxRef} collapsable={false} style={StyleSheet.absoluteFill}>
        <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing="back" enableTorch={lanterna} />
      </View>

      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigate('Home')} accessibilityLabel="Voltar">
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setLanterna((v) => !v)}
          style={[styles.pill, lanterna && styles.pillActive]}
          accessibilityLabel="Alternar lanterna"
        >
          <Text style={styles.pillText}>{lanterna ? 'Lanterna ligada' : 'Lanterna'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.viewfinder} pointerEvents="none">
        <View ref={frameRef} collapsable={false} style={styles.frameGuide} />
        <Text style={styles.hint}>Posicione o rótulo dentro da moldura</Text>
      </View>

      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <View style={styles.bottomBar}>
        <TouchableOpacity
          onPress={handleCapture}
          disabled={ocupado}
          accessibilityLabel="Capturar rótulo"
          activeOpacity={0.85}
        >
          {ocupado ? (
            <View style={styles.captureLoading}>
              <ActivityIndicator color={colors.white} />
            </View>
          ) : (
            <Image source={require('../assets/icon-camera.png')} style={styles.captureIcon} resizeMode="contain" />
          )}
        </TouchableOpacity>

        {lendoRotulo ? (
          <Text style={styles.readingText}>Lendo rótulo…</Text>
        ) : (
          <TouchableOpacity onPress={handleGaleria} disabled={ocupado} style={{ marginTop: spacing.md }}>
            <Text style={styles.galleryLink}>{partes.length > 0 ? 'Adicionar da galeria' : 'Escolher da galeria'}</Text>
          </TouchableOpacity>
        )}

        {partes.length > 0 && !lendoRotulo && (
          <View style={styles.partesBox}>
            <Text style={styles.partesTitulo}>
              {partes.length === 1 ? '1 foto lida' : `${partes.length} fotos lidas`}
            </Text>
            <ScrollView horizontal style={{ marginTop: spacing.sm }} contentContainerStyle={{ gap: spacing.sm }}>
              {partes.map((p, i) => (
                <Image key={p.uri + i} source={{ uri: p.uri }} style={styles.parteThumb} />
              ))}
            </ScrollView>
            <Text style={styles.partesDica}>
              Se a embalagem tiver o selo “zero lactose” em outro lado, tire também uma foto dele.
            </Text>
            <View style={styles.partesBotoes}>
              <TouchableOpacity onPress={() => atualizarPartes([])} disabled={ocupado}>
                <Text style={styles.galleryLink}>Recomeçar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={continuar} disabled={ocupado} style={styles.continuarBtn}>
                <Text style={styles.permissionButtonText}>Continuar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111111' },
  centered: {
    flex: 1,
    backgroundColor: colors.headerBg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  permissionText: { color: colors.inputBg, ...typography.body, textAlign: 'center', marginBottom: spacing.lg },
  permissionButton: {
    backgroundColor: colors.buttonBg,
    borderRadius: 30,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  permissionButtonText: { color: colors.white, ...typography.button },
  backLink: { color: colors.inputBg, textDecorationLine: 'underline' },
  topBar: {
    paddingTop: 24,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backIcon: { color: colors.white, fontSize: 24 },
  pill: {
    borderWidth: 1,
    borderColor: colors.inputBg,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: spacing.md,
  },
  pillActive: { backgroundColor: colors.buttonBg },
  pillText: { color: colors.inputBg, fontSize: 13 },
  viewfinder: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  frameGuide: {
    width: '78%',
    height: '45%',
    borderWidth: 2,
    borderColor: colors.inputBg,
    borderRadius: 16,
    borderStyle: 'dashed',
  },
  hint: { color: colors.inputBg, marginTop: spacing.lg, ...typography.body },
  errorBanner: {
    position: 'absolute',
    top: 90,
    left: spacing.lg,
    right: spacing.lg,
    backgroundColor: colors.dangerRed,
    borderRadius: 8,
    padding: spacing.md,
  },
  errorText: { color: colors.white, textAlign: 'center' },
  bottomBar: { alignItems: 'center', paddingVertical: spacing.xl },
  captureIcon: { width: 78, height: 78 },
  captureLoading: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: colors.buttonBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  partesBox: {
    marginTop: spacing.md,
    marginHorizontal: spacing.lg,
    padding: spacing.md,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignSelf: 'stretch',
  },
  partesTitulo: { color: colors.white, ...typography.label, textAlign: 'center' },
  parteThumb: { width: 140, height: 50, borderRadius: 6, backgroundColor: '#333' },
  partesDica: { color: colors.inputBg, fontSize: 13, textAlign: 'center', marginTop: spacing.xs },
  partesBotoes: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  continuarBtn: {
    backgroundColor: colors.buttonBg,
    borderRadius: 30,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
  },
  readingText: { color: colors.inputBg, ...typography.body, marginTop: spacing.md },
  galleryLink: { color: colors.inputBg, textDecorationLine: 'underline', ...typography.body },
});