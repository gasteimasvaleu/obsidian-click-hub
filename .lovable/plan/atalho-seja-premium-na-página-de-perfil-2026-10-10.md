# Atalho "Seja Premium" na página de Perfil

## Objetivo
Dar ao usuário gratuito um caminho visível para assinar fora do bloqueio de aulas: um card de destaque na página de Perfil que abre a tela de assinatura (Paywall) já existente.

## Mudanças

### 1. `src/pages/Profile.tsx`
- Importar `useSubscription` e o componente `Paywall` (já existentes).
- Logo abaixo do card principal do usuário (antes de `AppearanceSection`):
  - **Usuário gratuito:** mostrar um card de destaque com ícone de coroa/estrela, título "Seja Premium", texto curto sobre os benefícios (aulas ilimitadas, conteúdo completo) e botão "Assinar agora" que abre o `Paywall`.
  - **Assinante ativo:** mostrar um badge/card discreto "Assinante Premium" com a data de renovação (sem botão de compra).
- Estado local `showPaywall` controla a abertura do `Paywall` (mesmo padrão usado em `LessonPage`).

### 2. Sem mudanças em lógica de negócio
- Reutiliza `useSubscription` (status da assinatura) e `Paywall` (compra via RevenueCat) já criados na migração freemium.
- Nada muda no login, nas aulas ou no banco de dados.

## Detalhes técnicos
- `useSubscription` expõe `isSubscribed`/`loading`; o card só renderiza após o carregamento para não piscar.
- `Paywall` é controlado por props `open`/`onOpenChange` (verificar assinatura atual do componente ao implementar e adaptar).
- Estilo segue o tema: fundo escuro, borda `border-primary/20`, destaque em verde neon (`text-primary`), sem cores hardcoded fora dos tokens.

## Validação
- Build sem erros.
- Na prévia: conta gratuita vê o card "Seja Premium"; o botão abre o Paywall (no navegador a compra não conclui — esperado, só funciona no app nativo).
