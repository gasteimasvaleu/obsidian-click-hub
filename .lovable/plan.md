

## Diagnóstico: imagens já substituídas localmente, mas ícone antigo continua aparecendo

Se você já trocou os 6 PNGs em `ios/App/App/Assets.xcassets/Splash.imageset/` pela imagem nova e o ícone verde antigo continua aparecendo na abertura do app, o problema **não é mais o arquivo** — é cache. Há 3 camadas de cache que precisam ser invalidadas:

### Camada 1 — Cache do Xcode (DerivedData)
O Xcode mantém uma cópia compilada dos assets. Mesmo trocando o PNG, o build reaproveita a versão antiga.

**Resolver:**
```text
Xcode → Product → Clean Build Folder (Shift+Cmd+K)
rm -rf ~/Library/Developer/Xcode/DerivedData
```

### Camada 2 — Cache do iOS no device (o mais agressivo)
O iOS armazena um **snapshot do LaunchScreen** por bundle ID. Esse snapshot só é regenerado quando o app é desinstalado completamente. Reinstalar por cima NÃO resolve.

**Resolver:**
1. No iPhone: segurar ícone do app → "Remover App" → "Apagar App".
2. Reiniciar o iPhone (importante — força limpeza do cache de snapshots).
3. Rodar build novo no Xcode.

### Camada 3 — Capacitor sync sobrescrevendo
Quando você roda `npx cap sync ios`, o Capacitor pode estar copiando assets de algum lugar e sobrescrevendo. Vamos verificar se há algum asset fonte que precisa ser atualizado também (ex: `resources/splash.png` ou config `@capacitor/assets`).

### Plano de ação

1. **Verificar os arquivos atuais**: ler tamanho/dimensões dos 6 PNGs em `ios/App/App/Assets.xcassets/Splash.imageset/` para confirmar se realmente foram substituídos pela imagem nova (1080×1920) ou se ainda têm o conteúdo antigo.

2. **Verificar fonte do Capacitor**: procurar por `capacitor-assets.config.json`, pasta `resources/`, ou referências a `@capacitor/assets` no `package.json` que possam estar regerando os splashes a partir de uma imagem fonte antiga.

3. **Verificar `Contents.json`**: confirmar que o JSON do imageset aponta corretamente para os arquivos substituídos (nomes batem).

4. **Se tudo estiver correto no código** → o problema é 100% cache do iOS. Procedimento obrigatório:
   - Desinstalar app do iPhone.
   - Reiniciar o iPhone.
   - No Mac: `rm -rf ~/Library/Developer/Xcode/DerivedData`
   - Xcode → Clean Build Folder.
   - Build & Run.

5. **Se houver fonte do Capacitor sobrescrevendo** → atualizar a imagem fonte também e re-rodar `npx cap sync ios`.

### O que vou fazer ao aprovar
- Listar `ios/App/App/Assets.xcassets/Splash.imageset/` e verificar dimensões reais dos PNGs lá.
- Procurar por configurações do `@capacitor/assets` ou pasta `resources/` no projeto.
- Te dar um diagnóstico definitivo: ou (a) o arquivo está certo e é só cache do iOS, ou (b) há uma fonte sobrescrevendo que precisa ser atualizada.

### Risco
Zero — é puramente investigação read-only seguida de instruções para você executar no Mac/device.

