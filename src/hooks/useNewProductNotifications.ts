import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useProducts } from './useProducts';

export const useNewProductNotifications = () => {
  const { data: products } = useProducts();
  const previousCountRef = useRef<number | null>(null);

  useEffect(() => {
    if (!products) return;

    const currentCount = products.length;

    // Skip first render
    if (previousCountRef.current === null) {
      previousCountRef.current = currentCount;
      return;
    }

    // Check if new products were added
    if (currentCount > previousCountRef.current) {
      const newProductsCount = currentCount - previousCountRef.current;
      
      toast.success(
        `🆕 New Product${newProductsCount > 1 ? 's' : ''} Added!`,
        {
          description: `${newProductsCount} new product${newProductsCount > 1 ? 's have' : ' has'} been added to the store.`,
          duration: 5000,
          action: {
            label: 'View Products',
            onClick: () => window.location.href = '/products',
          },
        }
      );
    }

    previousCountRef.current = currentCount;
  }, [products]);

  return { productCount: products?.length || 0 };
};
