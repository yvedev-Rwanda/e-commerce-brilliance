import { useState, useCallback } from 'react';
import { Product } from '@/types';
import { sampleProducts } from '@/data/sampleData';

interface SearchResult {
  product: Product;
  score: number;
  matchReason: string;
}

// Simple AI-like search with scoring and semantic matching
export const useAISearch = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Generate search suggestions based on query
  const generateSuggestions = useCallback((query: string): string[] => {
    if (!query.trim()) return [];
    
    const q = query.toLowerCase();
    const allSuggestions: string[] = [];

    // Add category-based suggestions
    if (q.includes('phone') || q.includes('smart')) {
      allSuggestions.push('smartphones with best camera', 'latest flagship phones', 'budget smartphones');
    }
    if (q.includes('laptop') || q.includes('computer')) {
      allSuggestions.push('gaming laptops', 'ultrabooks for work', 'MacBooks');
    }
    if (q.includes('watch')) {
      allSuggestions.push('fitness smartwatches', 'Apple Watch alternatives', 'luxury smartwatches');
    }
    if (q.includes('ear') || q.includes('audio') || q.includes('music')) {
      allSuggestions.push('noise cancelling earbuds', 'wireless headphones', 'premium audio');
    }

    // Add brand suggestions
    const brands = ['Apple', 'Samsung', 'Sony', 'Dell', 'Google', 'OnePlus'];
    brands.forEach(brand => {
      if (brand.toLowerCase().startsWith(q)) {
        allSuggestions.push(`${brand} products`, `${brand} latest releases`);
      }
    });

    // Add feature-based suggestions
    const features = ['5G', 'OLED', 'fast charging', 'noise cancellation', 'gaming'];
    features.forEach(feature => {
      if (feature.toLowerCase().includes(q) || q.includes(feature.toLowerCase())) {
        allSuggestions.push(`products with ${feature}`);
      }
    });

    return [...new Set(allSuggestions)].slice(0, 5);
  }, []);

  // Score a product based on query match
  const scoreProduct = (product: Product, query: string): SearchResult | null => {
    const q = query.toLowerCase();
    let score = 0;
    let matchReason = '';

    // Exact name match (highest priority)
    if (product.name.toLowerCase().includes(q)) {
      score += 100;
      matchReason = 'Name match';
    }

    // Brand match
    if (product.brand.toLowerCase().includes(q)) {
      score += 80;
      matchReason = matchReason || 'Brand match';
    }

    // Category match
    if (product.category.toLowerCase().includes(q)) {
      score += 60;
      matchReason = matchReason || 'Category match';
    }

    // Description match
    if (product.description.toLowerCase().includes(q)) {
      score += 40;
      matchReason = matchReason || 'Description match';
    }

    // Feature match
    if (product.features?.some(f => f.toLowerCase().includes(q))) {
      score += 50;
      matchReason = matchReason || 'Feature match';
    }

    // Semantic matching for common queries
    const semanticMatches: Record<string, string[]> = {
      'best camera': ['camera', '48MP', '200MP', '50MP', 'photo'],
      'gaming': ['RTX', 'gaming', 'fps', 'refresh'],
      'battery life': ['battery', 'hours', 'mAh'],
      'fast': ['fast charging', 'quick', '100W', 'SUPERVOOC'],
      'premium': ['Pro', 'Ultra', 'Max', 'titanium'],
      'cheap': [], // Would filter by price
      'budget': [], // Would filter by price
      'wireless': ['bluetooth', 'wireless', 'WiFi'],
      'portable': ['slim', 'light', 'ultrabook'],
    };

    Object.entries(semanticMatches).forEach(([key, values]) => {
      if (q.includes(key)) {
        values.forEach(v => {
          if (
            product.name.toLowerCase().includes(v.toLowerCase()) ||
            product.description.toLowerCase().includes(v.toLowerCase()) ||
            product.features?.some(f => f.toLowerCase().includes(v.toLowerCase()))
          ) {
            score += 30;
            matchReason = matchReason || `Semantic match: ${key}`;
          }
        });
      }
    });

    // Boost featured and new products
    if (product.isFeatured) score += 10;
    if (product.isNew) score += 5;

    // Boost by rating
    score += product.rating * 2;

    return score > 0 ? { product, score, matchReason } : null;
  };

  // Main search function
  const search = useCallback(async (query: string): Promise<SearchResult[]> => {
    setIsSearching(true);
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const results: SearchResult[] = [];
    
    sampleProducts.forEach(product => {
      const result = scoreProduct(product, query);
      if (result) {
        results.push(result);
      }
    });

    // Sort by score (descending)
    results.sort((a, b) => b.score - a.score);

    // Update suggestions
    setSuggestions(generateSuggestions(query));

    setIsSearching(false);
    return results;
  }, [generateSuggestions]);

  // Get AI recommendations based on user behavior or product
  const getRecommendations = useCallback((
    baseProduct?: Product,
    viewedProducts?: string[],
    limit = 4
  ): Product[] => {
    let recommendations: Product[] = [];

    if (baseProduct) {
      // Get products from same category or brand
      recommendations = sampleProducts.filter(p => 
        p.id !== baseProduct.id && 
        (p.category === baseProduct.category || p.brand === baseProduct.brand)
      );
    } else if (viewedProducts?.length) {
      // Get products related to viewed products
      const viewedCategories = new Set<string>();
      const viewedBrands = new Set<string>();
      
      viewedProducts.forEach(id => {
        const product = sampleProducts.find(p => p.id === id);
        if (product) {
          viewedCategories.add(product.category);
          viewedBrands.add(product.brand);
        }
      });

      recommendations = sampleProducts.filter(p => 
        !viewedProducts.includes(p.id) &&
        (viewedCategories.has(p.category) || viewedBrands.has(p.brand))
      );
    } else {
      // Return featured products as default recommendations
      recommendations = sampleProducts.filter(p => p.isFeatured || p.isNew);
    }

    // Sort by rating and limit
    return recommendations
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }, []);

  return {
    search,
    isSearching,
    suggestions,
    getRecommendations,
  };
};
