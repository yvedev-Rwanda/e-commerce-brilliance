import { useQuery } from '@tanstack/react-query';
import { Product } from '@/types';
import { sampleProducts } from '@/data/sampleData';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';


const transformProduct = (p: any): Product => ({
  id: p._id,
  name: p.name,
  description: p.description || '',
  price: Number(p.price),
  originalPrice: p.original_price ? Number(p.original_price) : undefined,
  category: p.category || 'Other',
  brand: p.brand || 'Generic',
  images: p.image_url ? [p.image_url] : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'],
  rating: Number(p.rating) || 4.5,
  reviewCount: p.review_count || 0,
  stock: p.stock ?? 100,
  features: p.features || [],
  specifications: p.specifications || {},
  isNew: p.is_new || false,
  isFeatured: p.is_featured || false,
  createdAt: p.created_at,
});

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      try {
        const response = await fetch(`${API_URL}/products/`);
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        if (data && data.length > 0) return data.map(transformProduct);
        return sampleProducts;
      } catch (error) {
        console.error(error);
        return sampleProducts;
      }
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      try {
        const response = await fetch(`${API_URL}/products/${id}`);
        if (!response.ok) throw new Error('Product not found');
        const data = await response.json();
        if (data) return transformProduct(data);
      } catch (error) {
        console.error(error);
        const sample = sampleProducts.find(p => p.id === id);
        if (sample) return sample;
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5,
  });
};
