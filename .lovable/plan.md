

## Adicionar Loop ao Vídeo da Página Audiofy

### Mudança Solicitada

Fazer o vídeo do banner musical tocar em loop contínuo.

### Alteração

**Arquivo:** `src/pages/Audiofy.tsx`

**Linha:** ~113-120

**Mudança:** Adicionar o atributo `loop` ao elemento `<video>` e remover o handler `onEnded` que fazia o loop manual.

**De:**
```jsx
<video
  src="https://fnksvazibtekphseknob.supabase.co/storage/v1/object/public/criativos/bannermusical.mp4"
  className="w-full h-auto"
  style={{ maxHeight: '300px' }}
  autoPlay
  muted
  playsInline
  onEnded={(e) => {
    e.currentTarget.currentTime = 0;
  }}
/>
```

**Para:**
```jsx
<video
  src="https://fnksvazibtekphseknob.supabase.co/storage/v1/object/public/criativos/bannermusical.mp4"
  className="w-full h-auto"
  style={{ maxHeight: '300px' }}
  autoPlay
  muted
  loop
  playsInline
/>
```

### Resultado

O vídeo `bannermusical.mp4` irá tocar continuamente em loop usando o atributo nativo do HTML5, que é mais eficiente que o método manual anterior.

