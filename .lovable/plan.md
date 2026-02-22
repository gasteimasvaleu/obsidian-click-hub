

# Substituir placeholder do card "Acessar Cursos" pela imagem real

## Alteracao

No arquivo `src/pages/Index.tsx`, linha 70, substituir o div placeholder (retangulo gradiente com icone) pela tag `<img>` com a URL fornecida.

### De (linhas 68-72):
```tsx
<div className="absolute left-2 bottom-0 h-[130px] w-[72px] flex items-end">
  <div className={`w-full h-[90px] rounded-xl bg-gradient-to-br ${mainAction.gradient} flex items-center justify-center`}>
    <mainAction.icon size={36} className="text-white" />
  </div>
</div>
```

### Para:
```tsx
<img
  src="https://fnksvazibtekphseknob.supabase.co/storage/v1/object/public/criativos/botaocursos.png"
  alt="Acessar Cursos"
  className="absolute left-2 bottom-0 h-[130px] w-auto object-contain pointer-events-none"
/>
```

Isso remove o placeholder de icone com gradiente e coloca a imagem real no mesmo posicionamento (absolute, bottom-0, left-2), mantendo a altura de 130px com o efeito de "vazar" acima do card.

