

# Auditoria: Remover mencoes a compra/assinatura do app

## Contexto
A Apple rejeitou o app por conter referencias a conteudo pago fora do sistema de compras in-app. Precisamos remover qualquer mencao a compra, assinatura ou planos de preco para que o app pareca 100% gratuito para usuarios logados.

## Problemas encontrados

### 1. Pagina Sobre - Texto "Assinatura mensal acessivel" (CRITICO)
- **Arquivo**: `src/pages/Sobre.tsx`, linha 109
- **Texto atual**: "Assinatura mensal acessivel, novos conteudos adicionados regularmente..."
- **Correcao**: Remover mencao a assinatura, manter apenas: "Novos conteudos adicionados regularmente e recursos que estimulam a continuidade do aprendizado."

### 2. Pagina Sobre - CTA "Assine" (CRITICO)
- **Arquivo**: `src/pages/Sobre.tsx`, linha 277
- **Texto atual**: "Assine, explore o conteudo, interaja com a comunidade..."
- **Correcao**: Trocar para "Explore o conteudo, interaja com a comunidade e transforme o aprendizado da fe em uma aventura inesquecivel."

### 3. Login - Codigo morto da Hotmart (BAIXO RISCO)
- **Arquivo**: `src/pages/Login.tsx`, linhas 9-11
- **Problema**: Constante `HOTMART_URL` e import `ExternalLink` ainda no codigo, mesmo sem uso na UI
- **Correcao**: Remover ambos (codigo morto). Isso NAO afeta o fluxo de checkout da Hotmart, que funciona via webhook no Supabase (`hotmart-webhook`) de forma totalmente independente.

## Itens verificados e LIMPOS
- Pagina de Login (UI) - botao de assinar ja removido
- Pagina de Cadastro - apenas criacao de conta
- Pagina de Download - sem mencoes a compra
- Perfil do usuario - sem mencoes a premium/upgrade
- Navbar - sem referencias a planos
- Pages admin - protegidas, usuario comum nao acessa

## Resumo

| Arquivo | Alteracao | Risco |
|---------|-----------|-------|
| `src/pages/Sobre.tsx` | Remover "Assinatura mensal acessivel" | Nenhum |
| `src/pages/Sobre.tsx` | Trocar "Assine" por "Explore" no CTA | Nenhum |
| `src/pages/Login.tsx` | Remover `HOTMART_URL` e `ExternalLink` (codigo morto) | Nenhum |

Todas as alteracoes sao cosmeticas (texto) ou limpeza de codigo morto. O fluxo real de pagamento via Hotmart webhook continua funcionando normalmente.

