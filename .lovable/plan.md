

# Padronizar cor dos titulos das secoes

Os titulos das secoes devem seguir o padrao de gradiente verde usado em "Livrinho de Oracoes":
`bg-gradient-to-r from-primary via-primary to-primary/60 bg-clip-text text-transparent`

## Titulos que ja estao corretos
- Livrinho de Oracoes (Oracoes.tsx)
- Jogos & Quizzes (Games.tsx)
- Bibliafy (Audiofy.tsx)
- Amigo Divino (AmigoDivino.tsx)

## Titulos que precisam ser corrigidos

### 1. Colorir Biblico (src/pages/colorir/ColorirPage.tsx, linha 74)
Trocar `text-foreground mb-2` por `bg-gradient-to-r from-primary via-primary to-primary/60 bg-clip-text text-transparent mb-2`

### 2. Biblia Interativa (src/pages/biblia/BibliaPage.tsx, linha 108)
Trocar `text-foreground mb-2` por `bg-gradient-to-r from-primary via-primary to-primary/60 bg-clip-text text-transparent mb-2`

### 3. Devocional - titulo do tema (src/pages/devocional/DailyDevotionalPage.tsx, linha 402)
Trocar `text-foreground mb-3` por `bg-gradient-to-r from-primary via-primary to-primary/60 bg-clip-text text-transparent mb-3`

### 4. Comunidade (src/pages/Comunidade.tsx, linha 86)
Trocar `text-white text-2xl font-bold` por `text-2xl font-bold bg-gradient-to-r from-primary via-primary to-primary/60 bg-clip-text text-transparent`

## Fora do escopo
- Pagina `/plataforma` (excluida conforme solicitado)
- Pagina Sobre, NotFound, QuizPlayer (nao sao titulos de secao principal)
- GuiaPais nao possui titulo h1 na pagina

