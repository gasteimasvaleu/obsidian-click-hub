

## Renomear Audiofy para Bíbliafy

### Mudanças a Implementar

#### 1. Título da Página Audiofy

**Arquivo:** `src/pages/Audiofy.tsx`  
**Linha:** 127

**De:**
```tsx
Audiofy
```

**Para:**
```tsx
Bíbliafy
```

---

#### 2. Menu Inferior (Tubelight NavBar)

**Arquivo:** `src/App.tsx`  
**Linha:** 58

**De:**
```tsx
{ name: 'Audiofy', url: '/audiofy', icon: Music },
```

**Para:**
```tsx
{ name: 'Bíbliafy', url: '/audiofy', icon: Music },
```

### Resultado

- O título na página de músicas mudará de "Audiofy" para "Bíbliafy"
- O item no menu inferior também exibirá "Bíbliafy" ao invés de "Audiofy"
- A URL `/audiofy` permanece a mesma (apenas o nome visual muda)

