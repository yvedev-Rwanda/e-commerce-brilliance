const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envConfig = fs.readFileSync('.env', 'utf8').split('\n').reduce((acc, line) => {
  const match = line.split('=');
  if (match.length > 1) {
    acc[match[0]] = match.slice(1).join('=').trim().replace(/^"|"$/g, '');
  }
  return acc;
}, {});

const supabaseUrl = envConfig.VITE_SUPABASE_URL || envConfig.SUPABASE_URL;
const supabaseKey = envConfig.VITE_SUPABASE_PUBLISHABLE_KEY || envConfig.SUPABASE_PUBLISHABLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function updatePrices() {
  const { data: products, error } = await supabase.from('products').select('*');
  if (error) {
    console.error('Error fetching products:', error);
    return;
  }
  console.log('Found ' + products.length + ' products to update.');
  for (const product of products) {
    if (product.price < 50000) {
      let newPrice = Math.round((product.price * 1350) / 1000) * 1000;
      if (newPrice === 0 && product.price > 0) newPrice = 1000;
      let newOriginalPrice = product.original_price;
      if (newOriginalPrice) {
        newOriginalPrice = Math.round((newOriginalPrice * 1350) / 1000) * 1000;
      }
      const { error: updateError } = await supabase.from('products').update({ price: newPrice, original_price: newOriginalPrice }).eq('id', product.id);
      if (updateError) console.error('Failed to update product ' + product.name + ':', updateError);
      else console.log('Updated ' + product.name + ': ' + product.price + ' -> ' + newPrice);
    } else {
      console.log('Skipped ' + product.name + ' (Price already seems high enough: ' + product.price + ')');
    }
  }
}
updatePrices();
