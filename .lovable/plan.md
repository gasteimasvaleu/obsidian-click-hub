
# Adicionar video banner na header da pagina Comunidade

## O que muda

Inserir o video `bannercomunidade.mp4` dentro de um `GlassCard` no topo da pagina Comunidade, seguindo exatamente o mesmo padrao visual usado na pagina Index (video dentro de GlassCard com `p-0 overflow-hidden`).

## Alteracao

### `src/pages/Comunidade.tsx`

1. Importar o componente `GlassCard`
2. Adicionar a secao de video entre o `FuturisticNavbar` e o conteudo existente, antes do header "Comunidade"
3. O video sera inserido dentro de um `GlassCard` com as mesmas propriedades usadas na Index:
   - `p-0 overflow-hidden` no card
   - `autoPlay`, `muted`, `playsInline` no video
   - `maxHeight: 300px` para manter proporcao
   - Loop ao terminar (usando `onEnded` para reiniciar)

### Estrutura resultante

```text
FuturisticNavbar
|
+-- Video Banner (GlassCard + video)  <-- NOVO
|     bannercomunidade.mp4
|
+-- Header "Comunidade"
+-- PostForm
+-- Feed de posts
```

### Detalhes tecnicos

- URL do video: `https://fnksvazibtekphseknob.supabase.co/storage/v1/object/public/criativos/bannercomunidade.mp4`
- O `pt-20` existente no container de conteudo sera ajustado para acomodar o video logo abaixo da navbar, mantendo o mesmo espacamento visual da pagina Index (`pt-16 pb-4`)
- O card do video tera `max-w-[500px]` centralizado, identico ao padrao da Index
