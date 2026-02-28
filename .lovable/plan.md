

## Corrigir conflito de merge no fix-signing.cjs

### Problema
O arquivo `fix-signing.cjs` contém marcadores de conflito do git (`<<<<<<< Updated upstream`, `=======`, `>>>>>>> Stashed changes`) na linha 10. Isso causa `SyntaxError` quando o Node.js tenta executar o script durante o build.

### Solucao
Reescrever o `fix-signing.cjs` com a versao limpa e funcional (sem marcadores de conflito). Baseado no log do build anterior que deu certo, a versao correta e a que configura `CODE_SIGNING_ALLOWED = YES` para o App target e `NO` para os outros.

### Arquivo modificado
- `fix-signing.cjs` -- remover todos os marcadores de conflito e manter a logica funcional que ja funcionou no build anterior

### Detalhes tecnicos
O arquivo atual tem multiplos blocos de conflito intercalados. A versao limpa deve:
1. Encontrar todos os blocos `buildSettings` no `project.pbxproj`
2. Para o App target (que tem `PRODUCT_BUNDLE_IDENTIFIER`): setar `CODE_SIGNING_ALLOWED = YES` e `CODE_SIGN_STYLE = Manual`
3. Para todos os outros targets: setar `CODE_SIGNING_ALLOWED = NO`
4. Remover configuracoes de assinatura duplicadas de targets que nao sao o App

