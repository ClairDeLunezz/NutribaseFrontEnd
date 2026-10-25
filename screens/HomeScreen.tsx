import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { colors, spacing, radius, typography } from '../theme';
import AppHeader from '../components/AppHeader';
import PrimaryButton from '../components/PrimaryButton';
import { ScreenProps } from '../types';
import { buscarPerfil } from '../services/userService';
import { buscarHistorico, ScanRegistro } from '../services/scanService';
import { ApiError } from '../services/api';
import { useToast } from '../context/ToastContext';
import { buildAssetUrl } from '../utils/buildAssetUrl';
import { formatarData } from '../utils/formatarData';

export default function HomeScreen({ navigate }: ScreenProps) {
  const [nomeUsuario, setNomeUsuario] = useState<string | null>(null);
  const [fotoUsuario, setFotoUsuario] = useState<string | null>(null);

  const [registros, setRegistros] = useState<ScanRegistro[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    buscarPerfil()
      .then((usuario) => {
        setNomeUsuario(usuario.nome);
        setFotoUsuario(buildAssetUrl(usuario.foto_perfil));
      })
      .catch(() => {});

    carregarHistorico();
  
  }, []);

  const carregarHistorico = async (puxando = false) => {
    if (puxando) setAtualizando(true);
    else setCarregando(true);
    setErro(null);

    try {
      const lista = await buscarHistorico();
      setRegistros([...lista].sort((a, b) => (b.criado_em || '').localeCompare(a.criado_em || '')));
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        showToast('error', 'Sua sessão expirou. Faça login novamente.');
        navigate('Login');
        return;
      }
      setErro(e instanceof ApiError ? e.message : 'Não foi possível carregar o histórico.');
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  };

  const abrirRegistro = (registro: ScanRegistro) => {
    navigate(registro.resultado === 'prejudicial' ? 'ResultadoPrejudicial' : 'ResultadoSeguro', {
      photoUri: undefined,
      productName: registro.nome_produto,
      termosEncontrados: registro.detalhes?.termos_encontrados ?? [],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigate('Perfil')} activeOpacity={0.8}>
        <AppHeader title="Início" showAvatar avatarName={nomeUsuario} avatarPhotoUri={fotoUsuario} />
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={atualizando} onRefresh={() => carregarHistorico(true)} />}
      >
        <Text style={styles.sectionTitle}>Histórico</Text>

        {carregando ? (
          <ActivityIndicator color={colors.buttonBg} style={{ marginTop: spacing.xl }} />
        ) : erro ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Não foi possível carregar</Text>
            <Text style={[styles.emptyText, { marginBottom: spacing.lg }]}>{erro}</Text>
            <PrimaryButton label="Tentar novamente" onPress={() => carregarHistorico()} />
          </View>
        ) : registros.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>Nenhum registro ainda</Text>
            <Text style={styles.emptyText}>
              Escaneie o rótulo de um produto para começar a construir seu histórico de consultas.
            </Text>
          </View>
        ) : (
          registros.map((item) => {
            const seguro = item.resultado !== 'prejudicial';
            const cor = seguro ? colors.safeGreen : colors.dangerRed;
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.card}
                onPress={() => abrirRegistro(item)}
                activeOpacity={0.85}
                accessibilityLabel={`${item.nome_produto}, ${seguro ? 'produto seguro' : 'produto prejudicial'}`}
              >
                <View style={[styles.cardBar, { backgroundColor: cor }]} />
                <View style={styles.cardBody}>
                  <Text style={styles.cardTitle}>{item.nome_produto}</Text>
                  <View style={styles.statusRow}>
                    <Text style={{ color: cor, fontSize: 18 }}>{seguro ? '✓' : '⚠'}</Text>
                    <Text style={[styles.statusText, { color: cor }]}>
                      {seguro ? 'Produto Seguro' : 'Produto Prejudicial'}
                    </Text>
                  </View>
                  {!!formatarData(item.criado_em) && (
                    <Text style={styles.cardDate}>{formatarData(item.criado_em)}</Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      <TouchableOpacity onPress={() => navigate('Escaneamento')} accessibilityLabel="Escanear rótulo" style={styles.fab}>
        <Image source={require('../assets/icon-camera.png')} style={styles.fabIcon} resizeMode="contain" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: 120 },
  sectionTitle: { ...typography.h1, color: colors.textDark, marginBottom: spacing.lg },
  emptyState: { alignItems: 'center', paddingVertical: spacing.xl * 2, paddingHorizontal: spacing.lg },
  emptyIcon: { fontSize: 40, marginBottom: spacing.md },
  emptyTitle: { ...typography.h2, color: colors.textDark, marginBottom: spacing.sm },
  emptyText: { ...typography.body, color: colors.textMuted, textAlign: 'center' },
  card: { backgroundColor: colors.cardBg, borderRadius: radius.card, overflow: 'hidden', marginBottom: spacing.lg },
  cardBar: { height: 10, width: '100%' },
  cardBody: { padding: spacing.lg },
  cardTitle: { ...typography.label, color: colors.textDark, marginBottom: spacing.lg },
  statusRow: { flexDirection: 'row', alignItems: 'center' },
  statusText: { ...typography.body, marginLeft: spacing.sm, fontWeight: '600' },
  cardDate: { ...typography.body, color: colors.textMuted, fontSize: 13, marginTop: spacing.md },
  fab: { position: 'absolute', bottom: 32, alignSelf: 'center' },
  fabIcon: { width: 68, height: 68 },
});