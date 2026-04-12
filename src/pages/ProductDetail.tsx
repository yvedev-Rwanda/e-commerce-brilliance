import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  Heart,
  ShoppingCart,
  Truck,
  Shield,
  RefreshCw,
  ChevronRight,
  Minus,
  Plus,
  Check,
  MessageCircle,
  Phone,
  ChevronLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/product/ProductCard';
import { useProduct, useProducts } from '@/hooks/useProducts';
import { useCartStore } from '@/store/cartStore';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { sampleReviews } from '@/data/sampleData';

// WhatsApp Business Number
const WHATSAPP_NUMBER = '250798981668';

const ProductDetail = () => {
  const { id } = useParams();
  const { data: product, isLoading, error } = useProduct(id || '');
  const { data: allProducts = [] } = useProducts();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-accent border-t-transparent" />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Product not found</h1>
            <Link to="/products">
              <Button size="lg">Back to Products</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const productReviews = sampleReviews.filter((r) => r.productId === product.id);

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast.success(`${quantity} x ${product.name} added to cart`);
  };

  const whatsappMessage = `Hello, I want this product: ${product.name}`;
  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8 overflow-x-auto">
            <Link to="/" className="hover:text-foreground whitespace-nowrap">Home</Link>
            <ChevronRight className="h-4 w-4 shrink-0" />
            <Link to="/products" className="hover:text-foreground whitespace-nowrap">Products</Link>
            <ChevronRight className="h-4 w-4 shrink-0" />
            <Link
              to={`/products?category=${product.category.toLowerCase()}`}
              className="hover:text-foreground whitespace-nowrap"
            >
              {product.category}
            </Link>
            <ChevronRight className="h-4 w-4 shrink-0" />
            <span className="text-foreground truncate">{product.name}</span>
          </nav>

          {/* Product Details */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 mb-16">
            {/* Images - Large Gallery */}
            <div className="space-y-6">
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-muted shadow-2xl">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Image Navigation */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImage(prev => prev > 0 ? prev - 1 : product.images.length - 1)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-background/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-background transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
                    </button>
                    <button
                      onClick={() => setSelectedImage(prev => prev < product.images.length - 1 ? prev + 1 : 0)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-background/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-background transition-colors"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}
              </div>
              
              {/* Thumbnails */}
              <div className="flex gap-4 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`shrink-0 w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden border-3 transition-all ${
                      selectedImage === index
                        ? 'border-accent shadow-lg scale-105'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="lg:sticky lg:top-24 self-start">
              <div className="mb-6">
                <p className="text-sm text-muted-foreground font-medium mb-2">
                  {product.brand}
                </p>
                <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                  {product.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-6 w-6 ${
                          i < Math.floor(product.rating)
                            ? 'fill-warning text-warning'
                            : 'text-muted'
                        }`}
                      />
                    ))}
                    <span className="ml-2 font-bold text-lg">{product.rating}</span>
                  </div>
                  <span className="text-muted-foreground">
                    ({product.reviewCount} reviews)
                  </span>
                </div>

                {/* Price - Large */}
                <div className="flex items-baseline gap-4 mb-8">
                  <span className="text-5xl md:text-6xl font-bold text-foreground">
                    ${product.price}
                  </span>
                  {product.originalPrice && (
                    <>
                      <span className="text-2xl text-muted-foreground line-through">
                        ${product.originalPrice}
                      </span>
                      <span className="px-4 py-2 rounded-full bg-destructive text-destructive-foreground text-lg font-bold">
                        -{discount}% OFF
                      </span>
                    </>
                  )}
                </div>

                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  {product.description}
                </p>

                {/* Stock Status */}
                <div className="flex items-center gap-2 mb-8">
                  {product.stock > 10 ? (
                    <>
                      <div className="w-3 h-3 rounded-full bg-success animate-pulse" />
                      <span className="text-success font-semibold text-lg">In Stock</span>
                    </>
                  ) : product.stock > 0 ? (
                    <>
                      <div className="w-3 h-3 rounded-full bg-warning animate-pulse" />
                      <span className="text-warning font-semibold text-lg">
                        Only {product.stock} left
                      </span>
                    </>
                  ) : (
                    <span className="text-destructive font-semibold text-lg">
                      Out of Stock
                    </span>
                  )}
                </div>

                {/* Quantity & Add to Cart */}
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="flex items-center border-2 rounded-2xl bg-muted/50">
                    <Button
                      variant="ghost"
                      size="lg"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus className="h-5 w-5" />
                    </Button>
                    <span className="w-16 text-center font-bold text-xl">
                      {quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="lg"
                      onClick={() =>
                        setQuantity(Math.min(product.stock, quantity + 1))
                      }
                    >
                      <Plus className="h-5 w-5" />
                    </Button>
                  </div>

                  <Button
                    variant="accent"
                    size="xl"
                    className="flex-1 gap-3 text-lg py-7"
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                  >
                    <ShoppingCart className="h-6 w-6" />
                    Add to Cart
                  </Button>

                  <Button variant="outline" size="xl" className="py-7">
                    <Heart className="h-6 w-6" />
                  </Button>
                </div>

                {/* WhatsApp Contact Button - Large & Prominent */}
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mb-8"
                >
                  <Button
                    variant="hero"
                    size="xl"
                    className="w-full gap-4 bg-[#25D366] hover:bg-[#128C7E] text-white text-xl py-8 rounded-2xl shadow-xl"
                  >
                    <MessageCircle className="h-8 w-8" />
                    Order via WhatsApp
                    <Phone className="h-6 w-6" />
                  </Button>
                </a>

                {/* Features Grid */}
                <div className="grid grid-cols-3 gap-4 p-6 rounded-2xl bg-muted">
                  <div className="text-center">
                    <Truck className="h-8 w-8 mx-auto mb-3 text-accent" />
                    <p className="text-sm font-medium">Free Shipping</p>
                  </div>
                  <div className="text-center">
                    <Shield className="h-8 w-8 mx-auto mb-3 text-accent" />
                    <p className="text-sm font-medium">2 Year Warranty</p>
                  </div>
                  <div className="text-center">
                    <RefreshCw className="h-8 w-8 mx-auto mb-3 text-accent" />
                    <p className="text-sm font-medium">30-Day Returns</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs - Full Width */}
          <Tabs defaultValue="features" className="mb-16">
            <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0 gap-8">
              <TabsTrigger
                value="features"
                className="rounded-none border-b-4 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent pb-4 text-lg font-semibold"
              >
                Features
              </TabsTrigger>
              <TabsTrigger
                value="specifications"
                className="rounded-none border-b-4 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent pb-4 text-lg font-semibold"
              >
                Specifications
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="rounded-none border-b-4 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent pb-4 text-lg font-semibold"
              >
                Reviews ({productReviews.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="features" className="pt-8">
              {product.features && product.features.length > 0 ? (
                <ul className="grid md:grid-cols-2 gap-6">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-4 p-4 rounded-xl bg-muted/50">
                      <Check className="h-6 w-6 text-success mt-0.5 shrink-0" />
                      <span className="text-lg">{feature}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-lg">No features available for this product.</p>
              )}
            </TabsContent>

            <TabsContent value="specifications" className="pt-8">
              {product.specifications && Object.keys(product.specifications).length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between py-4 px-6 border-b border-border rounded-xl bg-muted/30"
                    >
                      <span className="text-muted-foreground text-lg">{key}</span>
                      <span className="font-semibold text-lg">{value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-lg">No specifications available for this product.</p>
              )}
            </TabsContent>

            <TabsContent value="reviews" className="pt-8">
              {productReviews.length > 0 ? (
                <div className="space-y-6">
                  {productReviews.map((review) => (
                    <div
                      key={review.id}
                      className="p-8 rounded-2xl bg-muted/50"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center">
                          <span className="font-bold text-xl text-accent">
                            {review.userName[0]}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-lg">{review.userName}</p>
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-5 w-5 ${
                                    i < review.rating
                                      ? 'fill-warning text-warning'
                                      : 'text-muted'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {review.createdAt}
                            </span>
                          </div>
                        </div>
                      </div>
                      <h4 className="font-semibold text-lg mb-2">{review.title}</h4>
                      <p className="text-muted-foreground text-lg">{review.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-lg">
                  No reviews yet. Be the first to review this product!
                </p>
              )}
            </TabsContent>
          </Tabs>

          {/* Related Products - Large Cards */}
          {relatedProducts.length > 0 && (
            <section>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-10">
                Related Products
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {relatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
