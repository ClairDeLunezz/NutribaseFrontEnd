import * as SecureStore from 'expo-secure-store';

const VERSAO = 'v1';

const chave = (usuarioId: number) => `nutribase_disclaimer_${VERSAO}_${usuarioId}`;

export async function disclaimerJaAceito(usuarioId: number): Promise<boolean> {
  try {
    return (await SecureStore.getItemAsync(chave(usuarioId))) !== null;
  } catch {
    return false; // na dúvida, mostra o aviso
  }
}

export async function registrarAceiteDisclaimer(usuarioId: number): Promise<void> {
  try {
    await SecureStore.setItemAsync(chave(usuarioId), new Date().toISOString());
  } catch {
    // Se não conseguir gravar, o aviso só aparece de novo no próximo login.
  }
}