
Objetivo: concluir a ativação do Google Sign-In agora que o Google Cloud e o Supabase já estão configurados.

Plano
1. Atualizar o novo Web Client ID no app
   - Trocar o ID antigo em `src/lib/native-google-signin.ts`
   - Trocar o mesmo ID antigo em `android/app/src/main/res/values/strings.xml`
   - Usar o novo valor:
     `135684784512-nt1jcoscltu5lh758l3evc2lrl7amdug.apps.googleusercontent.com`

2. Revisar o lado Android nativo
   - Confirmar se o `google-services.json` novo precisa substituir o atual em `android/app/`
   - Validar que o package Android continua sendo:
     `br.com.caio.bibliatoonkids`
   - Confirmar que o client Android foi criado com o SHA-1 correto do app

3. Validar o fluxo já existente
   - O projeto já está preparado para:
     - fazer login nativo com `@capgo/capacitor-social-login`
     - pegar o `idToken`
     - autenticar no Supabase com `supabase.auth.signInWithIdToken({ provider: 'google' })`
   - Não há necessidade de criar service key para essa etapa

4. Conferir a tela de login
   - Garantir que o botão Google continue aparecendo apenas no Android
   - Manter o fallback web via OAuth apenas se ainda fizer sentido para seu fluxo

5. Teste ponta a ponta
   - Abrir o app Android
   - Tocar em “Continuar com Google”
   - Selecionar conta
   - Confirmar login/criação do usuário no Supabase
   - Confirmar atualização do perfil/nome
   - Confirmar redirecionamento para `/`

O que encontrei no código atual
- `src/lib/native-google-signin.ts` ainda usa o Client ID antigo
- `android/app/src/main/res/values/strings.xml` ainda usa o Client ID antigo
- `src/pages/Login.tsx` já faz o fluxo correto com `signInWithIdToken` para Google

Detalhes técnicos
```text
Google Cloud
- Web Client ID + Secret -> ficam no Supabase
- Android Client ID -> identifica o app nativo via package + SHA-1

Projeto
- native-google-signin.ts -> inicializa o plugin com o Web Client ID
- Login.tsx -> recebe idToken e autentica no Supabase
- strings.xml -> expõe o server_client_id no Android nativo
```

Resultado esperado após implementar
- O login Google volta a funcionar no Android com o novo projeto OAuth
- O Supabase aceita o token emitido pelo novo client
- O usuário entra/cria conta normalmente sem mexer em banco ou edge functions
