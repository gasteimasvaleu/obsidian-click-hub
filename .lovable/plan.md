# Ícone antigo no Transporter: conferir antes de entregar

No projeto, o ícone novo (livro colorido) está certo no iPhone. O ícone que o Transporter mostra vem do próprio IPA. Então o mais provável é que o Appflow tenha gerado o IPA a partir de uma cópia antiga do projeto, sem o ícone novo.

## Passos (não clique em ENTREGAR ainda)
1. No Terminal, na mesma pasta de antes, rode:
```
open Payload/App.app/AppIcon60x60@2x.png
```
2. Se abrir o **livro verde antigo**, o IPA está desatualizado:
   - No Transporter, clique nos "..." e remova esse item.
   - No GitHub, confira se o envio mais recente do projeto já está lá ("Novo ícone oficial do app").
   - No Appflow, gere um build novo escolhendo esse envio mais recente. Antes, me peça para subir o build para 41, porque a Apple não aceita repetir o 40 se ele já tiver sido entregue.
   - Baixe o IPA novo, refaça a conferência do login com a Apple e arraste-o para o Transporter.
3. Se abrir o **livro colorido**, o IPA está certo, e o ícone antigo é só a memória do Transporter. Pode clicar em ENTREGAR.

Nada muda no app nesta etapa.
