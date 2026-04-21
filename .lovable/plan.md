

## Atualizar SPLASH_IMAGE_URL para o primeiro frame da animação

Trocar a URL da imagem base no `SplashScreen.tsx` para o primeiro frame do vídeo. Assim a transição entre a imagem estática (enquanto o vídeo carrega) e o início da animação fica imperceptível — sem mais o ícone verde antigo.

### Mudança em `src/components/SplashScreen.tsx`

Alterar apenas a constante:

```ts
// Antes
const SPLASH_IMAGE_URL = "https://fnksvazibtekphseknob.supabase.co/storage/v1/object/public/criativos/image.png";

// Depois
const SPLASH_IMAGE_URL = "https://fnksvazibtekphseknob.supabase.co/storage/v1/object/public/criativos/videoframe_0%2018.32.25.png";
```

Nenhuma outra alteração de lógica é necessária. O resto do componente (camadas, fade, timers, fallback) permanece igual.

### Comportamento resultante

```text
LaunchScreen nativo iOS (logo bibliatoon CLUB)
  ↓
React monta → SplashScreen mostra o primeiro frame da animação (estático)
  ↓
Vídeo carrega → animação começa do mesmo frame (transição invisível)
  ↓
Vídeo termina → fade out → app
```

Se o vídeo falhar, o usuário vê o primeiro frame estático até o `MAX_DISPLAY_MS` — visualmente coerente, sem ícone antigo.

### Lembrete sobre Live Update

Após a mudança, para que devices existentes recebam a correção:
1. `npm run sync:ios` no Mac e rebuildar via Xcode (testa local).
2. Publicar novo bundle no Appflow canal `Production` para alinhar todos os usuários.

### Risco
Mínimo — alteração de uma única string.

