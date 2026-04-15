
Objetivo: eliminar a causa do erro recorrente no Android e blindar o fluxo de terminal para que arquivos locais duplicados não voltem a quebrar o build.

Diagnóstico
- O erro do screenshot não vem do código React.
- O build quebra por causa de um arquivo local inválido: `android/app/src/main/res/xml/config 2.xml`.
- O Android trata isso como resource name inválido porque nomes de arquivos em `res/` não podem ter espaço.
- Hoje o repositório só tem `file_paths.xml` nessa pasta; então esse `config 2.xml` está sendo recriado ou sobrevivendo localmente fora do fluxo controlado.
- O problema é de “drift” nativo local: arquivos duplicados tipo `config 2.xml`, `config 2.xml` no iOS, etc.

Plano
1. Blindar o script de correção Android
- Ajustar `fix-android-appid.cjs` para fazer uma limpeza preventiva em diretórios nativos sensíveis antes de validar `Manifest`, `strings` e `MainActivity`.
- Remover automaticamente arquivos duplicados com padrão de cópia local, como:
  - `config 2.xml`
  - `file_paths 2.xml`
  - variantes com espaço + número em `android/app/src/main/res/xml`
  - variantes equivalentes em `ios/App/App`
- Limitar essa limpeza só a arquivos duplicados óbvios, para não tocar em arquivos legítimos.

2. Tornar o sync ainda mais seguro
- Manter `sync:android` como fluxo único oficial:
  - build web
  - `cap sync android`
  - script corretivo
- Garantir que a limpeza rode sempre após o sync, para apagar lixo local que o Git/IDE tenha deixado para trás.

3. Reduzir chance de recorrência no Git
- Expandir ignores para arquivos duplicados locais em áreas geradas/configuradas dos projetos nativos.
- Foco principal:
  - `android/app/src/main/res/xml`
  - `ios/App/App`
- Isso reduz a chance de `stash/pop`, Finder, Xcode ou Android Studio deixarem cópias “2” aparecendo no status.

4. Preservar o que já está funcionando
- Não mexer no fluxo de geração do AAB no Android Studio.
- Não alterar `versionCode`/`versionName` de novo.
- Não tocar em login, splash ou lógica web.
- Manter o script focado só em sanear arquivos nativos frágeis.

5. Deixar um procedimento seguro de uso
- Padronizar o fluxo para você usar sempre:
  - `git pull --rebase --autostash`
  - `npm run sync:android`
- E evitar `git stash pop` manual em cima de arquivos nativos gerados.

Arquivos que vou ajustar
- `fix-android-appid.cjs`
- `package.json` (apenas se precisar reforçar a ordem/segurança do fluxo)
- `android/.gitignore`
- `ios/.gitignore`
- possivelmente `.gitignore` raiz, se houver padrão útil para bloquear duplicatas locais

Resultado esperado
- o erro de `config 2.xml` para de voltar
- o Android não quebra mais por arquivo inválido em `res/xml`
- o terminal deixa de “bagunçar tudo” por causa de duplicatas locais
- você continua podendo abrir no Android Studio e gerar o `.aab` normalmente

Detalhes técnicos
- Regra principal da correção: limpar apenas arquivos com cara de cópia local acidental (`" 2"`, `" copy"`, etc.) dentro de diretórios nativos gerados/auxiliares.
- Não vou usar essa limpeza em diretórios amplos do projeto para evitar apagar algo legítimo.
- A causa exata vista agora é consistente com o screenshot: `android/app/src/main/res/xml/config 2.xml`.
