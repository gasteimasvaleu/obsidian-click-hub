

## Corrigir erro do TestFlight: Missing Purpose String

### Problema
A Apple rejeitou o build porque o `Info.plist` nao tem a chave `NSPhotoLibraryUsageDescription`. O app usa a biblioteca de fotos (provavelmente via Capacitor Camera para a funcionalidade "Transformar Foto") e precisa declarar o motivo.

### Solucao
Adicionar as seguintes chaves no arquivo `ios/App/App/Info.plist`:

- **NSPhotoLibraryUsageDescription** - Acesso a galeria de fotos (obrigatorio)
- **NSCameraUsageDescription** - Acesso a camera (recomendado, ja que o app usa `@capacitor/camera`)
- **NSPhotoLibraryAddUsageDescription** - Salvar fotos na galeria (recomendado, para salvar desenhos coloridos)

### Arquivo modificado
- `ios/App/App/Info.plist` - Adicionar as 3 chaves de privacidade com mensagens em portugues adequadas para um app infantil

### Apos a mudanca
Sera necessario fazer um novo build no Appflow para que o TestFlight aceite.

