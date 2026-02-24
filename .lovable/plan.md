

# Pagina de Download do App + Redirecionamento pos-cadastro

## Objetivo
Criar a pagina `/download` com links para App Store, Google Play, instrucoes PWA, e alterar o redirecionamento pos-cadastro de `/login` para `/download`.

## 1. Nova pagina: `src/pages/Download.tsx`

Secoes da pagina:

- **Hero** - Titulo "Baixe o App" com subtitulo convidativo
- **Secao App Nativo** - Dois cards (App Store e Google Play) com badges oficiais e QR codes placeholder (links como "#" ate aprovacao nas lojas)
- **Secao PWA** - Instrucoes passo a passo:
  - iPhone: Safari > Compartilhar > Adicionar a Tela de Inicio
  - Android: Chrome > Menu > Instalar aplicativo
- **Botao "Ir para Login"** no final da pagina para o usuario acessar sua conta

Estilo: fundo preto, GlassCard, animacoes framer-motion, FuturisticNavbar no topo. Sem NavBar tubelight no rodape.

## 2. Alteracao em `src/pages/Cadastro.tsx`

Alterar o redirecionamento apos sucesso de `/login` para `/download`:

```
// Antes
setTimeout(() => navigate('/login'), 3000);

// Depois
setTimeout(() => navigate('/download'), 3000);
```

## 3. Alteracao em `src/App.tsx`

- Importar o componente Download
- Adicionar rota publica `/download` (sem ProtectedRoute)
- Adicionar logica para esconder o NavBar tubelight na rota `/download`

## Arquivos afetados

1. `src/pages/Download.tsx` - Novo arquivo
2. `src/pages/Cadastro.tsx` - Mudar redirecionamento para `/download`
3. `src/App.tsx` - Nova rota publica + esconder NavBar tubelight

