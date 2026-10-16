# Guia reutilizável: evitar assinatura "emprestada" no login (RevenueCat + freemium)

## O que vou entregar
Um documento `docs/guia-assinatura-revenuecat.md` com o passo a passo para você repetir em outro app, mais um texto pronto para colar no Lovable do outro projeto e pedir que ele verifique.

## Conteúdo do guia

### 1. O problema
A assinatura da Apple ou do Google pertence à conta da loja do celular, não à conta do app. Se o app fizer "Restaurar Compras" sozinho no login, qualquer conta que entrar nesse celular vira Premium sem pagar. Outra falha: no login, o app pega uma assinatura "sem dono" qualquer e entrega para quem entrou.

### 2. Regras que o app precisa seguir
- No login: só identificar o usuário no RevenueCat (`Purchases.logIn` com o ID da conta). Nunca chamar `restorePurchases` automaticamente.
- "Restaurar Compras" só quando a pessoa toca no botão (no paywall ou no Perfil).
- Nunca ligar assinaturas "sem dono" a uma conta sem comparar o número da transação.
- Salvar a assinatura no banco só quando o RevenueCat diz que ela está ativa para aquele usuário.
- Ao sair da conta: chamar `Purchases.logOut`.
- O limite de aulas grátis é contado no banco por conta (não no celular), e rever uma aula não conta de novo.

### 3. O que fazer no painel do RevenueCat
Project Settings → Restore Behavior → **"Keep with original App User ID"**.

### 4. Como testar
- Use um celular cuja conta da loja nunca assinou.
- Abra 3 aulas diferentes: todas liberam. Na 4ª, aparece o paywall.
- Entre com outra conta no mesmo celular de um assinante: ela não pode virar Premium sozinha.

### 5. Texto pronto para colar no Lovable do outro app
> Verifique se este app tem o problema de "assinatura emprestada" com o RevenueCat. Confira: (1) se algum código chama `restorePurchases` automaticamente no login ou ao abrir o app (deve ser só pelo botão "Restaurar Compras"); (2) se existe rotina que liga assinaturas sem dono (`user_id` vazio) a quem acabou de entrar sem comparar a transação; (3) se o login chama `Purchases.logIn` com o ID do usuário e a saída chama `Purchases.logOut`; (4) se a assinatura só é salva no banco quando o RevenueCat a confirma ativa para esse usuário; (5) se o limite de conteúdo grátis é contado no banco por conta. Consulte o banco e me diga se alguma assinatura está ligada a mais de uma conta (mesma transação). Mostre o que encontrou e um plano de correção antes de mudar qualquer coisa.

## Detalhes técnicos
- Só cria um arquivo novo de documentação; nenhuma mudança de comportamento no app.
