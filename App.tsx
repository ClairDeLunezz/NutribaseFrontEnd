import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import LoginScreen from './screens/LoginScreen';
import CadastroScreen from './screens/CadastroScreen';
import EsqueciSenhaScreen from './screens/EsqueciSenhaScreen';
import HomeScreen from './screens/HomeScreen';
import EscaneamentoScreen from './screens/EscaneamentoScreen';
import NomeProdutoScreen from './screens/NomeProdutoScreen';
import ResultadoScreen from './screens/ResultadoScreen';
import PerfilScreen from './screens/PerfilScreen';
import EditarPerfilScreen from './screens/EditarPerfilScreen';
import { ScreenName, NavigateParams } from './types';


export default function App() {
  const [screen, setScreen] = useState<ScreenName>('Login');
  const [photoUri, setPhotoUri] = useState<string | undefined>(undefined);
  const [productName, setProductName] = useState<string | undefined>(undefined);

  const navigate = (next: ScreenName, params?: NavigateParams) => {
    if (params?.photoUri !== undefined) setPhotoUri(params.photoUri);
    if (params?.productName !== undefined) setProductName(params.productName);
    setScreen(next);
  };

  const renderScreen = () => {
    switch (screen) {
      case 'Login':
        return <LoginScreen navigate={navigate} />;
      case 'Cadastro':
        return <CadastroScreen navigate={navigate} />;
      case 'EsqueciSenha':
        return <EsqueciSenhaScreen navigate={navigate} />;
      case 'Home':
        return <HomeScreen navigate={navigate} />;
      case 'Escaneamento':
        return <EscaneamentoScreen navigate={navigate} />;
      case 'NomeProduto':
        return <NomeProdutoScreen navigate={navigate} photoUri={photoUri} />;
      case 'ResultadoSeguro':
        return <ResultadoScreen navigate={navigate} status="seguro" photoUri={photoUri} productName={productName} />;
      case 'ResultadoPrejudicial':
        return (
          <ResultadoScreen navigate={navigate} status="prejudicial" photoUri={photoUri} productName={productName} />
        );
      case 'Perfil':
        return <PerfilScreen navigate={navigate} />;
      case 'EditarPerfil':
        return <EditarPerfilScreen navigate={navigate} />;
      default:
        return <LoginScreen navigate={navigate} />;
    }
  };

  return (
    <>
      <StatusBar style="light" />
      {renderScreen()}
    </>
  );
}