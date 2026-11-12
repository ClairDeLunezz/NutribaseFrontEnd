# Nutribase (Front End)

Aplicativo Android para pessoas com intolerância à lactose. O usuário fotografa o rótulo de um produto, o texto é lido no próprio celular (OCR) e o app informa se o produto é **seguro**, exige **atenção** ou é **prejudicial**, conforme a presença de lactose e derivados.

Projeto de Trabalho de Graduação (TCC) da Fatec Itu "Dom Amaury Castanho".
Este repositório contém apenas o **front end** (Expo / React Native). A API (Flask) fica em um repositório separado.

## Sumário

- [Funcionalidades](#funcionalidades)
- [Como o app funciona](#como-o-app-funciona)
- [Tecnologias](#tecnologias)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Executando o projeto](#executando-o-projeto)
- [Integração com a API](#integração-com-a-api)
- [Decisões de projeto](#decisões-de-projeto)
- [Privacidade e segurança](#privacidade-e-segurança)
- [Solução de problemas](#solução-de-problemas)
- [Aviso](#aviso)
- [Autores](#autores)

## Funcionalidades

| Área | O que o app faz |
| ---- | --------------- |
| Conta | Cadastro com aceite da Política de Privacidade, login, recuperação de senha por código de 6 dígitos enviado por e-mail e logout |
| Senha | Indicador de força, checagem dos requisitos em tempo real e gerador de senha segura |
| Escaneamento | Leitura do rótulo pela câmera (com moldura de enquadramento e lanterna) ou pela galeria, com **várias fotos** por produto |
| OCR | Leitura do texto no próprio aparelho, sem enviar a foto |
| Resultado | Três níveis: Seguro, Atenção (pode conter traços) e Prejudicial, com os termos detectados e os avisos do rótulo |
| Produto | Nome do produto e alerta quando já existe um item parecido no histórico |
| Histórico | Lista dos produtos consultados (mais recentes primeiro), com atualização por gesto de puxar |
| Perfil | Edição de nome e foto, logout e exclusão de conta, ambos com confirmação |
| Legal | Aviso inicial no primeiro acesso e tela da Política de Privacidade (LGPD) |

## Como o app funciona

### Fluxo de telas

```
Login ──► Aviso inicial (1ª vez) ──► Home (histórico)
  │                                    │      │
  ├─► Cadastro ─► Política             │      └─► Perfil ─► Editar Perfil
  └─► Esqueci a senha                  ▼                    └► Política
                                  Escaneamento
                                       ▼
                                  Nome do produto
                                       ▼
                       Resultado (Seguro | Atenção | Prejudicial)
```

A navegação é feita por um estado simples em `App.tsx` (sem biblioteca de rotas). Os dados que passam de uma tela para a outra (foto, texto lido, nome, termos e avisos) são guardados lá e entregues às telas por *props*.

### Escaneamento de um produto

1. **Captura.** A câmera traz uma moldura. A foto é recortada para a área da moldura (`utils/croptoFrame.ts`), o que melhora o OCR. A galeria é uma alternativa.
2. **OCR.** `services/ocrService.ts` usa o Google ML Kit. A primeira foto precisa ter pelo menos 15 caracteres; fotos extras aceitam textos curtos (3 caracteres), por exemplo a frente da embalagem que só diz "ZERO LACTOSE".
3. **Várias fotos.** O usuário pode adicionar mais fotos (ingredientes, "contém", frente da embalagem). Os textos são juntados em um só antes da análise.
4. **Nome do produto.** Antes de analisar, o app compara o nome digitado com o histórico. Se achar algo parecido, pergunta se o usuário quer cancelar, ver o resultado anterior ou adicionar novamente.
5. **Análise.** Só o texto e o nome vão para `POST /scan/analyze`. A API devolve o resultado, os termos encontrados e os avisos.
6. **Resultado.** A tela mostra a cor e o título do nível, os termos detectados (Prejudicial) ou os avisos do rótulo (Atenção).

### Comparação de nomes

`utils/nomeSimilar.ts` evita registros duplicados. Ele normaliza o texto (minúsculas, sem acentos, "1,5 kg" e "1.5kg" viram o mesmo valor), ignora palavras de ligação ("de", "com", "sabor"…), tolera 1 letra de diferença em palavras com 5 ou mais letras e calcula uma nota de 0 a 1 (coeficiente de Dice). A partir de **0,75** o produto é considerado parecido.

### Senhas

`utils/senha.ts` exige no mínimo 8 caracteres, com letra, número e caractere especial, e no máximo 72 bytes (limite comum de algoritmos de hash como o bcrypt). O gerador usa `expo-crypto` quando disponível, sorteia sem viés e garante ao menos um caractere de cada tipo.

### Recuperação de senha

Em duas etapas na mesma tela: informa o e-mail e recebe um código de 6 dígitos; depois informa o código e a nova senha.

## Tecnologias

- [Expo](https://docs.expo.dev/versions/v54.0.0/) SDK 54, React Native 0.81 (nova arquitetura) e React 19
- TypeScript 5.9
- `@react-native-ml-kit/text-recognition`: OCR no dispositivo
- `expo-camera`, `expo-image-picker`, `expo-image-manipulator`: captura, galeria e recorte
- `expo-secure-store`: token de acesso e registro do aceite do aviso inicial
- `expo-crypto`: geração de senhas
- EAS Build para gerar o APK

> O OCR usa código nativo, então o app **não roda no Expo Go**. É preciso um *development build*.

## Estrutura do projeto

```
App.tsx            Navegação entre telas e estado compartilhado
index.ts           Ponto de entrada
config.ts          URL base da API
theme.ts           Cores, espaçamentos, raios e tipografia
types.ts           Tipos compartilhados (ScreenName, NavigateParams, ScreenProps)
app.json           Configuração do Expo (nome, ícone, permissões)
eas.json           Perfis de build

screens/           Login, Cadastro, EsqueciSenha, Disclaimer, Home, Escaneamento,
                   NomeProduto, Resultado, Perfil, EditarPerfil, PoliticaPrivacidade
components/        AppHeader, AppTextInput, Avatar, BrandHeader, PrimaryButton,
                   PasswordStrength, PasswordConfirmModal, KeyboardAvoidingScreen
context/           ToastContext (mensagens rápidas de sucesso e erro)
hooks/             useLabelCamera (permissão, captura e erro da câmera)
services/          api (cliente HTTP), authService, scanService, userService, ocrService
utils/             resultado, nomeSimilar, senha, croptoFrame, disclaimer,
                   politicaPrivacidade, rascunhoCadastro, formatarData,
                   extrairLista, buildAssetUrl
assets/            Ícones e imagens
```

## Executando o projeto

### Pré-requisitos

- Node.js 20 ou superior e npm
- Celular Android (ou emulador) com o *development build* instalado
- API do Nutribase rodando e acessível pela rede do celular
- Conta no [Expo/EAS](https://expo.dev) para gerar o build

### Passo a passo

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Aponte o app para a sua API em `config.ts`:

   ```ts
   export const API_BASE_URL = 'http://SEU_IP_LOCAL:5000';
   ```

   Use o IP da máquina que roda a API, na mesma rede Wi-Fi do celular. `localhost` não funciona no aparelho.

3. Gere e instale o *development build* (uma vez, ou quando mudar dependências nativas):

   ```bash
   npm install -g eas-cli
   eas login
   eas build --profile development --platform android
   ```

   Instale o APK gerado no celular.

4. Inicie o servidor de desenvolvimento:

   ```bash
   npm start
   ```

   Abra o *development build* no celular e conecte ao servidor indicado no terminal.

### Scripts

| Comando | O que faz |
| ------- | --------- |
| `npm start` | Inicia o servidor Expo |
| `npm run android` | Inicia e abre no Android |
| `npm run ios` | Inicia e abre no iOS |
| `npm run web` | Versão web (sem câmera nem OCR nativos) |

### Perfis de build (`eas.json`)

| Perfil | Uso |
| ------ | --- |
| `development` | *Development build* com dev client, distribuição interna |
| `preview` | APK de distribuição interna para testes |
| `production` | Build de produção, com incremento automático de versão |

### Permissões

O app pede acesso à **câmera** para escanear rótulos. Se o usuário negar de forma definitiva, a tela de escaneamento orienta a habilitar nas configurações do aparelho.

## Integração com a API

Todas as chamadas passam por `services/api.ts`, que monta a URL, envia o token no cabeçalho `Authorization: Bearer` quando a rota exige login e converte as respostas de erro (`{ "erro": "mensagem" }`) em `ApiError`, com a mensagem e o status HTTP. Falhas de rede viram uma mensagem amigável com `status` 0.

| Método | Rota | Auth | Uso |
| ------ | ---- | :--: | --- |
| POST | `/auth/register` | não | Cadastro (nome, e-mail, senha, confirmação, aceite da política) |
| POST | `/auth/login` | não | Login; devolve o token e o usuário |
| POST | `/auth/forgot-password` | não | Envia o código de recuperação por e-mail |
| POST | `/auth/reset-password` | não | Redefine a senha com e-mail, código e nova senha |
| POST | `/auth/logout` | sim | Encerra a sessão |
| POST | `/scan/analyze` | sim | Envia `texto_ocr` e `nome_produto`; recebe resultado, termos e avisos |
| GET | `/scan/history` | sim | Lista os escaneamentos do usuário |
| GET | `/scan/history/:id` | sim | Detalhe de um escaneamento |
| GET | `/user/profile` | sim | Dados do perfil |
| PUT | `/user/profile` | sim | Atualiza nome e foto (`multipart/form-data`, exige a senha atual) |
| DELETE | `/user/account` | sim | Exclui a conta (exige a senha) |

Resposta de `/scan/analyze`:

```json
{
  "resultado": "seguro | atencao | prejudicial",
  "termos_encontrados": ["leite", "soro de leite"],
  "advertencias": ["Pode conter traços de leite"],
  "registro": { "id": 1, "nome_produto": "...", "resultado": "...", "criado_em": "..." }
}
```

Se a API responder 401 (sessão expirada) na Home ou no aviso inicial, o app avisa e volta para o Login.

## Decisões de projeto

- **OCR no aparelho.** A foto do rótulo nunca sai do celular; a API recebe só texto. Isso protege a privacidade e reduz o tráfego.
- **Várias fotos por produto.** Rótulos grandes costumam ter ingredientes, alergênicos e frente em lugares diferentes. Juntar os textos aumenta a chance de detectar lactose.
- **Três níveis em vez de sim/não.** "Atenção" cobre avisos como "pode conter traços", que não são ingrediente, mas importam para quem é intolerante.
- **Sem biblioteca de rotas.** O fluxo é pequeno e linear, então um estado em `App.tsx` basta.
- **Módulos nativos opcionais.** OCR, recorte e criptografia são carregados com `try/require`. Se faltarem, o app não quebra: mostra uma mensagem orientando a usar o *development build*.
- **Rascunho do cadastro em memória.** Ao abrir a Política de Privacidade no meio do cadastro, o que o usuário digitou é guardado e restaurado na volta, sem gravar a senha em disco.
- **Aviso inicial versionado.** O aceite é gravado por usuário e por versão (`nutribase_disclaimer_v1_<id>`); mudar a versão em `utils/disclaimer.ts` faz o aviso reaparecer para todos.

## Privacidade e segurança

- As fotos dos rótulos são processadas no aparelho e não são enviadas.
- O token de acesso fica no `expo-secure-store` (armazenamento seguro do sistema) e é apagado no logout, mesmo se a chamada de logout falhar.
- Ações sensíveis (editar perfil e excluir conta) pedem a senha atual.
- A política completa está na tela **Política de Privacidade** (texto em `utils/politicaPrivacidade.ts`).

> `config.ts` guarda a URL da API em texto simples. Para produção, use HTTPS e um domínio próprio em vez de HTTP com IP local.

## Solução de problemas

| Sintoma | Causa provável e solução |
| ------- | ------------------------ |
| "O leitor de rótulos não está disponível neste app" | Você está no Expo Go. Instale o *development build* (`eas build --profile development`) |
| "Não foi possível conectar ao servidor" | API fora do ar, IP errado em `config.ts` ou celular em outra rede. Teste abrir `http://IP:5000` no navegador do celular |
| "Não conseguimos ler o texto do rótulo" | Pouca luz, foto tremida ou ingredientes fora da moldura. Use a lanterna e enquadre a lista de ingredientes |
| Câmera não abre | Permissão negada. Habilite a câmera nas configurações do Android |
| Erro de HTTP em build de produção | O Android bloqueia HTTP sem criptografia em builds de produção. Use HTTPS na API |
| Mudou uma dependência nativa e o app falha | Gere um novo *development build* |

## Aviso

O Nutribase é um apoio à leitura de rótulos e **não substitui a orientação de um profissional de saúde**. Sempre confira o rótulo do produto. O app foi desenvolvido como Trabalho de Graduação e é oferecido sem garantias.

## Autores

- Artur Cruz 
- Pietro 

Orientador: Prof. Fabrício Tonetto Londero, Fatec Itu, 2026.
