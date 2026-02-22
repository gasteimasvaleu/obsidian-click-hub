

# Ajustar fonte do titulo da Biblia

O titulo "Biblia Interativa" em `src/pages/biblia/BibliaPage.tsx` (linha 108) usa `text-4xl font-bold` fixo, mesmo caso das paginas anteriores.

## Mudanca

Linha 108, trocar:

```
text-4xl font-bold text-foreground mb-2
```

por:

```
text-3xl md:text-4xl font-bold text-foreground mb-2
```

Mesmo padrao responsivo aplicado no Guia para Pais e no Devocional.

