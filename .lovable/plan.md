

# Correção Definitiva: CODE_SIGNING_ALLOWED via xcargs

## O Problema Real

Todas as tentativas anteriores falharam porque modificávamos o `project.pbxproj`, mas o Appflow injeta `CODE_SIGN_IDENTITY` como **argumento de linha de comando** do xcodebuild (xcargs), que tem a prioridade MAIS ALTA no Xcode. Nenhuma configuração no pbxproj pode sobrescrevê-lo.

Comando que o Appflow executa:
```text
xcodebuild ... DEVELOPMENT_TEAM=CASJQDDA7L archive CODE_SIGN_IDENTITY=Apple\ Distribution:\ Caio\ Figueiredo\ Roberto\ (CASJQDDA7L)
```

O RevenueCat SPM usa assinatura automática, e recebe uma identidade de distribuição manual via xcargs = conflito.

## A Solução

Adicionar `CODE_SIGNING_ALLOWED=NO` nos **nossos xcargs** (Gymfile). Como o Appflow NAO adiciona `CODE_SIGNING_ALLOWED`, nosso valor persiste e tem a prioridade maxima. Isso desabilita toda validacao de assinatura durante o `archive`, eliminando o conflito.

A assinatura do app acontece na fase de **export** (criacao do IPA), controlada pelo `export_options`.

## Alteracoes

### 1. `ios/App/Gymfile` (arquivo principal)

```text
xcargs "DEVELOPMENT_TEAM=CASJQDDA7L CODE_SIGNING_ALLOWED=NO"
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

Mudancas:
- Adicionado `CODE_SIGNING_ALLOWED=NO` nos xcargs -- desabilita signing/validacao durante archive
- Adicionado `signingCertificate` e `teamID` no export_options -- garante que o export (criacao do IPA) assine corretamente

### 2. `fix-signing.cjs` (manter como fallback)

Manter o script como esta, pois ele corrige o pbxproj para quando o projeto e aberto no Xcode local. Nao precisa mudar.

### 3. `capacitor.config.ts` (remover hook invalido)

Remover o bloco `hooks` que nao funciona:

```typescript
const config: CapacitorConfig = {
  // ... tudo igual, sem o bloco hooks
};
```

## Por que vai funcionar

```text
Fluxo no Appflow:
1. npm run build -> compila web + pod install + fix-signing.cjs
2. cap sync -> atualiza assets e Package.swift
3. update_code_signing_settings -> configura App target (nao importa)
4. xcodebuild archive:
   xcargs: DEVELOPMENT_TEAM=CASJQDDA7L CODE_SIGNING_ALLOWED=NO
   Appflow adiciona: CODE_SIGN_IDENTITY=Apple Distribution:...
   
   Resultado: CODE_SIGNING_ALLOWED=NO tem prioridade maxima
   -> Xcode PULA toda validacao de assinatura
   -> RevenueCat SPM compila sem conflito
   -> Archive criado sem assinatura

5. xcodebuild -exportArchive:
   export_options define: signingStyle=manual, profile, certificado, teamID
   -> IPA e assinado corretamente nesta fase
   -> Pronto para upload na App Store
```

## Secao Tecnica

### Precedencia de Build Settings no Xcode

```text
1. xcargs (linha de comando) -- MAIS ALTA
2. Target build settings
3. xcconfig files
4. Project build settings -- MAIS BAIXA
```

As tentativas anteriores colocavam `CODE_SIGNING_ALLOWED` no nivel 2-4. O `CODE_SIGN_IDENTITY` do Appflow vem do nivel 1. Agora nosso `CODE_SIGNING_ALLOWED=NO` tambem esta no nivel 1.

### Por que export_options funciona

O `xcodebuild -exportArchive` e uma operacao separada do archive. Ele re-assina o binario usando as configuracoes do export options plist. Nao depende do signing do archive.

