

# Corrigir Safe Area cinza no iOS (barra de status)

## Problema

A faixa cinza visivel entre os icones do sistema (hora, sinal, bateria) e o conteudo do app acontece por dois motivos:

1. **Falta `viewport-fit=cover`** no meta viewport -- sem isso, o iOS nao expande o conteudo ate as bordas da tela, deixando uma area padrao do sistema (cinza/branca).
2. **A navbar usa fundo semi-transparente** (`rgba(0,0,0,0.4)`) que, ao se estender na safe area, revela o que esta atras (criando o tom acinzentado).
3. **Nenhum padding de safe area** e aplicado -- a navbar nao respeita `env(safe-area-inset-top)`, entao o conteudo fica atras dos icones do sistema.

## Solucao (3 arquivos)

### 1. `index.html` -- Adicionar `viewport-fit=cover`

Alterar a meta tag viewport para:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
```

Isso permite que o conteudo se estenda atras da safe area e habilita o uso de `env(safe-area-inset-*)`.

### 2. `src/index.css` -- Adicionar padding de safe area no body e na navbar

- Adicionar ao `html` e `body`:
```css
html {
  background: #000000;
}
```

- Alterar a classe `.navbar-glass` para incluir padding-top na safe area com fundo solido:
```css
.navbar-glass {
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding-top: env(safe-area-inset-top, 0px);
}
```

O fundo passa de `0.4` para `0.85` de opacidade para que a area do status bar fique praticamente preta, sem aquele tom cinza.

### 3. `src/components/ui/tubelight-navbar.tsx` -- Safe area inferior

Adicionar margem inferior respeitando a safe area do bottom:
```css
padding-bottom: env(safe-area-inset-bottom, 0px);
```

Isso garante que a barra de navegacao inferior tambem nao fique atras do indicador home do iPhone.

## Resultado esperado

- A area do status bar fica preta solida, integrada visualmente ao app
- A navbar respeita o espaco da safe area sem sobrepor os icones do sistema
- A barra inferior tambem respeita a safe area do bottom
- A splash screen (screenshot 2) continua funcionando normalmente pois ja usa `bg-black` no `fixed inset-0`

