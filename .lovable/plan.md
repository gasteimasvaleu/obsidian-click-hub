
Objetivo: seguir para a etapa de assinaturas Android. Sim, o próximo passo é criar/configurar a Conta de Serviço, mas ela é para Google Play + RevenueCat, não para o login Google.

Plano
1. Criar a Conta de Serviço no Google Cloud
- Use o mesmo projeto do Google Play/assinaturas.
- Vá em IAM & Admin > Service Accounts.
- Crie uma conta dedicada, por exemplo: `revenuecat-play-sync`.
- Gere a chave JSON dessa conta.
- Se o Google bloquear criação de chave por política da organização, use um projeto “sem organização” ou ajuste a política antes.

2. Dar acesso no Google Play Console
- No Play Console, convide essa service account como usuária/API access.
- Conceda as permissões mínimas necessárias para assinaturas:
  - Dados financeiros
  - Gerenciar pedidos e assinaturas
- Vincule o app correto da Play Store.

3. Conectar no RevenueCat
- No dashboard do RevenueCat, adicione a credencial da Google Play.
- Faça upload do JSON da service account.
- Confirme que o app Android e o produto de assinatura estão mapeados corretamente.

4. Validar o cadastro do produto Android
- Confirmar no Google Play Console se a assinatura Android correspondente existe e está ativa.
- Garantir alinhamento entre:
  - produto no app
  - produto no RevenueCat
  - entitlement/offering já usados no projeto

5. Depois da Conta de Serviço
- A próxima etapa técnica no projeto será habilitar Android no fluxo de assinatura.
- Hoje o código ainda bloqueia Android em `src/lib/revenuecat.ts` e mostra “Assinaturas via Google Play estarão disponíveis em breve!”.
- Depois que a service account estiver funcionando, o plano seguinte deve ser:
  - configurar a chave pública Android do RevenueCat (`goog_...`)
  - habilitar RevenueCat no Android
  - testar compra, restauração e sincronização com o webhook no Supabase

O que já está separado corretamente
- Google Auth/Supabase: já configurado para login
- Service Account: é outra trilha, usada só para compras/assinaturas Google Play

Detalhes técnicos
```text
Login Google
- Usa OAuth Web/Android + Supabase
- Não depende de service account

Assinatura Android
- Depende de Google Play Console + RevenueCat
- Precisa de service account JSON com permissões no Play Console
- Só depois disso faz sentido liberar o Android no código
```

Resultado esperado
- RevenueCat consegue ler/validar compras da Google Play
- O projeto fica pronto para a próxima implementação: ativar assinaturas Android no app sem quebrar o fluxo atual
