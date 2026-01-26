

## Atualizar URL do Vídeo na Página de Orações

### Resumo

Atualizar a URL do vídeo na página `/oracoes` para usar o novo caminho com a pasta `materials`.

---

### Alteração Necessária

| Arquivo | Linha | Alteração |
|---------|-------|-----------|
| `src/pages/Oracoes.tsx` | 124 | Atualizar URL do vídeo |

---

### Detalhes da Alteração

**Antes:**
```
https://fnksvazibtekphseknob.supabase.co/storage/v1/object/public/criativos/oracoes.mp4
```

**Depois:**
```
https://fnksvazibtekphseknob.supabase.co/storage/v1/object/public/criativos/materials/oracoes.mp4
```

---

### Resultado Esperado

O vídeo será carregado a partir do novo caminho no bucket `criativos/materials/`.

