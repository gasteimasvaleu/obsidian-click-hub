
# Substituir hero card por video na pagina Colorir

## Alteracao

**Arquivo:** `src/pages/colorir/ColorirPage.tsx`

Substituir o conteudo do GlassCard hero (icone, titulo e descricao) por um video com o mesmo estilo usado no SplashScreen e em outros banners do app.

### De (linhas 58-68):
```tsx
<div className="flex justify-center mb-6 animate-fade-in">
  <GlassCard className="w-full max-w-3xl text-center">
    <div className="p-4 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 w-fit mx-auto mb-4">
      <Palette size={40} className="text-white" />
    </div>
    <h1 className="...">Colorir Biblico</h1>
    <p className="...">Solte a criatividade...</p>
  </GlassCard>
</div>
```

### Para:
```tsx
<div className="flex justify-center mb-6 animate-fade-in">
  <GlassCard className="w-full max-w-3xl p-0 overflow-hidden">
    <video
      src="https://fnksvazibtekphseknob.supabase.co/storage/v1/object/public/criativos/colorir%20novo.mp4"
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      className="w-full h-auto rounded-2xl"
    />
  </GlassCard>
</div>
```

- O GlassCard recebe `p-0` para remover o padding interno e `overflow-hidden` para o video respeitar o border-radius
- O video usa `autoPlay`, `muted`, `loop` e `playsInline` para reproduzir automaticamente sem som
- O import do icone `Palette` sera mantido pois e usado em outras partes da mesma pagina (EmptyState e CategoryFilter)
