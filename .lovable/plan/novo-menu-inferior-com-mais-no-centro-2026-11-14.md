# Novo menu inferior com "Mais" no centro

O menu de baixo passa a seguir o modelo enviado: barra simples de ponta a ponta, ícones com nome embaixo e um botão redondo destacado no centro.

## Como fica
```text
 Início   Cursos   ( + Mais )   Bíblia   Guia Pais
```
- **Centro:** botão "Mais" redondo, violeta, levemente acima da barra, com sombra suave. Ao tocar, abre o painel de atalhos como hoje.
- **Colorir** sai da barra e entra no painel "Mais" (junto com Amigo Divino, Devocional, Orações etc.).
- Item da página atual fica destacado na cor violeta; os outros em cinza.
- Sem a "lâmpada" animada antiga; a barra continua respeitando a área segura de baixo do iPhone.
- Nas telas internas (tema escuro), o mesmo formato, com as cores escuras atuais.

## Detalhes técnicos
- `src/App.tsx`: `navItems` fica Início, Cursos, Mais (isMenu), Bíblia, Guia Pais; remover Colorir.
- `src/components/ui/tubelight-navbar.tsx`: grid de 5 colunas sem a caixa "glass"; item `isMenu` renderizado como círculo `h-12 w-12 -mt-6 rounded-full bg-primary text-primary-foreground ring-4 ring-background shadow-lg`; adicionar Colorir (`/colorir`, ícone Palette) à lista do painel Mais; cores via tokens (sem `text-white`).
