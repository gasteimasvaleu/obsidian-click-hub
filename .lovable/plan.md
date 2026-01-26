
## Corrigir Erro de Upload no Bucket "criativos"

### Diagnóstico

O erro `new row violates row-level security policy` ocorre porque o bucket `criativos` **não tem políticas RLS para INSERT** (upload).

Ao verificar as políticas de storage:

| Bucket | Política de INSERT | Status |
|--------|-------------------|--------|
| plataforma | Admins can upload | OK |
| story-thumbnails | Admins can upload | OK |
| avatars | Users can upload own | OK |
| criativos | **NENHUMA** | ERRO |

---

### Solução

Criar 3 políticas RLS para o bucket `criativos`:

1. **SELECT** - Permitir que qualquer pessoa visualize os arquivos (público)
2. **INSERT** - Permitir que admins façam upload
3. **DELETE** - Permitir que admins deletem arquivos

---

### SQL Migration

```sql
-- 1. Política de leitura pública
CREATE POLICY "Anyone can view criativos files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'criativos');

-- 2. Política de upload para admins
CREATE POLICY "Admins can upload criativos files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'criativos' 
    AND has_role(auth.uid(), 'admin')
  );

-- 3. Política de deleção para admins
CREATE POLICY "Admins can delete criativos files"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'criativos' 
    AND has_role(auth.uid(), 'admin')
  );
```

---

### Alterações

| Tipo | Descrição |
|------|-----------|
| Database Migration | Adicionar 3 políticas RLS ao bucket `criativos` |

---

### Resultado Esperado

Após a migration:
- Admins conseguirão fazer upload de ebooks, audiobooks e vídeos
- Qualquer usuário poderá visualizar os arquivos
- Apenas admins poderão deletar arquivos
