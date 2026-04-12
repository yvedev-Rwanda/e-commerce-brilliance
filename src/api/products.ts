// FastAPI Backend Integration
// Base URL for your Python FastAPI backend
const API_BASE_URL = 'http://127.0.0.1:8000';

export interface ApiProduct {
  id: string | number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category?: string;
  brand?: string;
  images: string[];
  rating?: number;
  reviewCount?: number;
  stock?: number;
  features?: string[];
  specifications?: Record<string, string>;
  isNew?: boolean;
  isFeatured?: boolean;
  createdAt?: string;
}

// Fetch all products from backend
export const fetchProducts = async (): Promise<ApiProduct[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Fetch single product by ID
export const fetchProductById = async (id: string): Promise<ApiProduct> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

// Search products
export const searchProducts = async (query: string): Promise<ApiProduct[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Failed to search products');
    }
    return await response.json();
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};

// Get product count for polling new products
export const getProductCount = async (): Promise<number> => {
  try {
    const products = await fetchProducts();
    return products.length;
  } catch (error) {
    console.error('Error getting product count:', error);
    return 0;
  }
};
