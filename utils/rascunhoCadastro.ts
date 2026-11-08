
interface Rascunho {
  nome: string;
  contato: string;
  senha: string;
  confirmarSenha: string;
  aceitou: boolean;
}

let atual: Rascunho | null = null;

export function guardarRascunho(r: Rascunho): void {
  atual = r;
}

export function consumirRascunho(): Rascunho | null {
  const r = atual;
  atual = null;
  return r;
}
