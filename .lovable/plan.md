# Trocar "Amigo" por "Bíblia" no menu de baixo e mover Amigo Divino para o menu "Mais"

## O que muda

O item central do menu inferior que hoje abre o Amigo Divino passa a abrir a Bíblia. O Amigo Divino deixa de ter botão fixo embaixo e passa a ficar dentro do painel "Mais", no lugar que era da Bíblia.

**Menu de baixo (6 itens), depois da mudança:**
Início · Cursos · **Bíblia** · Guia Pais · Colorir · Mais

**Painel "Mais" (10 itens), depois da mudança:**
**Amigo Divino** · Devocional · Orações · Bíbliafy · Games · Comunidade · Meu Perfil · Sobre · Política Família · Termos de Uso

A contagem de atalhos no "Mais" não muda (10), e a cor verde neon e o destaque da página aberta continuam iguais.

## Como é feito

**1. `src/App.tsx`**
- Linha 85: o item `{ name: 'Amigo Divino', url: '/amigodivino', icon: Bot, shortName: 'Amigo' }` vira `{ name: 'Bíblia', url: '/biblia', icon: BookOpen }`.
- Linha 7: `Bot` sai da lista de ícones importados (não é mais usado nesse arquivo) e `BookOpen` entra.

**2. `src/components/ui/tubelight-navbar.tsx`**
- Linha 21: a entrada `{ name: 'Bíblia', url: '/biblia', icon: BookOpen }` sai do `moreMenuItems` (Bíblia passa a ter botão fixo embaixo, então não se repete no "Mais").
- No mesmo lugar entra `{ name: 'Amigo Divino', url: '/amigodivino', icon: Bot }`, mantendo a lista com 10 atalhos e a grade de 3 colunas.
- Linha 4: `BookOpen` sai dos ícones importados (só era usado nessa entrada) e `Bot` entra.

**3. Acompanhamento**
- Atualizar a memória `mem://features/navigation-items-structure` com a nova composição dos dois menus.
- Registrar a tarefa concluída em `roadmap.md`.

Nada de rotas, páginas ou permissões é alterado: `/biblia` e `/amigodivino` continuam existindo e acessíveis pelos cards da tela inicial também.

## Detalhes técnicos

- Regra do projeto (`AGENTS.md`): a navegação principal vive em `src/App.tsx` (`navItems`) e a secundária em `src/components/ui/tubelight-navbar.tsx` (`moreMenuItems`) — cada menu continua com uma única fonte de verdade, sem duplicar atalhos entre os dois.
- O item novo do menu de baixo não precisa de `shortName`: "Bíblia" cabe no texto de 9px das colunas do menu.
- Ícones: `BookOpen` (Bíblia) e `Bot` (Amigo Divino) já vêm de `lucide-react`; a troca é só nos imports para não deixar ícone sem uso (o build avisa).
- Nenhuma mudança nativa: chega ao celular por atualização ao vivo (canal "Production"), fechando e abrindo o app de novo.
