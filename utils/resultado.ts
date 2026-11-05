

import { colors } from '../theme';

export type ResultadoScan = 'seguro' | 'atencao' | 'prejudicial';


export function normalizarResultado(valor?: string | null): ResultadoScan {
  return valor === 'prejudicial' || valor === 'atencao' ? valor : 'seguro';
}

export interface InfoResultado {
  cor: string;
  icone: string;
  titulo: string;
}

export function infoResultado(status: ResultadoScan): InfoResultado {
  if (status === 'prejudicial') {
    return { cor: colors.dangerRed, icone: '⚠', titulo: 'Produto Prejudicial' };
  }
  if (status === 'atencao') {
    return { cor: colors.warningAmber, icone: '!', titulo: 'Atenção: pode conter traços' };
  }
  return { cor: colors.safeGreen, icone: '✓', titulo: 'Produto Seguro' };
}


export function telaResultado(status: ResultadoScan) {
  if (status === 'prejudicial') return 'ResultadoPrejudicial' as const;
  if (status === 'atencao') return 'ResultadoAtencao' as const;
  return 'ResultadoSeguro' as const;
}
