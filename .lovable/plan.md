# Página Sobre no padrão do app

Todos os blocos passam a usar título em bolha violeta com o card branco preso embaixo. Saem os ícones que ocupam uma linha inteira e os quadrados coloridos.

## O que muda
- **Topo**: bolha "Sobre o BíbliaToon Club", com o card "Transformando fé em aventura" embaixo.
- **Nossa História**, **Nosso Propósito**, **Nosso Compromisso**: cada um vira uma bolha com o texto no card. O ícone grande acima do título sai.
- **Encantam / Educam / Transformam**: um card por item, com o título em bolha e o texto embaixo, sem quadrado colorido. Ficam 1 por linha no celular e 3 no desktop.
- **O que você encontra** e **Diferenciais**: o título da seção vira cabeçalho padrão (bolha com descrição curta). Cada item vira bolha + card com o texto, 1 por linha no celular e 2 no desktop. Os quadrados coloridos com ícone saem.
- **Junte-se a nós**: bolha + card com o texto e o botão "Começar Agora" como a barra violeta de setinhas, na largura do card.
- Espaços entre seções menores e uniformes.

## Observação de conteúdo
- O texto diz "valores evangélicos tradicionais". Como o app é católico, proponho trocar por "valores católicos". Os textos sobre "heróis de animes (Naruto, Goku)" ficam como estão, a menos que você peça.

## Detalhes técnicos
- `src/pages/Sobre.tsx`: usar o `BubbleSection` e o `SectionHeader` existentes, remover `SectionTitle`, `FeatureCard`, os gradientes e os ícones da lucide sem uso, trocar o `NeonButton` por `ArrowNavButton direction="right"` e manter as animações de entrada leves.
