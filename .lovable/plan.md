# Perguntas do Guia para Pais em card bolha violeta

## O que muda
No formulário do Guia para Pais, o título de cada uma das 9 perguntas passa a ficar no card bolha violeta, com a borda luminosa e a fonte grossa usada nos outros títulos. A última palavra ganha o gradiente.

Isso vale para "Como você chama seu filho(a)?", "Sexo da criança" e as demais perguntas. Os campos e as opções continuam iguais.

## Detalhes técnicos
- `ParentsGuideForm.tsx`: trocar os 9 `<h2 className="text-lg font-semibold text-foreground">…</h2>` por `<SectionHeader title="…" className="mb-0" />`, que já está importado.
- O título longo quebra linha dentro do card, porque o `SectionHeader` não corta o texto.
