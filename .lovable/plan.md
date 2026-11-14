# Manter a logo original na barra superior

Na tela inicial clara, a barra superior mostra o texto "BíbliaToon Club" no lugar da logo. A logo colorida "bibliatoon CLUB." vai voltar a aparecer, igual nas outras telas.

## O que muda
- Barra superior da tela inicial: sai o texto e volta a imagem da logo, na mesma altura de antes.
- O restante da barra (ícones de perfil, sair e informações) continua como está.

## Detalhes técnicos
- Em `src/components/FuturisticNavbar.tsx`, remover a troca condicional por texto quando `light` está ativo e usar sempre a `<img>` existente (`logonova2navbar.png`, já hospedada no armazenamento do app, igual ao arquivo enviado).
- O efeito de brilho ao passar o dedo fica só no tema escuro, para não destoar no fundo claro.
