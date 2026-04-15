const fs = require("fs");
const path = require("path");

const CORRECT_PACKAGE = "com.bibliatoonkids.app";
const CORRECT_PACKAGE_DIR = "com/bibliatoonkids/app";
const CAPACITOR_PACKAGE = "com.bibliatoonkids.app";
const CAPACITOR_PACKAGE_DIR = "com/bibliatoonkids/app";

const writeIfChanged = (filePath, nextContent, successMessage, unchangedMessage) => {
  const currentContent = fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : null;

  if (currentContent === nextContent) {
    console.log(unchangedMessage);
    return false;
  }

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, nextContent);
  console.log(successMessage);
  return true;
};

const getCanonicalDuplicateName = (fileName) => {
  const duplicatePatterns = [
    /(.+?) copy(?: \d+)?(\.[^.]+)$/i,
    /(.+?) - copy(?: \d+)?(\.[^.]+)$/i,
    /(.+?) cópia(?: \d+)?(\.[^.]+)$/i,
    /(.+?) \((?:copy|\d+)\)(\.[^.]+)$/i,
    /(.+?) \d+(\.[^.]+)$/i,
  ];

  for (const pattern of duplicatePatterns) {
    if (pattern.test(fileName)) {
      return fileName.replace(pattern, "$1$2");
    }
  }

  return null;
};

const cleanupDuplicateFiles = (targetDir, { recursive = false, label = targetDir } = {}) => {
  if (!fs.existsSync(targetDir)) {
    console.log(`ℹ️ ${label}: diretório não encontrado, limpeza ignorada`);
    return;
  }

  let removedCount = 0;
  const skippedDirs = new Set([".git", ".gradle", "build", "DerivedData"]);

  const visit = (currentDir) => {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        if (recursive && !skippedDirs.has(entry.name)) {
          visit(fullPath);
        }
        continue;
      }

      const canonicalName = getCanonicalDuplicateName(entry.name);
      if (!canonicalName) continue;

      const canonicalPath = path.join(currentDir, canonicalName);
      if (!fs.existsSync(canonicalPath)) continue;

      fs.unlinkSync(fullPath);
      removedCount += 1;
      console.log(`🧹 Removido duplicado local: ${path.relative(__dirname, fullPath)}`);
    }
  };

  visit(targetDir);

  if (removedCount === 0) {
    console.log(`ℹ️ ${label}: nenhum duplicado local encontrado`);
    return;
  }

  console.log(`✅ ${label}: ${removedCount} duplicado(s) local(is) removido(s)`);
};

console.log("🔧 Corrigindo appId do Android após cap sync...");

cleanupDuplicateFiles(path.join(__dirname, "android", "app", "src", "main", "res", "xml"), {
  label: "Android res/xml",
});
cleanupDuplicateFiles(path.join(__dirname, "ios", "App", "App"), {
  recursive: true,
  label: "iOS App/App",
});

// 1. Fix strings.xml
const stringsPath = path.join(__dirname, "android", "app", "src", "main", "res", "values", "strings.xml");
if (fs.existsSync(stringsPath)) {
  let content = fs.readFileSync(stringsPath, "utf8");
  content = content.replace(
    /<string name="package_name">[^<]+<\/string>/,
    `<string name="package_name">${CORRECT_PACKAGE}</string>`
  );
  content = content.replace(
    /<string name="custom_url_scheme">[^<]+<\/string>/,
    `<string name="custom_url_scheme">${CORRECT_PACKAGE}</string>`
  );
  writeIfChanged(stringsPath, content, "✅ strings.xml corrigido", "ℹ️ strings.xml já estava correto");
} else {
  console.warn("⚠️ strings.xml não encontrado");
}

// 2. Fix AndroidManifest.xml — ensure package and fully-qualified activity name
const manifestPath = path.join(__dirname, "android", "app", "src", "main", "AndroidManifest.xml");
if (fs.existsSync(manifestPath)) {
  let content = fs.readFileSync(manifestPath, "utf8");

  if (content.includes('package="')) {
    content = content.replace(/package="[^"]+"/g, `package="${CORRECT_PACKAGE}"`);
  } else {
    content = content.replace(
      /<manifest\s+xmlns:android="http:\/\/schemas\.android\.com\/apk\/res\/android"/,
      `<manifest xmlns:android="http://schemas.android.com/apk/res/android"\n    package="${CORRECT_PACKAGE}"`
    );
  }

  content = content.replace(
    /android:name="[^"]*MainActivity"/g,
    `android:name="${CORRECT_PACKAGE}.MainActivity"`
  );

  writeIfChanged(
    manifestPath,
    content,
    "✅ AndroidManifest.xml corrigido (package + MainActivity FQN)",
    "ℹ️ AndroidManifest.xml já estava correto"
  );
} else {
  console.warn("⚠️ AndroidManifest.xml não encontrado");
}

