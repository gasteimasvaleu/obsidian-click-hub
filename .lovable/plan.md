
Objetivo: corrigir definitivamente o bug do Passo 7 em `/guia-pais` quando o usuário toca no campo “Onde e quando você planeja ensinar?” no iPhone (layout “quebra”, corta lateral e desloca elementos).

Diagnóstico (com base no código + screenshots):
- O Passo 1 usa `Input` com `text-base md:text-sm` (16px no mobile), que evita zoom automático do iOS ao focar.
- O Passo 7 usa `Textarea` cujo componente base está com `text-sm` (14px) em `src/components/ui/textarea.tsx`.
- No iOS, campos com fonte < 16px podem disparar zoom automático ao focar — isso bate exatamente com os sintomas dos prints (corte lateral/desalinhamento ao abrir teclado).

Plano de implementação:
1) Ajuste estrutural no componente base de textarea
- Arquivo: `src/components/ui/textarea.tsx`
- Trocar a classe base de `text-sm` para o mesmo padrão do `Input`: `text-base md:text-sm`.
- Resultado: toda `Textarea` no mobile passa a abrir sem zoom automático do iOS.

2) Garantia local no Guia Pais (passos com textarea)
- Arquivo: `src/components/guia-pais/ParentsGuideForm.tsx`
- Nos `Textarea` dos passos 7, 8 e 9, adicionar explicitamente `text-base md:text-sm` no `className` (além das classes atuais), para blindar esse fluxo mesmo se o componente base mudar no futuro.
- Manter `min-h-[120px]` (não reduzir para altura do passo 1), pois o problema é fonte/zoom e não tamanho da caixa.

3) Não mexer na lógica de navegação/scroll atual
- Preservar `overflow-hidden`, wrappers e layout já existentes, para minimizar risco de regressão.
- Focar somente na causa raiz (zoom automático por font-size).

Detalhes técnicos:
- Causa raiz esperada: iOS Safari/WebView auto-zoom em `textarea` com fonte <16px.
- Correção alinhada ao padrão já usado no próprio app (`Input`).
- Baixo risco: alteração visual pequena (texto do textarea levemente maior no mobile), com ganho grande de estabilidade.

Validação (E2E manual após aplicar):
1) iPhone / viewport 390x691: abrir `/guia-pais`.
2) Avançar até Passo 7.
3) Tocar no textarea e abrir teclado.
4) Confirmar que:
   - não há zoom da página,
   - não há corte lateral,
   - header/progresso permanecem alinhados,
   - campo aceita digitação normalmente.
5) Repetir rapidamente nos passos 8 e 9 para garantir consistência.
6) Revalidar Passo 1 para confirmar que comportamento segue estável.

Se ainda restar algum sintoma em iOS específico (fallback):
- Aplicar `style={{ fontSize: '16px' }}` diretamente no `Textarea` do Passo 7 como reforço final para WebView mais sensível.
