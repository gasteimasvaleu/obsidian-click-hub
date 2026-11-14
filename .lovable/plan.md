# Comandos para gerar as versões com o ícone novo

## Resposta
O primeiro comando (`npx @capacitor/assets generate`) não é mais necessário. Os ícones e a tela de abertura nativa já estão prontos no projeto, em todos os tamanhos.

Se você rodar esse comando mesmo assim, não estraga nada: ele usa as imagens novas que já deixei prontas. Mas ele refaz o ícone do Android sem a folga que deixei, e o livro pode ficar cortado nos celulares com ícone redondo. Por isso, é melhor pular.

## Rode no seu computador, nesta ordem
1. Baixe o projeto atualizado.
2. `npm install` (só se aparecer alguma dependência faltando)
3. `npm run build`
4. `npx cap sync`
5. Rode os scripts de correção do Android que você já usa depois do sync.
6. Gere as versões no Xcode e no Android Studio e envie às lojas.

## Mudanças no projeto
Nenhuma.
