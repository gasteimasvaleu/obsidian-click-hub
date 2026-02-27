const fs = require('fs');
const path = require('path');

const projectPath = path.join(process.cwd(), 'ios', 'App', 'App.xcodeproj', 'project.pbxproj');

if (fs.existsSync(projectPath)) {
    let content = fs.readFileSync(projectPath, 'utf8');
    console.log('🔧 Injetando Team ID CASJQDDA7L no nível de PROJETO (Project-level)...');

    // Esta regex encontra as seções de buildSettings do PROJETO (não dos targets)
    // e garante que DEVELOPMENT_TEAM e CODE_SIGN_STYLE estejam lá.
    
    const teamId = 'CASJQDDA7L';
    
    // Função para injetar as configurações se não existirem
    const injectSettings = (section) => {
        if (!section.includes('DEVELOPMENT_TEAM')) {
            section = section.replace('buildSettings = {', 'buildSettings = {\n\t\t\t\tDEVELOPMENT_TEAM = ' + teamId + ';\n\t\t\t\tCODE_SIGN_STYLE = Automatic;');
        } else {
            // Se já existe, garante que o valor está correto
            section = section.replace(/DEVELOPMENT_TEAM = [^;]+;/g, 'DEVELOPMENT_TEAM = ' + teamId + ';');
            section = section.replace(/CODE_SIGN_STYLE = [^;]+;/g, 'CODE_SIGN_STYLE = Automatic;');
        }
        return section;
    };

    // Aplica a injeção em todas as seções de buildSettings do arquivo
    content = content.replace(/buildSettings = \{[^}]+\}/g, (match) => injectSettings(match));

    fs.writeFileSync(projectPath, content);
    console.log('✅ Sucesso! O RevenueCat agora herdará a Team ID do projeto.');
} else {
    console.log('❌ Erro: Projeto não encontrado.');
    process.exit(1);
}
