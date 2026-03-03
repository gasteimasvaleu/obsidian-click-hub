

## Plano: Melhorar UX do Chat do Amigo Divino

### Mudanças no `src/components/ChatInterface.tsx`:

1. **Adicionar FuturisticNavbar** no topo da página (substituindo o header custom atual)
2. **Envolver as mensagens em um GlassCard** para dar mais identidade visual
3. **Aumentar o padding inferior** da área de input para `pb-36` (compatível com o tubelight navbar `mb-9`)
4. **Manter o botão de voltar** integrado ao header, mas agora junto com a navbar
5. **Adicionar avatar/ícone** nas mensagens do assistente para melhorar a experiência visual

### Estrutura final:
- `FuturisticNavbar` no topo
- Header com título "Amigo Divino" e botão voltar
- Área de mensagens dentro de um `GlassCard`
- Input fixo no bottom com `pb-36` para não ficar atrás do tubelight menu

