# Gerar o arquivo (.aab) do Android para enviar ao Google Play

O app já está pronto para isso: a versão nativa está em **2.2.3 (versionCode 8)**, que é a que contém a tela nova (botão do Google liberado). O arquivo que o Google Play pede é um **Android App Bundle (.aab)**.

## O que eu faço (preparar o projeto)

1. Rodar `npm run sync:android` — isso monta a versão web mais recente, copia para dentro do projeto Android e roda o `fix-android-appid.cjs` no final.
2. **Segurança do sync (confirmado):** o script de correção recria a `MainActivity.java` com o pacote correto (`com.bibliatoonkids.app`) e remove arquivos duplicados — o código nativo não é perdido. A única coisa substituída é a pasta de assets dentro de `android/` (a versão web nova), que é exatamente o desejado.
3. Conferir que a pasta `android/` está pronta para abrir no Android Studio (versão 2.2.3 / código 8, MainActivity correta).

## O que você faz no Android Studio

0. **Antes de tudo: atualize o projeto no Mac** — o aviso "código de versão 7 já foi usado" mostra que sua cópia local está antiga. No terminal, dentro da pasta do projeto: `git pull`, depois `npm install`, depois `npm run sync:android`. Só então gere o .aab (ele sairá com código 8).
0.1. **Apague arquivos duplicados** — o erro de build "config 2.xml" é uma cópia criada pelo Finder em `android/app/src/main/res/xml/`. Delete `config 2.xml` (e qualquer arquivo com espaço/cópia no nome) no Finder ou rode `npm run sync:android`, que limpa essas duplicatas automaticamente.
0.2. **Não rode o AGP Upgrade Assistant** — o aviso do Android Studio para atualizar o plugin Gradle deve ser ignorado; atualizar quebra a compatibilidade com o Capacitor.
1. Abra o projeto Android no Android Studio (pasta `android` do projeto, depois do meu passo acima).
2. Menu **Build → Generate Signed App Bundle or APK...** (é exatamente o item do seu screenshot).
3. Escolha **Android App Bundle** (não APK).
4. **Key store path → Create new...** (só na primeira vez):
   - Grave o arquivo da chave em um lugar seguro (ex.: `bibliatoon-upload.jks`) e **guarde a senha** — sem ela não é possível atualizar o app no futuro.
   - Preencha alias e senhas, valide e avance.
   - Se você já tiver uma chave de upload criada antes (ex.: usada no AppFlow), escolha **Choose existing** em vez de criar nova — a chave precisa ser a mesma registrada no Play Console.
5. Selecione a variante **release** e clique em **Create**.
6. O arquivo gerado fica em `android/app/release/app-release.aab`.

## Envio para o Google Play

1. Na tela que você me mostrou ("Criar versão de produção → Pacotes de apps"), clique em **Enviar** e suba o `app-release.aab`.
2. Revise e confirme a versão. Como o versionCode 8 é maior que o publicado, o Google aceita.
3. Se o Play reclamar que a assinatura não confere: o app usa **Play App Signing**; a chave criada no passo 4 precisa estar registrada como chave de upload em **Play Console → Configuração → Assinatura de apps** (se nunca registrou, o próprio console oferece cadastrar a nova chave no primeiro upload).

## Validação

- Confirmar que `android/app/build.gradle` segue com versionCode 8 / versionName 2.2.3.
- Confirmar que o `.aab` foi gerado em `android/app/release/`.
- Depois do upload, o novo build da Play Store já traz o botão "Continuar com Google" ativo — sem depender de live update.
