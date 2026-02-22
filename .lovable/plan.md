
# Ajustar fonte do titulo do devocional

O titulo do tema do devocional usa `text-4xl font-bold` fixo (linha 402), mesmo padrao que acabamos de corrigir no Guia para Pais.

## Mudanca

Em `src/pages/devocional/DailyDevotionalPage.tsx`, linha 402, trocar:

```
text-4xl font-bold text-foreground mb-3
```

por:

```
text-3xl md:text-4xl font-bold text-foreground mb-3
```

Isso aplica o mesmo padrao responsivo do restante do site: menor no mobile, maior no desktop.
