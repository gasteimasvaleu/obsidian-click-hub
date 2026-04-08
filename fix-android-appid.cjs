const fs = require("fs");
const path = require("path");

const CORRECT_PACKAGE = "com.bibliatoonkids.app";
const CORRECT_PACKAGE_DIR = "com/bibliatoonkids/app";
const CAPACITOR_PACKAGE = "com.bibliatoonkids.app";
const CAPACITOR_PACKAGE_DIR = "com/bibliatoonkids/app";

console.log("🔧 Corrigindo appId do Android após cap sync...");

// 1. Fix build.gradle
const buildGradlePath = path.join(__dirname, "android", "app", "build.gradle");
if (fs.existsSync(buildGradlePath)) {
  let content = fs.readFileSync(buildGradlePath, "utf8");
  content = content.replace(/namespace\s*=\s*"[^"]+"/g, `namespace = "${CORRECT_PACKAGE}"`);
  content = content.replace(/applicationId\s+"[^"]+"/g, `applicationId "${CORRECT_PACKAGE}"`);
  fs.writeFileSync(buildGradlePath, content);
  console.log("✅ build.gradle corrigido");
} else {
  console.warn("⚠️ build.gradle não encontrado");
}

// 2. Fix strings.xml
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
  fs.writeFileSync(stringsPath, content);
  console.log("✅ strings.xml corrigido");
} else {
  console.warn("⚠️ strings.xml não encontrado");
}

// 3. Fix AndroidManifest.xml — ensure activity name points to correct package
const manifestPath = path.join(__dirname, "android", "app", "src", "main", "AndroidManifest.xml");
if (fs.existsSync(manifestPath)) {
  let content = fs.readFileSync(manifestPath, "utf8");
  // Replace any fully qualified MainActivity reference or relative one
  content = content.replace(
    /android:name="[^"]*MainActivity"/g,
    `android:name=".MainActivity"`
  );
  fs.writeFileSync(manifestPath, content);
  console.log("✅ AndroidManifest.xml corrigido");
} else {
  console.warn("⚠️ AndroidManifest.xml não encontrado");
}

// 4. Ensure MainActivity.java exists in the correct package directory
const javaBase = path.join(__dirname, "android", "app", "src", "main", "java");
const wrongDir = path.join(javaBase, ...CAPACITOR_PACKAGE_DIR.split("/"));
const correctDir = path.join(javaBase, ...CORRECT_PACKAGE_DIR.split("/"));
const wrongFile = path.join(wrongDir, "MainActivity.java");
const correctFile = path.join(correctDir, "MainActivity.java");
const samePath = wrongFile === correctFile;
const mainActivityContent = `package ${CORRECT_PACKAGE};\n\nimport com.getcapacitor.BridgeActivity;\n\npublic class MainActivity extends BridgeActivity {}\n`;

if (fs.existsSync(correctFile)) {
  // File already in the right place — overwrite with canonical content
  fs.writeFileSync(correctFile, mainActivityContent);
  console.log("✅ MainActivity.java reescrito com conteúdo canônico");
} else if (!samePath && fs.existsSync(wrongFile)) {
  // File exists in old location — move it
  fs.mkdirSync(correctDir, { recursive: true });
  fs.writeFileSync(correctFile, mainActivityContent);
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
  } catch (e) { /* ignore cleanup errors */ }
  console.log("✅ MainActivity.java movido para o pacote correto");
} else {
  // File missing entirely — recreate it
  fs.mkdirSync(correctDir, { recursive: true });
  fs.writeFileSync(correctFile, mainActivityContent);
  console.log("✅ MainActivity.java recriado automaticamente");
}

// Final verification — fail loudly if MainActivity.java is still missing
if (!fs.existsSync(correctFile)) {
  console.error("❌ ERRO CRÍTICO: MainActivity.java NÃO existe após a correção!");
  console.error("   Caminho esperado:", correctFile);
  process.exit(1);
} else {
  const finalContent = fs.readFileSync(correctFile, "utf8");
  if (!finalContent.includes("BridgeActivity")) {
    console.error("❌ ERRO CRÍTICO: MainActivity.java existe mas está corrompido!");
    process.exit(1);
  }
  console.log("✅ Verificação final: MainActivity.java OK");
}

console.log("🎉 Correção do Android concluída!");
