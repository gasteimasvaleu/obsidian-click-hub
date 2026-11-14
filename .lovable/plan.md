# Imagens 2D nos cards de "Seu progresso" (Perfil)

Trocar os 4 ícones dos cards (Jogos, Músicas, Devocionais, Sequência) por desenhos 2D no estilo do app: cartoon flat, contornos grossos, detalhes violeta, fundo transparente.

## Desenhos
- Jogos: controle de videogame alegre
- Músicas: notas musicais com fone de ouvido
- Devocionais: livro aberto com luz/cruz
- Sequência: chama/foguinho sorridente

## Layout
- A bolinha violeta com ícone vira a imagem 2D, h-14 w-14, centralizada acima do número.
- Número, título e legenda continuam iguais.

## Detalhes técnicos
- Gerar com imagegen (fundo transparente), reduzir para 256px e salvar em src/assets/perfil/progresso/{jogos,musicas,devocionais,sequencia}.png como imports diretos.
- Em Profile.tsx, trocar `icon` por `img` no array e renderizar `<img>` com alt vazio; remover imports de ícones não mais usados.
