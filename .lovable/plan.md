

# Esconder temporariamente botao "Assine Agora" na tela de Login

## Mudanca

No arquivo `src/pages/Login.tsx`, vou apenas comentar/remover as 3 secoes de JSX, sem mexer nos imports nem na constante `HOTMART_URL`:

1. O divisor "Ainda nao tem conta?" (linhas 79-87)
2. O link/botao "Assine Agora" (linhas 89-98)
3. O texto "Apos a compra..." (linhas 100-102)

Os imports (`ExternalLink`) e a constante (`HOTMART_URL`) permanecem intactos para nao afetar nada.

## Resultado

A tela de login ficara apenas com:
- Titulo "Bem-vindo"
- Descricao
- Campo de email
- Campo de senha
- Botao "Entrar"

## Arquivo alterado

| Arquivo | Mudanca |
|---------|---------|
| `src/pages/Login.tsx` | Remover apenas o JSX do divisor, botao e texto. Imports e constantes permanecem. |

