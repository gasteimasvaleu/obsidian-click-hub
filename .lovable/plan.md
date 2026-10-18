# Paywall: mostrar o preço em reais (R$ 29,90)

## O que muda
- O card do paywall vai mostrar **R$ 29,90/mês** em vez de $4.99.
- Se a loja informar o preço já em reais (conta brasileira), usamos o valor da loja. Se vier em outra moeda (dólar etc.), mostramos o valor fixo R$ 29,90/mês.

## Aviso importante
O $4.99 aparece porque a conta Apple/Google desse celular está registrada fora do Brasil (ou é conta de teste/sandbox). Quem tem conta brasileira normalmente já vê o preço em reais. A cobrança é sempre feita pela loja na moeda da conta: uma conta dos EUA continua pagando $4.99, mesmo com o texto em reais. Confira se o preço Brasil está em R$ 29,90 no App Store Connect e no Play Console.

## Detalhes técnicos
- `src/components/Paywall.tsx`: ler `product.currencyCode`; se for `BRL`, usar `priceString`; senão usar `'R$ 29,90'`. O valor inicial (antes de carregar) também passa a ser `R$ 29,90/mês` em vez de "Mensal".
- Chega aos celulares via live update.
