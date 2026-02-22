

# Fixar navbar no iOS durante scroll

## Problema
Em iPhones reais, ao fazer scroll para baixo, a navbar fixa "sobe" e fica atras da barra de status (bateria/hora). Ao voltar, ela desce para a posicao correta. Isso acontece em todas as paginas do app.

Esse e um bug conhecido do Safari no iOS: elementos com `position: fixed` podem "tremer" ou se deslocar durante o scroll elastico (rubber-band scrolling) do Safari.

## Solucao
Adicionar propriedades CSS que forcam a composicao por GPU na classe `.navbar-glass`, eliminando o jitter no iOS Safari.

## Detalhe tecnico

**Arquivo:** `src/index.css`, linhas 130-134

Adicionar duas propriedades a classe `.navbar-glass`:

```css
.navbar-glass {
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  -webkit-transform: translateZ(0);
  will-change: transform;
}
```

Essas propriedades forcam o Safari a tratar a navbar como uma camada separada de composicao, evitando que ela se desloque durante o scroll elastico. Afeta todas as paginas que usam a navbar.

