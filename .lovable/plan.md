

## Add "Mais" (More) hamburger menu to tubelight navbar

**Idea:** Replace the "Games" item in the bottom navbar with a "Mais" (More) button that opens a sheet/drawer listing all pages not in the main navbar — similar to the screenshot from your other app.

### Current navbar items (6)
1. Inicio (/)
2. Oracoes (/oracoes)
3. Bibliafy (/audiofy)
4. Cursos (/plataforma)
5. Guia para Pais (/guia-pais)
6. **Games (/games)** — will be replaced by "Mais"

### "Mais" menu items (pages NOT in navbar)
- Games (/games)
- Biblia Interativa (/biblia)
- Devocional Diario (/devocional)
- Colorir (/colorir)
- Amigo Divino (/amigodivino)
- Comunidade (/comunidade)
- Meu Perfil (/profile)
- Sobre (/sobre)
- Politica Familia (/politica-familia)
- Termos de Uso (/termos-de-uso)

### Changes

**1. `src/App.tsx`**
- Replace the Games nav item with `{ name: 'Mais', url: '#more', icon: Menu }` (or a special flag)
- Import `Menu` from lucide-react

**2. `src/components/ui/tubelight-navbar.tsx`**
- Detect when the "Mais" item is clicked (by url `#more` or a special prop)
- Instead of navigating, open a `Sheet` (bottom drawer) with the list of secondary pages
- Each item in the sheet: icon + label, clicking navigates and closes the sheet
- The sheet slides up from the bottom, styled consistently with the app's dark theme
- When sheet is open, the "Mais" icon changes to an X (close)

### Technical details
- Use the existing `Sheet` component from `src/components/ui/sheet.tsx` with `side="bottom"`
- The "Mais" button won't use `<Link>`, it will toggle sheet state via `onClick`
- NavBar interface updated: add optional `isMenu?: boolean` flag to NavItem
- Secondary menu items defined inline in tubelight-navbar or passed as a prop

