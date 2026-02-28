

## Corrigir conflito de merge no Gymfile

### Problema
O arquivo `ios/App/Gymfile` tambem tem marcadores de conflito do git (`<<<<<<< Updated upstream`, `=======`, `>>>>>>> Stashed changes`), igual ao `fix-signing.cjs` que ja foi corrigido.

### Solucao
Limpar o `ios/App/Gymfile` removendo os marcadores de conflito. Baseado na memoria do projeto, a versao correta usa `xcargs "DEVELOPMENT_TEAM=CASJQDDA7L"` (sem `CODE_SIGNING_ALLOWED=NO`).

### Arquivo modificado
- `ios/App/Gymfile` -- remover marcadores de conflito e manter a versao funcional:

```
xcargs "DEVELOPMENT_TEAM=CASJQDDA7L"
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

### Apos a correcao
Fazer push e iniciar novo build no Appflow.
