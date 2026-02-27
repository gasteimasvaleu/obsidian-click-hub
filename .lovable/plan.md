

# Corrigir conflito de CODE_SIGN_IDENTITY global no Appflow

## Problema

O Appflow injeta internamente `CODE_SIGN_IDENTITY=Apple Distribution: Caio Figueiredo Roberto (CASJQDDA7L)` como argumento global do `xcodebuild`, **ignorando** o `codesigning_identity ""` do Gymfile. Isso aplica uma identidade de distribuicao a todos os targets, incluindo o RevenueCat SPM, que usa signing automatico e rejeita identidades manuais.

Comando real executado pelo Appflow (do log):
```text
xcodebuild ... DEVELOPMENT_TEAM=CASJQDDA7L archive CODE_SIGN_IDENTITY=Apple\ Distribution:\ Caio\ Figueiredo\ Roberto\ \(CASJQDDA7L\)
```

O `CODE_SIGN_IDENTITY` e adicionado **pelo Appflow** apos o xcargs, entao precisamos forcar um override.

## Solucao

Mover `CODE_SIGN_IDENTITY=` (vazio) para **dentro do xcargs**. Argumentos CLI do xcodebuild sao processados na ordem, e como o Appflow adiciona `CODE_SIGN_IDENTITY=...` separadamente, precisamos que nosso xcargs venha **depois** usando uma tecnica: colocar ambos no mesmo xcargs string.

Na verdade, olhando o comando, o Appflow adiciona `CODE_SIGN_IDENTITY=...` DEPOIS dos xcargs. Entao precisamos de outra abordagem: usar o `fix-signing.cjs` (que ja roda no `postinstall` / cap sync) para **tambem** configurar `CODE_SIGN_STYLE = Automatic` nos targets-level do pbxproj para os SPM packages.

**Abordagem correta**: O problema real e que o Appflow passa `CODE_SIGN_IDENTITY` globalmente e nao ha como impedir isso do lado do repositorio. A solucao e configurar o Appflow para usar **Automatic Signing** no painel de configuracao, OU adicionar `CODE_SIGN_IDENTITY=` no xcargs para tentar sobrescrever.

Vamos tentar a abordagem mais agressiva: incluir no xcargs o reset da identidade para que o xcodebuild use a identidade correta por target.

## Alteracao

### `ios/App/Gymfile`

```ruby
xcargs "DEVELOPMENT_TEAM=CASJQDDA7L CODE_SIGN_IDENTITY= CODE_SIGN_STYLE=Automatic"
export_method "app-store"
export_options({
  provisioningProfiles: {
    "com.bibliatoonkids.app" => "com.bibliatoonkids.app_v2"
  },
  signingStyle: "automatic",
  manageAppVersionAndBuildNumber: true
})
```

Mudancas:
- `CODE_SIGN_IDENTITY=` (vazio) no xcargs: neutraliza a identidade global, deixando o Xcode resolver por target
- `CODE_SIGN_STYLE=Automatic` no xcargs: forca signing automatico para todos os targets
- `signingStyle: "automatic"` no export_options: garante que a exportacao use signing automatico
- Removido `codesigning_identity ""` (nao funciona, Appflow ignora)
- Removido `"App"` duplicado do provisioningProfiles

## Como funciona

Com `CODE_SIGN_STYLE=Automatic` e `CODE_SIGN_IDENTITY=` nos xcargs (que sao argumentos CLI e tem prioridade maxima):
- O Xcode resolve a identidade de assinatura automaticamente para cada target
- O target App usara a identidade de distribuicao (resolvida via provisioning profile)
- Os targets SPM (RevenueCat) nao terao conflito porque o Xcode sabe que libraries nao precisam de signing manual

## Plano B (se nao funcionar)

Se o Appflow sobrescrever os xcargs com seus proprios valores DEPOIS:
1. No painel do Appflow, ir em **Build > iOS > Signing**
2. Mudar para **Automatic Signing**
3. Isso impede o Appflow de injetar `CODE_SIGN_IDENTITY` manualmente

| Arquivo | Alteracao |
|---------|-----------|
| `ios/App/Gymfile` | Adicionar CODE_SIGN_IDENTITY= e CODE_SIGN_STYLE=Automatic nos xcargs |

