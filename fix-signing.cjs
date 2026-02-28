const fs = require("fs");
const path = require("path");

const projectPath = path.join(process.cwd(), "ios", "App", "App.xcodeproj", "project.pbxproj");

if (fs.existsSync(projectPath)) {
    console.log("🔧 Ajustando configurações do Xcode para assinatura...");
    let content = fs.readFileSync(projectPath, "utf8");

<<<<<<< Updated upstream
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
=======
    // 1. No nível do PROJETO (configs globais), bloquear signing para todos os targets
    // Isso afeta SPM packages e Pods que herdam do projeto
    
    // Remover CODE_SIGNING_ALLOWED = NO dos atributos do projeto (lugar errado)
    content = content.replace(/\s*CODE_SIGNING_ALLOWED = NO;\n/g, '\n');
    
    // 2. Identificar e modificar os blocos de buildSettings
    const buildSettingsRegex = /(isa = XCBuildConfiguration;\s*(?:baseConfigurationReference = [^;]+;\s*)?buildSettings = \{[^}]*\})/gs;

    content = content.replace(buildSettingsRegex, (match) => {
        const isAppTarget = match.includes('PRODUCT_BUNDLE_IDENTIFIER') || 
                           match.includes('ASSETCATALOG_COMPILER_APPICON_NAME');
        
        let modified = match;
>>>>>>> Stashed changes

        // Remove qualquer CODE_SIGNING_ALLOWED existente para reinjetar
        modifiedMatch = modifiedMatch.replace(/\s*CODE_SIGNING_ALLOWED = [^;]+;/g, '');

        if (isAppTarget) {
<<<<<<< Updated upstream
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
=======
            // App target: permitir signing, forçar Manual
            modified = modified.replace(/CODE_SIGN_STYLE = [^;]+;/g, 'CODE_SIGN_STYLE = Manual;');
            modified = modified.replace(/DEVELOPMENT_TEAM = [^;]*;/g, 'DEVELOPMENT_TEAM = CASJQDDA7L;');
            
            // Adicionar CODE_SIGNING_ALLOWED = YES se não existir
            if (!modified.includes('CODE_SIGNING_ALLOWED')) {
                modified = modified.replace('buildSettings = {', 'buildSettings = {\n\t\t\t\tCODE_SIGNING_ALLOWED = YES;');
            } else {
                modified = modified.replace(/CODE_SIGNING_ALLOWED = [^;]+;/g, 'CODE_SIGNING_ALLOWED = YES;');
            }
        } else {
            // Configs do projeto (globais) - bloquear signing
            // Adicionar CODE_SIGNING_ALLOWED = NO se não existir
            if (!modified.includes('CODE_SIGNING_ALLOWED')) {
                modified = modified.replace('buildSettings = {', 'buildSettings = {\n\t\t\t\tCODE_SIGNING_ALLOWED = NO;');
            } else {
                modified = modified.replace(/CODE_SIGNING_ALLOWED = [^;]+;/g, 'CODE_SIGNING_ALLOWED = NO;');
            }
>>>>>>> Stashed changes
        }

        return modified;
    });

    fs.writeFileSync(projectPath, content);
<<<<<<< Updated upstream
    console.log("✅ Sucesso: CODE_SIGNING_ALLOWED configurado (YES para App, NO para outros targets).");
=======
    console.log("✅ Sucesso: CODE_SIGNING_ALLOWED configurado (NO=projeto, YES=App target).");
>>>>>>> Stashed changes
} else {
    console.error("❌ Erro: Projeto não encontrado em " + projectPath);
    process.exit(1);
}

