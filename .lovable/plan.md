# Por que os logins com Google não aparecem no Google Cloud

## Diagnóstico

Não é problema de tempo nem de configuração errada — é o esperado. O Google Cloud Console **não é o painel de usuários do app**. Ele só registra chamadas técnicas às APIs do Google, e o nosso login funciona assim:

- O usuário clica em "Continuar com Google"
- O Google só **autentica** (confirma quem é a pessoa) e devolve um token
- Quem cria e guarda a conta do usuário é o **Supabase**, não o Google Cloud

Ou seja: o Google Cloud no máximo mostra estatísticas agregadas da tela de consentimento OAuth, e mesmo essas costumam aparecer com atraso de horas/dias e de forma resumida — não uma lista de logins.

## Onde verificar os logins de verdade

1. **Supabase** (é aqui que os usuários moram):
   - https://supabase.com/dashboard/project/fnksvazibtekphseknob/auth/users
   - Lista todos os usuários, provedor usado (google, apple, email) e data do último login.
2. **Google Cloud** (opcional, só estatística):
   - APIs e serviços → Tela de permissão OAuth → métricas de uso (agregadas, com atraso).

## Ação proposta

Nenhuma mudança de código. Apenas verificação:

1. Abrir a lista de usuários no Supabase e confirmar que os logins de hoje (computador e Android) aparecem lá com provedor "google".
2. Se aparecerem, está tudo funcionando — o Google Cloud simplesmente não é o lugar certo para olhar.
3. Se algum login NÃO aparecer no Supabase, aí sim investigamos (possível falha no callback OAuth).

## Validação

Confirmar visualmente na lista do Supabase que os dois logins de hoje constam com provider `google` e timestamps corretos.
