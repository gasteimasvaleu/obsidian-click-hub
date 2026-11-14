# Contorno da logo mais discreto

- O contorno preto fica mais fino (0.5px) e semitransparente (cerca de 45%), quase como uma sombra fina.
- No pulinho, o contorno só chega a 0.75px, em vez de 1.5px.
- A animação continua igual.

## Detalhes técnicos
- Em `src/index.css`: em `.logo-pop`, `--logo-ol` vai para `hsl(0 0% 0% / 0.45)` e os drop-shadows para 0.5px; no keyframe de 90%, ficam em 0.75px.
