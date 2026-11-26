# Versão 1.6.1 do app iOS

## O que muda
- App do iPhone passa de 1.6 (build 43) para **1.6.1 (build 44)**, para o novo envio à Apple.
- O app Android (2.3.2, código 13) não muda, a menos que você peça.

## Detalhes técnicos
- `ios/App/App.xcodeproj/project.pbxproj`: `MARKETING_VERSION = 1.6` → `1.6.1` e `CURRENT_PROJECT_VERSION = 43` → `44` (Debug e Release).
- Depois, no Mac: `git pull`, `npm install`, `npm run build`, `npx cap sync ios`, abrir no Xcode e gerar o Archive.
