# Tirar o nome "Frei Gilsinho" do Estudo Bíblico

Trocar todas as menções ao Frei por um guia sem nome:

- Descrição do topo: "Estude a Bíblia e a fé católica com um guia de IA. Escolha um tema, um trecho ou faça sua pergunta."
- Enquanto a resposta carrega: "Preparando a resposta..." no lugar de "O Frei está pensando...".
- Campo de mensagem: "Faça sua pergunta..." no lugar de "Pergunte ao Frei...".
- A IA deixa de se apresentar como Frei Gilsinho e passa a ser "o guia de estudo bíblico do BíbliaToon Club". O jeito de responder continua o mesmo.

O desenho do topo continua o mesmo.

## Detalhes técnicos
- src/pages/estudo/EstudoListPage.tsx, src/pages/estudo/EstudoChatPage.tsx e o prompt BASE em supabase/functions/bible-study-chat/index.ts (publicar a função de novo).
