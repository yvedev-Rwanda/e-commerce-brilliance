const fs = require('fs');
const path = require('path');

const walk = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) results = results.concat(walk(file));
    else if (file.endsWith('.tsx') || file.endsWith('.ts')) results.push(file);
  });
  return results;
}

const files = walk('./src');
let changedFiles = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let modified = content
    .replace(/\$\{([^}]+)\.toFixed\([0-9]\)\}/g, 'RWF ${$1.toLocaleString()}')
    .replace(/>\$([^<]+)</g, '>RWF $1<')
    .replace(/>\$\{([^}]+)\}</g, '>RWF ${$1.toLocaleString()}<')
    .replace(/'\$'/g, "'RWF '")
    .replace(/"\$"/g, '"RWF "')
    .replace(/`\$`/g, "`RWF `")
    .replace(/subtotal > 100 \? 0 : 9\.99/g, "subtotal > 100000 ? 0 : 5000");

  // Custom logic for Dashboard where $ is mixed in template strings
  modified = modified.replace(/\$([\d.]+)/g, 'RWF $1');
  modified = modified.replace(/\$\$\{/g, 'RWF ${');

  // Some leftovers like `$${something}` might become `RWF ${something}`
  if (content !== modified) {
    fs.writeFileSync(file, modified, 'utf8');
    console.log('Modified', file);
    changedFiles++;
  }
});

console.log(`Updated ${changedFiles} files.`);
