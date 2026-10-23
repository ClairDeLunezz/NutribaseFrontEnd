export function extrairLista<T>(resposta: unknown): T[] {
  if (Array.isArray(resposta)) return resposta as T[];
  if (resposta && typeof resposta === 'object') {
    for (const valor of Object.values(resposta as Record<string, unknown>)) {
      if (Array.isArray(valor)) return valor as T[];
    }
  }
  return [];
}