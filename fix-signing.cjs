const fs = require('fs');
const path = require('path');

const projectPath = path.join(process.cwd(), 'ios', 'App', 'App.xcodeproj', 'project.pbxproj');

if (fs.existsSync(projectPath)) {
    console.log('🚀 Iniciando correção de assinatura GLOBAL para MANUAL...');
    let content = fs.readFileSync(projectPath, 'utf8');
    
    // 1. Força o estilo de assinatura para MANUAL em todos os lugares
    content = content.replace(/CODE_SIGN_STYLE = Automatic;/g, 'CODE_SIGN_STYLE = Manual;');
    content = content.replace(/ProvisioningStyle = Automatic;/g, 'ProvisioningStyle = Manual;');
    
    // 2. Garante que o Team ID correto seja aplicado
    content = content.replace(/DEVELOPMENT_TEAM = [^;]+;/g, 'DEVELOPMENT_TEAM = CASJQDDA7L;');
    
    fs.writeFileSync(projectPath, content);
    console.log('✅ SUCESSO: Tudo configurado para Assinatura MANUAL e Team CASJQDDA7L.');
} else {
    console.error('❌ Erro: Projeto não encontrado em ' + projectPath);
    process.exit(1);
}
