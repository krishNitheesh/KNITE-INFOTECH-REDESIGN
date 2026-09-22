with open('ClientPortal_Fixed_v2.jsx', 'r') as f:
    content = f.read()

# Replace the last `</div>` before `{/* Footer */}` with `</main>`
content = content.replace("</div>\n\n      {/* Footer */}", "</main>\n\n      {/* Footer */}")

with open('ClientPortal_Fixed_v3.jsx', 'w') as f:
    f.write(content)
