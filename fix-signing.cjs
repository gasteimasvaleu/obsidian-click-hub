const fs = require("fs");
const path = require("path");

const projectPath = path.join(process.cwd(), "ios", "App", "App.xcodeproj", "project.pbxproj");

if (fs.existsSync(projectPath)) {
    let content = fs.readFileSync(projectPath, "utf8");
    
    console.log("🔧 Ajustando configurações do Xcode para assinatura...");

    // Regex para encontrar todos os blocos de buildSettings
    const buildSettingsRegex = /(isa = XCBuildConfiguration;\s+buildSettings = {[^}]*?};)/g;

    content = content.replace(buildSettingsRegex, (match) => {
        // Verifica se é o target principal 'App'
        const isAppTarget = match.includes("PRODUCT_NAME = \"App\"") || match.includes("PRODUCT_BUNDLE_IDENTIFIER = \"com.bibliatoonkids.app\"");

        let modifiedMatch = match;

        // Sempre garante ALWAYS_EMBED_SWIFT_STANDARD_LIBRARIES = "$(inherited)"
        modifiedMatch = modifiedMatch.replace(/ALWAYS_EMBED_SWIFT_STANDARD_LIBRARIES = [^;]+;/g, 'ALWAYS_EMBED_SWIFT_STANDARD_LIBRARIES = "$(inherited)";');
        // Sempre garante ENABLE_BITCODE = NO
        modifiedMatch = modifiedMatch.replace(/ENABLE_BITCODE = [^;]+;/g, 'ENABLE_BITCODE = NO;');

        if (isAppTarget) {
            // Para o target 'App', define assinatura manual e o team ID
            modifiedMatch = modifiedMatch.replace(/CODE_SIGN_STYLE = [^;]+;/g, 'CODE_SIGN_STYLE = Manual;');
            modifiedMatch = modifiedMatch.replace(/DEVELOPMENT_TEAM = [^;]+;/g, 'DEVELOPMENT_TEAM = CASJQDDA7L;');
            // Garante que o PROVISIONING_PROFILE_SPECIFIER esteja presente para o App target
            if (!modifiedMatch.includes('PROVISIONING_PROFILE_SPECIFIER')) {
                modifiedMatch = modifiedMatch.replace(/buildSettings = {/, 'buildSettings = {\n\t\t\t\tPROVISIONING_PROFILE_SPECIFIER = "BibliaToonKIDS_AppStore_Final";');
            }
        } else {
            // Para outros targets (pods), remove configurações de assinatura
            modifiedMatch = modifiedMatch.replace(/CODE_SIGN_STYLE = [^;]+;/g, '');
            modifiedMatch = modifiedMatch.replace(/DEVELOPMENT_TEAM = [^;]+;/g, '');
            modifiedMatch = modifiedMatch.replace(/PROVISIONING_PROFILE_SPECIFIER = [^;]+;/g, '');
            modifiedMatch = modifiedMatch.replace(/PROVISIONING_PROFILE = [^;]+;/g, '');
        }
        return modifiedMatch;
    });

    fs.writeFileSync(projectPath, content);
    console.log("✅ Sucesso: Configurações do Xcode ajustadas.");
} else {
    console.error("❌ Erro: Projeto não encontrado.");
    process.exit(1);
}
