# Abas no padrão do app (barra dividida)

As abas "Antigo Testamento / Novo Testamento" usam o estilo antigo (caixa cinza com botão branco). Vão virar a mesma barra arredondada com divisória usada em "Minha jornada" do Perfil: ativa em violeta clarinho com texto violeta.

## Onde
1. Bíblia — Antigo Testamento (46) | Novo Testamento (27).
2. Guia dos Pais — Para Iniciar | Para Explicar | Perguntas (mesmo estilo antigo).

O painel Admin fica como está (tema escuro próprio).

## Detalhes técnicos
- `TabsList className={`${SPLIT_BAR} !h-auto p-0 mb-6`}` (import de `@/components/ui/bubble-section`).
- `TabsTrigger`: `h-11 flex-1 min-w-0 rounded-none px-2 text-xs sm:text-sm text-muted-foreground shadow-none data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:font-semibold data-[state=active]:shadow-none`, com `truncate` no texto.
- Arquivos: `src/pages/biblia/BibliaPage.tsx`, `src/components/guia-pais/GuideDisplay.tsx`.
