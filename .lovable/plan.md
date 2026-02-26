

# Botoes de Assinatura na Pagina de Login

## Resumo

Adicionar dois botoes visuais (Apple e Google Play) na pagina de login, abaixo do botao "Entrar", com o texto "Assinar com:" acima deles. Os botoes serao placeholders visuais por enquanto (sem acao ao clicar), para demonstrar a intencao de oferecer assinatura nativa via App Store e Google Play.

## Layout

```text
[Campo Email]
[Campo Senha]
[Botao "Entrar"]

Assinar com:
[Botao App Store]  [Botao Google Play]
```

## Detalhes

- Texto "Assinar com:" centralizado, em cor neutra
- Dois botoes lado a lado com icones das respectivas lojas (Apple e Play Store) usando icones do Lucide ou SVG inline
- Estilo visual: botoes com variant `outline` ou estilo escuro padrao das badges de loja
- Ao clicar: nenhuma acao por enquanto (podem exibir um toast "Em breve" ou simplesmente nao fazer nada)

## Arquivo modificado

| Arquivo | Alteracao |
|---------|-----------|
| `src/pages/Login.tsx` | Adicionar texto "Assinar com:" e dois botoes (App Store / Google Play) abaixo do botao Entrar |

