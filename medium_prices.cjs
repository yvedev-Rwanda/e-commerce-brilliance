const fs = require('fs');

let content = fs.readFileSync('src/data/sampleData.ts', 'utf8');

// The logic reduces the price size by dividing by 4 or 4.5.
// For example, 1,600,000 / 4 = 400,000. It brings it to a very moderate scale.
content = content.replace(/price:\s*(\d+)/g, (match, p1) => {
  let val = parseInt(p1, 10);
  if (val > 1000) {
    let newPrice = Math.round(val / 4.5 / 1000) * 1000;
    if (newPrice < 5000) newPrice = 5000;
    return `price: ${newPrice}`;
  }
  return match;
});

// Replace originalPrice
content = content.replace(/originalPrice:\s*(\d+)/g, (match, p1) => {
  let val = parseInt(p1, 10);
  if (val > 1000) {
    let newPrice = Math.round(val / 4.5 / 1000) * 1000;
    if (newPrice < 5000) newPrice = 5000;
    return `originalPrice: ${newPrice}`;
  }
  return match;
});

fs.writeFileSync('src/data/sampleData.ts', content, 'utf8');
console.log('Updated sampleData.ts prices to medium scale in RWF!');

// Also update Supabase database
const { createClient } = require('@supabase/supabase-js');
const envConfig = fs.readFileSync('.env', 'utf8').split('\n').reduce((acc, line) => {
  const match = line.split('=');
  if (match.length > 1) {
    acc[match[0]] = match.slice(1).join('=').trim().replace(/^"|"$/g, '');
  }
  return acc;
}, {});

const supabaseUrl = envConfig.VITE_SUPABASE_URL || envConfig.SUPABASE_URL;
const supabaseKey = envConfig.VITE_SUPABASE_PUBLISHABLE_KEY || envConfig.SUPABASE_PUBLISHABLE_KEY;
if (supabaseUrl && supabaseKey) {
  const supabase = createClient(supabaseUrl, supabaseKey);
  async function updatePrices() {
    const { data: products, error } = await supabase.from('products').select('*');
    if (error) {
      console.error('Error fetching products:', error);
      return;
    }
    console.log('Found ' + products.length + ' products in Supabase. Updating...');
    for (const product of products) {
      if (product.price > 1000) {
        let newPrice = Math.round(product.price / 4.5 / 1000) * 1000;
        if (newPrice < 5000) newPrice = 5000;
        
        let newOriginalPrice = product.original_price;
        if (newOriginalPrice) {
          newOriginalPrice = Math.round(newOriginalPrice / 4.5 / 1000) * 1000;
        }
        
        const { error: updateError } = await supabase.from('products').update({ price: newPrice, original_price: newOriginalPrice }).eq('id', product.id);
        if (updateError) console.error('Failed to update product ' + product.name + ':', updateError);
        else console.log('Updated ' + product.name + ': ' + product.price + ' -> ' + newPrice);
      }
    }
    console.log('Finished updating Supabase products.');
  }
  updatePrices();
}
