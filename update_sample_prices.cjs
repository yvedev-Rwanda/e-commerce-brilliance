const fs = require('fs');

let content = fs.readFileSync('src/data/sampleData.ts', 'utf8');

// Replace price
content = content.replace(/price:\s*(\d+)/g, (match, p1) => {
  let val = parseInt(p1, 10);
  if (val < 50000) {
    let newPrice = Math.round((val * 1350) / 1000) * 1000;
    if (newPrice === 0) newPrice = 1000;
    return `price: ${newPrice}`;
  }
  return match;
});

// Replace originalPrice
content = content.replace(/originalPrice:\s*(\d+)/g, (match, p1) => {
  let val = parseInt(p1, 10);
  if (val < 50000) {
    let newPrice = Math.round((val * 1350) / 1000) * 1000;
    if (newPrice === 0) newPrice = 1000;
    return `originalPrice: ${newPrice}`;
  }
  return match;
});

fs.writeFileSync('src/data/sampleData.ts', content, 'utf8');
console.log('Updated sampleData.ts prices to RWF!');
