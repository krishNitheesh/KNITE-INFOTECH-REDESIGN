const fs = require('fs');
const taskFilePath = '/Users/nnitheesh/.gemini/antigravity-ide/brain/c7dea808-f667-4bfc-8502-fa7936535c75/task.md';
let taskContent = fs.readFileSync(taskFilePath, 'utf8');
taskContent = taskContent.replace('- `[ ]` Remove Firebase Functions imports from frontend.', '- `[x]` Remove Firebase Functions imports from frontend.');
taskContent = taskContent.replace('- `[ ]` Revert `handleRazorpayCheckout` in `ClientPortal.jsx`.', '- `[x]` Revert `handleRazorpayCheckout` in `ClientPortal.jsx`.');
taskContent = taskContent.replace('- `[ ]` Delete `functions` directory to clean up.', '- `[x]` Delete `functions` directory to clean up.');
taskContent = taskContent.replace('- `[ ]` Write Walkthrough documentation.', '- `[x]` Write Walkthrough documentation.');
fs.writeFileSync(taskFilePath, taskContent, 'utf8');
