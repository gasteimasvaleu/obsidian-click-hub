

## Remover animações do menu "Mais" (manter funcionalidade)

O problema: os `motion.button` com animações staggered provavelmente estão interceptando cliques durante a animação. Vamos trocar todos os elementos animados por elementos HTML normais.

### Arquivo: `src/components/ui/tubelight-navbar.tsx`

1. **Backdrop**: trocar `motion.div` por `div` simples (sem AnimatePresence)
2. **Painel do menu**: trocar `motion.div` por `div` simples, remover `initial/animate/exit/transition`
3. **Botões dos items**: trocar `motion.button` por `button` simples, remover `initial/animate/transition` com delay
4. **Remover `AnimatePresence`** dos wrappers do backdrop e painel (as duas primeiras instâncias)
5. Manter o `AnimatePresence` e `motion.div` do "lamp" effect na navbar principal (não está relacionado)
6. Usar renderização condicional simples (`{moreOpen && <div>...</div>}`) no lugar do AnimatePresence

Nenhuma mudança de layout, posicionamento ou estilo — apenas remoção das animações framer-motion do menu "Mais".

