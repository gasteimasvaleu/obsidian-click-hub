# Destaque discreto na logo do topo

- A logo ganha uma sombra violeta suave em volta, que a separa do fundo claro.
- De tempos em tempos, um brilho leve passa por ela (a cada cerca de 6 segundos), sem piscar.
- A logo fica um pouco maior: de 32px para 36px de altura.
- Quem ativou "reduzir movimento" no celular vê só a sombra, sem o brilho.

## Detalhes técnicos
- Em `src/components/FuturisticNavbar.tsx`: na imagem, trocar `h-8` por `h-9` e adicionar a classe `logo-pop`.
- Em `src/index.css`: `.logo-pop` com `filter: drop-shadow(0 1px 2px hsl(var(--primary)/.35)) drop-shadow(0 0 8px hsl(var(--primary)/.25))` e uma animação lenta `logo-breathe` que varia o drop-shadow e o brilho, desligada em `prefers-reduced-motion`.
