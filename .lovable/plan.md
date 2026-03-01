

## Resolver Rejeicao Apple: Dialog de Consentimento de IA

O app precisa pedir permissao ao usuario antes de enviar dados para servicos de IA, conforme exigido pela Apple (Guidelines 5.1.1 e 5.1.2).

### O que sera feito

**1. Criar componente `AIConsentDialog`**

Um dialog reutilizavel que explica:
- Quais dados serao enviados (mensagens, fotos, informacoes do formulario)
- Para quem (servicos de inteligencia artificial do Google, via servidores seguros)
- Que os dados sao usados apenas para gerar o conteudo e nao sao armazenados

O consentimento sera salvo no `localStorage` (`ai_consent_accepted`). O dialog so aparece uma vez.

**2. Criar hook `useAIConsent`**

Hook simples que retorna `{ hasConsent, showConsent, setShowConsent, acceptConsent }` para facilitar a integracao nos componentes.

**3. Integrar nos 4 pontos que usam IA**

| Arquivo | Gatilho |
|---|---|
| `ChatInterface.tsx` | Antes de enviar a primeira mensagem |
| `GuiaPais.tsx` | Antes de gerar o guia |
| `VerseCard.tsx` | Antes de gerar comentario teologico |
| `PhotoTransformPage.tsx` | Antes de enviar a foto |

Em cada caso: se o usuario ainda nao aceitou, abre o dialog. Apos aceitar, executa a acao normalmente.

**4. Corrigir erro de build**

Adicionar script `"build:dev": "vite build"` no `package.json` para resolver o erro `Script not found "build:dev"`.

---

### Nao sera feito (conforme solicitado)

- Atualizar politica de privacidade na pagina Sobre (ja feito externamente)

