

# Parental Gate para Links Externos

## Problema
A Apple exige um mecanismo de "Parental Gate" antes de qualquer link que tire a crianca do app em apps voltados para criancas.

## Links que precisam de Parental Gate

| Local | Tipo | Destino |
|-------|------|---------|
| `LessonPlayer.tsx` | window.open | Conteudo externo da aula |
| `ExternalContentModal.tsx` | window.open + iframe | Conteudo externo em nova aba |
| `PrayerCard.tsx` | window.open | WhatsApp (wa.me) |
| `ExternalFrame.tsx` / rota `/external-login` | iframe | themembers.com.br |

**NAO precisam de gate** (usam APIs nativas do sistema):
- `navigator.share` (VerseCard, ShareModal, DevotionalPage) - abre share sheet do iOS
- Downloads de arquivos do proprio storage (MaterialsList)

## Solucao

### 1. Criar `src/components/ParentalGate.tsx`
- Modal (Dialog) com uma conta matematica simples
- Gera uma soma de 2 numeros aleatorios entre 3 e 15 ao abrir
- Texto: "Para continuar, peca a um adulto para resolver:"
- Input numerico com `inputMode="numeric"`
- Se acertar: chama `onSuccess` e fecha o modal
- Se errar: mostra mensagem "Resposta incorreta, tente novamente" mas **mantém a mesma conta** (tentativas infinitas)
- A conta so muda quando o modal e reaberto (novo clique)

### 2. Modificar `src/components/plataforma/LessonPlayer.tsx`
- Importar ParentalGate
- Ao clicar em "Abrir conteudo externo", abrir o ParentalGate
- No `onSuccess`, executar o `window.open` original

### 3. Modificar `src/components/plataforma/ExternalContentModal.tsx`
- Adicionar ParentalGate no botao "Abrir em nova aba"
- O iframe interno permanece sem gate (conteudo ja esta dentro do app)

### 4. Modificar `src/components/oracoes/PrayerCard.tsx`
- Adicionar ParentalGate no fallback do compartilhamento que abre WhatsApp via `window.open`
- O `navigator.share` nativo continua sem gate

### 5. Verificar `src/App.tsx` e `ExternalFrame.tsx`
- Proteger ou remover a rota `/external-login` se necessario

## Fluxo do usuario

```text
Crianca clica em "Abrir conteudo externo"
         |
         v
  +-------------------------------+
  | Modal: Parental Gate          |
  | "Peca a um adulto resolver:"  |
  | Quanto e 8 + 6?               |
  | [    ] [Confirmar]            |
  +-------------------------------+
         |
    Resposta correta?
    Sim -> abre o link externo
    Nao -> "Resposta incorreta, tente novamente"
           (mesma conta, pode tentar de novo)
```

## Detalhes tecnicos

- Conta matematica gerada com `Math.random()` ao abrir o modal (via `useEffect` no `open`)
- Mesma conta mantida ate fechar e reabrir o modal
- Input `type="number"` com `inputMode="numeric"` para teclado numerico no mobile
- Componente reutilizavel: recebe `open`, `onOpenChange`, `onSuccess`
- 5 arquivos afetados no total

