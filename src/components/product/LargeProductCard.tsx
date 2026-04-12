import { Link } from 'react-router-dom';
import { Star, Heart, ShoppingCart, MessageCircle, Eye } from 'lucide-react';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cartStore';
import { toast } from 'sonner';

// WhatsApp Business Number
const WHATSAPP_NUMBER = '250798981668';

interface LargeProductCardProps {
  product: Product;
}

const LargeProductCard = ({ product }: LargeProductCardProps) => {
  const { addItem } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast.success(`${product.name} added to cart`);
  };

  const whatsappMessage = `Hello, I want this product: ${product.name}`;
  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group bg-card rounded-3xl overflow-hidden border border-border shadow-lg hover:shadow-2xl transition-all duration-500">
      {/* Large Image Container */}
      <Link to={`/product/${product.id}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.isNew && (
              <span className="px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-bold shadow-lg">
                NEW
              </span>
            )}
            {discount > 0 && (
              <span className="px-4 py-2 rounded-full bg-destructive text-destructive-foreground text-sm font-bold shadow-lg">
                -{discount}% OFF
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-4 right-4 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
            <Button
              variant="secondary"
              size="icon"
              className="h-10 w-10 md:h-12 md:w-12 rounded-full shadow-xl bg-background/90 backdrop-blur-sm hover:bg-background"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toast.success('Added to wishlist');
              }}
            >
              <Heart className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="h-10 w-10 md:h-12 md:w-12 rounded-full shadow-xl bg-background/90 backdrop-blur-sm hover:bg-background"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
          </div>

          {/* View Product Button */}
          <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
            <Button variant="secondary" className="w-full gap-2 py-4 md:py-6 text-sm md:text-lg font-semibold">
              <Eye className="h-4 w-4 md:h-5 md:w-5" />
              View Details
            </Button>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 sm:p-6 md:p-8">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground font-medium mb-2">{product.brand}</p>
            <Link to={`/product/${product.id}`}>
              <h3 className="font-display text-xl md:text-2xl font-bold text-foreground line-clamp-2 hover:text-accent transition-colors">
                {product.name}
              </h3>
            </Link>
          </div>
          
          {/* Rating */}
          <div className="flex items-center gap-2 bg-muted rounded-full px-3 py-1.5">
            <Star className="h-4 w-4 fill-warning text-warning" />
            <span className="font-semibold text-sm">{product.rating}</span>
          </div>
        </div>

        <p className="text-muted-foreground mb-6 line-clamp-2 text-base">
          {product.description}
        </p>

        {/* Price */}
        <div className="flex items-baseline gap-2 sm:gap-3 mb-4 sm:mb-6">
          <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">${product.price}</span>
          {product.originalPrice && (
            <span className="text-base sm:text-xl text-muted-foreground line-through">${product.originalPrice}</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 sm:gap-4">
          <Button
            variant="accent"
            size="lg"
            className="gap-2 py-4 sm:py-6 text-sm sm:text-base font-semibold"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden xs:inline">Add to</span> Cart
          </Button>
          
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="hero"
              size="lg"
              className="w-full gap-2 py-4 sm:py-6 text-sm sm:text-base font-semibold bg-[#25D366] hover:bg-[#128C7E] text-white"
            >
              <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              WhatsApp
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default LargeProductCard;
