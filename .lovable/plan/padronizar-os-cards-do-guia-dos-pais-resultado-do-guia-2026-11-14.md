# Padronizar os cards do Guia dos Pais (resultado do guia)

## O que muda
- **Cabeçalho "Seu Guia Personalizado"**: vira o título em bolha violeta (última palavra em gradiente) com o subtítulo "Para ensinar {nome} sobre: {passagem}" no card branco logo abaixo, igual às outras páginas. Os botões Imprimir e Novo Guia ficam embaixo, com a mesma largura.
- **Card "Perfil de {nome}"**: título em bolha no mesmo padrão, e o texto no card branco abaixo.
- **Seções abríveis** (Contexto da Passagem, Objetivos, Roteiro, Atividades, Frases, Desafios, Plano de Reforço, Recursos Extras, Dicas): cada uma ganha a bolha violeta como título (tocar continua abrindo e fechando, com a setinha) e o conteúdo aparece no card branco logo abaixo.
- **Ícones antes dos títulos**: todos removidos (Perfil, Livro, Alvo, Balão, Paleta, Lâmpada, Alerta, Calendário etc.). Os ícones dos botões Imprimir/Novo Guia também saem.
- Cards internos (passos e atividades) mantêm o conteúdo, com cantos arredondados e borda violeta fina, como os demais.

## Detalhes técnicos
- Arquivo: `src/components/guia-pais/GuideDisplay.tsx` apenas.
- Usar `SectionHeader` / `SectionDescription` de `CourseCarousel.tsx` para o cabeçalho e o perfil.
- No `AccordionTrigger`, renderizar a mesma bolha (`neon-glow-user feature-bubble bubble-user rounded-2xl` + `border-beam` + `BubbleTitleText`), e no `AccordionContent` o card branco anexado (`-mt-5`, estilo `SectionDescription`).
- Remover imports de ícones do lucide não usados.
