# Aviso de Inteligência Artificial no padrão do app

## O que muda
- **Tamanho no celular:** o aviso deixa de ocupar a tela de ponta a ponta e fica centralizado, com margem nos dois lados.
- **Visual do card:** cantos bem arredondados e uma borda fina violeta.
- **Título:** "Uso de Inteligência Artificial" passa a ser o card bolha violeta, com a fonte padrão e a última palavra em destaque, igual aos títulos das outras páginas.
- **Texto:** a introdução fica no card branco de subtítulo, logo abaixo do título. Os itens "Dados enviados", "Para quem" e "Proteção" continuam abaixo, em texto normal.
- **Botões:** "Agora não" vira um botão com contorno violeta, da mesma largura e altura de "Concordo e quero continuar", logo abaixo dele.
- O que cada botão faz continua igual.

## Detalhes técnicos
- `src/components/AIConsentDialog.tsx`:
  - `DialogContent`: `w-[calc(100%-2rem)] max-w-md rounded-3xl border border-primary/40 max-h-[85vh] overflow-y-auto`.
  - Trocar o ícone e o `DialogTitle` por `SectionHeader` com o título e a descrição introdutória. Manter `DialogTitle` e `DialogDescription` como `sr-only` para acessibilidade.
  - "Agora não": `variant="outline" className="w-full h-11 border-primary text-primary"`, e "Concordo..." com `h-11`.
