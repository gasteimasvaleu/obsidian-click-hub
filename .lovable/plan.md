# Nova tela de login (estilo app, tema violeta claro)

Hoje a tela é só um card cinza com "Bem-vindo", dois botões brancos e o formulário. A ideia é deixá-la com a mesma cara do resto do app.

## O que muda (só visual, a lógica de login continua igual)

1. **Topo com marca**
   - Logo do app (`logonova2navbar.png`) centralizada.
   - Mascote Frei Gilsinho ou a imagem 2D do Amigo Divino, flutuando de leve com uma animação suave.
   - Fundo com um brilho violeta difuso atrás do mascote.

2. **Card de boas-vindas no padrão bolha**
   - Título "Bem-vindo ao BíbliaToon Club" com a mesma fonte dos cards (última palavra em gradiente).
   - Subtítulo curto: "Bíblia, orações, devocional e cursos para toda a família".
   - Mesmo card violeta com borda luminosa usado nas outras páginas.

3. **Botões de entrar mais bonitos**
   - Apple e Google em pílulas brancas maiores, com sombra suave e cantos bem arredondados (Apple continua seguindo as regras de layout da Apple).
   - Divisor "ou entre com e-mail" mais discreto.

4. **Formulário de e-mail mais leve**
   - Campos dentro de um card branco translúcido, com ícones de e-mail e cadeado, botão para mostrar a senha.
   - Botão "Entrar" violeta, com o mesmo brilho dos outros botões.
   - Opcional: o formulário de e-mail começa recolhido ("Entrar com e-mail") para deixar a tela mais limpa.

5. **Rodapé**
   - Linha "Grátis para começar · 3 aulas liberadas" (reforça o freemium).
   - Links de Termos e Privacidade mantidos (exigência da Apple).

6. Ajuste para celular, iPad e computador (largura máxima, espaçamentos e área segura do iPhone).

## Detalhes técnicos
- Arquivo único: `src/pages/Login.tsx`; reaproveitar `BubbleTitleText`, classes `feature-bubble`, `neon-glow-user`, `border-beam`.
- Sem cores fixas novas: usar tokens do tema (exceto os botões brancos de Apple/Google, exigidos pelas diretrizes).
- Animações respeitam "reduzir movimento".
