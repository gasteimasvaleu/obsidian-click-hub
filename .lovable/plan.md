# Botão "Começar Jornada" no padrão violeta

## O que muda
- O botão "Começar Jornada" do Amigo Divino (e o "Começar Agora" da página Sobre, que usa o mesmo botão) fica violeta cheio, com texto branco.
- A sombra verde sai e entra uma sombra violeta suave, igual à dos outros cards.
- O botão passa a ocupar toda a largura do card, com a mesma altura dos botões principais do app.

## Detalhes técnicos
- `src/components/NeonButton.tsx`: trocar o estilo para `w-full h-12 rounded-2xl bg-primary text-primary-foreground`, a sombra para tokens violeta (`shadow-[0_8px_24px_hsl(var(--primary)/0.35)]`) e manter só o `active:scale-95`, sem o hover verde/preto.
