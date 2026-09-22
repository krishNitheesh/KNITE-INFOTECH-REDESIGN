const fs = require('fs');
const taskFilePath = '/Users/nnitheesh/.gemini/antigravity-ide/brain/c7dea808-f667-4bfc-8502-fa7936535c75/task.md';
let taskContent = fs.readFileSync(taskFilePath, 'utf8');
taskContent = taskContent.replace('- `[ ]` Write Walkthrough documentation.', '- `[x]` Write Walkthrough documentation.');
fs.writeFileSync(taskFilePath, taskContent, 'utf8');
