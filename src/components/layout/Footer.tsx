import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, Phone, MessageCircle } from 'lucide-react';

const WHATSAPP_NUMBER = '+250798981668';
const EMAIL = 'shimwayve@gmail.co';

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* WhatsApp Floating Button */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER.replace(/\+/g, '')}?text=${encodeURIComponent('Hi! I have a question about your products.')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#128C7E] text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 animate-pulse"
      >
        <MessageCircle className="h-7 w-7" />
      </a>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center">
                <span className="text-accent-foreground font-display font-bold text-lg">T</span>
              </div>
              <span className="font-display font-bold text-xl">TechStore</span>
            </Link>
            <p className="text-primary-foreground/70 text-sm mb-4">
              Your premier destination for tech & fashion.
            </p>
            <div className="flex gap-2">
              <a href="https://www.facebook.com/yvedev" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-primary-foreground/10 hover:bg-accent flex items-center justify-center transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="https://www.instagram.com/yve.dev" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-primary-foreground/10 hover:bg-accent flex items-center justify-center transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="https://wa.me/250798981668" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-[#25D366] hover:bg-[#128C7E] flex items-center justify-center transition-colors">
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-3">Shop</h4>
            <ul className="space-y-1.5 text-sm text-primary-foreground/70">
              <li><Link to="/products" className="hover:text-primary-foreground transition-colors">All Products</Link></li>
              <li><Link to="/products?category=smartphones" className="hover:text-primary-foreground transition-colors">Smartphones</Link></li>
              <li><Link to="/products?category=laptops" className="hover:text-primary-foreground transition-colors">Laptops</Link></li>
              <li><Link to="/products?category=clothing" className="hover:text-primary-foreground transition-colors">Clothing</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-3">Support</h4>
            <ul className="space-y-1.5 text-sm text-primary-foreground/70">
              <li><Link to="/contact" className="hover:text-primary-foreground transition-colors">Contact Us</Link></li>
              <li><Link to="/faqs" className="hover:text-primary-foreground transition-colors">FAQs</Link></li>
              <li><Link to="/shipping" className="hover:text-primary-foreground transition-colors">Shipping</Link></li>
              <li><Link to="/returns" className="hover:text-primary-foreground transition-colors">Returns</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-3">Contact</h4>
            <div className="space-y-2 text-sm text-primary-foreground/70">
              <a href={`https://wa.me/${WHATSAPP_NUMBER.replace(/\+/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#25D366] transition-colors">
                <Phone className="h-4 w-4" /> {WHATSAPP_NUMBER}
              </a>
              <a href={`mailto:${EMAIL}`} className="flex items-center gap-2 hover:text-accent transition-colors">
                <Mail className="h-4 w-4" /> {EMAIL}
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-primary-foreground/10 mt-6 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-primary-foreground/50">© 2024 TechStore. All rights reserved.</p>
          <div className="flex items-center gap-3 text-xs text-primary-foreground/50">
            <Link to="/privacy" className="hover:text-primary-foreground transition-colors">Privacy</Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-primary-foreground transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;