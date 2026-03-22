

## Reduzir altura vertical da navbar inferior

### Mudança

**Arquivo:** `src/components/ui/tubelight-navbar.tsx` (linha 110)

- Reduzir o padding inferior do container interno que fica entre os botões e a safe area
- Classe atual: `pt-2 pb-2`
- Classe nova: `pt-2 pb-0`

Isso remove o espaço extra entre o glass container e a faixa preta da safe area, deixando a navbar mais compacta como no outro app. A safe area continua funcionando normalmente via `pb-[env(safe-area-inset-bottom)]` no container pai.

