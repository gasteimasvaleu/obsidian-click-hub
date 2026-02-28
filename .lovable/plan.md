

## Correcao completa dos conflitos de assinatura iOS

### Diagnostico

Analisando os 4 erros do build:

1. **RevenueCat_RevenueCat (SPM)** - identidade manual aplicada a target auto-signed
2. **RevenueCat (Pods)** - MESMO problema, mas este vem do **Podfile que tem RevenueCat duplicado** (ja esta no SPM via `@revenuecat/purchases-capacitor`)
3. **Pods-App** - herda identidade manual indevida
4. **App** - `CODE_SIGN_STYLE=Automatic` (do xcargs) conflita com provisioning profile manual

### Causa raiz

Tres problemas:

1. **RevenueCat esta duplicado**: No Podfile (`pod 'RevenueCat'`) E no SPM (`RevenuecatPurchasesCapacitor`). Isso gera 2 erros extras desnecessarios.
2. **`CODE_SIGN_STYLE=Automatic` no Gymfile** conflita com o provisioning profile manual do App target
3. **O Appflow step 26 (`update_code_signing_settings`)** injeta `CODE_SIGN_IDENTITY = "Apple Distribution..."` no project.pbxproj DEPOIS do fix-signing.cjs rodar, e os SPM targets herdam isso

### Solucao (4 arquivos)

#### 1. `ios/App/Podfile` - Remover RevenueCat duplicado + desabilitar assinatura dos Pods

```ruby
platform :ios, '13.0'
use_frameworks!

def capacitor_pods
  pod 'CapacitorCordova', :path => '../../node_modules/@capacitor/ios'
  pod 'Capacitor', :path => '../../node_modules/@capacitor/ios'
  pod 'CapacitorApp', :path => '../../node_modules/@capacitor/app'
  pod 'CapacitorHaptics', :path => '../../node_modules/@capacitor/haptics'
  pod 'CapacitorKeyboard', :path => '../../node_modules/@capacitor/keyboard'
  pod 'CapacitorStatusBar', :path => '../../node_modules/@capacitor/status-bar'
end

pre_install do |installer|
  capacitor_pods
end

target 'App' do
  # RevenueCat removido - ja incluido via SPM (purchases-capacitor)
end

post_install do |installer|
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      config.build_settings['ALWAYS_EMBED_SWIFT_STANDARD_LIBRARIES'] = '$(inherited)'
      config.build_settings['ENABLE_BITCODE'] = 'NO'
      config.build_settings['CODE_SIGNING_ALLOWED'] = 'NO'
      config.build_settings['CODE_SIGN_IDENTITY'] = ''
    end
  end
end
```

Mudancas:
- Removido `pod 'RevenueCat', '5.59.2'` (duplicado com SPM)
- Adicionado `CODE_SIGNING_ALLOWED = NO` e `CODE_SIGN_IDENTITY = ''` no post_install

#### 2. `ios/App/Gymfile` - Trocar Automatic por Manual

```ruby
xcargs "DEVELOPMENT_TEAM=CASJQDDA7L CODE_SIGN_IDENTITY= CODE_SIGN_STYLE=Manual"
export_method "app-store"
skip_profile_detection true
export_options({
  signingStyle: "manual",
  provisioningProfiles: {
    "com.bibliatoonkids.app" => "BibliaToonKIDS_AppStore_Final"
  },
  signingCertificate: "Apple Distribution: Caio Figueiredo Roberto (CASJQDDA7L)",
  teamID: "CASJQDDA7L"
})
```

Mudanca: `CODE_SIGN_STYLE=Automatic` trocado por `CODE_SIGN_STYLE=Manual`. Isso evita o conflito com o provisioning profile manual do App. O `CODE_SIGN_IDENTITY=` (vazio) continua para limpar a identidade dos targets SPM.

#### 3. `ios/App/App.xcodeproj/project.pbxproj` - Limpar settings do nivel de projeto

Remover `CODE_SIGN_IDENTITY`, `PROVISIONING_PROFILE_SPECIFIER`, e `CODE_SIGNING_ALLOWED` dos build settings do **nivel de projeto** (Debug e Release globais). Esses devem existir APENAS nos build settings do App target.

Linhas afetadas:
- Debug projeto (linhas 215-218, 241): remover CODE_SIGN_IDENTITY, CODE_SIGNING_ALLOWED, PROVISIONING_PROFILE_SPECIFIER
- Release projeto (linhas 277-280, 296): remover CODE_SIGN_IDENTITY, CODE_SIGNING_ALLOWED, PROVISIONING_PROFILE_SPECIFIER

Os settings do App target (linhas 304-365) permanecem intactos.

#### 4. `fix-signing.cjs` - Tambem limpar PROVISIONING_PROFILE_SPECIFIER do nivel de projeto

Atualizar para tambem remover `PROVISIONING_PROFILE_SPECIFIER` e `CODE_SIGN_IDENTITY` dos build settings de nivel de projeto (nao-App), alem do `CODE_SIGNING_ALLOWED = NO` que ja faz.

### Por que isso resolve

```text
+------------------+--------------------------------+
| Target           | Como e resolvido               |
+------------------+--------------------------------+
| App              | Manual + profile do Appflow    |
|                  | + identity inferida do profile |
+------------------+--------------------------------+
| RevenueCat (SPM) | Identity vazia (xcargs) +      |
|                  | sem profile herdado            |
+------------------+--------------------------------+
| RevenueCat (Pod) | REMOVIDO (era duplicado)       |
+------------------+--------------------------------+
| Pods-App         | CODE_SIGNING_ALLOWED=NO        |
|                  | via Podfile post_install       |
+------------------+--------------------------------+
```

### Risco residual

O Appflow step 26 (`update_code_signing_settings`) pode reinjetar `CODE_SIGN_IDENTITY` no project.pbxproj depois do fix-signing.cjs. Porem, os xcargs do Gymfile sao a palavra final do xcodebuild e sobrescrevem qualquer setting do projeto. Isso deve garantir que SPM targets nao recebam identidade manual.

### Apos as correcoes

Fazer commit, push e iniciar novo build no Appflow.

