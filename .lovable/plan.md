

# Corrigir navbar atras da barra de status + reduzir espaco do video

## Problema 1: Navbar atras da barra de status
A navbar usa `position: fixed`, entao ela ignora o `padding-top` do `body`. Ela precisa ter seu proprio padding para o safe-area do iOS.

## Problema 2: Espaco entre navbar e video
O container do video usa `pt-14` que cria espaco excessivo.

## Solucao

### Arquivo: `src/components/FuturisticNavbar.tsx` (linha 13)
Adicionar padding-top com safe-area na navbar:

De:
```
px-4 pt-2 pb-4
```
Para:
```
px-4 pb-4 pt-[max(0.5rem,env(safe-area-inset-top))]
```

Isso faz a navbar respeitar o espaco da barra de status no iOS. Em dispositivos sem safe-area, usa 0.5rem como minimo.

### Arquivo: `src/pages/Index.tsx` (linha 42)
Reduzir o padding-top do container do video:

De:
```
pt-14
```
Para:
```
pt-12
```

