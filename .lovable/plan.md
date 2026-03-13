

# Atualizar versão para 1.1

Os arquivos iOS e Android estão com `1.0.1`, mas a versão criada no App Store Connect é `1.1`. Preciso alinhar.

## Alterações

1. **`ios/App/App.xcodeproj/project.pbxproj`** — Alterar `MARKETING_VERSION = 1.0.1` para `1.1` (2 ocorrências: Debug e Release)
2. **`android/app/build.gradle`** — Alterar `versionName "1.0.1"` para `"1.1"`

Após a alteração, faça novo Archive no Xcode e upload.

