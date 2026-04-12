import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_PUBLISHABLE_KEY);

async function testInsert() {
  const testProduct = {
    id: "00000000-0000-0000-0000-000000000017",
    name: "Test Xiaomi 14 Ultra",
    price: 899,
    description: "Leica professional photography.",
    features: ['Leica Summilux'],
    is_new: true,
    is_featured: true,
    stock: 38,
    brand: 'Xiaomi'
  };

  console.log('Inserting...');
  const { data, error } = await supabase.from('products').upsert(testProduct).select();
  if (error) {
    console.error('Error inserting product:', error.message);
  } else {
    console.log('Successfully inserted product:', data);
  }
}

testInsert();
