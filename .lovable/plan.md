

## Incrementar versionCode para reenvio ao Google Play

O arquivo `MainActivity.java` já está correto no repositório e você já corrigiu as pastas localmente. A única alteração necessária no código é incrementar o `versionCode` para que o Google Play aceite o novo AAB.

### Alteração

**`android/app/build.gradle`** — Mudar `versionCode` de `1` para `2`.

### Após a implementação

1. Faça `git pull` no seu Mac
2. Rode `npm run build && npx cap sync android`
3. No Android Studio: **Clean Project → Rebuild Project**
4. Teste no emulador (Wipe Data antes) — o app **deve abrir** antes de gerar o AAB
5. Gere o AAB assinado com `novakey.jks` e envie ao Google Play

