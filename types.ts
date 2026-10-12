export type ScreenName =
  | 'Login'
  | 'Cadastro'
  | 'EsqueciSenha'
  | 'Home'
  | 'Escaneamento'
  | 'NomeProduto'
  | 'ResultadoSeguro'
  | 'ResultadoPrejudicial'
  | 'Perfil'
  | 'EditarPerfil';

export interface NavigateParams {
  photoUri?: string;
  productName?: string;
  ocrText?: string; 
  termosEncontrados?: string[]; 
}

export type NavigateFn = (screen: ScreenName, params?: NavigateParams) => void;

export interface ScreenProps {
  navigate: NavigateFn;
  photoUri?: string;
  productName?: string;
  ocrText?: string;
  termosEncontrados?: string[];
}
