import { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, X, Sparkles, TrendingUp, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/product/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import { Product } from '@/types';

const trendingSearches = ['iPhone 16', 'MacBook Pro', 'Samsung Galaxy', 'AirPods', 'Dell XPS', 'Sony Camera'];

const categoryImages = [
  { label: 'Laptops', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300', query: 'laptop' },
  { label: 'Phones', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300', query: 'phone' },
  { label: 'Watches', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300', query: 'watch' },
  { label: 'Audio', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300', query: 'earphone' },
  { label: 'Cameras', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300', query: 'camera' },
  { label: 'Gaming', image: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=300', query: 'gaming' },
];

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [isFocused, setIsFocused] = useState(false);
  const { data: products = [], isLoading } = useProducts();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      if (query) {
        setSearchParams({ q: query });
      } else {
        setSearchParams({});
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query, setSearchParams]);

  const searchResults = useMemo(() => {
    if (!debouncedQuery.trim()) return [];
    const searchLower = debouncedQuery.toLowerCase();
    return products.filter((product: Product) =>
      product.name.toLowerCase().includes(searchLower) ||
      product.description.toLowerCase().includes(searchLower) ||
      product.brand.toLowerCase().includes(searchLower) ||
      product.category.toLowerCase().includes(searchLower) ||
      product.features?.some(f => f.toLowerCase().includes(searchLower))
    );
  }, [products, debouncedQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Search Hero */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-accent/5 to-background py-10 md:py-16">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-3xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent/10 rounded-full text-accent text-sm font-medium mb-5 animate-fade-in">
              <Sparkles className="h-3.5 w-3.5" />
              Smart Search
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-3 animate-fade-in" style={{ animationDelay: '50ms' }}>
              Find Your Perfect Tech
            </h1>
            <p className="text-muted-foreground text-base md:text-lg mb-8 animate-fade-in" style={{ animationDelay: '100ms' }}>
              Search through our premium collection of gadgets and accessories
            </p>

            {/* Search Input */}
            <div className={`relative max-w-2xl mx-auto transition-all duration-300 animate-fade-in ${isFocused ? 'scale-[1.02]' : ''}`} style={{ animationDelay: '150ms' }}>
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <SearchIcon className={`h-6 w-6 transition-colors duration-200 ${isFocused ? 'text-accent' : 'text-muted-foreground'}`} />
              </div>
              <Input
                ref={inputRef}
                type="text"
                placeholder="Search for smartphones, laptops, watches..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="w-full pl-14 pr-14 py-7 text-lg md:text-xl rounded-2xl border-2 border-border focus:border-accent bg-card shadow-lg transition-shadow duration-300 focus:shadow-xl focus:shadow-accent/10"
              />
              {query && (
                <button
                  onClick={() => { setQuery(''); inputRef.current?.focus(); }}
                  className="absolute inset-y-0 right-0 pr-5 flex items-center"
                >
                  <X className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                </button>
              )}
            </div>

            {/* Trending Searches */}
            {!debouncedQuery && (
              <div className="mt-6 animate-fade-in" style={{ animationDelay: '250ms' }}>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-3">
                  <TrendingUp className="h-4 w-4" />
                  <span>Trending searches</span>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {trendingSearches.map((term) => (
                    <Button
                      key={term}
                      variant="outline"
                      size="sm"
                      className="rounded-full px-4 hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all duration-200"
                      onClick={() => setQuery(term)}
                    >
                      {term}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Category Quick Picks - shown when no query */}
          {!debouncedQuery && (
            <div className="mb-12 animate-fade-in" style={{ animationDelay: '300ms' }}>
              <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-6 text-center">
                Browse by Category
              </h2>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
                {categoryImages.map((cat, i) => (
                  <button
                    key={cat.label}
                    onClick={() => setQuery(cat.query)}
                    className="group relative overflow-hidden rounded-2xl aspect-square animate-fade-in"
                    style={{ animationDelay: `${350 + i * 60}ms` }}
                  >
                    <img
                      src={cat.image}
                      alt={cat.label}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <span className="absolute bottom-3 left-0 right-0 text-center text-white font-semibold text-sm md:text-base drop-shadow-lg">
                      {cat.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loading */}
          {isLoading && debouncedQuery ? (
            <div className="text-center py-20">
              <div className="relative w-16 h-16 mx-auto mb-4">
                <div className="absolute inset-0 rounded-full border-4 border-accent/20" />
                <div className="absolute inset-0 rounded-full border-4 border-accent border-t-transparent animate-spin" />
              </div>
              <p className="text-muted-foreground text-lg">Searching...</p>
            </div>
          ) : debouncedQuery ? (
            <div>
              {/* Results Count */}
              <div className="flex items-center gap-3 mb-6 animate-fade-in">
                <Sparkles className="h-5 w-5 text-accent" />
                <h2 className="font-display text-xl md:text-2xl font-bold">
                  {searchResults.length} Result{searchResults.length !== 1 ? 's' : ''} for "{debouncedQuery}"
                </h2>
              </div>

              {searchResults.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {searchResults.map((product: Product, index: number) => (
                    <div
                      key={product.id}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 60}ms` }}
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 animate-fade-in">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                    <SearchIcon className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">No products found</h3>
                  <p className="text-muted-foreground mb-6">
                    Try a different search term or browse categories
                  </p>
                  <Button variant="accent" onClick={() => setQuery('')}>
                    Clear Search
                  </Button>
                </div>
              )}
            </div>
          ) : !isLoading && (
            <div className="text-center py-12 animate-fade-in">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                <SearchIcon className="h-10 w-10 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Start searching</h3>
              <p className="text-muted-foreground">
                Type a product name, brand, or category above
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Search;
