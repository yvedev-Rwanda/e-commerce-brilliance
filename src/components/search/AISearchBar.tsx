import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, Sparkles, ArrowRight, X, Loader2 } from 'lucide-react';
import { useAISearch } from '@/hooks/useAISearch';
import { Product } from '@/types';

interface AISearchBarProps {
  onSearch?: (results: Product[]) => void;
  className?: string;
  placeholder?: string;
}

const AISearchBar = ({ onSearch, className = '', placeholder = 'Search with AI...' }: AISearchBarProps) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<{ product: Product; score: number; matchReason: string }[]>([]);
  const { search, isSearching, suggestions, getRecommendations } = useAISearch();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle search
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (query.trim().length > 1) {
        const searchResults = await search(query);
        setResults(searchResults.slice(0, 6));
        onSearch?.(searchResults.map(r => r.product));
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, search, onSearch]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const featuredProducts = getRecommendations(undefined, [], 3);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {isSearching ? (
            <Loader2 className="h-4 w-4 text-accent animate-spin" />
          ) : (
            <Search className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 outline-none"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setResults([]);
                inputRef.current?.focus();
              }}
              className="p-1 hover:bg-muted rounded-full transition-colors"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
          <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-accent/10 text-accent text-xs font-medium">
            <Sparkles className="h-3 w-3" />
            AI
          </div>
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-2xl border border-border shadow-xl z-50 overflow-hidden animate-scale-in">
          {query.trim().length > 1 ? (
            <>
              {/* Search Results */}
              {results.length > 0 ? (
                <div className="p-2">
                  <p className="px-3 py-2 text-xs text-muted-foreground font-medium">
                    Found {results.length} results
                  </p>
                  {results.map((result) => (
                    <Link
                      key={result.product.id}
                      to={`/product/${result.product.id}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      <img
                        src={result.product.images[0]}
                        alt={result.product.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{result.product.name}</p>
                        <p className="text-xs text-muted-foreground">{result.matchReason}</p>
                      </div>
                      <p className="font-semibold text-accent">${result.product.price}</p>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center">
                  <p className="text-muted-foreground">No products found for "{query}"</p>
                </div>
              )}

              {/* AI Suggestions */}
              {suggestions.length > 0 && (
                <div className="border-t border-border p-3">
                  <p className="text-xs text-muted-foreground font-medium mb-2 flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-accent" />
                    AI Suggestions
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((suggestion, i) => (
                      <button
                        key={i}
                        onClick={() => setQuery(suggestion)}
                        className="px-3 py-1.5 rounded-full bg-muted text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Default State - Featured Products */}
              <div className="p-3">
                <p className="px-3 py-2 text-xs text-muted-foreground font-medium">
                  Trending Products
                </p>
                {featuredProducts.map((product) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.category}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                ))}
              </div>

              {/* Quick Categories */}
              <div className="border-t border-border p-3">
                <p className="px-3 py-2 text-xs text-muted-foreground font-medium">
                  Quick Search
                </p>
                <div className="flex flex-wrap gap-2 px-3">
                  {['Smartphones', 'Laptops', 'Tablets', 'Smartwatches', 'Earphones'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setQuery(cat)}
                      className="px-3 py-1.5 rounded-full bg-muted text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AISearchBar;
