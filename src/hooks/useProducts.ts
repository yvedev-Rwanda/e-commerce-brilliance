import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';
import { sampleProducts } from '@/data/sampleData';
import type { Tables } from '@/integrations/supabase/types';

type DbProduct = Tables<'products'>;

const transformProduct = (p: DbProduct): Product => ({
  id: p.id,
  name: p.name,
  description: p.description || '',
  price: Number(p.price),
  originalPrice: p.original_price ? Number(p.original_price) : undefined,
  category: p.brand || 'Other',
  brand: p.brand || 'Generic',
  images: p.images?.length ? p.images : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'],
  rating: Number(p.rating) || 4.5,
  reviewCount: p.review_count || 0,
  stock: p.stock ?? 100,
  features: p.features || [],
  specifications: (p.specifications as Record<string, string>) || {},
  isNew: p.is_new || false,
  isFeatured: p.is_featured || false,
  createdAt: p.created_at,
});

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (data && data.length > 0) return data.map(transformProduct);
      // Fallback to sample data if DB is empty
      return sampleProducts;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
      if (data) return transformProduct(data);
      // Fallback to sample data
      const sample = sampleProducts.find(p => p.id === id);
      if (sample) return sample;
      throw error || new Error('Product not found');
    },
    staleTime: 1000 * 60 * 5,
  });
};
