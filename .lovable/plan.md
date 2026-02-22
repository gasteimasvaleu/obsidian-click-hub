

# Corrigir erro de JSON na Edge Function generate-parents-guide

## Problema

A IA retorna JSON malformado (erro na posicao 6791), e o `JSON.parse()` falha. Alem disso, o modelo usado (`google/gemini-2.5-flash`) esta desatualizado -- conforme configuracao do projeto, deve ser `google/gemini-3-flash-preview`.

## Solucao

Duas mudancas em `supabase/functions/generate-parents-guide/index.ts`:

### 1. Atualizar modelo da IA (linha 96)
Trocar `google/gemini-2.5-flash` por `google/gemini-3-flash-preview` para evitar erros 500 observados com versoes anteriores.

### 2. Tornar o parsing de JSON mais robusto (linhas 131-138)
Adicionar limpeza do conteudo antes do `JSON.parse`:
- Remover blocos markdown (json e sem tipo)
- Remover caracteres de controle e trailing commas
- Adicionar `response_format: { type: "json_object" }` na chamada da API para forcar resposta em JSON puro
- Envolver o `JSON.parse` em try/catch com log do conteudo para facilitar debug futuro

### Detalhes tecnicos

```
Linha 96: model -> 'google/gemini-3-flash-preview'
Linha 95-101: adicionar response_format: { type: "json_object" }
Linhas 131-138: melhorar limpeza e parsing do JSON com:
  - Regex para remover markdown fences
  - Remover trailing commas antes de } e ]
  - Try/catch com log do conteudo bruto em caso de erro
```

