

## Ajustes na Página Download e Cadastro

### 1. Download.tsx - Botoes de download das lojas
Substituir o botao "Ir para o Login" por dois botoes:
- **"Baixe Agora na Apple Store"** - link externo para `https://apps.apple.com/app/id6759345320`
- **"Em Breve na Google Play"** - botao desabilitado com texto "Em Breve"

Usar icones da Apple e do Google Play (lucide `Smartphone` ou SVG inline). Manter o layout centralizado com os dois botoes empilhados.

### 2. Cadastro.tsx - Mensagem VIP no fluxo de token
No case `'valid'`, trocar o banner azul atual (sobre spam) por um banner dourado/amarelo com mensagem de boas-vindas VIP:
- Icone de estrela/coroa
- Texto: **"Parabens! Voce recebeu acesso VIP ao BibliaTooon Club!"**
- Subtexto: "Complete seu cadastro abaixo para ativar sua conta exclusiva."

### Arquivos editados
| Arquivo | Mudanca |
|---------|---------|
| `src/pages/Download.tsx` | Substituir botao login por botoes Apple Store + Google Play |
| `src/pages/Cadastro.tsx` | Trocar banner azul por mensagem VIP dourada no case `valid` |

