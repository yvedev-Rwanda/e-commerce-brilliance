import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Truck, Shield, Headphones, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/product/ProductCard';
import CategoryCard from '@/components/product/CategoryCard';
import AISearchBar from '@/components/search/AISearchBar';
import { sampleProducts, categories } from '@/data/sampleData';
import HeroPhotoCarousel from '@/components/home/HeroPhotoCarousel';
import developerPhoto from '@/assets/developer-photo.jpg';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const navigate = useNavigate();
  const { isAdmin, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && isAdmin) {
      navigate('/admin', { replace: true });
    }
  }, [isAdmin, authLoading, navigate]);
  const [currentBg, setCurrentBg] = useState(0);
  
  const heroBackgrounds = [
    "https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=90&w=2560&auto=format&fit=crop", // store/shopping
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=90&w=2560&auto=format&fit=crop", // card transaction
    "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=90&w=2560&auto=format&fit=crop", // ecommerce concept
    "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=90&w=2560&auto=format&fit=crop", // checkout
    "https://images.unsplash.com/photo-1586880244406-556ebe35f282?q=90&w=2560&auto=format&fit=crop", // packages/shipping
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=90&w=2560&auto=format&fit=crop", // happy shopper looking at phone
    "https://images.unsplash.com/photo-1523206489230-c012c64b2b48?q=90&w=2560&auto=format&fit=crop", // phone payment
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=90&w=2560&auto=format&fit=crop", // gadgets
    "https://images.unsplash.com/photo-1573376670774-4427757f7963?q=90&w=2560&auto=format&fit=crop", // parcel delivery box
    "https://images.unsplash.com/photo-1556740749-887f6717d7e4?q=90&w=2560&auto=format&fit=crop"  // paying sequence
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % heroBackgrounds.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const featuredProducts = sampleProducts.filter((p) => p.isFeatured);
  const newProducts = sampleProducts.filter((p) => p.isNew);
  const topRated = [...sampleProducts].sort((a, b) => b.rating - a.rating).slice(0, 4);

  const features = [
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'On orders over $100',
    },
    {
      icon: Shield,
      title: 'Secure Payment',
      description: '100% secure checkout',
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Expert assistance anytime',
    },
    {
      icon: Sparkles,
      title: 'Quality Guarantee',
      description: 'Genuine products only',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden min-h-[85vh] flex items-center">
          {/* Animated Background Slideshow */}
          <div className="absolute inset-0 z-0 bg-black">
            {heroBackgrounds.map((bg, index) => (
              <div 
                key={bg}
                className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${index === currentBg ? 'opacity-50' : 'opacity-0'}`}
              >
                <img 
                  src={bg} 
                  alt="Tech background" 
                  className={`w-full h-full object-cover transition-transform duration-[8000ms] ease-linear ${index === currentBg ? 'scale-105' : 'scale-100'}`}
                />
              </div>
            ))}
            {/* Gradient overlays to ensure text is perfectly readable */}
            <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-background max-h-[150px] bottom-0 via-transparent to-transparent" />
          </div>
          
          <div className="container mx-auto px-4 py-16 md:py-24 relative z-10 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            <div className="max-w-2xl flex-1">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/30 text-accent text-sm font-medium mb-8 animate-float shadow-[0_0_15px_rgba(var(--accent),0.3)] backdrop-blur-md">
                <Sparkles className="h-4 w-4 text-accent animate-pulse" />
                AI-Powered Shopping
              </span>
              
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[1.1] mb-6 tracking-tight animate-slide-up">
                Discover Your
                <br />
                <span className="gradient-text bg-clip-text text-transparent bg-gradient-to-r from-accent via-purple-500 to-accent animate-pulse" style={{ animationDuration: '3s' }}>
                  Perfect Tech
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl mb-10 leading-relaxed animate-fade-in delay-100 font-medium">
                Shop smartphones, laptops, tablets, and more. 
                <br className="hidden md:block" />
                Use our intelligent search to find exactly what you need.
              </p>

              {/* AI Search Bar */}
              <div className="mb-10 w-full animate-slide-up delay-200 hover:-translate-y-1 transition-transform duration-300">
                <div className="shadow-[0_8px_30px_rgb(0,0,0,0.2)] dark:shadow-[0_8px_30px_rgba(255,255,255,0.1)] rounded-2xl relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-accent/30 to-purple-500/30 blur-xl opacity-60 -z-10 rounded-2xl" />
                  <AISearchBar 
                    className="w-full bg-card/80 backdrop-blur-md border-border/50"
                    placeholder="Try 'best camera phone' or 'gaming laptop'..."
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-4 animate-fade-in delay-300">
                <Link to="/products">
                  <Button variant="hero" size="xl" className="gap-2 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-accent/40 rounded-full px-8 group">
                    Browse All
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/products?filter=new">
                  <Button variant="heroOutline" size="xl" className="hover:scale-105 transition-all duration-300 backdrop-blur-md bg-background/50 rounded-full px-8 border-2">
                    New Arrivals
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right side: Photo carousel + Developer badge */}
            <div className="hidden lg:flex flex-col items-center gap-6 flex-shrink-0 animate-fade-in delay-400">
              <HeroPhotoCarousel />
              <div className="flex items-center gap-3 bg-card/80 backdrop-blur-md rounded-full px-4 py-2 border border-border/50 shadow-lg">
                <img src={developerPhoto} alt="Developer" className="w-10 h-10 rounded-full object-cover border-2 border-accent" />
                <div>
                  <p className="text-xs font-bold text-foreground">Built by the Developer</p>
                  <p className="text-xs text-muted-foreground">Creator & Founder</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Bar */}
        <section className="bg-card border-y border-border">
          <div className="container mx-auto px-4 py-6 md:py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="flex items-center gap-3 md:gap-4 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0">
                    <feature.icon className="h-5 w-5 md:h-6 md:w-6" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-foreground text-sm md:text-base truncate">{feature.title}</h4>
                    <p className="text-xs md:text-sm text-muted-foreground truncate">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-12 md:py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 md:mb-10">
              <div>
                <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">
                  Shop by Category
                </h2>
                <p className="text-muted-foreground text-sm md:text-base">
                  Find exactly what you're looking for
                </p>
              </div>
              <Link to="/products" className="flex items-center gap-2 text-accent hover:underline text-sm md:text-base">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
              {categories.map((category, index) => (
                <div
                  key={category.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CategoryCard category={category} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-12 md:py-16 lg:py-24 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 md:mb-10">
              <div>
                <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">
                  Featured Products
                </h2>
                <p className="text-muted-foreground text-sm md:text-base">
                  Handpicked by our experts
                </p>
              </div>
              <Link to="/products" className="flex items-center gap-2 text-accent hover:underline text-sm md:text-base">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.slice(0, 4).map((product, index) => (
                <div
                  key={product.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AI Recommendations Banner */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-r from-accent to-accent/80">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-white" />
                <div className="absolute -left-10 -bottom-10 w-60 h-60 rounded-full bg-white" />
              </div>
              <div className="relative z-10 p-6 md:p-12 lg:p-16 flex flex-col md:flex-row items-center gap-6 md:gap-12">
                <div className="flex-1 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 text-white text-sm font-medium mb-4">
                    <Sparkles className="h-4 w-4" />
                    AI-Powered
                  </div>
                  <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
                    Smart Recommendations
                  </h2>
                  <p className="text-white/80 text-sm md:text-base mb-6 max-w-lg">
                    Our AI analyzes your preferences to suggest products you'll love. 
                    The more you browse, the smarter recommendations become.
                  </p>
                  <Link to="/products">
                    <Button variant="secondary" size="lg" className="gap-2">
                      Explore Products
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                </div>
                <div className="w-full md:w-auto grid grid-cols-2 gap-3 md:gap-4">
                  {topRated.slice(0, 2).map((product) => (
                    <Link
                      key={product.id}
                      to={`/product/${product.id}`}
                      className="bg-white/10 backdrop-blur-sm rounded-xl p-3 hover:bg-white/20 transition-colors"
                    >
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full aspect-square object-cover rounded-lg mb-2"
                      />
                      <p className="text-white text-xs md:text-sm font-medium truncate">{product.name}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-3 w-3 fill-warning text-warning" />
                        <span className="text-white/80 text-xs">{product.rating}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* New Arrivals */}
        <section className="py-12 md:py-16 lg:py-24 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 md:mb-10">
              <div>
                <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">
                  New Arrivals
                </h2>
                <p className="text-muted-foreground text-sm md:text-base">
                  Be the first to get the latest products
                </p>
              </div>
              <Link to="/products?filter=new" className="flex items-center gap-2 text-accent hover:underline text-sm md:text-base">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {newProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Top Rated */}
        <section className="py-12 md:py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 md:mb-10">
              <div>
                <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">
                  Top Rated
                </h2>
                <p className="text-muted-foreground text-sm md:text-base">
                  Customer favorites with the best reviews
                </p>
              </div>
              <Link to="/products" className="flex items-center gap-2 text-accent hover:underline text-sm md:text-base">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {topRated.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
