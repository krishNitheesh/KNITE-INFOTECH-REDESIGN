const fs = require('fs');
const filePath = '/Users/nnitheesh/Documents/KNITE INFOTECH/knite website/src/pages/AdminClientWorkspace.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Remove useState for newInvPayUrl
content = content.replace("const [newInvPayUrl, setNewInvPayUrl] = useState('');", "");

// 2. Remove payUrl from invoice object and set reset
content = content.replace("payUrl: newInvPayUrl || ''", "payUrl: ''");
content = content.replace("setNewInvPayUrl('');", "");

// 3. Remove the entire div containing the payment URL input
const inputDivRegex = /<div>\s*<label className="block text-\[10px\] font-bold text-slate-400 uppercase mb-1\.5">Payment checkout URL \(Optional\)<\/label>[\s\S]*?<\/div>/;
content = content.replace(inputDivRegex, "");

fs.writeFileSync(filePath, content, 'utf8');

const taskFilePath = '/Users/nnitheesh/.gemini/antigravity-ide/brain/c7dea808-f667-4bfc-8502-fa7936535c75/task.md';
let taskContent = fs.readFileSync(taskFilePath, 'utf8');
taskContent = taskContent.replace('- `[ ]` Remove Payment URL fields from invoice creation in `AdminClientWorkspace.jsx`.', '- `[x]` Remove Payment URL fields from invoice creation in `AdminClientWorkspace.jsx`.');
fs.writeFileSync(taskFilePath, taskContent, 'utf8');

console.log("Admin Workspace updated");
