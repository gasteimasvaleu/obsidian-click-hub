

## Incrementar CURRENT_PROJECT_VERSION para 27

O erro do upload foi porque o `CURRENT_PROJECT_VERSION` no `project.pbxproj` esta como `1`, e a Apple ja recebeu versoes ate `26`. Precisamos mudar para `27` nos dois build configurations do App target (Debug e Release).

### Arquivo: `ios/App/App.xcodeproj/project.pbxproj`

Alterar `CURRENT_PROJECT_VERSION = 1;` para `CURRENT_PROJECT_VERSION = 27;` em duas linhas:
- Debug do App target (por volta da linha 308)
- Release do App target (por volta da linha 338)

Nenhum outro arquivo precisa ser alterado.

