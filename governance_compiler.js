const fs = require('fs');

function compile() {
    const task = fs.readFileSync('./governance/TASK.md', 'utf8');
    const state = fs.readFileSync('./governance/PROJECT_STATE.md', 'utf8');
    const law = fs.readFileSync('./governance/MASTER_LAW.md', 'utf8');

    const output = `
${law}
---
${state}
---
# MISSION
${task}
---
## OUTPUT RULE
修正後のファイルを必ず以下の形式で出力せよ。
===FILE_START===path: [パス]
[コード]
===FILE_END===
UIの構造は絶対に変更せず、ロジックの要塞化のみを行え。
`;
    fs.writeFileSync('./governance/CLAUDE_INPUT.md', output);
    console.log('🚀 CLAUDE_INPUT.md created for Claude API.');
}
compile();
