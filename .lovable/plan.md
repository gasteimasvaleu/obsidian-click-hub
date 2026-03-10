

## Corrigir Splash Screen cortada no celular

O problema: o vídeo usa `object-cover` no mobile, o que faz ele "zoom in" e cortar o conteúdo (como mostra o screenshot com o logo cortado).

### Alteração

**`src/components/SplashScreen.tsx`** — Trocar `object-cover` por `object-contain` no mobile, mantendo o fundo preto visível nas bordas:

```tsx
// De:
"w-full h-full object-cover",
"md:w-auto md:h-full md:max-w-none",
"md:object-contain",

// Para:
"w-full h-full object-contain",
```

Isso garante que o vídeo inteiro seja visível sem cortes em qualquer tamanho de tela, centralizado sobre o fundo preto.

