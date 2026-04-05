

# Integrar botão Google Play com RevenueCat Android

## O que precisa acontecer

Quando as 36h de propagação da conta de serviço passarem e a chave `goog_` estiver disponível no RevenueCat, a integração requer **duas mudanças simples**:

---

## 1. Habilitar RevenueCat no Android (`src/lib/revenuecat.ts`)

**Hoje:** `isRevenueCatSupported()` retorna `true` apenas para iOS.

**Mudança:**
- Adicionar a API key Android: `const REVENUECAT_ANDROID_KEY = 'goog_XXXXXXXX'`
- Alterar `isRevenueCatSupported()` para aceitar iOS **e** Android
- No `initRevenueCat`, usar a chave correta conforme a plataforma (`appl_` no iOS, `goog_` no Android)

## 2. Ativar o botão Google Play na tela de Login (`src/pages/Login.tsx`)

**Hoje:** O botão "Google Play" exibe apenas um `toast.info("em breve")`.

**Mudança:**
- Fazer o botão chamar `handleAppStorePurchase()` (mesma função do iOS — usa `purchaseMonthly()` internamente)
- Adicionar o botão "Restaurar compras" no Android (hoje só aparece no iOS)
- Ajustar o texto de compliance para mencionar "App Store ou Google Play"

---

## O que eu preciso de você

1. **A chave pública Android do RevenueCat** (`goog_XXXXXXXX`) — você encontra em: RevenueCat Dashboard → Project → API Keys → Google Play public key
2. **Confirmar que o produto `BIBLIATOONKIDS2`** está mapeado no RevenueCat para o Google Play (vinculado ao product ID da assinatura que você criou no Play Console)

Com essas duas informações, a implementação leva poucos minutos — o fluxo de compra, sync com Supabase e restore já estão prontos e funcionam igual para ambas as plataformas.

