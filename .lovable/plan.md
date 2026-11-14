# Setinhas animadas no lugar de "Voltar", "Próximo" e "Anterior"

## O que muda
Todos os botões de navegação do app passam a ser barras violetas com setinhas brancas animadas, iguais às das páginas de curso, módulo e aula. Elas não têm texto, mas o nome da ação continua sendo lido pelo leitor de tela.
- **Voltar e Anterior:** setas apontando para a esquerda, como hoje.
- **Próximo:** novo modelo com setas para a direita, que ficam mais fortes conforme avançam.
- Quando os dois aparecem juntos, ficam lado a lado e dividem a linha ao meio.
- Quando o botão está bloqueado (por exemplo, "Próximo" sem escolher uma opção), fica apagado.

## Onde
- **Guia para Pais:** Voltar e Próximo de cada passo. O botão final "Gerar Guia Personalizado" continua com o texto.
- **Leitura da Bíblia:** Capítulo anterior e próximo.
- **Quebra-cabeça:** Anterior e próximo.
- **Termos de Uso, Política para Famílias, Foto para Colorir, Minhas Criações, editor de colorir e páginas externas:** botões "Voltar".
- **Jogos (Memória, Quiz, Caça-palavras, Quebra-cabeça e telas de erro):** "Voltar aos Jogos".
- **Telas de erro da Plataforma:** "Voltar para Plataforma".

## Fica como está
"Próximo nível" no Perfil (é um texto, não um botão), as setas do seletor de tema no Perfil e o painel administrativo.

## Detalhes técnicos
- Generalizar `src/components/plataforma/BackArrowButton.tsx` num componente `ArrowNavButton` com as props `direction: "left" | "right"`, `to?` (Link) ou `onClick?` (button), `disabled`, `label` (aria-label) e `className`. `BackArrowButton` continua existindo como atalho.
- Adicionar a animação `.next-arrow` / `@keyframes next-arrow-flow` em `src/index.css`, espelhando `back-arrow-flow`, com opacidade crescente para a direita e respeito a reduzir movimento.
- Estado desabilitado: `opacity-50 pointer-events-none`.
- Pares lado a lado: `flex gap-3` com `flex-1` em cada um.
