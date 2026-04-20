

## Diagnóstico: faixa preta extra abaixo do tubelight no iOS após fechar teclado

### Causa raiz

No iOS (WKWebView/Capacitor), quando o teclado abre num `<input>`/`<textarea>`:
1. O sistema "promove" `env(safe-area-inset-bottom)` para acomodar a barra de previsões e o teclado.
2. Ao fechar o teclado, o WKWebView **frequentemente não reseta** esse valor de imediato — o body (e qualquer `padding-bottom: env(safe-area-inset-bottom)`) permanece inflado por 1+ frame, criando a "faixa preta" abaixo do tubelight navbar.

A situação está agravada porque o padding inferior está sendo aplicado em **dois lugares** ao mesmo tempo:

- `src/index.css` linha 100: `body { padding-bottom: env(safe-area-inset-bottom); }`
- `src/components/ui/tubelight-navbar.tsx` linha 109: `<div className="... pb-[env(safe-area-inset-bottom)]">`

Isso já produz padding duplo. Quando o iOS infla o valor após o teclado, o efeito visual fica muito perceptível (a "nova safe-area" descrita pelo usuário).

Há também um padrão menor: `src/pages/GuiaPais.tsx` envolve o conteúdo com `overflow-x-hidden` e o input não tem nenhum guard contra reset de scroll após o blur — mesmo padrão que o memo `mem://style/ios-keyboard-viewport-reset` já corrige no Amigo Divino.

---

## Correções

### 1. Remover padding-bottom duplicado do `body` (`src/index.css`)

O navbar tubelight já cuida do safe-area inferior. Manter no body cria padding duplicado e é exatamente o que infla quando o teclado abre.

```diff
   body {
     @apply bg-background text-foreground min-h-screen;
     background: #000000;
     padding-top: env(safe-area-inset-top);
     padding-left: env(safe-area-inset-left);
     padding-right: env(safe-area-inset-right);
-    padding-bottom: env(safe-area-inset-bottom);
   }
```

O `pb-24` já presente nas páginas + `pb-[env(safe-area-inset-bottom)]` do navbar continuam protegendo o conteúdo de ficar atrás do navbar.

### 2. Reset de viewport ao fechar teclado em `GuiaPais.tsx`

Aplicar o mesmo padrão do memo `ios-keyboard-viewport-reset`: forçar `window.scrollTo(0, 0)` em todo `blur` de input/textarea da página. Adicionar um `useEffect` global ao componente:

```tsx
useEffect(() => {
  const handleBlur = (e: FocusEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      // iOS WKWebView: force viewport reset after keyboard dismiss
      setTimeout(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }, 50);
    }
  };
  document.addEventListener('focusout', handleBlur);
  return () => document.removeEventListener('focusout', handleBlur);
}, []);
```

### 3. Garantir `font-size: 16px` no `Input` para evitar zoom adicional do iOS

O `Input` (`src/components/ui/input.tsx`) tem `text-base` (16px) por padrão e `md:text-sm` apenas em desktop — já está correto. Nenhuma mudança necessária aqui.

### 4. (Opcional, defensivo) Forçar `touch-action: manipulation` no body

Reduz comportamentos de zoom/scroll inesperados do WebKit ao focar inputs. Pode ser adicionado ao `index.css` se a correção 1+2 não bastar — não aplicar agora, apenas como plano B caso o problema persista após o teste no aparelho.

---

## Arquivos modificados

1. `src/index.css` — remover `padding-bottom: env(safe-area-inset-bottom)` do `body`
2. `src/pages/GuiaPais.tsx` — adicionar `useEffect` de reset de viewport no blur

## O que NÃO muda

- Navbar tubelight (mantém `pb-[env(safe-area-inset-bottom)]`)
- Outras páginas (a mudança no `body` é global e benéfica para todas)
- iOS native config, Capacitor, Supabase

## Pós-correção (local no Mac)

```bash
git pull
npm run sync:ios       # ou npm run build && npx cap sync ios
```

Abrir Xcode → build → testar em aparelho real:
1. Ir em `/guia-pais`
2. Tocar no input "Digite o nome ou apelido"
3. Fechar teclado (tap fora ou botão "Concluído")
4. Verificar que a faixa preta extra **não persiste** abaixo do navbar tubelight

Repetir o teste nos textareas dos passos 7, 8 e 9.

## Risco

Baixo. A remoção do `padding-bottom` do body é compensada pelo `pb-24` das páginas + `pb-[env(safe-area-inset-bottom)]` do navbar. Se algum conteúdo solto (sem navbar) precisar do safe-area, podemos adicionar pontualmente — mas todas as rotas usam `FuturisticNavbar` (topo) + `NavBar` tubelight (base), que já cobrem.

