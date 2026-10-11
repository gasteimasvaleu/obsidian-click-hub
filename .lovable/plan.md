# Adicionar card "Comunidade" na home (último card, esticado até o menu)

## O que será feito

1. **Novo card "Comunidade"** como último atalho da tela inicial:
   - Abre `/comunidade` (rota já existente).
   - Ícone `MessageCircle` (lucide).
   - Nova cor própria `bg-feature-community` (índigo — `--feature-community: 245 85% 60%`), adicionada em `:root` e `.dark` no `index.css` e registrada no `tailwind.config.ts`.

2. **Último card esticado até o tubelight navbar**:
   - O card "Comunidade" recebe altura maior (`min-h-[150px]`) em vez dos 88px padrão.
   - O espaçamento inferior do conteúdo (`pb-8` do container interno) é removido, para que a borda inferior do card encoste exatamente no topo do menu inferior fixo (o `pb-24` externo, que reserva o espaço do navbar, é mantido).
   - O conteúdo do card (ícone + título + seta) continua alinhado ao topo, deixando o extra como área colorida abaixo — estilo "faixa" que desce até o menu.

## Arquivos alterados

- `src/index.css` — token `--feature-community` (claro e escuro).
- `tailwind.config.ts` — cor `community` no grupo `feature`.
- `src/pages/Index.tsx` — card "Comunidade" no fim de `featureActions`; altura maior no último item; remoção do `pb-8` inferior.

## Verificação

- Build sem erros.
- Playwright (390x844): rolar a home até o fim e confirmar que o card "Comunidade" é o último e encosta no menu inferior.

## Observações

- O item "Comunidade" continua também no menu "Mais" — o card é apenas um atalho adicional.
- Mudança só de telas (frontend), compatível com live update.
