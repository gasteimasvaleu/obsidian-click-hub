# Tirar "Política de Famílias e Privacidade" da tela inicial

## O que muda

- A tela inicial deixa de mostrar a linha azul "Política de Famílias e Privacidade" no fim da página, logo abaixo do card Bíbliafy.
- O acesso a essa página passa a existir apenas pelo menu "Mais" da barra inferior. Ele já está lá hoje com o rótulo curto "Política Família", então nada precisa ser adicionado ao menu.
- Os atalhos que já existem (Acessar Cursos, Lançamentos e os 4 cards) continuam exatamente como estão; a página termina no último card.

## Passos

1. Remover o bloco do link na tela inicial (`src/pages/Index.tsx`, linhas 167 a 173): o contêiner clicável que leva a `/politica-familia`, com o ícone de escudo e o texto sublinhado.
2. Retirar `ShieldCheck` da lista de ícones importados nesse mesmo arquivo (linha 4), já que ele só era usado ali.
3. Conferir que a entrada continua no menu "Mais" (`src/components/ui/tubelight-navbar.tsx`, linha 24) e manter o rótulo curto "Política Família" — o painel é dividido em três colunas estreitas e o nome completo não cabe.
4. Atualizar a memória da navegação para registrar que o link saiu da tela inicial e vive só no menu "Mais".

## Detalhes técnicos

- A rota `/politica-familia` (`src/App.tsx`, linha 158) permanece ativa; os links que levam até ela em `Login.tsx`, `Paywall.tsx` e no aviso de consentimento de IA também permanecem.
- Nenhuma mudança de banco de dados, permissões ou regras de assinatura.
- As definições de navegação continuam em `App.tsx` e `tubelight-navbar.tsx`, conforme a regra do projeto.

## Verificação

- Compilação sem erros.
- Tela inicial: a linha some e o conteúdo termina no card Bíbliafy, sem sobra de espaçamento.
- Menu "Mais": tocar em "Política Família" abre a página normalmente.
