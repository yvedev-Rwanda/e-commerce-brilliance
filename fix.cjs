const fs = require('fs');
const filePath = 'src/data/sampleData.ts';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/id: '(\d+)'/g, (match, p1) => {
    const padded = p1.padStart(12, '0');
    return `id: '00000000-0000-0000-0000-${padded}'`;
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed IDs');
