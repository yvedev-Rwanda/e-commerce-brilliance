import { Link, useNavigate } from 'react-router-dom';
import { Star, Heart, ShoppingCart, MessageCircle } from 'lucide-react';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cartStore';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

// WhatsApp Business Number
const WHATSAPP_NUMBER = '250798981668';

interface ProductCardProps {
  product: Product;
  featured?: boolean;
}

const ProductCard = ({ product, featured = false }: ProductCardProps) => {
  const { addItem } = useCartStore();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error('Please login first to add items to cart');
      navigate('/auth');
      return;
    }
    addItem(product);
    toast.success(`${product.name} added to cart`);
  };

  const whatsappMessage = `Hello, I want this product: ${product.name}`;
  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Link to={`/product/${product.id}`}>
      <div className={`product-card group ${featured ? 'md:col-span-2 md:row-span-2' : ''}`}>
        {/* Large Image Container */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.isNew && (
              <span className="px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-bold shadow-lg">
                NEW
              </span>
            )}
            {discount > 0 && (
              <span className="px-3 py-1.5 rounded-full bg-destructive text-destructive-foreground text-xs font-bold shadow-lg">
                -{discount}%
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              variant="secondary"
              size="icon"
              className="h-10 w-10 rounded-full shadow-lg"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toast.success('Added to wishlist');
              }}
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>

          {/* Add to Cart & WhatsApp Buttons */}
          <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0 space-y-2">
            <Button
              variant="accent"
              className="w-full gap-2 py-5"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </Button>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="hero"
                className="w-full gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white py-5"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp Order
              </Button>
            </a>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 md:p-6">
          <p className="text-xs md:text-sm text-muted-foreground mb-1 font-medium">{product.brand}</p>
          <h3 className="font-semibold text-foreground text-base md:text-lg line-clamp-2 mb-3 group-hover:text-accent transition-colors">
            {product.name}
          </h3>
          
          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating)
                      ? 'fill-warning text-warning'
                      : 'text-muted'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground ml-1">
              ({product.reviewCount})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3">
            <span className="text-xl md:text-2xl font-bold text-foreground">${product.price}</span>
            {product.originalPrice && (
              <span className="text-base text-muted-foreground line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
