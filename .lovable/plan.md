
Objetivo: fazer só o necessário para o Android release, sem mexer no fluxo de geração do AAB no Android Studio.

Plano

1. Atualizar apenas a versão Android
- Alterar `android/app/build.gradle`
  - `versionCode 4` → `5`
  - `versionName "2.1"` → `"2.2.0"`

2. Blindar o sync para não “bagunçar” os arquivos locais
- Ajustar o script `sync:android` no `package.json` para seguir o fluxo correto:
  - `npm run build`
  - `npx cap sync android`
  - `node fix-android-appid.cjs`
- Isso evita copiar assets/web desatualizados para o projeto nativo.

3. Tornar o `fix-android-appid.cjs` realmente seguro
- Manter o foco do script só no que precisa para o auth nativo:
  - `MainActivity.java`
  - `AndroidManifest.xml`
  - `strings.xml`
  - presença do plugin social login nos arquivos gerados
- Garantir que ele:
  - não altere `versionCode` nem `versionName`
  - não reescreva arquivos sem necessidade
  - não gere diffs desnecessários quando o conteúdo já estiver correto
  - continue idempotente, para poder rodar várias vezes sem efeito colateral

4. Reduzir ruído de Git/local
- Expandir `.gitignore` para artefatos locais que não deveriam entrar no fluxo:
  - arquivos de estado do Xcode/IDE
  - certificados/keystores locais (`*.jks`, `*.pem`)
  - outros arquivos locais temporários de ambiente nativo
- Objetivo: evitar novo cenário de `stash/pop` trazendo lixo local de volta.

5. Deixar o fluxo de atualização local previsível
Depois da implementação, o caminho seguro fica:
```bash
git pull --rebase --autostash
npm run sync:android
```

6. Resultado esperado
- Android em `2.2.0 (build 5)`
- você continua gerando o `.aab` pelo Android Studio
- o comando de atualização/sync deixa de sobrescrever versão/build ou sair recriando mudanças desnecessárias
- menos chance de conflito/local drift nos arquivos nativos

Detalhes técnicos
- Arquivos a ajustar:
  - `android/app/build.gradle`
  - `package.json`
  - `fix-android-appid.cjs`
  - `.gitignore`
- Observação importante:
  - hoje `android/capacitor.settings.gradle` e `android/app/capacitor.build.gradle` já estão corretos com o plugin social login; então o script deve apenas verificar e preservar, não “forçar” mudanças toda vez.
