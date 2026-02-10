const { execSync } = require('child_process');
const fs = require('fs');

function generateSnapshot() {
    let gitStatus = "";
    try {
        gitStatus = execSync('git status -s').toString();
    } catch (e) { gitStatus = "No git repo"; }

    const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    const protocol = fs.readFileSync('./lib/contracts/protocol.ts', 'utf8');

    const snapshot = `
# SYSTEM SNAPSHOT (${new Date().toLocaleString()})
## Environment: Node ${process.version} / Next.js ${pkg.dependencies.next}
## Current Contracts (protocol.ts):
\`\`\`typescript
${protocol}
\`\`\`
## Git Modified:
${gitStatus || 'None'}
`;
    fs.writeFileSync('./governance/PROJECT_STATE.md', snapshot);
    console.log('✅ PROJECT_STATE.md generated.');
}
generateSnapshot();
