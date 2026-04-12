import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, LogOut, Package, ChevronDown, Bell, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cartStore';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import { useState, useRef, useEffect } from 'react';
import AISearchBar from '@/components/search/AISearchBar';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/i18n/LanguageContext';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { getItemCount } = useCartStore();
  const { user, profile, isAdmin, signOut } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(e.target as Node)) {
        setNotifMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setProfileMenuOpen(false);
    await signOut();
    navigate('/');
  };

  const navLinks = [
    { name: t('home'), path: '/' },
    { name: t('products'), path: '/products' },
    { name: t('search'), path: '/search' },
  ];

  const cartItemCount = getItemCount();

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex h-14 md:h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-lg md:text-xl">T</span>
            </div>
            <span className="font-display font-bold text-lg md:text-xl hidden sm:block">TechStore</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} className={`nav-link text-sm font-medium ${location.pathname === link.path ? 'text-foreground' : ''}`}>
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:block flex-1 max-w-md mx-4">
            <AISearchBar placeholder={t('searchProducts')} />
          </div>

          <div className="flex items-center gap-1 md:gap-2">
            <LanguageSwitcher />
            <ThemeToggle />

            {!isAdmin && (
              <Link to="/cart">
                <Button variant="ghost" size="icon" className="relative h-9 w-9">
                  <ShoppingCart className="h-5 w-5" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent text-accent-foreground text-xs font-medium flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Button>
              </Link>
            )}

            {user && !isAdmin && (
              <div className="relative" ref={notifMenuRef}>
                <Button variant="ghost" size="icon" className="relative h-9 w-9" onClick={() => setNotifMenuOpen(!notifMenuOpen)}>
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs font-medium flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Button>
                {notifMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-80 max-h-96 overflow-y-auto rounded-lg border border-border bg-popover shadow-lg z-50">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                      <span className="font-semibold text-sm">Notifications</span>
                      {unreadCount > 0 && (
                        <button onClick={markAllAsRead} className="text-xs text-primary hover:underline flex items-center gap-1">
                          <CheckCheck className="h-3 w-3" /> Mark all read
                        </button>
                      )}
                    </div>
                    {notifications.length === 0 ? (
                      <p className="text-center text-sm text-muted-foreground py-6">No notifications</p>
                    ) : (
                      notifications.slice(0, 10).map(notif => (
                        <button
                          key={notif.id}
                          onClick={() => { markAsRead(notif.id); if (notif.order_id) { setNotifMenuOpen(false); } }}
                          className={`w-full text-left px-4 py-3 border-b border-border last:border-0 hover:bg-muted transition-colors ${!notif.is_read ? 'bg-primary/5' : ''}`}
                        >
                          <p className="font-medium text-sm">{notif.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notif.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{new Date(notif.created_at).toLocaleString()}</p>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            {user ? (
              <div className="relative" ref={profileMenuRef}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 h-9"
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">{profile?.first_name || t('account')}</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>

                {profileMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-48 rounded-lg border border-border bg-popover shadow-lg py-1 z-50">
                    <Link
                      to="/account"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors"
                    >
                      <User className="h-4 w-4" />
                      {t('profile')}
                    </Link>
                    {!isAdmin && (
                      <Link
                        to="/orders"
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors"
                      >
                        <Package className="h-4 w-4" />
                        {t('myOrders')}
                      </Link>
                    )}
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors"
                      >
                        <Package className="h-4 w-4" />
                        {t('admin')}
                      </Link>
                    )}
                    <div className="border-t border-border my-1" />
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2 px-4 py-2 text-sm w-full text-destructive hover:bg-muted transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      {t('logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/auth">
                <Button size="sm" className="h-9">{t('signIn')}</Button>
              </Link>
            )}

            <Button variant="ghost" size="icon" className="lg:hidden h-9 w-9" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        <div className="md:hidden pb-3">
          <AISearchBar placeholder={t('searchProducts')} />
        </div>

        {mobileMenuOpen && (
          <nav className="lg:hidden pb-4 animate-slide-up">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path} onClick={() => setMobileMenuOpen(false)} className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${location.pathname === link.path ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
                  {link.name}
                </Link>
              ))}
              {user && (
                <>
                  <Link to="/orders" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
                    {t('myOrders')}
                  </Link>
                  <Link to="/account" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
                    {t('profile')}
                  </Link>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
