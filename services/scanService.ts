import { apiRequest } from './api';

export interface ScanRegistro {
  id: number;
  usuario_id: number;
  nome_produto: string;
  resultado: 'seguro' | 'prejudicial';
  detalhes: {
    texto_analisado: string;
    termos_encontrados: string[];
  };
  criado_em: string;
}

interface AnalyzeResponse {
  resultado: 'seguro' | 'prejudicial';
  termos_encontrados: string[];
  registro: ScanRegistro;
}
export async function analisarEscaneamento(textoOcr: string, nomeProduto: string) {
  return apiRequest<AnalyzeResponse>('/scan/analyze', {
    method: 'POST',
    auth: true,
    body: { texto_ocr: textoOcr, nome_produto: nomeProduto },
  });
}
export async function buscarHistorico(): Promise<ScanRegistro[]> {
  return apiRequest<ScanRegistro[]>('/scan/history', { method: 'GET', auth: true });
}

// Detalhe de um item específico do histórico
export async function buscarDetalheHistorico(id: number): Promise<ScanRegistro> {
  return apiRequest<ScanRegistro>(`/scan/history/${id}`, { method: 'GET', auth: true });
}
