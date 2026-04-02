import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, Trash2, ArrowRight, MapPin, Clock } from 'lucide-react';

const timeSlots = [
  { time: '12:00', available: true },
  { time: '12:15', available: true },
  { time: '12:30', available: true },
  { time: '12:45', available: true },
  { time: '13:00', available: true },
  { time: '13:15', available: false },
  { time: '13:30', available: true },
  { time: '19:30', available: true },
  { time: '19:45', available: true },
  { time: '20:00', available: true },
  { time: '20:15', available: true },
  { time: '20:30', available: true },
];

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice, selectedTimeSlot, setSelectedTimeSlot } = useCart();
  const navigate = useNavigate();
  const serviceFee = 2.50;
  const total = totalPrice + serviceFee;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-surface flex flex-col">
        <header className="bg-surface/80 backdrop-blur-lg sticky top-0 z-50 shadow-sm">
          <div className="flex items-center gap-2 px-6 py-4">
            <Link to="/" className="text-primary hover:opacity-80 transition-opacity">
              <ArrowLeft size={24} />
            </Link>
            <span className="text-primary"><MapPin size={20} /></span>
            <h1 className="font-headline text-xl font-bold text-primary">L'Escale Terracotta</h1>
          </div>
        </header>
        <main className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="text-center">
            <div className="w-24 h-24 bg-surface-container-low rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🛒</span>
            </div>
            <h2 className="font-headline text-2xl font-bold text-on-surface mb-2">Votre panier est vide</h2>
            <p className="text-on-surface-variant mb-6">Découvrez notre menu et ajoutez des plats délicieux !</p>
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary-container text-white px-8 py-3 rounded-xl font-bold"
            >
              Voir le menu
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface pb-32">
      {/* Header */}
      <header className="bg-surface/80 backdrop-blur-lg sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2 px-6 py-4">
          <Link to="/" className="text-primary hover:opacity-80 transition-opacity active:scale-95 duration-200">
            <ArrowLeft size={24} />
          </Link>
          <span className="text-primary"><MapPin size={20} /></span>
          <h1 className="font-headline text-xl font-bold text-primary">L'Escale Terracotta</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 pt-8 space-y-10">
        {/* Header Section */}
        <section>
          <h2 className="font-headline text-4xl font-bold tracking-tight text-primary">Votre Panier</h2>
          <p className="text-on-surface-variant font-medium mt-2">Révision de votre sélection gastronomique</p>
        </section>

        {/* Cart Items */}
        <section className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {items.map((item) => (
              <div key={item.id} className="bg-surface-container-lowest rounded-xl p-6 flex items-center gap-6 group transition-all duration-300 hover:shadow-lg">
                <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-headline text-xl font-bold text-on-surface">{item.name}</h3>
                      <p className="text-xs font-bold uppercase tracking-widest text-secondary mt-1">{item.category}</p>
                    </div>
                    <span className="font-bold text-lg text-primary">{(item.price * item.quantity).toFixed(2)}€</span>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center bg-surface-container-low rounded-full px-3 py-1 gap-4">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="text-primary hover:opacity-70"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="text-primary hover:opacity-70"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-on-surface-variant hover:text-error transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Time Slot Selector */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-headline text-2xl font-bold text-on-surface flex items-center gap-2">
              <Clock size={24} className="text-secondary" />
              Heure d'arrivée
            </h3>
            <span className="text-secondary font-bold text-sm bg-secondary-container/30 px-3 py-1 rounded-full">Aujourd'hui</span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
            {timeSlots.map((slot) => (
              <button
                key={slot.time}
                disabled={!slot.available}
                onClick={() => setSelectedTimeSlot(slot.time)}
                className={`flex-shrink-0 px-6 py-4 rounded-xl border-2 text-center group transition-all ${
                  selectedTimeSlot === slot.time
                    ? 'bg-primary text-white border-primary shadow-lg'
                    : slot.available
                    ? 'bg-surface-container-lowest border-transparent hover:border-primary-container'
                    : 'bg-surface-container-low border-transparent opacity-50 cursor-not-allowed'
                }`}
              >
                <span className={`block text-lg font-extrabold ${selectedTimeSlot === slot.time ? 'text-white' : 'text-on-surface'}`}>
                  {slot.time}
                </span>
                <span className={`text-[10px] font-bold uppercase tracking-tighter ${
                  selectedTimeSlot === slot.time ? 'opacity-80' : 'text-on-surface-variant group-hover:text-primary'
                }`}>
                  {slot.available ? (selectedTimeSlot === slot.time ? 'Sélectionné' : 'Disponible') : 'Complet'}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Summary & CTA */}
        <section className="bg-surface-container-low rounded-[2rem] p-8 space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center text-on-surface-variant">
              <span className="font-medium">Sous-total</span>
              <span className="font-bold">{totalPrice.toFixed(2)}€</span>
            </div>
            <div className="flex justify-between items-center text-on-surface-variant">
              <span className="font-medium">Frais de service</span>
              <span className="font-bold">{serviceFee.toFixed(2)}€</span>
            </div>
            <div className="h-px bg-outline-variant/20 my-4"></div>
            <div className="flex justify-between items-center text-on-surface">
              <span className="font-headline text-2xl font-bold">Total</span>
              <span className="text-3xl font-extrabold text-primary">{total.toFixed(2)}€</span>
            </div>
          </div>
          <button 
            onClick={() => navigate('/checkout')}
            disabled={!selectedTimeSlot}
            className="w-full bg-gradient-to-r from-primary to-primary-container text-white py-5 rounded-full font-bold text-lg shadow-xl hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continuer vers les coordonnées
            <ArrowRight size={20} />
          </button>
          {!selectedTimeSlot && (
            <p className="text-center text-error text-sm">Veuillez sélectionner un créneau horaire</p>
          )}
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-3 bg-surface/80 backdrop-blur-lg z-50 rounded-t-[2rem] shadow-[0_-4px_20px_rgba(0,0,0,0.05)] border-t border-stone-200/20">
        <Link to="/" className="flex flex-col items-center justify-center text-on-surface-variant px-5 py-2 hover:text-secondary active:scale-90 transition-transform duration-200">
          <span className="text-xs">🍽️</span>
          <span className="font-label text-[10px] uppercase tracking-[0.05em] font-bold mt-1">Menu</span>
        </Link>
        <button className="flex flex-col items-center justify-center bg-primary-container text-white rounded-full px-5 py-2 transition-transform duration-200 active:scale-90">
          <span className="text-xs">🛒</span>
          <span className="font-label text-[10px] uppercase tracking-[0.05em] font-bold mt-1">Cart</span>
        </button>
        <Link to="/orders" className="flex flex-col items-center justify-center text-on-surface-variant px-5 py-2 hover:text-secondary active:scale-90 transition-transform duration-200">
          <span className="text-xs">📋</span>
          <span className="font-label text-[10px] uppercase tracking-[0.05em] font-bold mt-1">My Orders</span>
        </Link>
      </nav>
    </div>
  );
}
