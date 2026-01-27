

## Melhorar Template do Email com Link Clicável de Fallback

### Situação Atual

O template de email já possui um texto de fallback (linhas 240-243), mas o link está apenas como texto estático dentro de um `<span>`, o que significa que o usuário precisa copiar e colar manualmente no navegador.

### Melhoria Proposta

Converter o link de fallback de texto estático para um link clicável (`<a href>`), facilitando para usuários cujos clientes de email não renderizam o botão corretamente.

### Alteração

**Arquivo:** `supabase/functions/hotmart-webhook/index.ts`

**De (linhas 240-243):**
```html
<p style="color: #64748b; font-size: 12px; text-align: center;">
  Caso o botão não funcione, copie e cole este link no navegador:<br>
  <span style="color: #a855f7; word-break: break-all;">${signupUrl}</span>
</p>
```

**Para:**
```html
<p style="color: #64748b; font-size: 12px; text-align: center;">
  Caso o botão não funcione, clique ou copie e cole este link no navegador:<br>
  <a href="${signupUrl}" style="color: #a855f7; word-break: break-all; text-decoration: underline;">${signupUrl}</a>
</p>
```

### Resultado

| Antes | Depois |
|-------|--------|
| Texto estático (precisa copiar/colar) | Link clicável + opção de copiar/colar |

Os usuários agora terão duas opções para completar o cadastro:
1. **Botão principal** - "Completar Cadastro" 
2. **Link de fallback clicável** - para clientes de email que não renderizam botões

