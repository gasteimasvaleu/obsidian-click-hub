

# Integrar RevenueCat para Assinaturas Nativas (iOS)

## Resumo

Instalar o pacote `@revenuecat/purchases-capacitor`, configurar o SDK do RevenueCat na inicializacao do app, conectar o botao "App Store" na pagina de login para iniciar a compra do produto `com.bibliatoon.mensal`, e apos compra bem-sucedida atualizar o status do usuario no Supabase e redirecionar para a tela inicial.

## Arquitetura

```text
[Botao App Store] --> RevenueCat SDK --> Apple StoreKit --> Compra OK
                                                              |
                                                              v
                                                  Edge Function (revenuecat-webhook)
                                                              |
                                                              v
                                                  Supabase (subscribers table)
```

## Etapas

### 1. Instalar dependencia
- Instalar `@revenuecat/purchases-capacitor`

### 2. Criar servico RevenueCat (`src/lib/revenuecat.ts`)
- Inicializar o SDK com a API key `appl_rDJWtfWfVugefZjBugxiJIISOcR`
- Funcao `initRevenueCat()` para configurar o SDK (chamada uma vez no App.tsx)
- Funcao `purchaseMonthly()` para comprar o produto `com.bibliatoon.mensal`
- Funcao `checkSubscriptionStatus()` para verificar entitlements ativos
- Funcao `identifyUser(userId)` para associar o usuario Supabase ao RevenueCat

### 3. Configurar inicializacao no App.tsx
- Chamar `initRevenueCat()` no carregamento do app (apos splash)
- Quando o usuario estiver autenticado, chamar `identifyUser()` com o ID do Supabase para sincronizar

### 4. Atualizar pagina de Login (`src/pages/Login.tsx`)
- No botao "App Store", substituir o `toast.info('Em breve!')` por logica de compra:
  1. Chamar `purchaseMonthly()`
  2. Se compra bem-sucedida, criar conta/login do usuario e atualizar o Supabase
  3. Redirecionar para `/`
- Tratar erros (usuario cancelou, erro de pagamento, etc.)

### 5. Criar Edge Function `revenuecat-webhook` (para sincronizacao futura)
- Receber webhooks do RevenueCat para renovacoes, cancelamentos, etc.
- Atualizar a tabela `subscribers` com status da assinatura
- Registrar origem como `revenuecat`

### 6. Atualizar tabela `subscribers` apos compra
- Apos compra bem-sucedida no client, chamar uma Edge Function para registrar a assinatura
- Criar/atualizar registro na tabela `subscribers` com:
  - `subscription_status`: 'active'
  - `subscription_expires_at`: data de expiracao do RevenueCat
  - Novo campo ou convencao para identificar origem `revenuecat`

## Detalhes Tecnicos

### Arquivos criados/modificados

| Arquivo | Alteracao |
|---------|-----------|
| `package.json` | Adicionar `@revenuecat/purchases-capacitor` |
| `src/lib/revenuecat.ts` | Novo - servico com funcoes do RevenueCat |
| `src/App.tsx` | Inicializar RevenueCat e identificar usuario |
| `src/pages/Login.tsx` | Conectar botao App Store a funcao de compra |
| `supabase/functions/revenuecat-webhook/index.ts` | Nova Edge Function para webhooks |
| `supabase/config.toml` | Registrar nova Edge Function |

### Fluxo do botao "App Store" no Login

1. Usuario clica no botao
2. SDK RevenueCat apresenta a tela de compra nativa do iOS
3. Usuario completa a compra via Apple Pay / StoreKit
4. App recebe confirmacao do RevenueCat
5. App chama Edge Function para registrar assinatura no Supabase
6. Se usuario nao esta logado, redireciona para `/cadastro?source=revenuecat` para criar conta
7. Se usuario ja esta logado, atualiza subscribers e redireciona para `/`

### Nota importante sobre ambiente web
- O SDK do RevenueCat so funciona em ambiente nativo (iOS/Android via Capacitor)
- No ambiente web (preview), o botao exibira uma mensagem informando que a assinatura so esta disponivel no app nativo
- Sera usado um check `Capacitor.isNativePlatform()` para diferenciar

