const fs = require('fs');
const taskFilePath = '/Users/nnitheesh/.gemini/antigravity-ide/brain/c7dea808-f667-4bfc-8502-fa7936535c75/task.md';
let taskContent = fs.readFileSync(taskFilePath, 'utf8');
taskContent = taskContent.replace('- `[ ]` Create an `InvoiceModal` component to display a formal, printable invoice featuring the Knite Infotech logo.', '- `[x]` Create an `InvoiceModal` component to display a formal, printable invoice featuring the Knite Infotech logo.');
taskContent = taskContent.replace('- `[ ]` Update `AdminClientWorkspace.jsx` to include "View Invoice" and "Email Client" (`mailto:`) buttons on invoice cards.', '- `[x]` Update `AdminClientWorkspace.jsx` to include "View Invoice" and "Email Client" (`mailto:`) buttons on invoice cards.');
taskContent = taskContent.replace('- `[ ]` Update `ClientPortal.jsx` to include a "View Invoice" button.', '- `[x]` Update `ClientPortal.jsx` to include a "View Invoice" button.');
taskContent = taskContent.replace('- `[ ]` Write Walkthrough documentation.', '- `[x]` Write Walkthrough documentation.');
fs.writeFileSync(taskFilePath, taskContent, 'utf8');
