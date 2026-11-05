
const LIGACAO = new Set(['de', 'da', 'do', 'das', 'dos', 'com', 'e', 'em', 'para', 'a', 'o', 'sabor']);


export const LIMITE_SIMILARIDADE = 0.75;

export function normalizarNome(nome: string): string {
  return nome
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/(\d+)[.,](\d+)/g, '$1$2') 
    .replace(/(\d+)\s*(kg|g|mg|ml|l|un|und)\b/g, '$1$2')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokens(nome: string): string[] {
  const todos = normalizarNome(nome).split(' ').filter(Boolean);
  const uteis = todos.filter((t) => !LIGACAO.has(t));
  return uteis.length > 0 ? uteis : todos;
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  let anterior = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const atual = [i];
    for (let j = 1; j <= b.length; j++) {
      const custo = a[i - 1] === b[j - 1] ? 0 : 1;
      atual[j] = Math.min(atual[j - 1] + 1, anterior[j] + 1, anterior[j - 1] + custo);
    }
    anterior = atual;
  }
  return anterior[b.length];
}


function mesmaPalavra(a: string, b: string): boolean {
  if (a === b) return true;
  if (/\d/.test(a) || /\d/.test(b)) return false; 
  return Math.min(a.length, b.length) >= 5 && levenshtein(a, b) <= 1;
}


export function similaridade(a: string, b: string): number {
  const na = normalizarNome(a);
  const nb = normalizarNome(b);
  if (!na || !nb) return 0;
  if (na === nb) return 1;

  const ta = tokens(a);
  const tb = tokens(b);
  const usados = new Set<number>();
  let iguais = 0;
  for (const palavra of ta) {
    const idx = tb.findIndex((outra, i) => !usados.has(i) && mesmaPalavra(palavra, outra));
    if (idx >= 0) {
      usados.add(idx);
      iguais++;
    }
  }
  return (2 * iguais) / (ta.length + tb.length);
}

export interface ComNome {
  nome_produto: string;
}


export function acharSimilares<T extends ComNome>(nome: string, historico: T[], max = 3): T[] {
  return historico
    .map((item) => ({ item, nota: similaridade(nome, item.nome_produto) }))
    .filter((x) => x.nota >= LIMITE_SIMILARIDADE)
    .sort((x, y) => y.nota - x.nota)
    .slice(0, max)
    .map((x) => x.item);
}
