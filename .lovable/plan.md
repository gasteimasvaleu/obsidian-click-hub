

## Plano: Corrigir build Android sem afetar iOS

### Problema
O build Android falha em `mergeDexRelease` com 4 erros — classes duplicadas vindas do `amazon-appstore-sdk` que é dependência transitiva do RevenueCat.

### Abordagem
Editar **apenas** o arquivo `android/app/build.gradle` para:

1. Adicionar `multiDexEnabled true` no `defaultConfig`
2. Adicionar `packagingOptions` para excluir META-INF duplicados
3. Sobrescrever a dependência do RevenueCat (que vem do `capacitor.build.gradle` gerado) com uma versão que exclui o Amazon SDK

### Mudanças

**Arquivo: `android/app/build.gradle`** (único arquivo alterado)

```groovy
defaultConfig {
    ...
    multiDexEnabled true   // ← adicionar
}

// Adicionar bloco packaging:
packaging {
    resources {
        excludes += ['META-INF/DEPENDENCIES', 'META-INF/LICENSE', 'META-INF/LICENSE.txt', 'META-INF/NOTICE', 'META-INF/NOTICE.txt']
    }
}
```

E no bloco `dependencies`, adicionar a exclusão do Amazon SDK **antes** do `apply from: 'capacitor.build.gradle'` para que a configuração do módulo RevenueCat exclua o Amazon SDK:

```groovy
configurations.all {
    exclude group: 'com.amazon.device', module: 'amazon-appstore-sdk'
}
```

### O que NÃO será alterado
- Nenhum arquivo iOS
- Nenhum arquivo em `src/` (código TypeScript)
- O `capacitor.build.gradle` e `capacitor.settings.gradle` continuam intactos (são gerados pelo `cap sync`)
- O RevenueCat continua instalado e funcionando no iOS normalmente

### Após a mudança
Rodar novamente: `Build > Generate Signed Bundle (AAB)` no Android Studio.

