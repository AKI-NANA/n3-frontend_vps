const fs = require('fs');
const path = require('path');

const input = fs.readFileSync('./governance/AI_OUTPUT.txt', 'utf8');
const fileRegex = /===FILE_START===path: ([\s\S]*?)\n([\s\S]*?)===FILE_END===/g;

let match;
while ((match = fileRegex.exec(input)) !== null) {
    const filePath = match[1].trim();
    const content = match[2].trim();
    const fullPath = path.resolve('./', filePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content);
    console.log(`💾 Applied: ${filePath}`);
}
