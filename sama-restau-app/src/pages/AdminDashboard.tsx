import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Clock, 
  Euro, 
  Star, 
  Filter, 
  Plus, 
  MoreVertical,
  AlertTriangle,
  CheckCircle,
  Utensils,
  Menu as MenuIcon,
  QrCode,
  LogOut,
  X,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { supabase, Order, MenuItem } from '../lib/supabase';
import QRCodeModal from '../components/QRCodeModal';

// Extended order interface with items
interface OrderWithItems extends Order {
  order_items?: (OrderItem & { menu_item?: MenuItem })[];
  initials?: string;
  name?: string;
  table?: string;
  avatarColor?: string;
}

interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  quantity: number;
  price_at_time: number;
  menu_item?: MenuItem;
}

const stats = [
  { 
    label: 'Total Couverts', 
    value: '142', 
    change: '+12% vs hier',
    icon: Utensils,
    color: 'bg-primary-container/10 text-primary'
  },
  { 
    label: 'En Préparation', 
    value: '8', 
    change: null,
    icon: Clock,
    color: 'bg-secondary-container/20 text-secondary',
    pulse: true
  },
  { 
    label: 'CA du Soir', 
    value: '4 280 €', 
    change: null,
    icon: Euro,
    color: 'bg-tertiary-container/10 text-tertiary'
  },
  { 
    label: 'Satisfaction', 
    value: '4.9 / 5', 
    change: null,
    icon: Star,
    color: 'bg-primary-container text-white'
  },
];

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'preparing':
      return { label: 'En préparation', class: 'bg-secondary-container text-on-secondary-container', dot: 'bg-secondary' };
    case 'received':
      return { label: 'Reçue', class: 'bg-primary-container/20 text-primary', dot: 'bg-primary' };
    case 'ready':
      return { label: 'Prête', class: 'bg-green-100 text-green-700', dot: 'bg-green-600' };
    case 'arrived':
      return { label: 'Arrivée', class: 'bg-stone-100 text-stone-500', icon: CheckCircle };
    default:
      return { label: status, class: 'bg-surface-container-high text-on-surface-variant', dot: 'bg-on-surface-variant' };
  }
};

const alerts = [
  {
    type: 'warning',
    title: 'Ingrédient Manquant',
    message: 'Stock de "Truffe Noire" critique (< 200g)',
    action: 'Commander',
    borderColor: 'border-secondary',
    bgColor: 'bg-secondary-container/10'
  },
  {
    type: 'info',
    title: 'Nouveaux Avis',
    message: '5 nouvelles notes 5 étoiles sur Google Maps',
    action: 'Voir',
    borderColor: 'border-primary',
    bgColor: 'bg-primary-container/5'
  }
];

