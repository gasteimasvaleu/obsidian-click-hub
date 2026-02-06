

# Fix: Adicionar padding inferior no editor de colorir

## Problema
Os controles de cores na parte inferior da pagina do editor de colorir (paleta de cores, ferramentas) ficam escondidos atras do menu tubelight fixo na parte inferior da tela.

## Solucao
Adicionar `pb-28` (padding-bottom) na div de controles do `ColoringEditorPage.tsx` para garantir que todo o conteudo fique visivel acima do menu de navegacao.

## Alteracao

**Arquivo:** `src/pages/colorir/ColoringEditorPage.tsx` (linha 141)

Trocar:
```
<div className="p-3 space-y-3 border-t border-border bg-background/80 backdrop-blur">
```

Por:
```
<div className="p-3 pb-28 space-y-3 border-t border-border bg-background/80 backdrop-blur">
```

Essa e a mesma abordagem usada em outras paginas do app (Login, Profile, Plataforma) conforme o padrao ja documentado no projeto.

