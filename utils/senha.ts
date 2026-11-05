export const SENHA_MIN = 8;
export const SENHA_MAX_BYTES = 72;

export interface Requisito {
  id: 'tamanho' | 'letra' | 'numero' | 'especial';
  label: string;
  ok: boolean;
}

export interface AvaliacaoSenha {
  requisitos: Requisito[];
  valida: boolean; 
  forca: 0 | 1 | 2 | 3 | 4;
  rotulo: string;
}

const RE_LETRA = /[A-Za-zÀ-ÿ]/;
const RE_MAIUSCULA = /[A-ZÀ-Þ]/;
const RE_MINUSCULA = /[a-zß-ÿ]/;
const RE_NUMERO = /[0-9]/;
const RE_ESPECIAL = /[^A-Za-z0-9À-ÿ\s]/;

function tamanhoEmBytes(texto: string): number {
  let bytes = 0;
  for (let i = 0; i < texto.length; i++) {
    const c = texto.charCodeAt(i);
    if (c < 0x80) bytes += 1;
    else if (c < 0x800) bytes += 2;
    else if (c >= 0xd800 && c <= 0xdbff) {
      bytes += 4; 
      i++;
    } else bytes += 3;
  }
  return bytes;
}

const ROTULOS = ['', 'Fraca', 'Razoável', 'Boa', 'Forte'];

export function avaliarSenha(senha: string): AvaliacaoSenha {
  const requisitos: Requisito[] = [
    { id: 'tamanho', label: `Pelo menos ${SENHA_MIN} caracteres`, ok: senha.length >= SENHA_MIN },
    { id: 'letra', label: 'Uma letra', ok: RE_LETRA.test(senha) },
    { id: 'numero', label: 'Um número', ok: RE_NUMERO.test(senha) },
    { id: 'especial', label: 'Um caractere especial (ex.: ! @ # $ %)', ok: RE_ESPECIAL.test(senha) },
  ];
  const valida = requisitos.every((r) => r.ok) && tamanhoEmBytes(senha) <= SENHA_MAX_BYTES;

  let forca: 0 | 1 | 2 | 3 | 4 = 0;
  if (senha.length > 0) {
    if (!valida) {
      forca = 1;
    } else {
      let pontos = 2;
      if (senha.length >= 12) pontos++;
      if (senha.length >= 12 && RE_MAIUSCULA.test(senha) && RE_MINUSCULA.test(senha)) pontos++;
      forca = pontos as 2 | 3 | 4;
    }
  }
  return { requisitos, valida, forca, rotulo: ROTULOS[forca] };
}


export function validarSenha(senha: string): string | null {
  if (tamanhoEmBytes(senha) > SENHA_MAX_BYTES) return 'A senha é longa demais (máximo de 72 bytes).';
  const { requisitos } = avaliarSenha(senha);
  if (requisitos.every((r) => r.ok)) return null;
  return `A senha deve ter ao menos ${SENHA_MIN} caracteres, com letra, número e caractere especial.`;
}

const MINUSCULAS = 'abcdefghijkmnpqrstuvwxyz';
const MAIUSCULAS = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
const NUMEROS = '23456789';
const ESPECIAIS = '!@#$%&*?-_+=';


let _cryptoNativo: { getRandomBytes: (n: number) => Uint8Array } | null | undefined;
function cryptoNativo() {
  if (_cryptoNativo !== undefined) return _cryptoNativo;
  _cryptoNativo = null;
  try {

    const { requireOptionalNativeModule } = require('expo-modules-core');
    if (requireOptionalNativeModule('ExpoCrypto')) {

      _cryptoNativo = require('expo-crypto');
    }
  } catch {
    _cryptoNativo = null;
  }
  return _cryptoNativo;
}


function bytesAleatorios(n: number): Uint8Array {
  const nativo = cryptoNativo();
  if (nativo) return nativo.getRandomBytes(n) as Uint8Array;
  const g = globalThis as { crypto?: { getRandomValues?: (a: Uint8Array) => Uint8Array } };
  const arr = new Uint8Array(n);
  if (g.crypto?.getRandomValues) {
    g.crypto.getRandomValues(arr);
    return arr;
  }
  for (let i = 0; i < n; i++) arr[i] = Math.floor(Math.random() * 256);
  return arr;
}

function inteiroAleatorio(max: number): number {
  const limite = 256 - (256 % max);
  for (;;) {
    const [b] = bytesAleatorios(1);
    if (b < limite) return b % max;
  }
}

function sortear(conjunto: string): string {
  return conjunto[inteiroAleatorio(conjunto.length)];
}


export function gerarSenha(tamanho = 14): string {
  const n = Math.min(32, Math.max(SENHA_MIN, Math.floor(tamanho)));
  const todos = MINUSCULAS + MAIUSCULAS + NUMEROS + ESPECIAIS;

  const chars = [sortear(MINUSCULAS), sortear(MAIUSCULAS), sortear(NUMEROS), sortear(ESPECIAIS)];
  while (chars.length < n) chars.push(sortear(todos));


  for (let i = chars.length - 1; i > 0; i--) {
    const j = inteiroAleatorio(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join('');
}