# Checklist de renovação da assinatura do app

## Objetivo

Criar dentro do projeto um passo a passo definitivo para a renovação da assinatura do app iOS, que vence em **18/02/2027** (131 dias a partir de hoje), para que o build nunca falhe no AppFlow por certificado ou perfil vencido.

## O que será criado

Um documento `docs/renovacao-assinatura-ios.md`, em português, na mesma pasta onde já estão os guias das rotinas automáticas. Ele traz:

1. **O que vence e quando** — tabela com perfis de assinatura (18/02/2027), certificado de distribuição, Programa de Desenvolvedores (renovação anual, data a confirmar com você) e builds do TestFlight (expiram em 90 dias).
2. **Como saber que venceu** — as mensagens de erro que aparecem no AppFlow quando o perfil ou o certificado não vale mais.
3. **Passo a passo da renovação** — gerar o certificado novo, criar os perfis, trocar os arquivos no projeto, atualizar o AppFlow e fazer um build de teste.
4. **Pré-checagens antes de reenviar** — acordos pendentes no App Store Connect, chave da App Store Connect ainda ativa, credenciais do RevenueCat.
5. **Android** — o que precisa de atenção por lá (chave de envio do app e a conta do Google Play, que não tem renovação anual).
6. **O que NÃO muda quando vence** — quem já instalou continua usando normalmente, a versão nas lojas continua no ar e o live update continua chegando.
7. **Agenda** — renovar em **janeiro/2027**, com margem para build + revisão da Apple.

## Detalhes técnicos que vão no documento

- **Time e identificador:** Team ID `CASJQDDA7L`, app `com.bibliatoonkids.app`, certificado `Apple Distribution: Caio Figueiredo Roberto (CASJQDDA7L)`.
- **Perfil que o build realmente usa:** `ios/App/Gymfile` e `ios/App/App.xcodeproj/project.pbxproj` apontam para o perfil **`BibliaToonKIDS_AppStore_Final`**, com assinatura manual e `skip_profile_detection true`.
- **Diferença importante a registrar:** os dois arquivos na raiz do projeto (`combibliatoonkidsapp.mobileprovision` e `combibliatoonkidsapp2.mobileprovision`) são perfis gerados pelo Xcode com o nome `XC com bibliatoonkids app` e vencem 18/02/2027 — ou seja, **não são** o perfil que o build da App Store usa. O checklist deixa claro qual dos dois precisa ser recriado, para ninguém trocar o arquivo errado.
- **Aviso:** `build.xcconfig` está com `CODE_SIGN_STYLE = Automatic`, enquanto o projeto e o Gymfile usam assinatura manual. O documento instrui a **não** mexer nisso na renovação.
- **Android:** não há chave de assinatura do Android dentro do projeto (nenhum `.jks`/`.keystore`), então o checklist manda guardar o backup da chave de envio que fica no AppFlow e lembra que o Google mantém a chave final (App Signing), o que permite recuperação via suporte se a chave de envio for perdida.
- **Programa de Desenvolvedores:** é o único item que derruba o app das lojas se vencer sem pagamento. O campo da data fica no documento para você preencher depois de conferir em App Store Connect → Assinatura.

## Registro de memória

Guardar a data-limite (18/02/2027) e a recomendação de renovar em janeiro como referência do projeto, para que qualquer conversa futura sobre novo build já parta desse prazo.

## O que não será feito

- Nenhuma alteração em código, configuração de assinatura ou AppFlow.
- Nenhum certificado ou perfil recriado agora — ambos estão válidos por mais 131 dias.

## Validação

Reler o documento gerado e conferir que os nomes dos perfis, o Team ID e as datas batem com o que está no projeto; o build não é afetado (é só documentação).
