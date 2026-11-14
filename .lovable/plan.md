# Novo cabeçalho do chat do Amigo Divino

## O que muda
**Cabeçalho do chat**
- Passa a usar o card bolha violeta com a borda luminosa, igual aos outros títulos.
- "Amigo Divino" ganha a fonte grossa do sistema, com "Divino" em gradiente.
- O ícone de brilho dá lugar à imagem colorida do Amigo Divino, a mesma do menu Mais.
- O botão de voltar fica alinhado à direita, com as setinhas brancas animadas do novo botão de voltar.

**Área das conversas**
- Só troca o ícone: o de brilho dá lugar à imagem do Amigo Divino na mensagem de boas-vindas, ao lado de cada resposta e no "digitando…".
- O resto da área de conversa não muda.

## Detalhes técnicos
- `ChatInterface.tsx`, cabeçalho: o contêiner ganha `neon-glow-user feature-bubble bubble-user` com `<span className="border-beam" />`. Por ordem, ficam a imagem (`@/assets/more-menu/amigo-divino.png`, cerca de 40px, `object-contain`), `<h1 className="bubble-title"><BubbleTitleText text="Amigo Divino" /></h1>` e, com `ml-auto`, um botão `onClick={onClose}` com `aria-label="Voltar"` contendo 4 `ChevronLeft` com a classe `.back-arrow` e opacidade escalonada, igual ao `BackArrowButton`.
- Mensagens: trocar os 4 `Sparkles` por `<img src={amigoDivinoImg} alt="" className="... object-contain" />` nos mesmos tamanhos atuais. Os avatares perdem o fundo e a borda.
- Remover os imports de `ArrowLeft` e `Sparkles` se ficarem sem uso.
