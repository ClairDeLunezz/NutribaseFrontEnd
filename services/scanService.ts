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
