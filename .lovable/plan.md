
Plano:

1. Destravar o `git pull` tratando apenas o arquivo que mudou localmente:
   - O diff mostra que o bloqueio está no `android/app/src/main/AndroidManifest.xml`.
   - Essa mudança local veio do fluxo Android (`npm run sync:android` + `fix-android-appid.cjs`), não de Xcode.

2. Recuperar a base mais recente do projeto:
   - Opção segura: guardar temporariamente esse manifest com `git stash` só para esse arquivo e depois rodar `git pull`.
   - Opção rápida: descartar só o manifest local com `git restore` e então rodar `git pull`.

3. Confirmar que a pasta local ficou alinhada com a versão correta:
   - `package.json` deve continuar com `"version": "2.1.0"`.
   - `android/app/build.gradle` deve estar com `versionCode 4` e `versionName "2.1"`.

4. Regerar o Android do zero:
   - Rodar `npm run build`
   - Rodar `npm run sync:android`
   - Rodar `./gradlew clean bundleRelease` dentro de `android`

5. Validar o bundle antes do upload:
   - Conferir o horário do arquivo gerado em `android/app/build/outputs/bundle/release/`
   - Subir exatamente o `.aab` recém-gerado, para evitar reenviar um bundle antigo

Detalhe técnico:
- O `git diff` confirmou que o manifest local foi alterado pelo fluxo Android ao adicionar:
  - `package="com.bibliatoonkids.app"`
  - permissões (`INTERNET`, `CAMERA`, storage)
  - `MainActivity` com nome totalmente qualificado
- Isso explica por que o `git pull` foi barrado.
- Como o projeto atual já está configurado para `2.1.0` e Android `build 4`, o problema mais provável continua sendo pasta local desatualizada ou bundle antigo sendo enviado.
- Nenhuma ação em iOS/Xcode é necessária para esse ajuste.

Comandos que eu vou orientar a executar na próxima etapa, sem mexer em Xcode:
```bash
git stash push -m "temp-android-manifest" -- android/app/src/main/AndroidManifest.xml
git pull
cat package.json | grep '"version"'
grep -n "versionCode\|versionName" android/app/build.gradle
npm run build
npm run sync:android
cd android && ./gradlew clean bundleRelease && cd ..
ls -lh android/app/build/outputs/bundle/release/
```

Fallback:
- Se não quiser preservar a mudança local do manifest:
```bash
git restore android/app/src/main/AndroidManifest.xml
git pull
```
- Se depois de tudo a Play Store ainda acusar código 2, aí o próximo ajuste será subir o `versionCode` para 5.
