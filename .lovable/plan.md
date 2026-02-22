

# Trocar texto da Navbar por logo

Substituir o texto "BibliaToonKIDS" no componente `FuturisticNavbar` pela imagem do logo.

## Alteracao

**Arquivo:** `src/components/FuturisticNavbar.tsx` (linha 19)

Trocar:
```tsx
<h1 className="text-primary font-bold text-lg hover:animate-glow transition-all duration-300">
  BíbliaToonKIDS
</h1>
```

Por:
```tsx
<Link to="/">
  <img 
    src="https://fnksvazibtekphseknob.supabase.co/storage/v1/object/public/criativos/logonavbar.png"
    alt="BíbliaToonKIDS"
    className="h-8 w-auto hover:animate-glow transition-all duration-300"
  />
</Link>
```

- Altura fixada em `h-8` (32px) para caber na navbar
- Largura automatica (`w-auto`) para manter proporcao
- Logo clicavel, levando para a pagina inicial (`/`)
- Mantido o efeito hover de glow
- Nao requer novo build nativo, Appflow Live Updates resolve

