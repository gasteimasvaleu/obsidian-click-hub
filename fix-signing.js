const fs = require('fs');
const path = require('path');

const projectPath = path.join(process.cwd(), 'ios', 'App', 'App.xcodeproj', 'project.pbxproj');

if (fs.existsSync(projectPath)) {
    let content = fs.readFileSync(projectPath, 'utf8');
    console.log('🔧 Aplicando correção de Signing para a Team: CASJQDDA7L...');
    content = content.replace(/DEVELOPMENT_TEAM = "";/g, 'DEVELOPMENT_TEAM = "CASJQDDA7L";');
    content = content.replace(/DEVELOPMENT_TEAM = [A-Z0-9]{10};/g, 'DEVELOPMENT_TEAM = "CASJQDDA7L";');
    fs.writeFileSync(projectPath, content);
    console.log('✅ Sucesso! Todas as dependências agora usam a Team CASJQDDA7L.');
} else {
    console.log('❌ Erro: Arquivo de projeto não encontrado em ' + projectPath);
    process.exit(1);
}
