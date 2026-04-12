import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingCart, Users, BarChart3,
  LogOut, Menu, Bell, Search, DollarSign, ShoppingBag, AlertTriangle,
  Plus, Edit, Trash2, Check, X, Eye, Camera, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';

type Product = Tables<'products'>;
type Order = Tables<'orders'>;
type Profile = Tables<'profiles'>;

const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--destructive))', 'hsl(var(--muted))', 'hsl(var(--secondary))'];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');

  const [productModal, setProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '', description: '', price: '', original_price: '', brand: '',
    stock: '', features: '', images: '' as string, is_new: false, is_featured: false,
  });

  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    const [productsRes, ordersRes, customersRes] = await Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
    ]);
    setProducts(productsRes.data || []);
    setOrders(ordersRes.data || []);
    setCustomers(customersRes.data || []);
    setLoading(false);
  };

  const handleLogout = async () => { await signOut(); navigate('/'); };

  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total), 0);
  const lowStockProducts = products.filter((p) => (p.stock ?? 0) < 20);

  const ordersByDate = orders.reduce((acc: Record<string, number>, order) => {
    const date = order.created_at.split('T')[0];
    acc[date] = (acc[date] || 0) + Number(order.total);
    return acc;
  }, {});
  const chartData = Object.entries(ordersByDate).map(([date, revenue]) => ({ date, revenue })).slice(-14);

  const categoryStats = products.reduce((acc: Record<string, number>, p) => {
    const brand = p.brand || 'Other';
    acc[brand] = (acc[brand] || 0) + 1;
    return acc;
  }, {});
  const pieData = Object.entries(categoryStats).slice(0, 5).map(([name, value]) => ({ name, value }));

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.brand || '').toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredOrders = orders.filter(o =>
    o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.status.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredCustomers = customers.filter(c =>
    (c.first_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.last_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddProduct = () => {
    setEditingProduct(null);
    setProductForm({ name: '', description: '', price: '', original_price: '', brand: '', stock: '', features: '', images: '', is_new: false, is_featured: false });
    setProductModal(true);
  };

  const openEditProduct = (p: Product) => {
    setEditingProduct(p);
    setProductForm({
      name: p.name, description: p.description || '', price: String(p.price),
      original_price: p.original_price ? String(p.original_price) : '', brand: p.brand || '',
      stock: String(p.stock ?? 0), features: (p.features || []).join('\n'),
      images: (p.images || []).join('\n'), is_new: p.is_new || false, is_featured: p.is_featured || false,
    });
    setProductModal(true);
  };

  const handleSaveProduct = async () => {
    const payload = {
      name: productForm.name, description: productForm.description, price: Number(productForm.price),
      original_price: productForm.original_price ? Number(productForm.original_price) : null,
      brand: productForm.brand, stock: Number(productForm.stock),
      features: productForm.features.split('\n').filter(Boolean),
      images: productForm.images.split('\n').filter(Boolean),
      is_new: productForm.is_new, is_featured: productForm.is_featured,
    };
    if (editingProduct) {
      const { error } = await supabase.from('products').update(payload).eq('id', editingProduct.id);
      if (error) { toast.error(error.message); return; }
      toast.success('Product updated');
    } else {
      const { error } = await supabase.from('products').insert(payload);
      if (error) { toast.error(error.message); return; }
      toast.success('Product added');
    }
    setProductModal(false);
    fetchData();
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('Product deleted');
    fetchData();
  };

  const handleOrderAction = async (orderId: string, status: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
    if (error) { toast.error(error.message); return; }
    const statusMessages: Record<string, { title: string; message: string }> = {
      confirmed: { title: '✅ Order Confirmed', message: `Your order #${orderId.slice(0, 8)} has been confirmed and is being prepared.` },
      rejected: { title: '❌ Order Rejected', message: `Your order #${orderId.slice(0, 8)} has been rejected. Please contact support for details.` },
      shipped: { title: '🚚 Order Shipped', message: `Your order #${orderId.slice(0, 8)} has been shipped and is on its way!` },
      delivered: { title: '📦 Order Delivered', message: `Your order #${orderId.slice(0, 8)} has been delivered. Enjoy your purchase!` },
    };
    const notifData = statusMessages[status];
    if (notifData) {
      await supabase.from('notifications').insert({
        user_id: order.user_id, title: notifData.title, message: notifData.message,
        type: 'order_update', order_id: orderId,
      });
    }
    toast.success(`Order ${status}`);
    fetchData();
  };

  const handleDeleteUser = async (userId: string, email: string) => {
    if (!confirm(`Are you sure you want to delete user "${email}"? This cannot be undone.`)) return;
    const { data, error } = await supabase.functions.invoke('delete-user', { body: { user_id: userId } });
    if (error || data?.error) { toast.error(data?.error || error?.message || 'Failed to delete user'); return; }
    toast.success(`User "${email}" deleted`);
    fetchData();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const url = reader.result as string;
      setAvatarUrl(url);
      await supabase.from('profiles').update({ avatar_url: url }).eq('user_id', profile.user_id);
      toast.success('Avatar updated');
    };
    reader.readAsDataURL(file);
  };

  const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', key: 'dashboard' },
    { icon: Package, label: 'Products', key: 'products' },
    { icon: ShoppingCart, label: 'Orders', key: 'orders' },
    { icon: Users, label: 'Customers', key: 'customers' },
    { icon: BarChart3, label: 'Analytics', key: 'analytics' },
  ];

  const pendingCount = orders.filter(o => o.status === 'pending').length;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-card border-r border-border transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'w-60 translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-[72px]'}
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border shrink-0">
          <Link to="/" className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center shrink-0">
              <span className="text-primary-foreground font-bold text-lg">T</span>
            </div>
            {sidebarOpen && <span className="font-bold text-lg whitespace-nowrap">TechStore</span>}
          </Link>
          {sidebarOpen && (
            <Button variant="ghost" size="icon" className="h-8 w-8 lg:hidden shrink-0" onClick={() => setSidebarOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => (
            <button
              key={item.key}
              onClick={() => { setActiveTab(item.key); setSearchTerm(''); setSidebarOpen(false); }}
              title={item.label}
              className={`w-full flex items-center gap-3 rounded-lg transition-colors h-10
                ${sidebarOpen ? 'px-3' : 'justify-center px-0'}
                ${activeTab === item.key
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }
              `}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {sidebarOpen && <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-border shrink-0">
          <button
            onClick={handleLogout}
            title="Logout"
            className={`w-full flex items-center gap-3 rounded-lg h-10 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors
              ${sidebarOpen ? 'px-3' : 'justify-center px-0'}
            `}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="lg:pl-[72px] min-h-screen flex flex-col">
        {/* Top bar */}
        <header className="h-14 bg-card border-b border-border flex items-center justify-between px-4 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="font-semibold text-base capitalize hidden sm:block">{activeTab}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-9 w-9 relative">
              <Bell className="h-5 w-5" />
              {pendingCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive" />
              )}
            </Button>
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-primary flex items-center justify-center">
                  {avatarUrl || profile?.avatar_url ? (
                    <img src={avatarUrl || profile?.avatar_url || ''} alt="Admin" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-primary-foreground text-sm font-medium">{profile?.first_name?.[0] || 'A'}</span>
                  )}
                </div>
                <label className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-accent text-accent-foreground flex items-center justify-center cursor-pointer">
                  <Camera className="h-2.5 w-2.5" />
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </label>
              </div>
              <span className="hidden md:block text-sm font-medium">{profile?.first_name || 'Admin'}</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : (
            <>
              {/* DASHBOARD */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  {/* Stats */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                    {[
                      { label: 'Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, sub: `${orders.length} orders` },
                      { label: 'Orders', value: orders.length, icon: ShoppingBag, sub: `${pendingCount} pending` },
                      { label: 'Products', value: products.length, icon: Package, sub: `${products.filter(p => p.is_new).length} new` },
                      { label: 'Customers', value: customers.length, icon: Users, sub: `${lowStockProducts.length} low stock` },
                    ].map((s) => (
                      <div key={s.label} className="bg-card rounded-xl p-4 border border-border">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <s.icon className="h-4 w-4 text-primary" />
                          </div>
                          <span className="text-xs text-muted-foreground truncate">{s.sub}</span>
                        </div>
                        <p className="text-lg md:text-xl font-bold truncate">{s.value}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Charts */}
                  <div className="grid lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2 bg-card rounded-xl p-4 md:p-6 border border-border">
                      <h3 className="font-semibold text-sm mb-4">Revenue Overview</h3>
                      {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={260}>
                          <AreaChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v) => v.split('-')[2]} />
                            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v / 1000}k`} width={50} />
                            <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']} />
                            <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" strokeWidth={2} />
                          </AreaChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-[260px] flex items-center justify-center text-muted-foreground text-sm">No order data yet</div>
                      )}
                    </div>
                    <div className="bg-card rounded-xl p-4 md:p-6 border border-border">
                      <h3 className="font-semibold text-sm mb-4">By Brand</h3>
                      {pieData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={260}>
                          <PieChart>
                            <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={85} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                              {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-[260px] flex items-center justify-center text-muted-foreground text-sm">No products yet</div>
                      )}
                    </div>
                  </div>

                  {/* Pending Orders */}
                  <div className="bg-card rounded-xl p-4 md:p-6 border border-border">
                    <h3 className="font-semibold text-sm mb-4">Pending Orders ({pendingCount})</h3>
                    {pendingCount > 0 ? (
                      <div className="space-y-3">
                        {orders.filter(o => o.status === 'pending').slice(0, 5).map((order) => (
                          <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg bg-muted/50 border border-border">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 min-w-0">
                              <span className="font-mono text-xs text-muted-foreground">#{order.id.slice(0, 8)}</span>
                              <span className="font-semibold text-sm">${Number(order.total).toFixed(2)}</span>
                              <span className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</span>
                            </div>
                            <div className="flex gap-2 shrink-0">
                              <Button size="sm" className="h-8 gap-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => handleOrderAction(order.id, 'confirmed')}>
                                <Check className="h-3 w-3" /> Confirm
                              </Button>
                              <Button size="sm" variant="destructive" className="h-8 gap-1 text-xs" onClick={() => handleOrderAction(order.id, 'rejected')}>
                                <X className="h-3 w-3" /> Reject
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-6 text-sm">No pending orders</p>
                    )}
                  </div>
                </div>
              )}

              {/* PRODUCTS */}
              {activeTab === 'products' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div className="relative flex-1 max-w-sm">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search products..." className="pl-10 h-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                    <Button className="gap-2 h-9" onClick={openAddProduct}>
                      <Plus className="h-4 w-4" /> Add Product
                    </Button>
                  </div>

                  {/* Mobile cards / Desktop table */}
                  <div className="hidden md:block bg-card rounded-xl border border-border overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border bg-muted/50">
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Product</th>
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Brand</th>
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Price</th>
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Stock</th>
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredProducts.map((product) => (
                            <tr key={product.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  {product.images?.[0] && <img src={product.images[0]} alt="" className="w-9 h-9 rounded-lg object-cover shrink-0" />}
                                  <span className="font-medium truncate max-w-[200px]">{product.name}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-muted-foreground">{product.brand || '-'}</td>
                              <td className="py-3 px-4 font-medium">${Number(product.price).toFixed(2)}</td>
                              <td className="py-3 px-4">
                                <span className={(product.stock ?? 0) < 20 ? 'text-destructive font-medium' : ''}>{product.stock}</span>
                              </td>
                              <td className="py-3 px-4">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                  product.is_new ? 'bg-emerald-500/10 text-emerald-600' : product.is_featured ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                                }`}>
                                  {product.is_new ? 'New' : product.is_featured ? 'Featured' : 'Active'}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex gap-1">
                                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditProduct(product)}><Edit className="h-4 w-4" /></Button>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteProduct(product.id)}><Trash2 className="h-4 w-4" /></Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {filteredProducts.length === 0 && <p className="text-center py-8 text-muted-foreground text-sm">No products found</p>}
                  </div>

                  {/* Mobile product cards */}
                  <div className="md:hidden space-y-3">
                    {filteredProducts.map((product) => (
                      <div key={product.id} className="bg-card rounded-xl border border-border p-4">
                        <div className="flex items-start gap-3">
                          {product.images?.[0] && <img src={product.images[0]} alt="" className="w-14 h-14 rounded-lg object-cover shrink-0" />}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{product.name}</p>
                            <p className="text-xs text-muted-foreground">{product.brand || 'No brand'}</p>
                            <div className="flex items-center gap-3 mt-1.5">
                              <span className="font-semibold text-sm">${Number(product.price).toFixed(2)}</span>
                              <span className={`text-xs ${(product.stock ?? 0) < 20 ? 'text-destructive' : 'text-muted-foreground'}`}>Stock: {product.stock}</span>
                            </div>
                          </div>
                          <div className="flex gap-1 shrink-0">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditProduct(product)}><Edit className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteProduct(product.id)}><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {filteredProducts.length === 0 && <p className="text-center py-8 text-muted-foreground text-sm">No products found</p>}
                  </div>
                </div>
              )}

              {/* ORDERS */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search orders..." className="pl-10 h-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                  </div>

                  {/* Desktop table */}
                  <div className="hidden md:block bg-card rounded-xl border border-border overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border bg-muted/50">
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Order ID</th>
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Customer</th>
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Total</th>
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredOrders.map((order) => {
                            const customer = customers.find(c => c.user_id === order.user_id);
                            return (
                              <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                                <td className="py-3 px-4 font-mono text-xs">{order.id.slice(0, 8)}</td>
                                <td className="py-3 px-4">{customer ? `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || customer.email : 'Unknown'}</td>
                                <td className="py-3 px-4 font-medium">${Number(order.total).toFixed(2)}</td>
                                <td className="py-3 px-4">
                                  <StatusBadge status={order.status} />
                                </td>
                                <td className="py-3 px-4 text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</td>
                                <td className="py-3 px-4">
                                  <OrderActions order={order} onAction={handleOrderAction} />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    {filteredOrders.length === 0 && <p className="text-center py-8 text-muted-foreground text-sm">No orders found</p>}
                  </div>

                  {/* Mobile order cards */}
                  <div className="md:hidden space-y-3">
                    {filteredOrders.map((order) => {
                      const customer = customers.find(c => c.user_id === order.user_id);
                      return (
                        <div key={order.id} className="bg-card rounded-xl border border-border p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs text-muted-foreground">#{order.id.slice(0, 8)}</span>
                            <StatusBadge status={order.status} />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm truncate max-w-[60%]">{customer ? `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || customer.email : 'Unknown'}</span>
                            <span className="font-semibold">${Number(order.total).toFixed(2)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</span>
                            <OrderActions order={order} onAction={handleOrderAction} />
                          </div>
                        </div>
                      );
                    })}
                    {filteredOrders.length === 0 && <p className="text-center py-8 text-muted-foreground text-sm">No orders found</p>}
                  </div>
                </div>
              )}

              {/* CUSTOMERS */}
              {activeTab === 'customers' && (
                <div className="space-y-4">
                  <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search customers..." className="pl-10 h-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                  </div>

                  {/* Desktop table */}
                  <div className="hidden md:block bg-card rounded-xl border border-border overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border bg-muted/50">
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Customer</th>
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Email</th>
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Phone</th>
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Joined</th>
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Orders</th>
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredCustomers.map((customer) => {
                            const customerOrders = orders.filter(o => o.user_id === customer.user_id);
                            return (
                              <tr key={customer.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full overflow-hidden bg-muted flex items-center justify-center shrink-0">
                                      {customer.avatar_url ? (
                                        <img src={customer.avatar_url} alt="" className="w-full h-full object-cover" />
                                      ) : (
                                        <span className="text-xs font-medium">{(customer.first_name?.[0] || customer.email[0]).toUpperCase()}</span>
                                      )}
                                    </div>
                                    <span className="font-medium">{`${customer.first_name || ''} ${customer.last_name || ''}`.trim() || 'No name'}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-muted-foreground">{customer.email}</td>
                                <td className="py-3 px-4 text-muted-foreground">{customer.phone || '-'}</td>
                                <td className="py-3 px-4 text-muted-foreground">{new Date(customer.created_at).toLocaleDateString()}</td>
                                <td className="py-3 px-4 font-medium">{customerOrders.length}</td>
                                <td className="py-3 px-4">
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleDeleteUser(customer.user_id, customer.email)}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    {filteredCustomers.length === 0 && <p className="text-center py-8 text-muted-foreground text-sm">No customers found</p>}
                  </div>

                  {/* Mobile customer cards */}
                  <div className="md:hidden space-y-3">
                    {filteredCustomers.map((customer) => {
                      const customerOrders = orders.filter(o => o.user_id === customer.user_id);
                      return (
                        <div key={customer.id} className="bg-card rounded-xl border border-border p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex items-center justify-center shrink-0">
                              {customer.avatar_url ? (
                                <img src={customer.avatar_url} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-sm font-medium">{(customer.first_name?.[0] || customer.email[0]).toUpperCase()}</span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{`${customer.first_name || ''} ${customer.last_name || ''}`.trim() || 'No name'}</p>
                              <p className="text-xs text-muted-foreground truncate">{customer.email}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-xs text-muted-foreground">{customerOrders.length} orders</span>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteUser(customer.user_id, customer.email)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {filteredCustomers.length === 0 && <p className="text-center py-8 text-muted-foreground text-sm">No customers found</p>}
                  </div>
                </div>
              )}

              {/* ANALYTICS */}
              {activeTab === 'analytics' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3 md:gap-4">
                    <div className="bg-card rounded-xl p-4 md:p-6 border border-border">
                      <p className="text-xs text-muted-foreground mb-1">Avg Order</p>
                      <p className="text-xl md:text-2xl font-bold">${orders.length ? (totalRevenue / orders.length).toFixed(2) : '0.00'}</p>
                    </div>
                    <div className="bg-card rounded-xl p-4 md:p-6 border border-border">
                      <p className="text-xs text-muted-foreground mb-1">Success Rate</p>
                      <p className="text-xl md:text-2xl font-bold">{orders.length ? Math.round(orders.filter(o => ['confirmed', 'delivered', 'shipped'].includes(o.status)).length / orders.length * 100) : 0}%</p>
                    </div>
                    <div className="bg-card rounded-xl p-4 md:p-6 border border-border">
                      <p className="text-xs text-muted-foreground mb-1">Customers</p>
                      <p className="text-xl md:text-2xl font-bold">{customers.length}</p>
                    </div>
                  </div>

                  <div className="bg-card rounded-xl p-4 md:p-6 border border-border">
                    <h3 className="font-semibold text-sm mb-4">Revenue Trend</h3>
                    {chartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                          <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v.toLocaleString()}`} width={60} />
                          <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']} />
                          <Area type="monotone" dataKey="revenue" stroke="hsl(var(--accent))" fill="hsl(var(--accent) / 0.2)" strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-[300px] flex items-center justify-center text-muted-foreground text-sm">No data available</div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Product Modal */}
      <Dialog open={productModal} onOpenChange={setProductModal}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Add Product'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Product Name *</Label>
              <Input value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Price *</Label>
                <Input type="number" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Original Price</Label>
                <Input type="number" value={productForm.original_price} onChange={(e) => setProductForm({ ...productForm, original_price: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Brand</Label>
                <Input value={productForm.brand} onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Stock</Label>
                <Input type="number" value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Image URLs (one per line)</Label>
              <Textarea value={productForm.images} onChange={(e) => setProductForm({ ...productForm, images: e.target.value })} rows={3} placeholder="https://example.com/image1.jpg" />
            </div>
            <div className="space-y-1.5">
              <Label>Features (one per line)</Label>
              <Textarea value={productForm.features} onChange={(e) => setProductForm({ ...productForm, features: e.target.value })} rows={3} />
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={productForm.is_new} onChange={(e) => setProductForm({ ...productForm, is_new: e.target.checked })} className="rounded" />
                <span className="text-sm">New</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={productForm.is_featured} onChange={(e) => setProductForm({ ...productForm, is_featured: e.target.checked })} className="rounded" />
                <span className="text-sm">Featured</span>
              </label>
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setProductModal(false)}>Cancel</Button>
              <Button className="flex-1" onClick={handleSaveProduct}>
                {editingProduct ? 'Update' : 'Add'} Product
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Helper components
const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    delivered: 'bg-emerald-500/10 text-emerald-600',
    confirmed: 'bg-emerald-500/10 text-emerald-600',
    shipped: 'bg-blue-500/10 text-blue-600',
    cancelled: 'bg-destructive/10 text-destructive',
    rejected: 'bg-destructive/10 text-destructive',
    pending: 'bg-amber-500/10 text-amber-600',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[status] || styles.pending}`}>
      {status}
    </span>
  );
};

const OrderActions = ({ order, onAction }: { order: Order; onAction: (id: string, status: string) => void }) => {
  if (order.status === 'pending') {
    return (
      <div className="flex gap-1.5">
        <Button size="sm" className="h-7 gap-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => onAction(order.id, 'confirmed')}>
          <Check className="h-3 w-3" /> OK
        </Button>
        <Button size="sm" variant="destructive" className="h-7 gap-1 text-xs" onClick={() => onAction(order.id, 'rejected')}>
          <X className="h-3 w-3" /> No
        </Button>
      </div>
    );
  }
  if (order.status === 'confirmed') {
    return <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => onAction(order.id, 'shipped')}>Ship</Button>;
  }
  if (order.status === 'shipped') {
    return <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => onAction(order.id, 'delivered')}>Delivered</Button>;
  }
  return <span className="text-xs text-muted-foreground">—</span>;
};

export default AdminDashboard;
