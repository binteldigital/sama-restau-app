import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Plus, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

// Types
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

// Categories with representative images
const categories = [
  { 
    id: 'Plats', 
    name: 'Plats', 
    image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&auto=format&fit=crop'
  },
  { 
    id: 'Desserts', 
    name: 'Desserts', 
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800&auto=format&fit=crop'
  },
  { 
    id: 'Boissons', 
    name: 'Boissons', 
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&auto=format&fit=crop'
  },
  { 
    id: 'Snacks', 
    name: 'Snacks', 
    image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=800&auto=format&fit=crop'
  }
];

// Menu items organized by category
const menuItemsByCategory: Record<string, MenuItem[]> = {
  Plats: [
    { id: '1', name: 'Risotto aux cèpes', description: 'Riz crémeux aux champignons', price: 18, image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&auto=format&fit=crop' },
    { id: '2', name: 'Saumon Grillé', description: 'Avec légumes de saison', price: 22, image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&auto=format&fit=crop' },
    { id: '5', name: 'Poulet Rôti', description: 'Pommes de terre et herbes', price: 16, image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800&auto=format&fit=crop' },
    { id: '6', name: 'Burger Gourmet', description: 'Bœuf, cheddar, bacon', price: 14, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop' },
    { id: '7', name: 'Pâtes Carbonara', description: 'Crème, lardons, parmesan', price: 13, image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&auto=format&fit=crop' },
    { id: '8', name: 'Steak Frites', description: 'Entrecôte, sauce béarnaise', price: 24, image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&auto=format&fit=crop' },
  ],
  Desserts: [
    { id: '3', name: 'Fondant au chocolat', description: 'Cœur coulant', price: 8, image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800&auto=format&fit=crop' },
    { id: '4', name: 'Panna Cotta', description: 'Coulis fruits rouges', price: 7, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&auto=format&fit=crop' },
    { id: '9', name: 'Tiramisu', description: 'Café, mascarpone', price: 8, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&auto=format&fit=crop' },
    { id: '10', name: 'Crème Brûlée', description: 'Vanille bourbon', price: 7, image: 'https://images.unsplash.com/photo-1470324161839-ce2bb6fa6bc3?w=800&auto=format&fit=crop' },
    { id: '11', name: 'Mousse au Chocolat', description: 'Chocolat noir 70%', price: 6, image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=800&auto=format&fit=crop' },
    { id: '12', name: 'Tarte Tatin', description: 'Pommes caramélisées', price: 8, image: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=800&auto=format&fit=crop' },
  ],
  Boissons: [
    { id: '13', name: 'Coca-Cola', description: '33cl', price: 3, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&auto=format&fit=crop' },
    { id: '14', name: 'Jus d\'Orange', description: 'Frais pressé', price: 4, image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=800&auto=format&fit=crop' },
    { id: '15', name: 'Eau Minérale', description: '50cl', price: 2, image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=800&auto=format&fit=crop' },
    { id: '16', name: 'Thé à la Menthe', description: 'Thé vert, menthe fraîche', price: 3, image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&auto=format&fit=crop' },
    { id: '17', name: 'Café Espresso', description: 'Intense', price: 2.5, image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=800&auto=format&fit=crop' },
    { id: '18', name: 'Smoothie', description: 'Fruits rouges', price: 5, image: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=800&auto=format&fit=crop' },
  ],
  Snacks: [
    { id: '19', name: 'Frites', description: 'Maison, sauce au choix', price: 4, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&auto=format&fit=crop' },
    { id: '20', name: 'Nachos', description: 'Fromage, jalapeños', price: 6, image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=800&auto=format&fit=crop' },
    { id: '21', name: 'Ailes de Poulet', description: 'Sauce BBQ', price: 8, image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=800&auto=format&fit=crop' },
    { id: '22', name: 'Onion Rings', description: 'Panés croustillants', price: 5, image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=800&auto=format&fit=crop' },
    { id: '23', name: 'Mozzarella Sticks', description: 'Sauce tomate', price: 6, image: 'https://images.unsplash.com/photo-1548340748-6d2f3f94c25b?w=800&auto=format&fit=crop' },
    { id: '24', name: 'Salade César', description: 'Poulet, croûtons', price: 9, image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=800&auto=format&fit=crop' },
  ]
};

export default function MenuPage() {
  const { addItem, totalItems } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleAddToCart = (item: MenuItem, categoryId: string) => {
    addItem({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      image: item.image,
      category: categoryId
    });
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="bg-surface/80 backdrop-blur-lg sticky top-0 z-50 shadow-sm">
        <div className="flex justify-between items-center w-full px-6 py-4">
          <div className="flex items-center space-x-2 text-primary">
            <MapPin size={20} />
            <span className="font-headline text-lg font-bold tracking-tight">L'Escale Terracotta</span>
          </div>
          <Link to="/cart" className="relative text-primary hover:opacity-80 transition-opacity active:scale-95 duration-200">
            <ShoppingBag size={24} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-secondary text-white text-xs flex items-center justify-center rounded-full font-bold">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </header>

      <main className="pb-32">
        {/* Hero Section */}
        <section className="px-6 pt-8 pb-4">
          <h1 className="font-headline text-4xl font-bold text-on-background mb-2">Notre Menu</h1>
          <p className="font-body text-on-surface-variant max-w-xs">Savourez une cuisine authentique dans un cadre inspiré par la terre.</p>
        </section>

        {/* Categories Grid - Main View */}
        {!selectedCategory ? (
          <section className="px-6 mb-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-headline text-2xl font-bold">Nos Catégories</h2>
              <div className="h-[2px] flex-grow ml-4 bg-outline-variant opacity-20"></div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className="group relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                >
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="font-headline text-xl md:text-2xl font-bold text-white drop-shadow-lg">
                      {category.name}
                    </h3>
                  </div>
                </button>
              ))}
            </div>
          </section>
        ) : (
          /* Products Grid - Category View */
          <section className="px-6 mb-12">
            <div className="flex items-center justify-between mb-8">
              <button 
                onClick={() => setSelectedCategory(null)}
                className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity"
              >
                <span className="text-xl">←</span>
                <span className="font-label font-bold uppercase tracking-wider text-sm">Retour</span>
              </button>
              <h2 className="font-headline text-2xl font-bold">
                {categories.find(c => c.id === selectedCategory)?.name}
              </h2>
              <div className="h-[2px] flex-grow ml-4 bg-outline-variant opacity-20"></div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {menuItemsByCategory[selectedCategory]?.map((item) => (
                <div key={item.id} className="group">
                  <div className="aspect-square rounded-2xl overflow-hidden shadow-sm bg-surface-container-low mb-3">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="font-headline text-sm md:text-base font-bold text-on-surface truncate">{item.name}</h3>
                    <p className="font-body text-xs text-on-surface-variant mb-2 line-clamp-1">{item.description}</p>
                    <p className="font-body font-bold text-primary text-sm mb-3">{item.price}€</p>
                    <button 
                      onClick={() => handleAddToCart(item, selectedCategory!)}
                      className="w-full bg-gradient-to-r from-primary to-primary-container text-white py-2.5 rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
                    >
                      <Plus size={16} />
                      <span className="font-label font-bold uppercase tracking-wider text-xs">Ajouter</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-3 bg-surface/80 backdrop-blur-lg z-50 rounded-t-[2rem] border-t border-stone-200/20 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <Link to="/" className="flex flex-col items-center justify-center bg-primary-container text-white rounded-full px-5 py-2 active:scale-90 transition-transform duration-200">
          <span className="text-xs">🍽️</span>
          <span className="font-label text-[10px] uppercase tracking-[0.05em] font-bold">Menu</span>
        </Link>
        <Link to="/cart" className="flex flex-col items-center justify-center text-on-surface-variant px-5 py-2 hover:text-secondary active:scale-90 transition-transform duration-200">
          <ShoppingBag size={20} />
          <span className="font-label text-[10px] uppercase tracking-[0.05em] font-bold">Cart</span>
        </Link>
        <Link to="/orders" className="flex flex-col items-center justify-center text-on-surface-variant px-5 py-2 hover:text-secondary active:scale-90 transition-transform duration-200">
          <span className="text-xs">📋</span>
          <span className="font-label text-[10px] uppercase tracking-[0.05em] font-bold">My Orders</span>
        </Link>
      </nav>
    </div>
  );
}
