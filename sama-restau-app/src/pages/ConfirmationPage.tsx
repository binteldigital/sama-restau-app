import { Link } from 'react-router-dom';
import { CheckCircle, MessageSquare, HeadphonesIcon } from 'lucide-react';

export default function ConfirmationPage() {
  const orderNumber = Math.floor(10000 + Math.random() * 90000);
  const currentTime = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface antialiased flex flex-col">
      {/* Header */}
      <header className="bg-surface/80 backdrop-blur-lg sticky top-0 z-50 shadow-sm">
        <div className="flex justify-between items-center w-full px-6 py-4">
          <div className="flex items-center space-x-2">
            <span className="text-primary text-xl">📍</span>
            <h1 className="font-headline text-xl font-bold text-primary">L'Escale Terracotta</h1>
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center px-6 py-12 max-w-2xl mx-auto w-full">
        {/* Success Identity Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-secondary-container rounded-full mb-6 shadow-lg transition-transform hover:scale-105 duration-500">
            <CheckCircle size={48} className="text-secondary" />
          </div>
          <h2 className="font-headline text-4xl font-bold text-primary mb-4 tracking-tight">Commande validée !</h2>
          <p className="font-body text-on-surface-variant text-lg max-w-md mx-auto leading-relaxed">
            Merci de votre confiance. Votre table et vos saveurs vous attendent.
          </p>
        </div>

        {/* QR Code Bento Card */}
        <div className="w-full bg-surface-container-lowest rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-outline-variant/10 relative overflow-hidden text-center">
          {/* Decorative Accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-container/20 rounded-bl-full -mr-8 -mt-8"></div>
          <div className="relative z-10">
            <div className="mb-8">
              <p className="font-label text-xs uppercase tracking-[0.2em] text-secondary font-extrabold mb-2">Votre Sésame Digital</p>
              <p className="font-body text-on-surface-variant text-sm">Présentez ce QR code à votre arrivée au restaurant</p>
            </div>
            
            {/* QR Code Container */}
            <div className="relative inline-block p-6 bg-white rounded-3xl shadow-inner border border-outline-variant/20 mb-8">
              <div className="w-48 h-48 md:w-64 md:h-64 bg-gradient-to-br from-primary to-primary-container rounded-xl flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-6xl mb-2">📱</div>
                  <div className="text-sm font-mono">QR-{orderNumber}</div>
                </div>
              </div>
              {/* Center Logo Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-12 h-12 bg-white rounded-xl shadow-md flex items-center justify-center p-1 border border-primary/10">
                  <span className="text-primary text-2xl">🍽️</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center space-y-4">
              <div className="flex items-center space-x-2 px-4 py-2 bg-surface-container-low rounded-full">
                <MessageSquare size={16} className="text-primary" />
                <span className="font-body text-sm font-medium text-on-surface">Confirmation envoyée par SMS</span>
              </div>
              <div className="pt-4 border-t border-outline-variant/20 w-full flex justify-around">
                <div className="text-center px-4">
                  <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Commande</p>
                  <p className="font-headline text-lg font-bold text-primary">#{orderNumber}</p>
                </div>
                <div className="text-center px-4 border-l border-outline-variant/20">
                  <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Heure Prévue</p>
                  <p className="font-headline text-lg font-bold text-primary">{currentTime}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Section */}
        <div className="mt-12 flex flex-col w-full space-y-4">
          <button className="w-full py-4 bg-gradient-to-r from-primary to-primary-container text-white font-body font-bold rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all">
            Enregistrer dans mon wallet
          </button>
          <Link 
            to="/orders" 
            className="w-full py-4 bg-surface-container-highest text-on-surface font-body font-bold rounded-xl hover:bg-surface-container-high transition-colors text-center"
          >
            Voir mes commandes
          </Link>
        </div>

        {/* Restaurant Identity Footer */}
        <footer className="mt-16 text-center pb-24">
          <div className="flex items-center justify-center space-x-3 mb-4 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
            <span className="text-3xl">🏛️</span>
            <span className="font-headline text-xl font-bold tracking-widest">L'ESCALE</span>
          </div>
          <p className="font-body text-xs text-on-surface-variant/60">© 2024 L'Escale Terracotta • Gastronomie & Sérénité</p>
        </footer>
      </main>

      {/* Floating Help Button */}
      <div className="fixed bottom-8 right-6 z-50">
        <button className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center text-white shadow-xl active:scale-90 transition-transform">
          <HeadphonesIcon size={24} />
        </button>
      </div>
    </div>
  );
}
