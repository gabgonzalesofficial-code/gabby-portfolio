const fs = require('fs');
const content = fs.readFileSync('_case_content.b64', 'utf8');
const decoded = Buffer.from(content.trim(), 'base64').toString('utf8');
fs.writeFileSync('src/components/ProjectCaseStudy.jsx', decoded);
console.log('Written', decoded.length, 'chars');
