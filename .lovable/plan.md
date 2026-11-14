# Perfil no padrão do app

Todos os blocos do Perfil passam a usar o mesmo visual das outras telas: título em bolha violeta com um card branco preso embaixo, botões em barra arredondada dividida e a largura igual à da Bíblia.

## O que muda, bloco a bloco
1. **Cabeçalho do usuário**
   - O nome vai para a bolha violeta, com o lápis de editar dentro dela.
   - No card branco: foto com o botão da câmera, e-mail, três etiquetas suaves (Nível, pontos, conquistas) e a barra "Próximo nível" em violeta.
   - "Sair da Conta" e "Excluir Conta" viram uma barra arredondada dividida ao meio. Os dois ficam em vermelho e mantêm a confirmação de exclusão.
2. **Premium**: bolha "Assinante Premium" (ou "Seja Premium"), com a coroa e a data de renovação no card. Quem não assina vê o botão "Assinar agora" na largura do card.
3. **Aparência**: bolha "Aparência", com a explicação e as bolinhas de cor no card. As setas laterais passam a ser as setinhas violeta do app.
4. **Devocional no WhatsApp**: bolha com o título. No card ficam a chave liga/desliga, o telefone e o "Salvar" na largura do card. O ícone e o check verdes passam a violeta.
5. **Estatísticas** (Jogos, Músicas, Devocionais, Sequência): um título em bolha "Seu progresso" e um card com 4 quadradinhos em grade 2x2 no celular (4 lado a lado no desktop), cada um com ícone violeta, número grande e legenda.
6. **Abas** (Conquistas, Atividades, Devocionais, Anotações): as abas viram uma barra arredondada dividida em 4, com ícone e nome pequeno, e a escolhida em violeta clarinho.
   - Na lista de conquistas, os nomes técnicos (ex.: "first_coloring") passam a aparecer em português ("Primeira Pintura").

## Detalhes técnicos
- `src/pages/Profile.tsx`: o wrapper passa a `container mx-auto px-4 pt-20 max-w-[58rem]`. Cada bloco usa `neon-glow-user feature-bubble bubble-user` + border-beam + `BubbleTitleText` e `GlassCard -mt-4 pt-7 rounded-t-none`. Barras com `rounded-full border divide-x h-11`. Cores `red-*` e `green-*` trocadas pelos tokens `destructive`/`primary`. `TabsList` estilizado como barra. Completar `getBadgeName` com os tipos que faltam.
- `src/components/profile/AppearanceSection.tsx` e `WhatsAppOptinSection.tsx`: trocar o `Card` pelo padrão bolha + GlassCard, sem mudar a lógica.
