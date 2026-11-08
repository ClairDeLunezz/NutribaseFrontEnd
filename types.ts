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
  | 'Disclaimer'
  | 'Politica';

export interface NavigateParams {
  photoUri?: string;
  productName?: string;
  ocrText?: string;
  termosEncontrados?: string[];
  advertencias?: string[];
  /** Tela para a qual a Política de Privacidade volta (Cadastro ou Perfil). */
  origem?: ScreenName;
}

export type NavigateFn = (screen: ScreenName, params?: NavigateParams) => void;

export interface ScreenProps {
  navigate: NavigateFn;
  photoUri?: string;
  productName?: string;
  ocrText?: string;
  termosEncontrados?: string[];
  advertencias?: string[];
  /** Tela para a qual a Política de Privacidade volta (Cadastro ou Perfil). */
  origem?: ScreenName;
}
