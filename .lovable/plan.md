# Vídeo de topo na página Terço

- Colocar o vídeo enviado no topo da página Terço, no mesmo cartão de vídeo das outras páginas (como Orações): largura total, formato 16:9, toca sozinho, sem som e **sem repetir**.
- Ele fica acima do título "Santo Terço", abaixo do botão voltar.

## Detalhes técnicos
- Subir o vídeo com lovable-assets para `src/assets/terco/terco-topo.mp4.asset.json` e importar em `src/pages/Terco.tsx`.
- `<video autoPlay muted playsInline className="aspect-video w-full object-cover">` dentro de `GlassCard p-0`, sem `loop`; esconde o cartão se o vídeo falhar.
- O endereço completo do site já é aplicado no build nativo, então o vídeo também aparece no app.
