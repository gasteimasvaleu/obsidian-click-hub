
## Simplificar a Página de Download

### O que muda

A página `/download` será reestruturada para ficar mais simples e objetiva:

1. **Remover** toda a seção "App Nativo" (cards da App Store e Google Play com QR codes "em breve")

2. **Adicionar mensagem de agradecimento** no topo com um botao "Ir para Login"

3. **Manter a seção PWA** com as instrucoes de instalacao pelo navegador, mas com um titulo contextualizado tipo: "Comprou pela Hotmart? Siga as instrucoes abaixo para instalar o app"

### Estrutura final da pagina

```text
+--------------------------------------+
|          Obrigado! / Sucesso         |
|   Sua conta foi criada com sucesso   |
|        [ Ir para o Login ]           |
+--------------------------------------+
|                                      |
|  Comprou pela Hotmart?               |
|  Siga as instrucoes abaixo           |
|  para instalar o app:                |
|                                      |
|  [iOS PWA]        [Android PWA]      |
|  (instrucoes)     (instrucoes)       |
+--------------------------------------+
```

### Detalhes tecnicos

- Arquivo modificado: `src/pages/Download.tsx`
- Remover a section "App Nativo" (linhas ~40-93)
- Atualizar o hero com mensagem de agradecimento e botao de login
- Alterar o titulo da secao PWA para mencionar Hotmart
- Remover o CTA duplicado do final (ja estara no topo)
