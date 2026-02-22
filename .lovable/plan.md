

# Redesign dos Cards da Home com Placeholders

## Resumo

Implementar o novo layout dos cards na pagina principal com imagens placeholder temporarias. O card "Acessar Cursos" ocupa uma linha inteira, os outros 10 cards ficam em grid de 2 colunas. Todos com estilo horizontal compacto.

## Alteracoes

### 1. Index.tsx

**Dados dos cards:**
- Remover imports de icones do Lucide (Package, Book, Heart, HandHeart, Music, Palette, Users, Gamepad2, MessagesSquare, UserCircle)
- Adicionar campo `image` em cada action com URL placeholder (usar icone com fundo gradiente como fallback visual ate as imagens reais chegarem)
- Unificar `specialActions` e `navigationActions` em uma unica lista `gridActions`

**Card principal (Acessar Cursos) - full-width:**
```tsx
<GlassCard
  hoverable pressable
  onClick={mainAction.action}
  className="relative h-[100px] pl-[80px] pr-4 flex items-center overflow-visible cursor-pointer"
>
  <div className="absolute left-2 bottom-0 h-[130px] w-[72px] flex items-end">
    <div className={`w-full h-[90px] rounded-xl bg-gradient-to-br ${mainAction.gradient} flex items-center justify-center`}>
      <mainAction.icon size={36} className="text-white" />
    </div>
  </div>
  <span className="text-white font-bold text-base">{mainAction.title}</span>
</GlassCard>
```

O placeholder sera um retangulo arredondado com gradiente e o icone original dentro, simulando onde a imagem ficara. Quando as imagens reais chegarem, basta trocar esse div por um `<img>`.

**Cards do grid (10 cards) - 2 por linha:**
```tsx
<div className="grid grid-cols-2 gap-x-4 gap-y-6">
  {gridActions.map((action, index) => (
    <GlassCard
      key={index}
      hoverable pressable
      onClick={action.action}
      className="relative h-[90px] pl-[65px] pr-3 flex items-center overflow-visible cursor-pointer"
    >
      <div className="absolute left-1 bottom-0 h-[110px] w-[58px] flex items-end">
        <div className={`w-full h-[80px] rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center`}>
          <action.icon size={28} className="text-white" />
        </div>
      </div>
      <span className="text-white font-semibold text-sm leading-tight">
        {action.title}
      </span>
    </GlassCard>
  ))}
</div>
```

**Layout geral:**
- Manter o video/logo no topo
- Remover a separacao em 3 grupos (mainAction, specialActions, navigationActions)
- Usar `space-y-6` entre o card principal e o grid para acomodar overflow
- O gap vertical do grid sera `gap-y-6` (maior que o horizontal `gap-x-4`) para dar espaco ao overflow da imagem

### 2. Nenhuma alteracao em GlassCard.tsx

O componente ja suporta todas as classes necessarias via `className`.

### 3. Nenhuma alteracao em index.css

Nao ha necessidade de novas classes CSS.

## Resultado esperado

- Card "Acessar Cursos" full-width com placeholder de icone no lado esquerdo
- 10 cards em grid de 2 colunas, cada um com placeholder de icone vazando levemente acima
- Texto `text-sm` (14px) ao lado direito do placeholder
- Quando as imagens reais forem fornecidas, basta trocar os divs de placeholder por tags `<img>`

