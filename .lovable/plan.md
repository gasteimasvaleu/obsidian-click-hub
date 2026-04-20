
Os dois screenshots confirmam:

**Web Client** (`135684784512-u67o6coqesuehpflqgfj28646daoq2q3`)
- Projeto: **bibliatoon-kids** ✅
- Tipo: Aplicativo da Web ✅

**Android Client** (`135684784512-nt1jcoscltu5lh758l3evc2lrl7amdug`)
- Projeto: **bibliatoon-kids** ✅ (mesmo projeto, confirmado pelo header)
- Package: `com.bibliatoonkids.app` ✅
- SHA-1: `A7:B8:33:C2:DC:C3:BF:7D:28:7E:48:D0:BB:DD:01:46:09:8D:13:30` ✅
- Propriedade verificada ✅

**MAS — encontrei o problema real.** 

O Web Client usado no código (`src/lib/native-google-signin.ts`) é:
```
135684784512-nt1jcoscltu5lh758l3evc2lrl7amdug.apps.googleusercontent.com
```

Esse ID é o **Android Client**, não o Web Client! O `webClientId` que o plugin precisa é o do tipo "Aplicativo da Web", que pelo screenshot é:
```
135684784512-u67o6coqesuehpflqgfj28646daoq2q3.apps.googleusercontent.com
```

# Plano: Corrigir o `webClientId` para o ID correto do Web Client

## Diagnóstico
O Credential Manager exige que o parâmetro `webClientId` seja o ID do OAuth Client do tipo **"Aplicativo da Web"**. O código atual está passando o ID do Client Android, o que faz o Google retornar **"Developer console is not set up correctly"** mesmo com tudo certo no Cloud Console.

Os dois clients existem, estão no mesmo projeto, e estão corretos individualmente. O erro é na atribuição: **trocaram-se os IDs**.

## Mudança

### Arquivo: `src/lib/native-google-signin.ts`
Trocar a constante:

De:
```typescript
const WEB_CLIENT_ID = '135684784512-nt1jcoscltu5lh758l3evc2lrl7amdug.apps.googleusercontent.com';
```

Para:
```typescript
const WEB_CLIENT_ID = '135684784512-u67o6coqesuehpflqgfj28646daoq2q3.apps.googleusercontent.com';
```

### Atualizar memória
Atualizar `mem://auth/google-sign-in-android` para refletir o ID correto do Web Client.

## O que NÃO muda
- Nenhum arquivo nativo Android, iOS, Apple Sign-In, MainActivity, Supabase
- Sem rebuild necessário do lado Cloud
- Sem mudança no Google Cloud Console

## Pós-correção
Como envolve mudança em código TypeScript que vai para o app nativo, é necessário:
1. Rodar `npm run build` + `npx cap sync android`
2. Gerar nova build Android
3. Subir para Internal Testing e testar

## Risco
Zero. Se ainda falhar depois disso, capturamos o `adb logcat` para diagnóstico fino — mas essa é a causa clássica e mais provável agora que os dois clients foram visualmente confirmados.
