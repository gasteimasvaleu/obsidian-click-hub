

# Mover Lancamentos para Baixo do Grid e Reduzir Imagens

## Alteracao

Duas mudancas simples no arquivo `src/pages/Index.tsx`:

1. **Mover a secao de Lancamentos** (linhas 98-124) para depois do grid de botoes (apos linha 147), mantendo a ordem: Video > Cursos > Grid > Lancamentos.

2. **Reduzir o tamanho das imagens pela metade**: de `w-[150px] h-[290px]` para `w-[75px] h-[145px]`.

## Layout Final

```text
[Video banner]
[Card "Acessar Cursos"]
[Grid de botoes 2 colunas]
[Card "Confira nossos Lancamentos"]   <-- movido para ca
[Carrossel com imagens 75x145]        <-- imagens reduzidas
```

## Arquivo modificado

| Arquivo | Alteracao |
|---------|-----------|
| `src/pages/Index.tsx` | Mover bloco do carrossel para apos o grid; alterar dimensoes das imagens de 150x290 para 75x145 |

