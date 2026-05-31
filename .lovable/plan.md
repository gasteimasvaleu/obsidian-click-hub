
## Corrigir erro em /colorir/transformar

### Diagnóstico
- O cliente envia foto para a edge function `photo-transform` e espera receber `{ success: true, transformedImageUrl }`.
- Os logs do servidor mostram que a função processa com sucesso (usando Runware) e retorna a imagem.
- Porém, a versão deployada da função é **antiga** e retorna outro formato (sem o campo `success`), enquanto o código atual em `supabase/functions/photo-transform/index.ts` já usa Lovable AI Gateway (Gemini) e o formato correto.
- O cliente, ao não encontrar `data.success`, lança "Erro na transformação".

### Causa raiz
A função no projeto está fora de sincronia com a função efetivamente deployada no Supabase.

### Solução
Reescrever `supabase/functions/photo-transform/index.ts` com o conteúdo já correto (Gemini via Lovable AI Gateway, upload para `photo-transforms/transformed/`, retorno `{ success: true, transformedImageUrl }`), forçando o redeploy automático.

A função final terá:
- CORS habilitado.
- Validação de `imageUrl` e `fileName`.
- Chamada ao Lovable AI Gateway (`google/gemini-2.5-flash-image-preview`) com prompt para página de colorir.
- Tratamento de 429 (rate limit) e 402 (créditos) com mensagens em português.
- Conversão do base64 retornado, upload no bucket `photo-transforms` e retorno da URL pública no campo `transformedImageUrl`.

### Sem mudanças no frontend
O cliente em `PhotoUploader.tsx` já está correto — não será alterado.

### Risco
Baixo. A função volta a usar o fluxo Gemini já presente no repositório; o redeploy acontece automaticamente.
