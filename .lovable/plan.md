# Paywall: botão da loja e card mais compacto

## O que muda
1. **Botão "Assinar com Google Play" (Android) / "Assinar com App Store" (iPhone)**
   - Troca o botão "Assinar" por um botão com o logo da loja, no estilo do antigo botão do login.
   - O teclado aparecia porque o botão abria primeiro a verificação para pais (conta de matemática com campo de digitação). No Android o botão passa a abrir direto a compra do Google Play, sem esse passo.
   - No iPhone a verificação para pais continua, mas com respostas em botões (sem abrir teclado).
2. **Card do paywall menor na altura**
   - Ícone, título e espaçamentos menores; benefícios em texto menor; preço junto do botão; links de Termos/Privacidade e "Restaurar Compras" na mesma linha.

## Detalhes técnicos
- `src/components/Paywall.tsx`: botão com ícone SVG da loja conforme `getPlatform()`; Android chama `doPurchase()` direto; reduzir `p-5→p-4`, `mt-5→mt-3`, título `text-xl`, ícone `h-10`.
- `src/components/ParentalGate.tsx`: trocar campo de texto por 4 opções de resposta em botões.
- Chega aos celulares via live update.
