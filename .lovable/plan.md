

## Correções para Rejeição da Apple (Guidelines 3.1.1 e 3.1.2c)

Três alterações de código + uma página nova:

### 1. `src/lib/revenuecat.ts` — Adicionar `restorePurchases()`
Nova função exportada que chama `Purchases.restorePurchases()` e retorna status de entitlements ativos.

### 2. `src/pages/TermosDeUso.tsx` — Nova página
Página com termos de uso/EULA cobrindo: descrição do serviço, assinatura auto-renovável, política de cancelamento, contato. Estilo consistente com `PoliticaFamilia.tsx`.

### 3. `src/App.tsx` — Registrar rota
Adicionar rota `/termos-de-uso` apontando para `TermosDeUso`.

### 4. `src/pages/Login.tsx` — Principais mudanças
- **Google Play**: Mudar condição para `getPlatform() === 'android'` (segurança extra)
- **Info da assinatura**: Abaixo do botão App Store, exibir:
  - "BíbliaToon KIDS Premium — Assinatura Mensal"
  - "Renovação automática. Cancele a qualquer momento."
- **Links obrigatórios**: Links para `/politica-familia` e `/termos-de-uso`
- **Botão Restaurar Compras**: Botão texto "Restaurar Compras" abaixo da seção de assinatura (visível apenas no iOS nativo)

### Ação manual no App Store Connect
1. Submeter o IAP BIBLIATOONKIDS2 para review com screenshot da tela de login atualizada
2. Adicionar link do EULA no campo de metadata

