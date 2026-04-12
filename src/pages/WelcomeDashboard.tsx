import { useNavigate } from 'react-router-dom';
import { Monitor, Smartphone, Headphones, Watch, Gamepad2, Camera, Search, ShoppingBag, User, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';

const categories = [
  { name: 'Laptops', icon: Monitor, color: 'from-blue-500 to-cyan-400', path: '/products?category=laptops', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400' },
  { name: 'Smartphones', icon: Smartphone, color: 'from-violet-500 to-purple-400', path: '/products?category=smartphones', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400' },
  { name: 'Earphones', icon: Headphones, color: 'from-pink-500 to-rose-400', path: '/products?category=earphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400' },
  { name: 'Smartwatches', icon: Watch, color: 'from-amber-500 to-orange-400', path: '/products?category=smartwatches', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400' },
  { name: 'Gaming', icon: Gamepad2, color: 'from-green-500 to-emerald-400', path: '/products?category=gaming', image: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400' },
  { name: 'Cameras', icon: Camera, color: 'from-red-500 to-pink-400', path: '/products?category=cameras', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400' },
];

const quickActions = [
  { name: 'Search Products', icon: Search, path: '/search', desc: 'Find exactly what you need' },
  { name: 'Browse All', icon: ShoppingBag, path: '/products', desc: 'Explore our full catalog' },
  { name: 'My Profile', icon: User, path: '/account', desc: 'Manage your account' },
];

const WelcomeDashboard = () => {
  const navigate = useNavigate();
  const { user, profile, isAdmin, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth', { replace: true });
    }
    if (!loading && isAdmin) {
      navigate('/admin', { replace: true });
    }
  }, [user, isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  const firstName = profile?.first_name || user?.email?.split('@')[0] || 'there';

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Welcome */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 px-4 py-12 md:py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full text-accent text-sm font-medium mb-6 animate-fade-in">
            <Sparkles className="h-4 w-4" />
            Welcome back!
          </div>
          <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 animate-fade-in" style={{ animationDelay: '100ms' }}>
            Hello, <span className="text-accent">{firstName}</span>! 👋
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '200ms' }}>
            What would you like to explore today? Choose a category or action below.
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-5xl mx-auto px-4 -mt-6 relative z-10 mb-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickActions.map((action, i) => (
            <button
              key={action.name}
              onClick={() => navigate(action.path)}
              className="flex items-center gap-4 p-5 bg-card border border-border rounded-2xl shadow-sm hover:shadow-lg hover:border-accent/50 transition-all duration-300 group animate-fade-in"
              style={{ animationDelay: `${300 + i * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                <action.icon className="h-5 w-5 text-accent" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground">{action.name}</p>
                <p className="text-sm text-muted-foreground">{action.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Category Grid */}
      <div className="max-w-5xl mx-auto px-4 pb-16">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {categories.map((cat, i) => (
            <button
              key={cat.name}
              onClick={() => navigate(cat.path)}
              className="group relative overflow-hidden rounded-2xl aspect-[4/3] animate-fade-in"
              style={{ animationDelay: `${400 + i * 80}ms` }}
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} opacity-60 group-hover:opacity-70 transition-opacity`} />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                <cat.icon className="h-8 w-8 md:h-10 md:w-10 mb-2 drop-shadow-lg" />
                <span className="font-display font-bold text-lg md:text-xl drop-shadow-lg">{cat.name}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Browse All Button */}
        <div className="text-center mt-10">
          <Button
            variant="accent"
            size="lg"
            className="gap-2 px-8"
            onClick={() => navigate('/products')}
          >
            <ShoppingBag className="h-5 w-5" />
            Browse All Products
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeDashboard;
