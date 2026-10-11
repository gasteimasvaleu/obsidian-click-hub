# Trocar os botões Colorir e Games do menu inferior

## O que muda

No menu de baixo (o "menu tubelight"), dois botões trocam de lugar:

- o botão **Colorir** vira **Cursos** e passa a abrir a tela de cursos
- o botão **Games** vira **Colorir** e passa a abrir a tela de colorir

Antes:

```text
Início | Colorir | Amigo | Guia Pais | Games | Mais
```

Depois:

```text
Início | Cursos | Amigo | Guia Pais | Colorir | Mais
```

Cada botão continua com o mesmo tamanho, o mesmo brilho ao ficar ativo e o mesmo toque com vibração. Só mudam o nome, o desenho e a tela que abre.

- **Cursos** abre a mesma tela do destaque "Acessar Cursos" da tela inicial (o catálogo de cursos, com as aulas).
- **Colorir** abre a mesma tela de desenhos para colorir de antes.
- **Games** sai do menu de baixo, mas continua acessível pela tela inicial, onde já existe o card verde-lima "Games". Nada é perdido.

Os cards da tela inicial (Bíblia Interativa, Devocional Diário, Orações, Bíbliafy, Colorir, Amigo Divino, Guia para Pais, Games e Comunidade) e o menu "Mais" (Comunidade, Meu Perfil, Sobre, Política Família, Termos de Uso) ficam exatamente como estão.

## Detalhes técnicos

- `src/App.tsx` — na lista `navItems` (fonte única da navegação principal, conforme a regra do projeto):
  - item na posição 2: `{ name: 'Colorir', url: '/colorir', icon: Palette }` passa a `{ name: 'Cursos', url: '/plataforma', icon: GraduationCap }`
  - item na posição 5: `{ name: 'Games', url: '/games', icon: Gamepad2 }` passa a `{ name: 'Colorir', url: '/colorir', icon: Palette }`
  - import de `lucide-react`: acrescentar `GraduationCap` (o mesmo ícone já usado em "Cursos" no painel administrativo) e remover `Gamepad2`, que deixa de ser usado nesse arquivo
- `src/components/ui/tubelight-navbar.tsx` — sem alteração: o componente só renderiza a lista que recebe, e o rótulo "Cursos" (6 letras) cabe no espaço dos 9px usado hoje
- Rotas: `/plataforma` e `/colorir` já existem e continuam protegidas por login; nenhuma rota nova é criada
- Memória do projeto: atualizar `mem://features/navigation-items-structure` com a nova ordem dos seis botões, para as próximas mudanças partirem da estrutura correta
- `roadmap.md`: registrar a troca como tarefa concluída e manter a validação no aparelho como pendência

## Como validar

1. Abrir a prévia e conferir o menu de baixo na nova ordem
2. Tocar em "Cursos" → deve abrir o catálogo de cursos
3. Tocar em "Colorir" → deve abrir a tela de colorir, com o botão ficando aceso
4. Conferir que o card "Games" na tela inicial continua abrindo os jogos
5. Publicar e fazer a atualização ao vivo; fechar o app por completo e abrir de novo
