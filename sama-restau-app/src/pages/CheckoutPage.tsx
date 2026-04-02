import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Minus, Plus, MapPin, ArrowRight } from 'lucide-react';

export default function CheckoutPage() {
  const { items, totalPrice, selectedTimeSlot, clearCart } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    guests: 2
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const serviceFee = 2.50;
  const total = totalPrice + serviceFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Clear cart and navigate to confirmation
    clearCart();
    navigate('/confirmation');
  };

  if (items.length === 0) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="bg-surface/80 backdrop-blur-lg sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3 px-6 py-4">
          <Link to="/cart" className="text-primary hover:opacity-80 transition-opacity active:scale-95 duration-200">
            <ArrowLeft size={24} />
          </Link>
          <span className="text-primary"><MapPin size={20} /></span>
          <h1 className="font-headline text-xl font-bold text-primary">L'Escale Terracotta</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 pt-12 pb-24">
        {/* Hero Title Section */}
        <section className="mb-12">
          <h2 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-4 leading-tight">Finaliser votre expérience</h2>
          <p className="text-on-surface-variant font-medium tracking-wide">Vérifiez vos informations pour une table parfaitement préparée.</p>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-12">
          {/* Customer Form */}
          <section className="bg-surface-container-low rounded-xl p-8 shadow-lg">
            <h3 className="font-label text-xs uppercase tracking-[0.2em] font-bold text-secondary mb-8">Informations de contact</h3>
            <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative group">
                  <label className="font-label text-[10px] uppercase font-bold text-on-surface-variant tracking-wider mb-2 block">Prénom</label>
                  <input 
                    type="text" 
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="w-full bg-surface-container-lowest border-none rounded-lg p-4 focus:ring-2 focus:ring-primary-container transition-all text-on-surface placeholder-on-surface-variant/40"
                    placeholder="Jean"
                  />
                </div>
                <div className="relative group">
                  <label className="font-label text-[10px] uppercase font-bold text-on-surface-variant tracking-wider mb-2 block">Nom</label>
                  <input 
                    type="text" 
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="w-full bg-surface-container-lowest border-none rounded-lg p-4 focus:ring-2 focus:ring-primary-container transition-all text-on-surface placeholder-on-surface-variant/40"
                    placeholder="Dupont"
                  />
                </div>
              </div>
              <div className="relative">
                <label className="font-label text-[10px] uppercase font-bold text-on-surface-variant tracking-wider mb-2 block">Nombre de personnes</label>
                <div className="flex items-center bg-surface-container-lowest rounded-lg overflow-hidden w-fit">
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, guests: Math.max(1, formData.guests - 1)})}
                    className="px-6 py-4 hover:bg-surface-container-high transition-colors active:scale-90"
                  >
                    <Minus size={20} className="text-primary" />
                  </button>
                  <input 
                    type="number" 
                    readOnly
                    value={formData.guests}
                    className="w-16 text-center border-none bg-transparent font-bold text-lg pointer-events-none"
                  />
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, guests: formData.guests + 1})}
                    className="px-6 py-4 hover:bg-surface-container-high transition-colors active:scale-90"
                  >
                    <Plus size={20} className="text-primary" />
                  </button>
                </div>
              </div>
            </form>
          </section>

          {/* Order Summary Bento */}
          <section className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/20 shadow-lg">
            <div className="flex justify-between items-end mb-8">
              <h3 className="font-headline text-2xl font-bold text-primary">Récapitulatif</h3>
              <div className="text-right">
                <span className="font-label text-[10px] uppercase font-bold text-secondary tracking-widest block mb-1">Arrivée estimée</span>
                <p className="font-bold text-on-surface">{selectedTimeSlot || 'Non sélectionnée'} Aujourd'hui</p>
              </div>
            </div>
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between group">
                  <div className="flex gap-4 items-center">
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container-high">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-on-surface">{item.name}</h4>
                      <p className="text-sm text-on-surface-variant">Qté: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-on-surface">{(item.price * item.quantity).toFixed(2)} €</span>
                </div>
              ))}
            </div>
            <div className="mt-10 pt-8 border-t border-outline-variant/30">
              <div className="flex justify-between items-center mb-2">
                <span className="text-on-surface-variant">Sous-total</span>
                <span className="font-medium">{totalPrice.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-on-surface-variant">Frais de service</span>
                <span className="font-medium text-secondary">{serviceFee.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-headline text-2xl font-bold text-on-surface">Total</span>
                <span className="font-headline text-3xl font-bold text-primary">{total.toFixed(2)} €</span>
              </div>
            </div>
          </section>

          {/* Final Action */}
          <div className="pt-4">
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.firstName || !formData.lastName}
              className="w-full py-6 rounded-xl bg-gradient-to-r from-primary to-primary-container text-white font-bold text-lg shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span>Confirmation en cours...</span>
              ) : (
                <>
                  Confirmer ma commande
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
            <p className="text-center text-on-surface-variant text-sm mt-6 font-medium flex items-center justify-center gap-1">
              <Lock size={16} />
              Paiement sécurisé sur place à l'arrivée
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
