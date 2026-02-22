
# Adicionar card de descricao na pagina Colorir

A pagina Colorir nao possui o card com titulo e descricao abaixo do video, diferente das outras paginas (Biblia, Amigo Divino, etc.).

## Mudanca

Em `src/pages/colorir/ColorirPage.tsx`, adicionar um GlassCard de descricao entre o video (linha 70) e os Action Cards (linha 72), seguindo o mesmo padrao da pagina da Biblia:

```tsx
<GlassCard className="max-w-3xl mx-auto mb-6 text-center animate-fade-in bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-400/30">
  <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
    Colorir Biblico
  </h1>
  <p className="text-muted-foreground text-base">
    Pinte desenhos biblicos incriveis e solte sua criatividade!
  </p>
</GlassCard>
```

Usa gradiente roxo/rosa para combinar com a identidade visual da secao de colorir, e segue o padrao responsivo de fonte ja aplicado nas outras paginas.
