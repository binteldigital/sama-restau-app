import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ShoppingBag, Clock, CheckCircle, Utensils, ChevronRight, QrCode } from 'lucide-react';
import { supabase, Order, MenuItem } from '../lib/supabase';
import QRCodeModal from '../components/QRCodeModal';

// Extended order interface
interface OrderWithItems extends Order {
  order_items?: (OrderItem & { menu_item?: MenuItem })[];
}

interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  quantity: number;
  price_at_time: number;
  menu_item?: MenuItem;
}

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'confirmed':
      return {
        label: 'Confirmée',
        color: 'bg-secondary-container text-on-secondary-container',
        icon: Clock
      };
    case 'completed':
      return {
        label: 'Terminée',
        color: 'bg-green-100 text-green-700',
        icon: CheckCircle
      };
    default:
      return {
        label: 'En cours',
        color: 'bg-primary-container/20 text-primary',
        icon: Utensils
      };
  }
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [showQRCode, setShowQRCode] = useState<OrderWithItems | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // In a real app, you would get the user ID from auth
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            menu_item:menu_items (*)
          )
        `)
        // .eq('user_id', userId) // Uncomment when auth is implemented
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      if (data) setOrders(data as OrderWithItems[]);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-surface pb-24">
      {/* Header */}
      <header className="bg-surface/80 backdrop-blur-lg sticky top-0 z-50 shadow-sm">
        <div className="flex justify-between items-center w-full px-6 py-4">
          <div className="flex items-center space-x-2 text-primary">
            <MapPin size={20} />
            <span className="font-headline text-lg font-bold tracking-tight">L'Escale Terracotta</span>
          </div>
        </div>
      </header>

      <main className="px-6 pt-8 pb-32">
        {/* Hero Section */}
        <section className="mb-8">
          <h1 className="font-headline text-4xl font-bold text-on-background mb-2">Mes Commandes</h1>
          <p className="font-body text-on-surface-variant">Historique de vos expériences gastronomiques</p>
        </section>

        {/* Orders List */}
        <section className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-4 text-on-surface-variant">Chargement des commandes...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag size={48} className="mx-auto mb-4 text-on-surface-variant/40" />
              <h2 className="font-headline text-2xl font-bold text-on-surface mb-2">Aucune commande</h2>
              <p className="text-on-surface-variant mb-6">Vous n'avez pas encore passé de commande</p>
              <Link 
                to="/" 
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary-container text-white px-8 py-3 rounded-xl font-bold"
              >
                Découvrir le menu
              </Link>
            </div>
          ) : (
            orders.map((order) => {
              const statusConfig = getStatusConfig(order.status);
              const StatusIcon = statusConfig.icon;
              
              return (
                <div 
                  key={order.id} 
                  className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/10 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-headline text-lg font-bold text-primary">Commande #{order.id.toString().slice(-5)}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 ${statusConfig.color}`}>
                          <StatusIcon size={12} />
                          {statusConfig.label}
                        </span>
                      </div>
                      <p className="text-sm text-on-surface-variant">
                        {new Date(order.created_at).toLocaleDateString('fr-FR', { 
                          weekday: 'long', 
                          day: 'numeric', 
                          month: 'long',
                          year: 'numeric'
                        })} • {new Date(order.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <span className="font-headline text-xl font-bold text-primary">{order.total_amount.toFixed(2)}€</span>
                  </div>

                  {/* Items */}
                  <div className="space-y-2 mb-4">
                    {order.order_items?.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-on-surface-variant">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                        <span>{item.quantity}x {item.menu_item?.name || 'Article'}</span>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t border-outline-variant/20">
                    {order.status === 'confirmed' && (
                      <button 
                        onClick={() => setShowQRCode(order)}
                        className="flex-1 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                      >
                        <QrCode size={16} /> Voir QR Code
                      </button>
                    )}
                    <button 
                      onClick={() => alert('Fonctionnalité détails à venir')}
                      className="flex-1 py-2 bg-surface-container-high text-on-surface rounded-lg text-sm font-bold hover:bg-surface-container transition-colors flex items-center justify-center gap-1"
                    >
                      Détails
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </section>

        {/* Empty State (shown if no orders) */}
        {orders.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-surface-container-low rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag size={40} className="text-on-surface-variant" />
            </div>
            <h2 className="font-headline text-2xl font-bold text-on-surface mb-2">Aucune commande</h2>
            <p className="text-on-surface-variant mb-6">Vous n'avez pas encore passé de commande</p>
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary-container text-white px-8 py-3 rounded-xl font-bold"
            >
              Découvrir le menu
            </Link>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-3 bg-surface/80 backdrop-blur-lg z-50 rounded-t-[2rem] border-t border-stone-200/20 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <Link to="/" className="flex flex-col items-center justify-center text-on-surface-variant px-5 py-2 hover:text-secondary active:scale-90 transition-transform duration-200">
          <span className="text-xs">🍽️</span>
          <span className="font-label text-[10px] uppercase tracking-[0.05em] font-bold">Menu</span>
        </Link>
        <Link to="/cart" className="flex flex-col items-center justify-center text-on-surface-variant px-5 py-2 hover:text-secondary active:scale-90 transition-transform duration-200">
          <ShoppingBag size={20} />
          <span className="font-label text-[10px] uppercase tracking-[0.05em] font-bold">Cart</span>
        </Link>
        <button className="flex flex-col items-center justify-center bg-primary-container text-white rounded-full px-5 py-2 active:scale-90 transition-transform duration-200">
          <span className="text-xs">📋</span>
          <span className="font-label text-[10px] uppercase tracking-[0.05em] font-bold">My Orders</span>
        </button>
      </nav>

      {/* QR Code Modal */}
      {showQRCode && (
        <QRCodeModal
          orderId={showQRCode.id.toString()}
          orderData={showQRCode}
          onClose={() => setShowQRCode(null)}
        />
      )}
    </div>
  );
}
