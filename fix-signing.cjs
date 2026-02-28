const fs = require("fs");
const path = require("path");

const projectPath = path.join(process.cwd(), "ios", "App", "App.xcodeproj", "project.pbxproj");

if (fs.existsSync(projectPath)) {
    let content = fs.readFileSync(projectPath, "utf8");
    
    console.log("🔧 Ajustando configurações do Xcode para assinatura...");

    // 1. Remover CODE_SIGNING_ALLOWED do bloco attributes (lugar errado)
    content = content.replace(/(\battributes\s*=\s*\{[^}]*?)CODE_SIGNING_ALLOWED\s*=\s*[^;]+;\s*/g, '$1');

    // 2. Regex para encontrar todos os blocos de buildSettings
    const buildSettingsRegex = /(isa = XCBuildConfiguration;\s+buildSettings = {[^}]*?};)/g;

    content = content.replace(buildSettingsRegex, (match) => {
        const isAppTarget = match.includes("PRODUCT_BUNDLE_IDENTIFIER") || match.includes("ASSETCATALOG_COMPILER_APPICON_NAME");

        let modifiedMatch = match;

        // Sempre garante ALWAYS_EMBED_SWIFT_STANDARD_LIBRARIES = "$(inherited)"
        modifiedMatch = modifiedMatch.replace(/ALWAYS_EMBED_SWIFT_STANDARD_LIBRARIES = [^;]+;/g, 'ALWAYS_EMBED_SWIFT_STANDARD_LIBRARIES = "$(inherited)";');
        // Sempre garante ENABLE_BITCODE = NO
        modifiedMatch = modifiedMatch.replace(/ENABLE_BITCODE = [^;]+;/g, 'ENABLE_BITCODE = NO;');

        // Remove qualquer CODE_SIGNING_ALLOWED existente para reinjetar
        modifiedMatch = modifiedMatch.replace(/\s*CODE_SIGNING_ALLOWED = [^;]+;/g, '');

        if (isAppTarget) {
            // App target: assinatura manual + CODE_SIGNING_ALLOWED = YES
            modifiedMatch = modifiedMatch.replace(/CODE_SIGN_STYLE = [^;]+;/g, 'CODE_SIGN_STYLE = Manual;');
            modifiedMatch = modifiedMatch.replace(/DEVELOPMENT_TEAM = [^;]+;/g, 'DEVELOPMENT_TEAM = CASJQDDA7L;');
            // Injeta CODE_SIGNING_ALLOWED = YES
            modifiedMatch = modifiedMatch.replace(/buildSettings = {/, 'buildSettings = {\n\t\t\t\tCODE_SIGNING_ALLOWED = YES;');
            // Garante PROVISIONING_PROFILE_SPECIFIER
            if (!modifiedMatch.includes('PROVISIONING_PROFILE_SPECIFIER')) {
                modifiedMatch = modifiedMatch.replace(/buildSettings = {/, 'buildSettings = {\n\t\t\t\tPROVISIONING_PROFILE_SPECIFIER = "BibliaToonKIDS_AppStore_Final";');
            }
        } else {
            // Outros targets (projeto global, pods, SPM): CODE_SIGNING_ALLOWED = NO
            modifiedMatch = modifiedMatch.replace(/buildSettings = {/, 'buildSettings = {\n\t\t\t\tCODE_SIGNING_ALLOWED = NO;');
            // Remove configurações de assinatura de pods/SPM
            modifiedMatch = modifiedMatch.replace(/CODE_SIGN_STYLE = [^;]+;/g, '');
            modifiedMatch = modifiedMatch.replace(/PROVISIONING_PROFILE_SPECIFIER = [^;]+;/g, '');
            modifiedMatch = modifiedMatch.replace(/PROVISIONING_PROFILE = [^;]+;/g, '');
        }
        return modifiedMatch;
    });

    fs.writeFileSync(projectPath, content);
    console.log("✅ Sucesso: CODE_SIGNING_ALLOWED configurado (YES para App, NO para outros targets).");
} else {
    console.error("❌ Erro: Projeto não encontrado.");
    process.exit(1);
}
