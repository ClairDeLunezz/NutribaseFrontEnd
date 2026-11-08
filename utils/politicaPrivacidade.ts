
export const POLITICA_ATUALIZADA_EM = '05/11/2026';
export const POLITICA_CONTATO = 'nutribase.application@gmail.com';

export const POLITICA_SECOES: { titulo: string; texto: string }[] = [
  {
    titulo: '1. Quem somos',
    texto:
      'O Nutribase é um aplicativo desenvolvido como Trabalho de Graduação na Faculdade de Tecnologia de Itu "Dom Amaury Castanho" (Fatec Itu), para ajudar pessoas com intolerância à lactose a ler rótulos de alimentos. Os responsáveis pelo tratamento dos dados são os autores do projeto, que podem ser contatados em ' +
      POLITICA_CONTATO +
      '.',
  },
  {
    titulo: '2. Quais dados coletamos',
    texto:
      'Nome, e-mail e senha informados no cadastro; foto de perfil, se você escolher enviar uma; e o histórico das suas consultas (nome do produto, texto lido do rótulo, resultado da análise e data). Também registramos a data e a hora em que você aceitou esta política.',
  },
  {
    titulo: '3. O que não coletamos',
    texto:
      'As fotos dos rótulos não saem do seu celular: o texto é lido no próprio aparelho e somente esse texto é enviado ao servidor. Não coletamos localização, contatos nem outros dados do aparelho.',
  },
  {
    titulo: '4. Para que usamos os dados',
    texto:
      'Para criar e proteger a sua conta, analisar os rótulos, guardar o seu histórico e enviar o código de recuperação de senha por e-mail. Não usamos os dados para publicidade e não os vendemos. A base legal é o seu consentimento, dado ao aceitar esta política no cadastro.',
  },
  {
    titulo: '5. Com quem compartilhamos',
    texto:
      'Não compartilhamos seus dados com terceiros para fins comerciais. O e-mail de recuperação de senha é enviado por um serviço de envio de e-mails utilizado para esse fim, que recebe apenas o seu endereço e o código.',
  },
  {
    titulo: '6. Como protegemos',
    texto:
      'A senha é guardada de forma criptografada (hash) e a sessão fica no armazenamento seguro do aparelho. Cada usuário só acessa o próprio histórico. Esta versão do aplicativo é de demonstração acadêmica e o servidor de testes pode operar sem HTTPS; em uma publicação oficial, a conexão segura será obrigatória.',
  },
  {
    titulo: '7. Por quanto tempo guardamos',
    texto:
      'Enquanto a sua conta existir. Ao excluir a conta pelo aplicativo (Perfil > Excluir Conta), seus dados, histórico e foto são apagados. Os códigos de recuperação de senha expiram em poucos minutos.',
  },
  {
    titulo: '8. Seus direitos',
    texto:
      'Pela LGPD (Lei nº 13.709/2018), você pode pedir confirmação do tratamento, acesso, correção, eliminação dos dados e a revogação do consentimento. Você corrige o nome e a foto em Perfil > Editar Perfil e exclui a conta em Perfil > Excluir Conta. Para os demais pedidos, escreva para ' +
      POLITICA_CONTATO +
      '.',
  },
  {
    titulo: '9. Mudanças nesta política',
    texto: 'Esta política pode ser atualizada. A data da última atualização aparece abaixo e a versão vigente está sempre disponível no cadastro e na tela de Perfil. Última atualização: ' + POLITICA_ATUALIZADA_EM + '.',
  },
];
