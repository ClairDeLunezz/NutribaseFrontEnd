import { apiRequest, saveToken, clearToken } from './api';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  foto_perfil: string | null;
  restricoes: string[];
  criado_em: string | null;
}

interface LoginResponse {
  mensagem: string;
  access_token: string;
  usuario: Usuario;
}

interface RegisterResponse {
  mensagem: string;
  usuario: Usuario;
}

interface MensagemResponse {
  mensagem: string;
}

export async function registrar(nome: string, email: string, senha: string, confirmarSenha: string) {
  return apiRequest<RegisterResponse>('/auth/register', {
    method: 'POST',
    body: { nome, email, senha, confirmar_senha: confirmarSenha },
  });
}

export async function login(email: string, senha: string): Promise<Usuario> {
  const resposta = await apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: { email, senha },
  });
  await saveToken(resposta.access_token);
  return resposta.usuario;
}

