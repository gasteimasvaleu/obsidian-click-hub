

# Ajustar fonte do titulo do Guia

O titulo "Seu Guia Personalizado" usa `text-4xl font-bold` fixo, enquanto o padrao do site e `text-3xl md:text-4xl font-bold` (menor em mobile, maior em desktop).

## Mudanca

Em `src/components/guia-pais/GuideDisplay.tsx`, linha 28, trocar:

```
text-4xl font-bold
```

por:

```
text-3xl md:text-4xl font-bold
```

Isso alinha o titulo com o padrao responsivo usado nas demais paginas (Games, Oracoes, Biblia, etc).

