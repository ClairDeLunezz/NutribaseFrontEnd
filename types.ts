export type ScreenName =
  | 'Login'
  | 'Cadastro'
  | 'EsqueciSenha'
  | 'Home'
  | 'Escaneamento'
  | 'NomeProduto'
  | 'ResultadoSeguro'
  | 'ResultadoAtencao'
  | 'ResultadoPrejudicial'
  | 'Perfil'
  | 'EditarPerfil'
  | 'Disclaimer';

export interface NavigateParams {
  photoUri?: string;
  productName?: string;
  ocrText?: string;
  termosEncontrados?: string[];
  advertencias?: string[];
}

export type NavigateFn = (screen: ScreenName, params?: NavigateParams) => void;

export interface ScreenProps {
  navigate: NavigateFn;
  photoUri?: string;
  productName?: string;
  ocrText?: string;
  termosEncontrados?: string[];
  advertencias?: string[];
}
