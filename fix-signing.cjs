const fs = require('fs');
const path = require('path');

const projectPath = path.join(process.cwd(), 'ios', 'App', 'App.xcodeproj', 'project.pbxproj');

if (fs.existsSync(projectPath)) {
    let content = fs.readFileSync(projectPath, 'utf8');
    console.log('🔧 Forçando Team ID CASJQDDA7L em todos os targets...');

    // 1. Força a Team ID no projeto principal
    content = content.replace(/DEVELOPMENT_TEAM = "";/g, 'DEVELOPMENT_TEAM = "CASJQDDA7L";');
    content = content.replace(/DEVELOPMENT_TEAM = [A-Z0-9]{10};/g, 'DEVELOPMENT_TEAM = "CASJQDDA7L";');

    // 2. Mágica para pacotes SPM: Força o estilo de assinatura para automático e injeta a Team
    // Isso resolve o erro do RevenueCat_RevenueCat
    if (!content.includes('CODE_SIGN_STYLE = Automatic;')) {
        content = content.replace(/buildSettings = \{/g, 'buildSettings = {\n\t\t\t\tCODE_SIGN_STYLE = Automatic;');
    }

    fs.writeFileSync(projectPath, content);
    console.log('✅ Sucesso! O projeto foi "vacinado" contra erros de assinatura.');
} else {
    console.log('❌ Erro: Projeto não encontrado.');
    process.exit(1);
}
