

# Reorganizar filtros: "Todos" sozinho + pares abaixo

## Problema

Forcar 5 colunas ou scroll horizontal nao funciona bem no mobile.

## Solucao

Separar o botao "Todos" dos demais e usar grid de 2 colunas para os restantes:

1. "Todos" ocupa uma linha inteira (largura total)
2. "Quiz" + "Memoria" na segunda linha
3. "Caca-palavras" + "Quebra-cabeca" na terceira linha

## Mudanca

| Arquivo | Alteracao |
|---------|-----------|
| `src/pages/Games.tsx` | Linhas 130-149: Substituir o grid unico por dois blocos - um Button "Todos" com `w-full` seguido de um `grid grid-cols-2 gap-2` com os 4 botoes restantes |

### Codigo resultante (trecho)

```text
<div className="space-y-2">
  {/* Botao Todos - linha inteira */}
  <Button w-full ...>Todos</Button>
  
  {/* Demais botoes - 2 por linha */}
  <div className="grid grid-cols-2 gap-2">
    <Button>Quiz</Button>
    <Button>Memoria</Button>
    <Button>Caca-palavras</Button>
    <Button>Quebra-cabeca</Button>
  </div>
</div>
```

Tambem reverter as mudancas anteriores: remover `text-xs sm:text-sm` e `hidden sm:block` dos botoes, voltando ao tamanho e icones normais.

