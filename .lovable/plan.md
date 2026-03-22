
## Corrigir cliques no menu "Mais"

Encontrei a causa mais provável: o painel do menu está com `className="... z-45 ..."`, mas `z-45` não é uma classe padrão do Tailwind neste projeto. Na prática, o painel pode ficar sem `z-index` válido e acabar atrás do backdrop `z-40`, bloqueando os botões.

### O que vou ajustar

**Arquivo:** `src/components/ui/tubelight-navbar.tsx`

1. **Corrigir a camada do painel**
   - Trocar `z-45` por um valor válido:
     - opção mais simples: `z-50`
     - ou mais explícita: `z-[45]`
   - Assim o painel ficará realmente acima do backdrop.

2. **Manter o backdrop atrás do menu**
   - Preservar o backdrop com `z-40`
   - Garantir que ele continue fechando o menu ao clicar fora, sem cobrir os botões internos.

3. **Ajuste defensivo nos botões internos**
   - Adicionar `type="button"` nos botões do menu “Mais”
   - Não muda o visual, mas evita comportamento inesperado caso algum container futuro esteja dentro de formulário.

### Resultado esperado
- Os botões internos do menu “Mais” voltam a receber clique normalmente
- O menu continua aparecendo acima da faixa preta e da navbar
- Nenhuma outra mudança visual além da correção da camada

### Detalhe técnico
Hoje a hierarquia está assim:

```text
backdrop: z-40
painel:   z-45  <- inválido no Tailwind
navbar:   z-50
```

Com a correção:

```text
backdrop: z-40
painel:   z-[45] ou z-50
navbar:   z-50
```

Se eu quiser manter o painel visualmente entre backdrop e navbar, uso `z-[45]`. Se preferir máxima segurança de clique, uso `z-50`.
