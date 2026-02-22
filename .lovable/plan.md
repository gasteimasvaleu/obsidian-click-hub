

# Ajustar grid de cards: remover clipPath e usar placeholders internos

## O que muda:

1. **Card "Acessar Cursos"**: permanece como esta, com o efeito clipPath e a imagem saindo do card.

2. **Grid de cards**: 
   - Remover o `clipPath` e o posicionamento absoluto dos icones.
   - Remover a `image` do card "Biblia Interativa" para que use o placeholder (icone com gradiente) igual aos outros.
   - Ajustar o layout dos cards do grid para que o icone com gradiente fique **dentro** do card, ao lado do texto, sem sair dos limites.
   - Reduzir o `pl` (padding-left) ja que o icone nao sai mais do card.

## Detalhes tecnicos em `src/pages/Index.tsx`:

**Linha 26** - Remover a propriedade `image` do item "Biblia Interativa":
```
{ title: "Biblia Interativa", icon: Book, action: () => navigate('/biblia'), gradient: "from-blue-500 to-indigo-600" },
```

**Linhas 83-107** - Simplificar os cards do grid:
- Remover `style={{ clipPath: ... }}` 
- Trocar layout para `flex items-center gap-3` com padding normal
- Substituir o bloco condicional `action.image ? ... : ...` por apenas o icone placeholder dentro do card (sem posicionamento absoluto)
- Icone placeholder: caixa com gradiente e icone, tamanho fixo (~48x48px), arredondado

O resultado sera cards com o icone colorido a esquerda e o texto a direita, tudo contido dentro dos limites do card.
