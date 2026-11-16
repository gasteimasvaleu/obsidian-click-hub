# Abrir o Paywall direto para conferir

O Paywall não tem endereço próprio. Hoje ele só aparece de dois jeitos:
- Na 4ª aula inédita de um curso, para quem não é assinante.
- No Perfil, no botão "Assinar agora" do card "Seja Premium" (só aparece para quem não assina).

## Proposta
Criar o endereço `/paywall-preview`, que só administradores conseguem abrir. Ele mostra o Paywall em tela cheia, do mesmo jeito que o aluno vê. O botão de fechar volta para a página anterior.

## Detalhes técnicos
- Nova rota em App.tsx protegida pela checagem de admin já usada no painel.
- Renderiza `<Paywall onClose={() => navigate(-1)} onUnlocked={() => navigate(-1)} />`.
- Nenhuma mudança na lógica das 3 aulas grátis.
