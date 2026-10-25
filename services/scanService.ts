import { apiRequest } from './api';
import { extrairLista } from '../utils/extrairLista';

export interface ScanRegistro {
  id: number;
  nome_produto: string;
  resultado: 'seguro' | 'prejudicial';
  detalhes?: { termos_encontrados?: string[]; [chave: string]: unknown } | null;
  criado_em: string | null;
}

interface AnalyzeResponse {
  resultado: 'seguro' | 'prejudicial';
  termos_encontrados: string[];
  registro: ScanRegistro;
}

// RF06/RF07/RF08 - Envia o texto já extraído pelo OCR + nome do produto para análise.
export async function analisarEscaneamento(textoOcr: string, nomeProduto: string) {
  return apiRequest<AnalyzeResponse>('/scan/analyze', {
    method: 'POST',
    auth: true,
    body: { texto_ocr: textoOcr, nome_produto: nomeProduto },
  });
}


export async function buscarHistorico(): Promise<ScanRegistro[]> {
  const resposta = await apiRequest<unknown>('/scan/history', { method: 'GET', auth: true });
  return extrairLista<ScanRegistro>(resposta);
}

// Detalhe de um item específico do histórico
export async function buscarDetalheHistorico(id: number): Promise<ScanRegistro> {
  return apiRequest<ScanRegistro>(`/scan/history/${id}`, { method: 'GET', auth: true });
}