const notifications = [
  { id: 1, icon: '🍽️', title: 'Table 12 — Commande prête', time: 'il y a 2 min', unread: true },
  { id: 2, icon: '⚠️', title: 'Stock truffe noire critique', time: 'il y a 15 min', unread: true },
  { id: 3, icon: '⭐', title: '5 nouveaux avis 5 étoiles', time: 'il y a 1h', unread: true },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showNewTableModal, setShowNewTableModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [orderActionMenu, setOrderActionMenu] = useState<string | null>(null);
  const [newTableName, setNewTableName] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [notifCount, setNotifCount] = useState(3);
  
  // Real data states
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOrderDetails, setShowOrderDetails] = useState<OrderWithItems | null>(null);
  const [showQRCode, setShowQRCode] = useState<OrderWithItems | null>(null);

  // Fetch real data from Supabase
  useEffect(() => {
    fetchOrders();
    fetchMenuItems();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            menu_item:menu_items (*)
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      if (data) {
        // Add mock data properties for compatibility
        const ordersWithMock = data.map(order => ({
          ...order,
          initials: order.customer_name?.split(' ').map((n: string) => n[0]).join('') || 'CL',
          name: order.customer_name || 'Client',
          table: order.table || 'N/A',
          avatarColor: 'bg-primary/10 text-primary'
        }));
        setOrders(ordersWithMock);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMenuItems = async () => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('category');
      
      if (error) throw error;
      if (data) setMenuItems(data as MenuItem[]);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  const handleOrderAction = async (orderId: string, newStatus: string) => {
    const statusMap: Record<string, string> = {
      'En préparation': 'preparing',
      'Reçue': 'received',
      'Prête': 'ready',
      'Arrivée': 'arrived'
    };
    
    try {
      await supabase
        .from('orders')
        .update({ status: statusMap[newStatus] })
        .eq('id', orderId);
      
      setOrders(orders.map((order: OrderWithItems) => 
        order.id.toString() === orderId ? { ...order, status: statusMap[newStatus] as any } : order
      ));
      setOrderActionMenu(null);
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  const handleDeleteMenuItem = async (itemId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return;
    
    try {
      await supabase.from('menu_items').delete().eq('id', itemId);
      setMenuItems(menuItems.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error deleting menu item:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const handleBellClick = () => {
    setShowNotifications(prev => !prev);
    if (!showNotifications) setNotifCount(0);
  };

  const handleNotificationClick = (notification: any) => {
    if (notification.title.includes('Commande')) {
      setActiveTab('orders');
    } else if (notification.title.includes('Stock')) {
      alert('Redirection vers la gestion des stocks...');
    } else if (notification.title.includes('Avis')) {
      window.open('https://maps.google.com', '_blank');
    }
    setShowNotifications(false);
  };

  const handleAlertAction = (alertType: string) => {
    if (alertType === 'warning') {
      alert('Redirection vers la page de commande fournisseur...');
    } else {
      alert('Ouverture des avis Google Maps...');
    }
  };

  const handleEditOffer = () => alert('Ouverture de l\'éditeur de promotion...');

  // Render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboardContent();
      case 'orders':
        return renderOrdersContent();
      case 'menu':
        return renderMenuContent();
      case 'scanner':
        return renderScannerContent();
      default:
        return renderDashboardContent();
    }
  };

  // Dashboard Content
  const renderDashboardContent = () => (
    <>
      {/* Bento Stats Overview */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-surface-container-lowest p-4 lg:p-6 rounded-2xl lg:rounded-[2rem] shadow-sm border border-outline-variant/10">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 lg:p-3 rounded-xl lg:rounded-2xl ${stat.color}`}>
                <stat.icon size={20} className="lg:w-6 lg:h-6" />
              </div>
              {stat.change && (
                <span className="text-[10px] lg:text-xs font-bold text-secondary uppercase tracking-wider">
                  {stat.change}
                </span>
              )}
              {stat.pulse && (
                <div className="w-2 h-2 lg:w-3 lg:h-3 rounded-full bg-secondary animate-pulse"></div>
              )}
            </div>
            <p className="text-on-surface-variant font-label text-xs lg:text-sm uppercase tracking-wider font-bold">
              {stat.label}
            </p>
            <h3 className="font-headline text-xl lg:text-3xl font-bold text-on-surface mt-1">{stat.value}</h3>
          </div>
        ))}
      </section>

      {/* Main Order Table - Preview */}
      <section className="bg-surface-container-low rounded-2xl lg:rounded-[2.5rem] overflow-hidden">
        <div className="p-4 lg:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-container-high/50">
          <div>
            <h3 className="font-headline text-xl lg:text-2xl font-bold text-on-surface">Commandes récentes</h3>
            <p className="text-on-surface-variant font-body mt-1 text-sm">Aperçu des dernières commandes</p>
          </div>
          <button 
            onClick={() => setActiveTab('orders')}
            className="bg-primary px-6 py-3 rounded-full text-white font-bold text-sm hover:opacity-90 transition-opacity"
          >
            Voir toutes les commandes
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] uppercase tracking-[0.15em] font-bold text-on-surface-variant/70 border-b border-outline-variant/20">
                <th className="px-4 lg:px-8 py-4 lg:py-6">Nom du client</th>
                <th className="px-4 lg:px-8 py-4 lg:py-6 hidden sm:table-cell">Couverts</th>
                <th className="px-4 lg:px-8 py-4 lg:py-6">Heure</th>
                <th className="px-4 lg:px-8 py-4 lg:py-6">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {orders.slice(0, 3).map((order) => {
                const status = getStatusConfig(order.status);
                return (
                  <tr key={order.id} className="hover:bg-surface-container-lowest/40">
                    <td className="px-4 lg:px-8 py-4 lg:py-6">
                      <div className="flex items-center gap-3 lg:gap-4">
                        <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center font-bold text-xs lg:text-sm ${order.avatarColor}`}>
                          {order.initials}
                        </div>
                        <div>
                          <p className="font-bold text-on-surface text-sm lg:text-base">{order.name}</p>
                          <p className="text-xs text-on-surface-variant">Table {order.table}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 lg:px-8 py-4 lg:py-6 hidden sm:table-cell">
                      <span className="font-bold text-on-surface-variant text-sm">{order.guest_count} personnes</span>
                    </td>
                    <td className="px-4 lg:px-8 py-4 lg:py-6">
                      <span className="font-body text-on-surface-variant text-sm">
                        {new Date(order.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>
                    <td className="px-4 lg:px-8 py-4 lg:py-6">
                      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase ${status.class}`}>
                        {status.icon ? <status.icon size={12} /> : <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`}></span>}
                        <span className="hidden sm:inline">{status.label}</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Bottom Layout Section: Alerts & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Alerts Card */}
        <div className="lg:col-span-2 bg-surface-container-lowest p-4 lg:p-8 rounded-2xl lg:rounded-[2rem] border border-outline-variant/10 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle size={20} className="text-secondary" />
              <h4 className="font-headline text-lg font-bold">Alertes Cuisine</h4>
            </div>
            <div className="space-y-4">
              {alerts.map((alert, idx) => (
                <div key={idx} className={`p-4 rounded-2xl border-l-4 ${alert.borderColor} ${alert.bgColor} flex justify-between items-center`}>
                  <div>
                    <p className="font-bold text-on-surface text-sm">{alert.title}</p>
                    <p className="text-xs lg:text-sm text-on-surface-variant">{alert.message}</p>
                  </div>
                  <button 
                    onClick={() => handleAlertAction(alert.type)}
                    className={`font-bold text-xs uppercase tracking-widest hover:underline ${
                      alert.type === 'warning' ? 'text-secondary' : 'text-primary'
                    }`}
                  >
                    {alert.action}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Card/Visual */}
        <div className="bg-primary rounded-2xl lg:rounded-[2rem] p-4 lg:p-8 text-white relative overflow-hidden group min-h-[200px] lg:min-h-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-container to-primary opacity-90"></div>
          <div className="relative z-10 h-full flex flex-col justify-end">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2 opacity-80">Promotion du Moment</span>
            <h4 className="font-headline text-xl lg:text-2xl font-bold mb-4">Menu Dégustation "Escale d'Automne"</h4>
            <button 
              onClick={handleEditOffer}
              className="w-fit px-4 lg:px-6 py-2 bg-white text-primary rounded-full font-bold text-xs uppercase tracking-widest hover:bg-secondary-container hover:text-on-secondary-container transition-colors"
            >
              Éditer l'offre
            </button>
          </div>
        </div>
      </div>
    </>
  );

  // Orders Content
  const renderOrdersContent = () => (
    <section className="bg-surface-container-low rounded-2xl lg:rounded-[2.5rem] overflow-hidden">
      <div className="p-4 lg:p-8">
        <h3 className="font-headline text-2xl font-bold text-on-surface mb-2">Toutes les Commandes</h3>
        <p className="text-on-surface-variant mb-6">Gérez et suivez toutes les commandes clients</p>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-on-surface-variant">Chargement des commandes...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <Utensils size={48} className="mx-auto mb-4 text-on-surface-variant/40" />
            <p className="text-on-surface-variant">Aucune commande pour le moment</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] uppercase tracking-[0.15em] font-bold text-on-surface-variant/70 border-b border-outline-variant/20">
                  <th className="px-4 py-4">Client</th>
                  <th className="px-4 py-4 hidden sm:table-cell">Couverts</th>
                  <th className="px-4 py-4">Heure</th>
                  <th className="px-4 py-4">Statut</th>
                  <th className="px-4 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {orders.map((order) => {
                  const status = getStatusConfig(order.status);
                  return (
                    <tr key={order.id} className="hover:bg-surface-container-lowest/40">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${order.avatarColor}`}>
                            {order.initials}
                          </div>
                          <div>
                            <p className="font-bold text-on-surface text-sm">{order.name}</p>
                            <p className="text-xs text-on-surface-variant">Table {order.table}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden sm:table-cell">
                        <span className="text-sm text-on-surface-variant">{order.guest_count} personnes</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-on-surface-variant">
                          {new Date(order.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase ${status.class}`}>
                          {status.icon ? <status.icon size={12} /> : <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`}></span>}
                          <span className="hidden sm:inline">{status.label}</span>
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="relative inline-block">
                          <button 
                            onClick={() => setOrderActionMenu(order.id === orderActionMenu ? null : order.id)}
                            className="p-2 hover:bg-surface-container-high rounded-full transition-colors"
                          >
                            <MoreVertical size={18} />
                          </button>
                          {orderActionMenu === order.id && (
                            <div className="absolute right-0 top-10 w-48 bg-white rounded-xl shadow-xl border border-outline-variant/20 z-20 overflow-hidden">
                              {['En préparation', 'Reçue', 'Prête', 'Arrivée'].map(action => (
                                <button
                                  key={action}
                                  onClick={() => handleOrderAction(order.id, action)}
                                  className="w-full text-left px-4 py-3 text-sm hover:bg-surface-container-low transition-colors"
                                >
                                  {action}
                                </button>
                              ))}
                              <div className="border-t border-outline-variant/10">
                                <button
                                  onClick={() => {
                                    setShowOrderDetails(order);
                                    setOrderActionMenu(null);
                                  }}
                                  className="w-full text-left px-4 py-3 text-sm hover:bg-primary/10 text-primary transition-colors flex items-center gap-2"
                                >
                                  <Eye size={16} /> Voir détails
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );

  // Menu Management Content
  const renderMenuContent = () => (
    <section className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-headline text-2xl font-bold text-on-surface">Gestion du Menu</h3>
          <p className="text-on-surface-variant">Ajoutez, modifiez ou supprimez des articles</p>
        </div>
        <button 
          onClick={() => alert('Fonctionnalité d\'ajout à venir')}
          className="bg-primary text-white px-6 py-3 rounded-full font-bold text-sm flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <Plus size={18} /> Ajouter
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        </div>
      ) : menuItems.length === 0 ? (
        <div className="text-center py-12">
          <MenuIcon size={48} className="mx-auto mb-4 text-on-surface-variant/40" />
          <p className="text-on-surface-variant">Aucun article dans le menu</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <div key={item.id} className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border border-outline-variant/10">
              <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-headline text-lg font-bold text-on-surface">{item.name}</h4>
                  <span className="font-bold text-primary">{item.price}€</span>
                </div>
                <p className="text-sm text-on-surface-variant mb-4 line-clamp-2">{item.description}</p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => alert('Modification à venir')}
                    className="flex-1 bg-surface-container-high text-on-surface py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-surface-container"
                  >
                    <Edit size={16} /> Modifier
                  </button>
                  <button 
                    onClick={() => handleDeleteMenuItem(item.id)}
                    className="px-4 bg-red-50 text-red-500 py-2 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );

  // QR Scanner Content
  const renderScannerContent = () => (
    <section className="bg-surface-container-low rounded-2xl lg:rounded-[2.5rem] overflow-hidden p-8 lg:p-12">
      <div className="text-center max-w-2xl mx-auto">
        <div className="w-24 h-24 bg-primary-container/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <QrCode size={48} className="text-primary" />
        </div>
        <h3 className="font-headline text-3xl font-bold text-on-surface mb-4">Scanner QR Code</h3>
        <p className="text-on-surface-variant mb-8">Scannez le code QR d'une commande pour voir les détails</p>
        
        <div className="bg-surface-container-lowest rounded-2xl p-8 border-2 border-dashed border-outline-variant/30">
          <p className="text-on-surface-variant mb-4">Fonctionnalité de scan à venir</p>
          <button 
            onClick={() => alert('Ouverture de la caméra...')}
            className="bg-primary text-white px-8 py-4 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
          >
            Ouvrir le Scanner
          </button>
        </div>
      </div>
    </section>
  );

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col h-screen w-72 border-r border-outline-variant/20 bg-surface py-8 sticky top-0 shrink-0">
        <div className="px-8 mb-12">
          <h1 className="font-headline text-2xl font-bold text-primary">Management</h1>
        </div>
        <nav className="flex-1 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center space-x-4 w-full px-6 py-4 cursor-pointer transition-all ${
              activeTab === 'dashboard' 
                ? 'bg-primary-container/10 text-primary border-r-4 border-primary' 
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <LayoutDashboard size={20} />
            <span className="font-body font-medium">Dashboard</span>
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`flex items-center space-x-4 w-full px-6 py-4 cursor-pointer transition-all ${
              activeTab === 'orders' 
                ? 'bg-primary-container/10 text-primary border-r-4 border-primary' 
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <Clock size={20} />
            <span className="font-body font-medium">Orders</span>
          </button>
          <button 
            onClick={() => setActiveTab('menu')}
            className={`flex items-center space-x-4 w-full px-6 py-4 cursor-pointer transition-all ${
              activeTab === 'menu' 
                ? 'bg-primary-container/10 text-primary border-r-4 border-primary' 
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <MenuIcon size={20} />
            <span className="font-body font-medium">Menu Management</span>
          </button>
          <button 
            onClick={() => setActiveTab('scanner')}
            className={`flex items-center space-x-4 w-full px-6 py-4 cursor-pointer transition-all ${
              activeTab === 'scanner' 
                ? 'bg-primary-container/10 text-primary border-r-4 border-primary' 
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <QrCode size={20} />
            <span className="font-body font-medium">QR Scanner</span>
          </button>
        </nav>
        <div className="px-6 mt-auto">
          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-white font-bold">
              MA
            </div>
            <div>
              <p className="text-sm font-bold text-on-surface">Chef Marc-Antoine</p>
              <p className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-72 bg-surface z-50 transform transition-transform lg:hidden ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="font-headline text-2xl font-bold text-primary">Management</h1>
            <button onClick={() => setSidebarOpen(false)}>
              <LogOut size={24} className="text-on-surface-variant" />
            </button>
          </div>
          <nav className="space-y-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'orders', label: 'Orders', icon: Clock },
              { id: 'menu', label: 'Menu Management', icon: MenuIcon },
              { id: 'scanner', label: 'QR Scanner', icon: QrCode },
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                className={`flex items-center space-x-4 w-full px-4 py-3 rounded-lg cursor-pointer transition-all ${
                  activeTab === item.id 
                    ? 'bg-primary-container/10 text-primary' 
                    : 'text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                <item.icon size={20} />
                <span className="font-body font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* TopAppBar */}
        <header className="bg-surface/80 backdrop-blur-lg sticky top-0 z-30 flex justify-between items-center w-full px-4 lg:px-8 py-4 lg:py-6 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg bg-surface-container-high"
            >
              <MenuIcon size={20} />
            </button>
            <div className="hidden sm:flex p-2 rounded-lg bg-primary/5 text-primary">
              <span className="text-xl">📍</span>
            </div>
            <h2 className="font-headline text-lg lg:text-xl font-bold tracking-tight text-primary">
              L'Escale Terracotta - {activeTab === 'dashboard' ? 'Dashboard' : activeTab === 'orders' ? 'Commandes' : activeTab === 'menu' ? 'Menu' : 'Scanner'}
            </h2>
          </div>
          <div className="flex items-center gap-4 lg:gap-6">
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-on-surface">
                {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              <p className="text-xs text-on-surface-variant">
                {new Date().toLocaleTimeString('fr-FR')}
              </p>
            </div>
            <div className="relative">
              <button 
                onClick={handleBellClick}
                className="relative cursor-pointer text-primary hover:opacity-80 transition-opacity p-2"
              >
                <span className="text-xl">🔔</span>
                {notifCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-secondary text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                    {notifCount}
                  </span>
                )}
              </button>
              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl border border-outline-variant/20 z-50 overflow-hidden">
                  <div className="flex justify-between items-center px-5 py-4 border-b border-outline-variant/10">
                    <h4 className="font-headline font-bold text-on-surface">Notifications</h4>
                    <button onClick={() => setShowNotifications(false)} className="text-on-surface-variant hover:text-primary text-xs font-bold">Fermer ✕</button>
                  </div>
                  <div className="divide-y divide-outline-variant/10">
                    {notifications.map(n => (
                      <button 
                        key={n.id} 
                        onClick={() => handleNotificationClick(n)}
                        className="w-full text-left flex items-start gap-3 px-5 py-4 hover:bg-surface-container-low transition-colors"
                      >
                        <span className="text-xl mt-0.5">{n.icon}</span>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-on-surface">{n.title}</p>
                          <p className="text-xs text-on-surface-variant mt-0.5">{n.time}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="px-5 py-3 border-t border-outline-variant/10 text-center">
                    <button className="text-xs font-bold text-primary hover:underline">Voir toutes les notifications</button>
                  </div>
                </div>
              )}
            </div>
            <div className="p-2 rounded-lg bg-surface-container-high text-on-surface-variant cursor-pointer">
              <span className="text-xl">🛍️</span>
            </div>
          </div>
        </header>

        {/* Dynamic Tab Content */}
        <div className="p-4 lg:p-8 space-y-6 lg:space-y-10">
          {renderTabContent()}
        </div>
      </main>

      {/* Order Details Modal */}
      {showOrderDetails && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowOrderDetails(null)}>
          <div className="bg-white rounded-3xl p-6 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline text-2xl font-bold text-on-surface">Détails de la commande</h3>
              <button onClick={() => setShowOrderDetails(null)} className="p-2 hover:bg-surface-container-high rounded-full">
                <X size={24} className="text-on-surface-variant" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4 pb-4 border-b border-outline-variant/20">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${showOrderDetails.avatarColor}`}>
                  {showOrderDetails.initials}
                </div>
                <div>
                  <p className="font-bold text-on-surface">{showOrderDetails.name}</p>
                  <p className="text-sm text-on-surface-variant">Table {showOrderDetails.table} • {showOrderDetails.guest_count} personnes</p>
                  <p className="text-xs text-on-surface-variant">
                    {new Date(showOrderDetails.created_at).toLocaleString('fr-FR')}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-on-surface mb-4">Articles commandés</h4>
                <div className="space-y-3">
                  {showOrderDetails.order_items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-3 border-b border-outline-variant/10 last:border-0">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-primary">{item.quantity}x</span>
                        <div>
                          <p className="font-medium text-on-surface">{item.menu_item?.name || 'Article'}</p>
                          <p className="text-xs text-on-surface-variant">{item.menu_item?.description || ''}</p>
                        </div>
                      </div>
                      <span className="font-bold text-on-surface">{(item.quantity * item.price_at_time).toFixed(2)}€</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-outline-variant/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-on-surface-variant">Sous-total</span>
                  <span className="font-medium">{showOrderDetails.total_amount.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold">
                  <span className="text-on-surface">Total</span>
                  <span className="text-primary">{showOrderDetails.total_amount.toFixed(2)}€</span>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setShowQRCode(showOrderDetails)}
                  className="flex-1 bg-primary text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                >
                  <QrCode size={18} /> Voir QR Code
                </button>
                <button 
                  onClick={() => setShowOrderDetails(null)}
                  className="flex-1 bg-surface-container-high text-on-surface py-3 rounded-xl font-bold"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Filtrer */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowFilterModal(false)}>
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-headline text-xl font-bold mb-6">Filtrer les commandes</h3>
            <div className="space-y-3 mb-6">
              {[{val:'all',label:'Toutes'},{val:'preparing',label:'En préparation'},{val:'received',label:'Reçue'},{val:'ready',label:'Prête'},{val:'arrived',label:'Arrivée'}].map(opt => (
                <button
                  key={opt.val}
                  onClick={() => setFilterStatus(opt.val)}
                  className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-colors ${
                    filterStatus === opt.val ? 'bg-primary text-white' : 'bg-surface-container-low hover:bg-surface-container-high text-on-surface'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowFilterModal(false)} className="flex-1 py-3 rounded-full border border-outline-variant font-bold text-sm text-on-surface">Annuler</button>
              <button onClick={() => setShowFilterModal(false)} className="flex-1 py-3 rounded-full bg-primary text-white font-bold text-sm">Appliquer</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nouvelle Table */}
      {showNewTableModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowNewTableModal(false)}>
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-headline text-xl font-bold mb-6">Nouvelle Table</h3>
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2 block">Numéro de table</label>
                <input
                  type="text"
                  value={newTableName}
                  onChange={e => setNewTableName(e.target.value)}
                  placeholder="Ex: Table 07"
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface font-body focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2 block">Couverts</label>
                <div className="flex gap-2">
                  {[2,4,6,8].map(n => (
                    <button key={n} className="flex-1 py-2.5 rounded-xl bg-surface-container-low hover:bg-primary hover:text-white font-bold text-sm transition-colors">{n}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowNewTableModal(false)} className="flex-1 py-3 rounded-full border border-outline-variant font-bold text-sm text-on-surface">Annuler</button>
              <button onClick={() => { alert(`Table "${newTableName}" créée !`); setShowNewTableModal(false); setNewTableName(''); }} className="flex-1 py-3 rounded-full bg-primary text-white font-bold text-sm">Créer</button>
            </div>
          </div>
        </div>
      )}

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
