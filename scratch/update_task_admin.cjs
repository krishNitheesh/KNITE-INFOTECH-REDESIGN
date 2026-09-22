const fs = require('fs');
const taskFilePath = '/Users/nnitheesh/.gemini/antigravity-ide/brain/c7dea808-f667-4bfc-8502-fa7936535c75/task.md';
let taskContent = fs.readFileSync(taskFilePath, 'utf8');
taskContent = taskContent.replace('- `[ ]` Update Walkthrough documentation.', '- `[x]` Update Walkthrough documentation.');
fs.writeFileSync(taskFilePath, taskContent, 'utf8');
