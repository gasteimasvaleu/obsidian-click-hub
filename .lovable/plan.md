# Trocar o conteúdo do card de boas-vindas pela imagem do Frei

- No card violeta da tela de login, sai o título "Bem-vindo ao BíbliaToon Club" e o subtítulo.
- No lugar entra a imagem enviada (Frei segurando a placa "Bem-Vindo ao Bíbliatoon Club"), centralizada e ocupando a largura do card.
- O fundo violeta e a borda luminosa continuam iguais.
- As laterais vazias da imagem são cortadas para o Frei aparecer maior. Se o fundo for branco, ele é removido para a imagem ficar sobre o violeta.

## Detalhes técnicos
- Cortar e, se precisar, deixar o fundo transparente; enviar com lovable-assets para `src/assets/frei-boas-vindas.png.asset.json`.
- Em `src/pages/Login.tsx`, trocar o h1 e o p do card por `<img alt="Bem-vindo ao BíbliaToon Club">`, com padding menor no card.
