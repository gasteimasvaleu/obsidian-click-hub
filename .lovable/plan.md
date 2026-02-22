

# Aplicar Gradiente Verde nos Titulos de Paginas Internas

## Problema
Varias paginas internas usam `text-foreground` (branco) nos titulos, enquanto as paginas principais ja usam o gradiente verde consistente (`bg-gradient-to-r from-primary via-primary to-primary/60 bg-clip-text text-transparent`).

## Paginas que precisam do gradiente

| Pagina | Arquivo | Titulo atual |
|--------|---------|-------------|
| Livro (capitulos) | `src/pages/biblia/BookChaptersPage.tsx` | Nome do livro (ex: "Genesis") |
| Leitor de capitulo | `src/pages/biblia/ChapterReaderPage.tsx` | "Genesis - Capitulo 1" |
| Minhas Criacoes | `src/pages/colorir/MyCreationsPage.tsx` | "Minhas Criacoes" |
| Transformar Foto | `src/pages/colorir/PhotoTransformPage.tsx` | "Transformar Foto" |
| Quiz Player | `src/pages/games/QuizPlayer.tsx` | Titulo do jogo |
| Guia para os Pais (resultado) | `src/components/guia-pais/GuideDisplay.tsx` | "Seu Guia Personalizado" |

**Excluidos (conforme solicitado):** todas as paginas da plataforma e paginas admin.

## Alteracoes

### 1. BookChaptersPage.tsx (linha 45)
Trocar:
```
text-3xl font-bold text-foreground
```
Por:
```
text-3xl font-bold bg-gradient-to-r from-primary via-primary to-primary/60 bg-clip-text text-transparent
```

### 2. ChapterReaderPage.tsx (linha 86)
Mesma troca no titulo do capitulo.

### 3. MyCreationsPage.tsx (linha 86)
Trocar `text-2xl font-bold mb-2 text-foreground` aplicando o gradiente.

### 4. PhotoTransformPage.tsx (linha 34)
Trocar `text-2xl font-bold mb-2 text-foreground` aplicando o gradiente.

### 5. QuizPlayer.tsx (linha 247)
Trocar `text-2xl font-bold text-foreground` no titulo do jogo aplicando o gradiente.

### 6. GuideDisplay.tsx (linha 28)
Trocar `text-primary animate-glow` por o gradiente verde (ja usa cor verde mas nao o gradiente consistente).

## Detalhes tecnicos

Classe padrao do gradiente usada nas paginas principais:
```
bg-gradient-to-r from-primary via-primary to-primary/60 bg-clip-text text-transparent
```

Sao 6 alteracoes simples de classe CSS, sem mudanca de estrutura. Nao requer novo build nativo.

