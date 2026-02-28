const fs = require('fs');
const path = require('path');

// Caminho para o arquivo de configuração do Xcode
const projectPath = path.join(__dirname, 'ios', 'App', 'App.xcodeproj', 'project.pbxproj');

if (fs.existsSync(projectPath)) {
    console.log('🔍 Iniciando correção de assinatura no projeto Xcode...');
    let content = fs.readFileSync(projectPath, 'utf8');
    
    // 1. Força o estilo de assinatura para Manual em todos os targets
    const updatedContent = content
        .replace(/CODE_SIGN_STYLE = Automatic;/g, 'CODE_SIGN_STYLE = Manual;')
        .replace(/ProvisioningStyle = Automatic;/g, 'ProvisioningStyle = Manual;')
        // 2. Garante que o Team ID correto seja aplicado globalmente
        .replace(/DEVELOPMENT_TEAM = [^;]+;/g, 'DEVELOPMENT_TEAM = CASJQDDA7L;');
    
    if (content !== updatedContent) {
        fs.writeFileSync(projectPath, updatedContent);
        console.log('✅ Sucesso: Assinatura automática removida e Team ID (CASJQDDA7L) aplicado.');
    } else {
        console.log('ℹ️ O projeto já parece estar configurado para assinatura manual.');
    }
} else {
    console.error('❌ Erro: Arquivo ios/App/App.xcodeproj/project.pbxproj não encontrado. Verifique se você está na raiz do projeto.');
}
