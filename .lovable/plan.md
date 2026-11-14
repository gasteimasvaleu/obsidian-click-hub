# Página de Estudo Bíblico com IA

Uma nova página "Estudo Bíblico", com chat de IA católico (Bíblia Ave Maria, 73 livros), estudos salvos na conta do usuário e o mesmo visual das outras páginas (títulos em bolha, cards brancos, barras divididas, desenhos 2D).

## Estrutura

```text
/estudo                 Lista de estudos + "Novo estudo"
  ├─ Bolha "Estudo Bíblico" + desenho 2D do Frei com a Bíblia
  ├─ Nível da linguagem: [ Crianças | Pais e catequistas ]
  ├─ Começar um estudo:
  │    • Temas prontos (cards 2D): Parábolas, Sacramentos, Maria,
  │      Os Apóstolos, Criação, Milagres de Jesus, Os 10 Mandamentos, Santos
  │    • Trecho da Bíblia: escolher livro → capítulo (usa a Bíblia do app)
  │    • Pergunta livre: campo de texto
  └─ Meus estudos: lista dos estudos salvos (título, data, apagar)

/estudo/:id             Conversa de um estudo
  ├─ Barra voltar (setinhas) + título do estudo em bolha
  ├─ Mensagens: aluno em bolha violeta, IA sem fundo, com texto formatado
  │   e versículos citados com link para abrir na Bíblia do app
  ├─ Sugestões rápidas: "Explique mais simples", "Me dê um exemplo",
  │   "Como aplicar no dia a dia?"
  ├─ Botão "Revisar com perguntinhas": a IA gera 3 a 5 perguntas de
  │   múltipla escolha no visual do Quiz, com acerto/erro e pontuação
  └─ Campo de mensagem fixo embaixo
```

- Cada estudo tem seu próprio endereço, então recarregar a página volta para a mesma conversa.
- O nível (Crianças ou Pais) fica salvo em cada estudo e pode ser trocado durante a conversa.
- Concluir uma revisão soma pontos e conta como atividade no Perfil.
- Acesso: livre para quem tem login, como o Amigo Divino. Se quiser limitar no plano gratuito, me diga.
- Entrada no app: card "Estudo Bíblico" na tela inicial e no menu "Mais".

## Comportamento da IA
- Persona de catequista católico, fiel ao Magistério e ao Catecismo, citando a tradução Ave Maria.
- Linguagem simples e acolhedora no modo Crianças; mais aprofundada, com referências do Catecismo, no modo Pais.
- Recusa educadamente temas fora da fé e da Bíblia.
- Antes do primeiro uso, mostra o aviso de consentimento de IA que o app já tem (exigência da Apple).

## Detalhes técnicos
- Banco (migration com GRANTs + RLS por `auth.uid()`):
  - `bible_studies` (id, user_id, title, audience 'kids'|'parents', source_type 'theme'|'passage'|'free', source_ref, created_at, updated_at)
  - `bible_study_messages` (id, study_id, user_id, role, parts jsonb, created_at); o id do AI SDK fica em coluna texto separada.
- Edge Function `bible-study-chat`: segue o padrão do `amigo-divino-chat` (LOVABLE_API_KEY, `/v1/responses`, `openai/gpt-6-astra`, streaming). Valida o dono do estudo, monta o histórico completo e salva as mensagens do usuário e da IA. Erros 402/429 aparecem como aviso amigável.
- Revisão: a mesma função, com `mode: 'quiz'`, retorna JSON por `json_schema` estrito ({perguntas:[{pergunta, alternativas[4], correta, explicacao}]}).
- Frontend: `src/pages/estudo/EstudoListPage.tsx` e `EstudoChatPage.tsx`, com rotas em App.tsx. Usa `useChat` do AI SDK + componentes AI Elements, com estilo nos tokens do app. Markdown com `react-markdown`.
- Desenhos 2D novos: topo da página e os 8 temas (estilo cartoon flat violeta).
- Tela inicial e menu "Mais": adicionar o item conforme a regra de navegação do AGENTS.md.
