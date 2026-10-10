# Freemium via Live Update (sem novo build nativo)

## Decisão
Publicar todas as mudanças do modelo freemium apenas por **atualização ao vivo (live update)**, sem gerar novo build para App Store / Google Play e sem criar novo produto no RevenueCat.

## Por que funciona
- Todas as mudanças feitas são somente de código web (telas, regras de acesso, hooks): login livre, 3 aulas grátis, paywall em tela cheia, card "Seja Premium" no Perfil.
- Nenhuma mudança tocou código nativo, permissões ou plugins — portanto o live update cobre tudo.
- O produto de assinatura existente no RevenueCat (**BIBLIATOONKIDS2** no iOS / **bibliatoonkids2** no Android) continua o mesmo — o paywall usa `Purchases.getOfferings()` e `purchaseMonthly()`, que já apontam para ele. Nenhum produto novo é necessário.

## O que já está pronto (nada a refazer)
1. Login livre com Apple/Google (sem exigir compra antes).
2. 3 aulas grátis por usuário; na 4ª, paywall em tela cheia.
3. Card "Seja Premium" / "Assinante Premium" na página de Perfil.
4. Compra e restauração via RevenueCat com o produto mensal já existente.

## Passos para publicar
1. Publicar o projeto no Lovable (botão Publish) — a atualização ao vivo chega aos apps instalados automaticamente.
2. Validar no celular com uma conta sem assinatura: abrir 3 aulas (libera), na 4ª aparece o paywall, compra ativa o acesso.

## Ressalvas (ciência do usuário)
- A Apple pode notar a mudança de modelo (pago → freemium) em uma revisão futura e pedir ajustes; isso seria tratado na próxima submissão de build, quando houver.
- Metadados da loja (textos que dizem que o app exige assinatura na entrada) ficam desatualizados até o próximo build.

## Fora de escopo
- Novo build nativo, nova submissão às lojas, novo produto no RevenueCat.
