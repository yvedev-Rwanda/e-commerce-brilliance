import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, SlidersHorizontal, Grid, LayoutGrid, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/product/ProductCard';
import LargeProductCard from '@/components/product/LargeProductCard';
import { useProducts } from '@/hooks/useProducts';
import { Product } from '@/types';
import { categories } from '@/data/sampleData';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';

const Products = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'large'>('large');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 3000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);

  const { data: products = [], isLoading } = useProducts();

  const categoryParam = searchParams.get('category');
  const filterParam = searchParams.get('filter');

  useEffect(() => {
    if (categoryParam) {
      const cat = categories.find(c => c.slug === categoryParam.toLowerCase());
      if (cat) setSelectedCategories([cat.name]);
    }
  }, [categoryParam]);

  const brands = useMemo(() => {
    return [...new Set(products.map((p: Product) => p.brand))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Apply new arrivals filter
    if (filterParam === 'new') {
      filtered = filtered.filter((p: Product) => p.isNew);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((p: Product) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((p: Product) =>
        selectedCategories.includes(p.category)
      );
    }

    // Brand filter
    if (selectedBrands.length > 0) {
      filtered = filtered.filter((p: Product) => selectedBrands.includes(p.brand));
    }

    // Price filter
    filtered = filtered.filter(
      (p: Product) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Rating filter
    if (minRating > 0) {
      filtered = filtered.filter((p: Product) => p.rating >= minRating);
    }

    // Sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      default:
        filtered.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return filtered;
  }, [
    searchQuery,
    sortBy,
    selectedCategories,
    selectedBrands,
    priceRange,
    minRating,
    filterParam,
    products,
  ]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange([0, 3000]);
    setMinRating(0);
  };

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedBrands.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < 3000 ||
    minRating > 0 ||
    searchQuery;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-accent border-t-transparent mx-auto mb-4" />
            <p className="text-muted-foreground text-xl">Loading products...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="mb-8 md:mb-12">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
              {filterParam === 'new' 
                ? 'New Arrivals'
                : categoryParam
                  ? categories.find((c) => c.slug === categoryParam.toLowerCase())?.name || 'Products'
                  : 'All Products'}
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl">
              {filteredProducts.length} products found
            </p>
          </div>

          {/* Search Bar - Large */}
          <div className="relative mb-8">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search products by name, brand, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-14 py-6 text-lg rounded-2xl border-2"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-5 top-1/2 -translate-y-1/2"
              >
                <X className="h-6 w-6 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex items-center gap-3 flex-wrap">
              {/* Filter Toggle (Mobile) */}
              <Button
                variant="outline"
                size="lg"
                className="lg:hidden gap-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="h-5 w-5" />
                Filters
                {hasActiveFilters && (
                  <span className="w-2 h-2 rounded-full bg-accent" />
                )}
              </Button>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="lg"
                  className="gap-2 text-accent"
                  onClick={clearFilters}
                >
                  <X className="h-5 w-5" />
                  Clear Filters
                </Button>
              )}
            </div>

            <div className="flex items-center gap-3 sm:ml-auto">
              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px] md:w-[200px] h-12">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode */}
              <div className="hidden md:flex items-center border-2 rounded-xl overflow-hidden">
                <Button
                  variant={viewMode === 'large' ? 'accent' : 'ghost'}
                  size="icon"
                  className="h-12 w-12 rounded-none"
                  onClick={() => setViewMode('large')}
                >
                  <LayoutGrid className="h-5 w-5" />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'accent' : 'ghost'}
                  size="icon"
                  className="h-12 w-12 rounded-none"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex gap-8 lg:gap-12">
            {/* Filters Sidebar */}
            <aside
              className={`${
                showFilters ? 'fixed inset-0 z-50 bg-background p-6 overflow-auto' : 'hidden'
              } lg:block lg:relative lg:w-72 shrink-0`}
            >
              <div className="lg:sticky lg:top-24 bg-card rounded-3xl p-6 md:p-8 border-2 border-border">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-bold text-xl">Filters</h3>
                  <div className="flex items-center gap-2">
                    {hasActiveFilters && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-accent"
                      >
                        Clear all
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="lg:hidden"
                      onClick={() => setShowFilters(false)}
                    >
                      <X className="h-6 w-6" />
                    </Button>
                  </div>
                </div>

                {/* Categories */}
                <div className="mb-8">
                  <h4 className="font-semibold text-lg mb-4">Categories</h4>
                  <div className="space-y-3">
                    {categories.map((category) => (
                      <label
                        key={category.id}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <Checkbox
                          checked={selectedCategories.includes(category.name)}
                          onCheckedChange={() => toggleCategory(category.name)}
                          className="h-5 w-5"
                        />
                        <span className="text-base group-hover:text-accent transition-colors">{category.name}</span>
                        <span className="text-sm text-muted-foreground ml-auto">
                          ({category.productCount})
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Brands */}
                <div className="mb-8">
                  <h4 className="font-semibold text-lg mb-4">Brands</h4>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {brands.map((brand) => (
                      <label
                        key={brand}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <Checkbox
                          checked={selectedBrands.includes(brand)}
                          onCheckedChange={() => toggleBrand(brand)}
                          className="h-5 w-5"
                        />
                        <span className="text-base group-hover:text-accent transition-colors">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-8">
                  <h4 className="font-semibold text-lg mb-4">Price Range</h4>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    min={0}
                    max={3000}
                    step={50}
                    className="mb-3"
                  />
                  <div className="flex items-center justify-between text-base text-muted-foreground">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <h4 className="font-semibold text-lg mb-4">Minimum Rating</h4>
                  <div className="flex flex-wrap gap-2">
                    {[0, 3, 4, 4.5].map((rating) => (
                      <Button
                        key={rating}
                        variant={minRating === rating ? 'accent' : 'outline'}
                        size="lg"
                        onClick={() => setMinRating(rating)}
                      >
                        {rating === 0 ? 'All' : `${rating}+`}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Apply Button (Mobile) */}
                <Button
                  variant="accent"
                  size="xl"
                  className="w-full mt-8 lg:hidden"
                  onClick={() => setShowFilters(false)}
                >
                  Apply Filters
                </Button>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1 min-w-0">
              {/* Active Filters */}
              {hasActiveFilters && (
                <div className="flex flex-wrap gap-3 mb-8">
                  {selectedCategories.map((cat) => (
                    <span
                      key={cat}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-base font-medium"
                    >
                      {cat}
                      <button onClick={() => toggleCategory(cat)}>
                        <X className="h-4 w-4" />
                      </button>
                    </span>
                  ))}
                  {selectedBrands.map((brand) => (
                    <span
                      key={brand}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-base font-medium"
                    >
                      {brand}
                      <button onClick={() => toggleBrand(brand)}>
                        <X className="h-4 w-4" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {filteredProducts.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                    <Search className="h-16 w-16 text-muted-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">No products found</h3>
                  <p className="text-muted-foreground text-lg mb-6">
                    No products found matching your criteria.
                  </p>
                  <Button variant="accent" size="lg" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                </div>
              ) : viewMode === 'large' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {filteredProducts.map((product: Product, index: number) => (
                    <div
                      key={product.id}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <LargeProductCard product={product} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {filteredProducts.map((product: Product, index: number) => (
                    <div
                      key={product.id}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Products;
