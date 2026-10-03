import { apiRequest } from './api';
import { Usuario } from './authService';

interface ProfileResponse {
  mensagem: string;
  usuario: Usuario;
}

export async function buscarPerfil(): Promise<Usuario> {
  return apiRequest<Usuario>('/user/profile', { method: 'GET', auth: true });
}

interface AtualizarPerfilParams {
  senhaAtual: string;
  nome?: string;
  foto?: { uri: string; name: string; type: string }; // formato aceito pelo FormData no RN
}

// RF04 - Editar perfil (nome, restrições e foto). Exige a senha atual, como no caso de uso.
export async function atualizarPerfil(params: AtualizarPerfilParams): Promise<Usuario> {
  const formData = new FormData();
  formData.append('senha_atual', params.senhaAtual);
  if (params.nome) formData.append('nome', params.nome);
 
  if (params.foto) {
    // @ts-expect-error - RN aceita esse formato de objeto no FormData, mas o tipo do DOM não o reconhece
    formData.append('foto', { uri: params.foto.uri, name: params.foto.name, type: params.foto.type });
  }

  const resposta = await apiRequest<ProfileResponse>('/user/profile', {
    method: 'PUT',
    auth: true,
    isFormData: true,
    body: formData,
  });
  return resposta.usuario;
}

// RF05 - Excluir conta (exige senha para confirmar)
export async function excluirConta(senha: string): Promise<void> {
  await apiRequest<{ mensagem: string }>('/user/account', {
    method: 'DELETE',
    auth: true,
    body: { senha },
  });
}
