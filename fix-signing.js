const fs = require('fs');
const path = require('path');
const projectPath = path.join(__dirname, 'ios', 'App', 'App.xcodeproj', 'project.pbxproj');
if (fs.existsSync(projectPath)) {
    let content = fs.readFileSync(projectPath, 'utf8');
    content = content.replace(/DEVELOPMENT_TEAM = "";/g, 'DEVELOPMENT_TEAM = "CASJQDDA7L";');
    content = content.replace(/DEVELOPMENT_TEAM = [A-Z0-9]{10};/g, 'DEVELOPMENT_TEAM = "CASJQDDA7L";');
    fs.writeFileSync(projectPath, content);
    console.log('✅ Development Team forçada para CASJQDDA7L');
} else {
    console.log('⚠️ Arquivo de projeto não encontrado em: ' + projectPath);
}
