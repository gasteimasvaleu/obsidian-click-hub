# O que o live update resolve e o que não resolve

## Funciona pelo live update
- O aviso "Você precisa estar logado" que sumiu da tela de login.
- A nova mensagem de erro do login com Apple.

Para testar: publique o projeto aqui, feche o app de vez e abra de novo (às vezes precisa repetir 2 vezes).

## Não funciona pelo live update
- O "Continuar com Apple" em si (erro 1000).

O live update troca só as telas do app. A permissão para usar o login com Apple fica gravada no app instalado, na hora em que o AppFlow monta o build e assina com o perfil da Apple. Para corrigir isso é preciso:
1. Gerar o perfil de novo no site da Apple (em Profiles, clique em Edit e depois em Save, e baixe o arquivo).
2. Trocar o perfil no AppFlow.
3. Gerar um build novo, o 1.3.1 (38), que já está preparado.
4. Testar no TestFlight.

## Próximo passo
Nenhuma mudança de código nova. Posso publicar agora para você testar a parte que vem pelo live update.
