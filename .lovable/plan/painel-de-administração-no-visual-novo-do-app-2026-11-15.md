# Painel de administração no visual novo do app

Levar o visual completo do app (fundo cinza clarinho e branco, violeta, cards com faixa de título, barras arredondadas e setas) para todas as telas do painel.

## O que muda
- **Tema**: o painel deixa o tema escuro e passa a usar o mesmo claro/violeta das telas do usuário.
- **Menu lateral e topo**: fundo branco, item ativo em violeta clarinho, ícones violeta.
- **Painel inicial**: cards de números no estilo BubbleSection com faixa violeta e título com gradiente na última palavra.
- **Telas de cadastro** (Ebooks, Jogos, Gerador, Devocionais, Orações, Colorir, Destaques, Tokens VIP, Cursos, Módulos, Aulas, Materiais, Carrosséis, Configurações):
  - títulos de página no padrão SectionHeader;
  - listas e formulários dentro de cards no padrão da Bíblia;
  - abas/filtros como barra arredondada com divisória (SPLIT_BAR);
  - botões de ação em barra arredondada; voltar como barra violeta de setas.
- Cores com significado (ativo/inativo, erro, sucesso, categorias) continuam.

## Detalhes técnicos
- Remover o wrapper `.dark` em `src/components/admin/ProtectedRoute.tsx`; atualizar a regra correspondente no AGENTS.md.
- Ajustar `AdminLayout`, `AdminSidebar`, `AdminHeader` para tokens claros.
- Trocar cores fixas (bg-black, text-white, hex) encontradas em Dashboard, GamesManager, LessonsManager, AdminLayout por tokens semânticos.
- Reutilizar `BubbleSection`/`SPLIT_BAR`, `SectionHeader`, `ArrowNavButton`, `BackArrowButton`.
- Sem mudanças de dados ou permissões.
- Não consigo entrar logado no painel (banco externo), então a conferência visual final será sua.
