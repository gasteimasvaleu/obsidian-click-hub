const fs = require("fs");
const path = require("path");

const CORRECT_PACKAGE = "br.com.caio.bibliatoonkids";
const CORRECT_PACKAGE_DIR = "br/com/caio/bibliatoonkids";
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

// 4. Move MainActivity.java to correct package directory
const javaBase = path.join(__dirname, "android", "app", "src", "main", "java");
const wrongDir = path.join(javaBase, ...CAPACITOR_PACKAGE_DIR.split("/"));
const correctDir = path.join(javaBase, ...CORRECT_PACKAGE_DIR.split("/"));
const wrongFile = path.join(wrongDir, "MainActivity.java");
const correctFile = path.join(correctDir, "MainActivity.java");

if (fs.existsSync(wrongFile)) {
  // Ensure correct directory exists
  fs.mkdirSync(correctDir, { recursive: true });

  // Read, fix package declaration, write to correct location
  let content = fs.readFileSync(wrongFile, "utf8");
  content = content.replace(/^package\s+[^;]+;/m, `package ${CORRECT_PACKAGE};`);
  fs.writeFileSync(correctFile, content);

  // Remove wrong file and clean up empty dirs
  fs.unlinkSync(wrongFile);
  try {
    // Remove empty directories up the chain
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
} else if (fs.existsSync(correctFile)) {
  // Already in correct location, just fix package declaration
  let content = fs.readFileSync(correctFile, "utf8");
  const fixed = content.replace(/^package\s+[^;]+;/m, `package ${CORRECT_PACKAGE};`);
  if (fixed !== content) {
    fs.writeFileSync(correctFile, fixed);
    console.log("✅ MainActivity.java package corrigido");
  } else {
    console.log("✅ MainActivity.java já está correto");
  }
} else {
  console.warn("⚠️ MainActivity.java não encontrado em nenhum local esperado");
}

console.log("🎉 Correção do Android concluída!");
