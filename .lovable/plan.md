# Login com a Apple: nenhuma mudança necessária

O "Apple: disabled" no Terminal é esperado e não desliga o login com a Apple.

- Esse aviso vem de uma ferramenta de login usada só para o Google (e outros).
- O login com a Apple do iPhone usa um componente próprio, feito sob medida para o app, que fica fora dessa ferramenta. Por isso ela mostra "disabled".
- Se a Apple fosse ligada nela, haveria dois sistemas de login da Apple ao mesmo tempo, o que pode causar conflito.

## O que fazer
Nada. Pode seguir com o Archive no Xcode normalmente.

## Detalhe técnico
`capacitor.config.ts` tem `SocialLogin.providers.apple: false` de propósito; o Apple Sign-In roda pelo `NativeAppleSignInPlugin` (ios/App/App/NativeAppleSignInPlugin.swift + src/lib/native-apple-signin.ts).
