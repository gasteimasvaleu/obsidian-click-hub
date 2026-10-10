# Checklist de renovação da assinatura do app (iOS)

Guia para não ser pego de surpresa quando o certificado e os perfis de assinatura vencerem.
Enquanto este checklist não for executado, **nenhum build nativo novo pode ser enviado**.

> **Data-limite: 18/02/2027.** Recomendação: executar tudo em **janeiro/2027**, com margem para
> build + revisão da Apple no caminho.

---

## 1. O que vence e quando

| Item | Vence em | O que acontece se vencer |
| --- | --- | --- |
| Perfis de assinatura (`combibliatoonkidsapp.mobileprovision` e `combibliatoonkidsapp2.mobileprovision`, nome `XC com bibliatoonkids app`) | **18/02/2027** | O AppFlow não consegue mais gerar o build de distribuição |
| Certificado de distribuição `Apple Distribution: Caio Figueiredo Roberto (CASJQDDA7L)` | Mesmo ciclo de 1 ano (reconfirmar a data em App Store Connect) | Mesmo efeito: upload rejeitado por certificado inválido |
| **Programa de Desenvolvedores Apple** (renovação anual, US$ 99) | **A confirmar** — App Store Connect → Assinatura | **É o único item que derruba o app das lojas.** Se vencer sem pagamento, a Apple remove o app |
| Builds enviados ao TestFlight | 90 dias após o envio (renovação a cada novo envio) | O build de teste para de abrir nos celulares; não afeta a App Store |
| Chave da App Store Connect usada no AppFlow (Key ID + Issuer ID + `.p8`) | Só expira se for revogada | Sem renovação anual; trocar a senha do Apple ID **não** afeta a chave |
| Conta do Google Play (Android) | Sem renovação anual (taxa única) | Nada a renovar anualmente |

**Data do Programa de Desenvolvedores:** _______________  _(preencher após conferir em App Store Connect → Assinatura)_

---

## 2. Como saber que venceu

O sintoma é sempre no envio do build, nunca no app em uso:

- `No matching provisioning profile found` / `no profile for com.bibliatoonkids.app`
- `Apple Distribution certificate ... has expired`
- `Code signing failed` / `CodeBuild failed` no log do AppFlow
- `The identity ... doesn't match any valid certificate`

Se aparecer qualquer um desses, pare e execute o passo a passo abaixo.

---

## 3. Passo a passo da renovação

Tempo estimado: **30 a 45 minutos**, mais o tempo do build.

1. **Aceitar acordos pendentes.** App Store Connect → Usuários e Acesso (e e-mails da Apple).
   Acordo pendente faz a Apple recusar o envio, e o erro parece ser de certificado.
2. **Gerar a solicitação de certificado (CSR)** no Keychain Access do Mac:
   Assistente de Certificado Autoridade de Certificação → salvar o `.certSigningRequest`.
3. **Criar o certificado de distribuição novo** em App Store Connect → Certificados, IDs e Perfis →
   Certificados → **Apple Distribution**. Baixar o `.cer` e importar no Keychain do Mac.
   (Dá para fazer isso sem revogar o certificado antigo — os dois coexistem.)
4. **Recriar o perfil que o build realmente usa:** o App Store usa o perfil
   **`BibliaToonKIDS_AppStore_Final`**, citado em `ios/App/Gymfile` e em
   `ios/App/App.xcodeproj/project.pbxproj` (`PROVISIONING_PROFILE_SPECIFIER[sdk=iphoneos*]`).
   Edite esse perfil em Profiles → selecione o certificado novo → baixar o `.mobileprovision` novo.
5. **Atualizar os perfis auxiliares do projeto** (os dois da raiz, `combibliatoonkidsapp.mobileprovision`
   e `combibliatoonkidsapp2.mobileprovision`, nome `XC com bibliatoonkids app`). São perfis gerados
   pelo Xcode para desenvolvimento local — **não são** o perfil da App Store, mas vencem junto
   (18/02/2027) e devem ser recriados e substituídos pelos novos.
6. **Substituir os arquivos `.mobileprovision`** na raiz do projeto pelos baixados agora
   (mesmo nome de arquivo), e commitar.
7. **Atualizar o AppFlow:** na configuração do projeto, trocar o certificado/perfil armazenados
   pelos novos (o AppFlow guarda essas credenciais fora deste repositório).
8. **Rodar os scripts de correção de assinatura** depois de `git pull`, se o projeto tiver sido
   atualizado: `node fix-signing.cjs` e `node fix-spm-signing.cjs`.
9. **Fazer um build de teste** no AppFlow e conferir que ele conclui. Se o nome do certificado novo
   for diferente, atualizar em `ios/App/Gymfile` (`signingCertificate`) e no
   `project.pbxproj` (`CODE_SIGN_IDENTITY`) para o nome exato do novo certificado.
10. **Só então** enviar o build definitivo para TestFlight / revisão da App Store.

> **Importante — não mexer no modo de assinatura:** `build.xcconfig` está com
> `CODE_SIGN_STYLE = Automatic`, mas o projeto e o Gymfile usam assinatura **manual**.
> A renovação **não** altera isso; deixar como está evita que o Xcode escolha perfis sozinhos.

---

## 4. Pré-checagens antes de reenviar

- [ ] Acordos da Apple todos aceitos
- [ ] Chave da App Store Connect ainda ativa (App Store Connect → Integrações → API): Key ID e Issuer ID conferem, `.p8` no AppFlow
- [ ] Certificado novo importa no Keychain sem aviso
- [ ] Perfil novo contém o certificado novo (abrir o `.mobileprovision` e conferir)
- [ ] Produto `BIBLIATOONKIDS2` com status **Checked/Approved** no RevenueCat
- [ ] Credenciais do App Store Connect no RevenueCat válidas (se estiverem expiradas, o status fica "Could not check")

---

## 5. Android

- Não há chave de assinatura do Android dentro deste projeto (nenhum `.jks`/`.keystore`) — a chave de
  envio fica guardada no AppFlow. **Guardar backup dessa chave** em local seguro: sem ela não é possível
  atualizar o app no Google Play.
- O Google guarda a chave final do app (App Signing). Se a chave de envio for perdida, é possível
  pedir a troca pelo suporte do Console do Google Play — o app continua o mesmo, não é preciso publicar
  um app novo.
- A conta do Google Play **não** tem renovação anual (taxa única), então não há prazo aqui.
- O Google Play exige, ao longo do tempo, que o app suba de versão de API/SDK. Quando isso acontecer,
  é preciso build nativo novo — mais um motivo para ter a chave de envio em mãos.

---

## 6. O que NÃO muda quando os certificados vencem

- Quem **já instalou** o app continua usando normalmente — a Apple confere a assinatura na instalação,
  não no uso diário.
- A versão que já está na **App Store e no Google Play** continua no ar e funcionando.
- O **live update** continua chegando (canal `Production`, App ID `688c8cc6`) — atualização de telas e
  conteúdo não passa por assinatura nenhuma.
- **Assinaturas** dos usuários (RevenueCat) seguem ativas e renovam normalmente.

O único prejuízo real é **não conseguir publicar versão nova** até renovar.

---

## 7. Agenda

| Quando | O que fazer |
| --- | --- |
| Agora | Preencher a data do Programa de Desenvolvedores na tabela da seção 1 |
| Dezembro/2026 | Conferir se o Programa de Desenvolvedores está pago e sem acordo pendente |
| **Janeiro/2027** | Executar o passo a passo da seção 3 (certificado + perfis) e fazer build de teste |
| Fevereiro/2027 | Enviar build novo se houver mudança nativa; caso contrário, seguir só com live update |
