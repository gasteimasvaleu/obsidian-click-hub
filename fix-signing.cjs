const fs = require("fs");
const path = require("path");

const projectPath = path.join(process.cwd(), "ios", "App", "App.xcodeproj", "project.pbxproj");

if (fs.existsSync(projectPath)) {
    console.log("🔧 Ajustando assinatura do App target (modo seguro - preserva CocoaPods)...");
    let content = fs.readFileSync(projectPath, "utf8");

    // SOMENTE blocos que pertencem ao App target (contêm PRODUCT_BUNDLE_IDENTIFIER ou APPICON).
    // NÃO tocamos em baseConfigurationReference, build phases, nem blocos de Pods/SPM.
    const buildSettingsRegex = /(buildSettings = \{[^}]*\})/gs;

    content = content.replace(buildSettingsRegex, (match) => {
        const isAppTarget = match.includes("PRODUCT_BUNDLE_IDENTIFIER") || match.includes("ASSETCATALOG_COMPILER_APPICON_NAME");
        if (!isAppTarget) return match; // não toca em ninguém mais

        let modified = match;
        // Garante assinatura manual + team correto. NÃO mexe em CODE_SIGNING_ALLOWED, identity, profile.
        if (/CODE_SIGN_STYLE = [^;]+;/.test(modified)) {
            modified = modified.replace(/CODE_SIGN_STYLE = [^;]+;/g, "CODE_SIGN_STYLE = Manual;");
        }
        if (/DEVELOPMENT_TEAM = [^;]*;/.test(modified)) {
            modified = modified.replace(/DEVELOPMENT_TEAM = [^;]*;/g, "DEVELOPMENT_TEAM = CASJQDDA7L;");
        }
        return modified;
    });

    fs.writeFileSync(projectPath, content);
    console.log("✅ Signing OK. CocoaPods/SPM intactos (baseConfigurationReference preservado).");
} else {
    console.error("❌ Erro: Projeto não encontrado em " + projectPath);
    process.exit(1);
}
