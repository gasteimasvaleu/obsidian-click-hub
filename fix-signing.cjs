const fs = require("fs");
const path = require("path");

const projectPath = path.join(process.cwd(), "ios", "App", "App.xcodeproj", "project.pbxproj");

if (fs.existsSync(projectPath)) {
    console.log("🔧 Ajustando configurações do Xcode para assinatura...");
    let content = fs.readFileSync(projectPath, "utf8");

    // Regex para encontrar todos os blocos de buildSettings
    const buildSettingsRegex = /(isa = XCBuildConfiguration;\s*(?:baseConfigurationReference = [^;]+;\s*)?buildSettings = \{[^}]*\})/gs;

    content = content.replace(buildSettingsRegex, (match) => {
        const isAppTarget = match.includes("PRODUCT_BUNDLE_IDENTIFIER") || match.includes("ASSETCATALOG_COMPILER_APPICON_NAME");

        let modified = match;

        // Remove qualquer CODE_SIGNING_ALLOWED existente para reinjetar
        modified = modified.replace(/\s*CODE_SIGNING_ALLOWED = [^;]+;/g, "");

        if (isAppTarget) {
            // App target: assinatura manual + CODE_SIGNING_ALLOWED = YES
            modified = modified.replace(/CODE_SIGN_STYLE = [^;]+;/g, "CODE_SIGN_STYLE = Manual;");
            modified = modified.replace(/DEVELOPMENT_TEAM = [^;]*;/g, "DEVELOPMENT_TEAM = CASJQDDA7L;");
            modified = modified.replace("buildSettings = {", "buildSettings = {\n\t\t\t\tCODE_SIGNING_ALLOWED = YES;");
        } else {
            // Outros targets (projeto global, pods, SPM): CODE_SIGNING_ALLOWED = NO
            modified = modified.replace("buildSettings = {", "buildSettings = {\n\t\t\t\tCODE_SIGNING_ALLOWED = NO;");
        }

        return modified;
    });

    fs.writeFileSync(projectPath, content);
    console.log("✅ Sucesso: CODE_SIGNING_ALLOWED configurado (YES=App target, NO=outros).");
} else {
    console.error("❌ Erro: Projeto não encontrado em " + projectPath);
    process.exit(1);
}
