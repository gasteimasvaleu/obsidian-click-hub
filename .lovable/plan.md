

## Problema
O `fix-android-appid.cjs` só corrige a linha `package` via regex quando o arquivo já existe. Se o conteúdo estiver corrompido (sem `;`, sem imports), o script não detecta e não corrige.

## Solução
Alterar a lógica do bloco `else if (fs.existsSync(correctFile))` no `fix-android-appid.cjs` para **sempre sobrescrever** o `MainActivity.java` com o conteúdo canônico correto, em vez de apenas fazer regex replace na linha do package.

## Arquivo alterado
- `fix-android-appid.cjs`

## Mudança específica
No trecho que trata o caso "arquivo já existe no caminho correto" (por volta da linha 80-90), substituir a lógica de regex replace por uma reescrita completa:

```javascript
} else if (fs.existsSync(correctFile)) {
  // Always overwrite with canonical content to fix any corruption
  const mainActivityContent = `package ${CORRECT_PACKAGE};\n\nimport com.getcapacitor.BridgeActivity;\n\npublic class MainActivity extends BridgeActivity {}\n`;
  fs.writeFileSync(correctFile, mainActivityContent);
  console.log("✅ MainActivity.java reescrito com conteúdo canônico");
}
```

## Resultado
Qualquer corrupção no arquivo (semicolons faltando, imports ausentes, etc.) será automaticamente corrigida ao rodar `npm run sync:android`.

