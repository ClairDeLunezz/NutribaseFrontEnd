import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { CameraView } from 'expo-camera';
import { colors, spacing, typography } from '../theme';
import { useLabelCamera } from '../hooks/useLabelCamera';
import { ScreenProps } from '../types';

export default function EscaneamentoScreen({ navigate }: ScreenProps) {
  const { cameraRef, permission, requestPermission, isCapturing, error, capturePhoto } = useLabelCamera();


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


  const handleCapture = async () => {
    const result = await capturePhoto();
    if (result) {
      navigate('NomeProduto', { photoUri: result.uri });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing="back" />

      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigate('Home')} accessibilityLabel="Voltar">
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.viewfinder} pointerEvents="none">
        <View style={styles.frameGuide} />
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
          disabled={isCapturing}
          accessibilityLabel="Capturar rótulo"
          activeOpacity={0.85}
        >
          {isCapturing ? (
            <View style={styles.captureLoading}>
              <ActivityIndicator color={colors.white} />
            </View>
          ) : (
            <Image source={require('../assets/icon-camera.png')} style={styles.captureIcon} resizeMode="contain" />
          )}
        </TouchableOpacity>

     
        <TouchableOpacity
          onPress={async () => {
            const result = await capturePhoto();
            navigate('NomeProduto', { photoUri: result?.uri });
          }}
          style={{ marginTop: spacing.lg }}
        >
          <Text style={styles.demoLink}>Simular produto prejudicial (demo)</Text>
        </TouchableOpacity>
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
  permissionText: {
    color: colors.inputBg,
    ...typography.body,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  permissionButton: {
    backgroundColor: colors.buttonBg,
    borderRadius: 30,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  permissionButtonText: { color: colors.white, ...typography.button },
  backLink: { color: colors.inputBg, textDecorationLine: 'underline' },
  topBar: { paddingTop: 24, paddingHorizontal: spacing.lg },
  backIcon: { color: colors.white, fontSize: 24 },
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
  demoLink: {
    color: colors.inputBg,
    fontSize: 13,
    textDecorationLine: 'underline',
  },
});
