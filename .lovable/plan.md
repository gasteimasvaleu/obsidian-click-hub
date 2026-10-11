# Paywall dentro de um card

## Objetivo

A tela de assinatura (paywall) hoje mostra os elementos soltos na tela. A ideia é reunir tudo — coroa, título, lista de benefícios, caixa de preço, botão Assinar, aviso de renovação, Restaurar Compras e links de Termos/Política — dentro de um único card com a borda padrão do app, deixando a tela mais bonita e organizada.

## Como vai ficar

- Fundo da tela continua escuro, ocupando o app inteiro.
- No centro, um card com a aparência padrão do app: cantos arredondados, fundo de vidro levemente translúcido e a mesma borda fininha usada nos cards das outras telas.
- O botão de fechar (X) fica no canto superior direito do próprio card.
- O card acompanha o brilho e a linha de luz animada na borda que já aparecem nos cards da tela inicial, na cor escolhida em Perfil → Aparência.
- Se a tela for pequena (celular com teclado, ou aparelho curto), o card continua rolando sem cortar o conteúdo.

## O que não muda

- Preço, assinatura, Restaurar Compras, portão de segurança dos pais e os links de Termos de Uso e Política de Privacidade seguem funcionando exatamente como hoje.
- Nenhum texto novo é inventado; só a apresentação muda.

## Detalhes técnicos

- Arquivo: `src/components/Paywall.tsx` (único arquivo alterado).
- O contêiner fixo de tela cheia (`fixed inset-0`, com as áreas seguras de topo e base) permanece, mas o bloco interno `max-w-md ... min-h-full` vira o card: `glass rounded-2xl p-6` — a classe `glass` já traz `background: var(--glass-bg)` e `border: 1px solid var(--glass-border)`, a borda padrão do app.
- Centralização vertical com `my-auto` no card e `flex-col` no contêiner; rolagem preservada porque o contêiner mantém `overflow-y-auto` e ganha padding vertical nas áreas seguras.
- Botão fechar move-se para dentro do card (topo direito), sem mudar a ação de fechar.
- Brilho e linha animada: `neon-glow-user` + `<span aria-hidden className="border-beam" />` dentro do card, iguais a `GlassCard.tsx`; o card não usa `overflow-hidden`, para não cortar a linha de luz.
- Caixa de preço mantém a borda esverdeada atual (`border-primary/30`) como destaque interno, agora dentro do card.
- `ParentalGate` continua renderizado fora do card, no mesmo nível do contêiner fixo.

## Validação

- Conferir no `build-errors.log` que a compilação está limpa.
- Verificar na prévia (navegador) o paywall aberto pela tela de Perfil → "Seja Premium", com o card centralizado, borda visível, botão fechar funcionando e a tela rolando em janela estreita.
- Validação final no celular pelo live update: fechar o app por completo e abrir de novo.
