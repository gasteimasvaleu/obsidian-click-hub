

# Fluxo correto para gerar o AAB sem recriar arquivos duplicados

Você tem razão em se preocupar. O `npx cap sync` é o comando que copia arquivos e pode recriar duplicatas. O fluxo seguro é:

## Passos no terminal local

```text
1. git pull origin main
2. npm install
3. npm run build
4. npx cap sync android
5. node fix-android-appid.cjs
6. find android/ -name "* *" -delete      ← remove duplicatas com espaço
7. Abrir Android Studio e gerar o AAB
```

**O `cap sync android` sincroniza apenas o Android** — não toca no iOS. É o comando certo.

Os arquivos duplicados (como `config 2.xml`) são gerados pelo macOS quando já existe um arquivo com o mesmo nome no destino, não pelo `cap sync` em si. O `find ... -delete` no passo 6 garante a limpeza.

## Sobre o versionCode

Eu vou alterar o `versionCode` de 35 para 36 no `build.gradle` agora, assim quando você fizer o `git pull` já vem atualizado.

