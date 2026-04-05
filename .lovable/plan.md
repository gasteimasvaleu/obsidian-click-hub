

# Integrar RevenueCat Android com chave `goog_TdisBiQciqEnylaoXGDwMAKebIl`

## Arquivo 1: `src/lib/revenuecat.ts`

- Adicionar constante: `const REVENUECAT_ANDROID_KEY = 'goog_TdisBiQciqEnylaoXGDwMAKebIl'`
- Alterar `isRevenueCatSupported()` para retornar `true` quando plataforma for `ios` **ou** `android`
- Alterar `initRevenueCat()` para usar `REVENUECAT_ANDROID_KEY` no Android e `REVENUECAT_API_KEY` no iOS

## Arquivo 2: `src/pages/Login.tsx`

- Botão **Google Play** (linha 366): trocar o `toast.info(...)` por `handleAppStorePurchase()` (mesma lógica de compra do iOS)
- Desabilitar o botão Google durante compra (`disabled={isPurchasing}`) e mostrar spinner
- Botão **"Continuar com Google"** (linha 284): condicionar a `!hasPurchased` (igual ao Apple)
- Mostrar texto "Assine primeiro abaixo..." no Android quando `!hasPurchased`
- **Restaurar Compras** (linha 387): remover a condição `platform !== 'android'` para aparecer em ambas as plataformas
- **Texto de compliance** (linha 382): alterar "App Store" para "App Store ou Google Play"

## Resultado

O fluxo de compra, sync com Supabase e restore já existem e funcionam — apenas precisam ser habilitados para Android. Nenhuma mudança no backend/webhook é necessária.