// 3. Ensure MainActivity.java exists in the correct package directory
const javaBase = path.join(__dirname, "android", "app", "src", "main", "java");
const wrongDir = path.join(javaBase, ...CAPACITOR_PACKAGE_DIR.split("/"));
const correctDir = path.join(javaBase, ...CORRECT_PACKAGE_DIR.split("/"));
const wrongFile = path.join(wrongDir, "MainActivity.java");
const correctFile = path.join(correctDir, "MainActivity.java");
const samePath = wrongFile === correctFile;
const mainActivityContent = `package ${CORRECT_PACKAGE};

import android.content.Intent;
import android.util.Log;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginHandle;
import ee.forgr.capacitor.social.login.GoogleProvider;
import ee.forgr.capacitor.social.login.SocialLoginPlugin;
import ee.forgr.capacitor.social.login.ModifiedMainActivityForSocialLoginPlugin;

public class MainActivity extends BridgeActivity implements ModifiedMainActivityForSocialLoginPlugin {
    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode >= GoogleProvider.REQUEST_AUTHORIZE_GOOGLE_MIN && requestCode < GoogleProvider.REQUEST_AUTHORIZE_GOOGLE_MAX) {
            PluginHandle pluginHandle = getBridge().getPlugin("SocialLogin");
            if (pluginHandle == null) {
                Log.i("Google Activity Result", "SocialLogin login handle is null");
                return;
            }
            Plugin plugin = pluginHandle.getInstance();
            if (!(plugin instanceof SocialLoginPlugin)) {
                return;
            }
            ((SocialLoginPlugin) plugin).handleGoogleLoginIntent(requestCode, data);
        }
    }

    @Override
    public void IHaveModifiedTheMainActivityForTheUseWithSocialLoginPlugin() {}
}
`;

if (fs.existsSync(correctFile)) {
  writeIfChanged(
    correctFile,
    mainActivityContent,
    "✅ MainActivity.java corrigido com conteúdo canônico",
    "ℹ️ MainActivity.java já estava correto"
  );
} else if (!samePath && fs.existsSync(wrongFile)) {
  writeIfChanged(
    correctFile,
    mainActivityContent,
    "✅ MainActivity.java movido para o pacote correto",
    "ℹ️ MainActivity.java já existia no pacote correto"
  );
  fs.unlinkSync(wrongFile);

  try {
    let dir = wrongDir;
    while (dir !== javaBase) {
      const files = fs.readdirSync(dir);
      if (files.length === 0) {
        fs.rmdirSync(dir);
        dir = path.dirname(dir);
      } else {
        break;
      }
    }
  } catch (e) {}
} else {
  writeIfChanged(correctFile, mainActivityContent, "✅ MainActivity.java recriado automaticamente", "ℹ️ MainActivity.java já estava correto");
}

if (!fs.existsSync(correctFile)) {
  console.error("❌ ERRO CRÍTICO: MainActivity.java NÃO existe após a correção!");
  console.error("   Caminho esperado:", correctFile);
  process.exit(1);
}

const finalContent = fs.readFileSync(correctFile, "utf8");
if (!finalContent.includes("BridgeActivity")) {
  console.error("❌ ERRO CRÍTICO: MainActivity.java existe mas está corrompido!");
  process.exit(1);
}
console.log("✅ Verificação final: MainActivity.java OK");

// 4. Ensure capacitor.settings.gradle includes capgo-capacitor-social-login
const settingsGradlePath = path.join(__dirname, "android", "capacitor.settings.gradle");
if (fs.existsSync(settingsGradlePath)) {
  let content = fs.readFileSync(settingsGradlePath, "utf8");
  if (!content.includes("capgo-capacitor-social-login")) {
    content += `\ninclude ':capgo-capacitor-social-login'\nproject(':capgo-capacitor-social-login').projectDir = new File('../node_modules/@capgo/capacitor-social-login/android')\n`;
    writeIfChanged(
      settingsGradlePath,
      content,
      "✅ capacitor.settings.gradle: capgo-capacitor-social-login adicionado",
      "ℹ️ capacitor.settings.gradle já estava correto"
    );
  } else {
    console.log("ℹ️ capacitor.settings.gradle: capgo-capacitor-social-login já presente");
  }
} else {
  console.warn("⚠️ capacitor.settings.gradle não encontrado");
}

// 5. Ensure capacitor.build.gradle includes capgo-capacitor-social-login dependency
const capBuildGradlePath = path.join(__dirname, "android", "app", "capacitor.build.gradle");
if (fs.existsSync(capBuildGradlePath)) {
  let content = fs.readFileSync(capBuildGradlePath, "utf8");
  if (!content.includes("capgo-capacitor-social-login")) {
    content = content.replace(
      /implementation project\(':revenuecat-purchases-capacitor'\)/,
      `implementation project(':revenuecat-purchases-capacitor')\n    implementation project(':capgo-capacitor-social-login')`
    );
    writeIfChanged(
      capBuildGradlePath,
      content,
      "✅ capacitor.build.gradle: capgo-capacitor-social-login adicionado",
      "ℹ️ capacitor.build.gradle já estava correto"
    );
  } else {
    console.log("ℹ️ capacitor.build.gradle: capgo-capacitor-social-login já presente");
  }
} else {
  console.warn("⚠️ capacitor.build.gradle não encontrado");
}

console.log("🎉 Correção do Android concluída!");
