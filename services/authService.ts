import { apiRequest, saveToken, clearToken } from './api';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  foto_perfil: string | null;
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

// RF01 - Cadastro
export async function registrar(nome: string, email: string, senha: string, confirmarSenha: string) {
  return apiRequest<RegisterResponse>('/auth/register', {
    method: 'POST',
    body: { nome, email, senha, confirmar_senha: confirmarSenha },
  });
}

// RF02 - Login. Já salva o token no SecureStore em caso de sucesso.
export async function login(email: string, senha: string): Promise<Usuario> {
  const resposta = await apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: { email, senha },
  });
  await saveToken(resposta.access_token);
  return resposta.usuario;
}

// RF03 (parte 1) - Solicita o código de recuperação por e-mail
export async function solicitarRecuperacaoSenha(email: string) {
  return apiRequest<MensagemResponse>('/auth/forgot-password', {
    method: 'POST',
    body: { email },
  });
}

// RF03 (parte 2) - Confirma o código e define a nova senha
export async function redefinirSenha(email: string, codigo: string, novaSenha: string) {
  return apiRequest<MensagemResponse>('/auth/reset-password', {
    method: 'POST',
    body: { email, codigo, nova_senha: novaSenha },
  });
}

// Logoff - invalida o token no back-end e limpa localmente
export async function logout(): Promise<void> {
  try {
    await apiRequest<MensagemResponse>('/auth/logout', { method: 'POST', auth: true });
  } finally {
    // Mesmo se a chamada falhar (ex: sem internet), remove o token local
    // para não deixar o app "preso" numa sessão que o usuário não consegue mais usar.
    await clearToken();
  }
}
