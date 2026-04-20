

## Bump de versão iOS para reenvio à App Store

A correção do autoplay de vídeos (`allowsInlineMediaPlayback: true`) é uma mudança **nativa** que **não passa via Live Update**. Precisa novo binário.

### Versões atuais (iOS)

Lidos em `ios/App/App.xcodeproj/project.pbxproj` (Debug e Release):

- `MARKETING_VERSION = 1.1` (versão exibida ao usuário)
- `CURRENT_PROJECT_VERSION = 35` (build number — precisa ser único por upload)

> Observação: o `Info.plist` referencia `$(MARKETING_VERSION)` e `$(CURRENT_PROJECT_VERSION)`, então a fonte da verdade é o `project.pbxproj`.

### Bump proposto

| Campo | De | Para |
|---|---|---|
| `MARKETING_VERSION` | `1.1` | `1.2` |
| `CURRENT_PROJECT_VERSION` | `35` | `36` |

Aplicar em **ambas** as configurações (Debug e Release) — linhas 322, 331, 353, 362 do `project.pbxproj`.

### Mudança no arquivo `ios/App/App.xcodeproj/project.pbxproj`

```diff
- CURRENT_PROJECT_VERSION = 35;
+ CURRENT_PROJECT_VERSION = 36;
...
- MARKETING_VERSION = 1.1;
+ MARKETING_VERSION = 1.2;
...
- CURRENT_PROJECT_VERSION = 35;
+ CURRENT_PROJECT_VERSION = 36;
...
- MARKETING_VERSION = 1.1;
+ MARKETING_VERSION = 1.2;
```

### O que NÃO muda

- Android (já está em `versionCode 7 / versionName 2.2.2`)
- `capacitor.config.ts` / `capacitor.config.json` (já têm `allowsInlineMediaPlayback: true`)
- Componentes de vídeo (já com `webkit-playsinline` + `play()` defensivo)
- Bundle ID, certificados, provisioning profile, entitlements

### Pós-edição (local no Mac)

```bash
git pull
npm run build
npx cap sync ios
```

No Xcode:
1. Abrir `ios/App/App.xcworkspace`
2. Selecionar target **App** → conferir General → Identity:
   - Version: `1.2`
   - Build: `36`
3. Selecionar destino **Any iOS Device (arm64)**
4. Product → **Archive**
5. Organizer → **Distribute App** → App Store Connect → Upload
6. Em App Store Connect: criar nova versão `1.2` apontando para o build `36`
7. (Opcional recomendado) Disponibilizar no **TestFlight Internal** primeiro e validar autoplay no aparelho antes de submeter para revisão

### Validação no aparelho antes de submeter

1. Cold start do app (matar e reabrir)
2. Splash deve rodar **sem botão de play**
3. Hero da home deve rodar **automaticamente**
4. LoadingOverlay e ResponsiveHeroBanner também devem rodar inline

### Risco

Mínimo. Apenas bump de números de versão. Se a App Store rejeitar por qualquer motivo não relacionado, basta novo bump de `CURRENT_PROJECT_VERSION` (ex: `37`) — `MARKETING_VERSION` pode permanecer `1.2`.

