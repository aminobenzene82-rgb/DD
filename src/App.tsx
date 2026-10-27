/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Zap, 
  ShieldCheck, 
  Clock, 
  Check, 
  Star, 
  Menu, 
  X, 
  ArrowRight, 
  MessageSquare, 
  Mail, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  ExternalLink,
  Heart,
  Key,
  FolderOpen,
  Search,
  Sliders,
  Volume2,
  Gift,
  Flame,
  Download
} from 'lucide-react';

import { ProductItem, CartItem, OrderRecord } from './types';
import { STORE_CONFIG, PRODUCTS, FAQS } from './data/products';
import { PriceTag } from './components/PriceTag';
import { ProductCard } from './components/ProductCard';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { DownloadsVaultModal } from './components/DownloadsVaultModal';
import { InteractiveLutViewer } from './components/InteractiveLutViewer';
import { AudioPreviewer } from './components/AudioPreviewer';
import { ReviewsSection } from './components/ReviewsSection';
import { ContactView } from './components/ContactView';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  emoji: string;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [currency, setCurrency] = useState<'BDT' | 'USD'>('BDT');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [checkoutProducts, setCheckoutProducts] = useState<{ product: ProductItem; quantity: number }[]>([]);
  const [isVaultOpen, setIsVaultOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [confetti, setConfetti] = useState<Particle[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, selectedProductId]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Playful confetti burst
  const triggerConfetti = (e?: React.MouseEvent) => {
    const x = e?.clientX || window.innerWidth / 2;
    const y = e?.clientY || window.innerHeight / 2;
    const newParticles: Particle[] = Array.from({ length: 24 }).map((_, i) => ({
      id: Date.now() + i,
      x,
      y,
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 0.7) * 16,
      color: ['#FFD400', '#FF4D8D', '#6C2BD9', '#00E5FF', '#FF9100'][Math.floor(Math.random() * 5)],
      emoji: ['⚡', '👾', '🎉', '🚀', '✨', '💎', '🎬'][Math.floor(Math.random() * 7)]
    }));
    setConfetti(prev => [...prev, ...newParticles]);
    setTimeout(() => {
      setConfetti(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 1200);
  };

  const navigateTo = (page: string, productId: string | null = null) => {
    setCurrentPage(page);
    if (productId) setSelectedProductId(productId);
    setIsMobileMenuOpen(false);
  };

  // Cart operations
  const handleAddToCart = (product: ProductItem, e?: React.MouseEvent) => {
    triggerConfetti(e);
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    showToast(`Added "${product.name}" to cart! 🛍️`);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems(prev =>
      prev
        .map(item => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Instant Checkout triggers
  const handleInstantBuy = (product: ProductItem, e?: React.MouseEvent) => {
    triggerConfetti(e);
    setCheckoutProducts([{ product, quantity: 1 }]);
    setIsCheckoutOpen(true);
  };

  const handleCheckoutFromCart = () => {
    if (cartItems.length === 0) return;
    setCheckoutProducts(cartItems);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Mega Combo Bundle: buy all 3
  const handleBuyAllCombo = (e?: React.MouseEvent) => {
    triggerConfetti(e);
    setCheckoutProducts(PRODUCTS.map(p => ({ product: p, quantity: 1 })));
    setIsCheckoutOpen(true);
  };

  const selectedProduct = PRODUCTS.find(p => p.id === selectedProductId) || PRODUCTS[0];
  const totalCartCount = cartItems.reduce((acc, it) => acc + it.quantity, 0);

  // Filter products
  const filteredProducts = PRODUCTS.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.features.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FFF8EC] text-[#1A1A1A] font-sans selection:bg-[#FFD400] selection:text-[#1A1A1A] overflow-x-hidden relative">
      
      {/* Floating Confetti Particles Layer */}
      {confetti.map((p) => (
        <div 
          key={p.id}
          className="fixed pointer-events-none z-50 text-2xl font-bold animate-ping"
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            transform: `translate(${p.vx * 12}px, ${p.vy * 12}px)`,
            transition: 'all 1s cubic-bezier(0.25, 1, 0.5, 1)'
          }}
        >
          {p.emoji}
        </div>
      ))}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 bg-[#1A1A1A] text-[#FFD400] font-display text-xs sm:text-sm px-4 py-3 rounded-2xl border-3 border-[#FFD400] shadow-[4px_4px_0px_#1A1A1A] flex items-center gap-2 animate-in fade-in slide-in-from-top duration-200">
          <Sparkles size={16} className="text-[#00E5FF]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* STYLES & NEO-BRUTALIST ATOMS */}
      <style>{`
        .bg-dot-pattern {
          background-image: radial-gradient(#1A1A1A 1.5px, transparent 1.5px);
          background-size: 18px 18px;
        }
        .sticker-card {
          background: #FFFFFF;
          border: 3.5px solid #1A1A1A;
          border-radius: 24px;
          box-shadow: 6px 6px 0px #1A1A1A;
          transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .sticker-card:hover {
          transform: translateY(-5px);
          box-shadow: 10px 10px 0px #6C2BD9;
        }
        .sticker-btn {
          border: 3.5px solid #1A1A1A;
          border-radius: 18px;
          box-shadow: 4px 4px 0px #1A1A1A;
          font-weight: 900;
          transition: all 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          cursor: pointer;
        }
        .sticker-btn:hover {
          transform: translate(-2px, -2px);
          box-shadow: 7px 7px 0px #FF4D8D;
        }
        .sticker-btn:active {
          transform: translate(2px, 2px);
          box-shadow: 2px 2px 0px #1A1A1A;
        }
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px) rotate(-4deg); }
          50% { transform: translateY(-16px) rotate(-1deg); }
        }
        @keyframes floatMedium {
          0%, 100% { transform: translateY(0px) rotate(3deg); }
          50% { transform: translateY(-20px) rotate(6deg); }
        }
        @keyframes floatFast {
          0%, 100% { transform: translateY(0px) rotate(-2deg); }
          50% { transform: translateY(-14px) rotate(1deg); }
        }
        .animate-float-slow { animation: floatSlow 4.5s ease-in-out infinite; }
        .animate-float-medium { animation: floatMedium 5.2s ease-in-out infinite; }
        .animate-float-fast { animation: floatFast 3.8s ease-in-out infinite; }
        .hero-floating-card:hover {
          animation-play-state: paused;
          z-index: 30 !important;
          transform: scale(1.04) rotate(0deg) !important;
          box-shadow: 12px 12px 0px #6C2BD9 !important;
        }
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: 200%;
          animation: marquee 14s linear infinite;
        }
      `}</style>

      {/* TOP ANNOUNCEMENT BANNER */}
      <div className="bg-[#1A1A1A] text-white py-1.5 px-4 text-center text-xs font-black tracking-wide border-b-2 border-[#1A1A1A] flex items-center justify-center gap-2">
        <span className="bg-[#FF4D8D] text-white px-2 py-0.5 rounded text-[10px] font-display">
          LIMITED DROP
        </span>
        <span>🔥 FLASH SALE: Use code <strong className="text-[#FFD400]">CREATOR50</strong> at checkout for 50% OFF!</span>
      </div>

      {/* STICKY NAV BAR */}
      <header className="sticky top-0 z-40 bg-[#FFF8EC]/95 backdrop-blur-md border-b-4 border-[#1A1A1A] px-4 md:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <button 
            onClick={(e) => { triggerConfetti(e); navigateTo("home"); }}
            className="flex items-center gap-3 group text-left focus:outline-none shrink-0"
          >
            <div className="w-12 h-12 bg-[#FFD400] border-3 border-[#1A1A1A] rounded-2xl flex items-center justify-center font-display text-2xl shadow-[4px_4px_0px_#1A1A1A] group-hover:rotate-12 transition-transform">
              ⚡
            </div>
            <div>
              <span className="font-display text-2xl md:text-3xl tracking-wide text-[#6C2BD9] block leading-none drop-shadow-[2px_2px_0px_#FFD400]">
                {STORE_CONFIG.brandName}
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#1A1A1A] block mt-1 bg-[#FFD400] px-2 py-0.5 rounded-full border border-[#1A1A1A]">
                {STORE_CONFIG.tagline}
              </span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 font-black text-sm tracking-wide">
            <button 
              onClick={() => navigateTo("home")} 
              className={`hover:text-[#6C2BD9] transition-colors ${currentPage === 'home' ? 'text-[#6C2BD9] underline underline-offset-8 decoration-4 decoration-[#FF4D8D]' : 'text-[#1A1A1A]'}`}
            >
              🕹️ Home
            </button>
            <button 
              onClick={() => navigateTo("products")} 
              className={`hover:text-[#6C2BD9] transition-colors ${currentPage === 'products' ? 'text-[#6C2BD9] underline underline-offset-8 decoration-4 decoration-[#FF4D8D]' : 'text-[#1A1A1A]'}`}
            >
              📦 Bundles
            </button>
            <button 
              onClick={() => navigateTo("lut-tool")} 
              className={`hover:text-[#6C2BD9] transition-colors ${currentPage === 'lut-tool' ? 'text-[#6C2BD9] underline underline-offset-8 decoration-4 decoration-[#FF4D8D]' : 'text-[#1A1A1A]'}`}
            >
              🎨 LUT Slider
            </button>
            <button 
              onClick={() => navigateTo("sfx-tool")} 
              className={`hover:text-[#6C2BD9] transition-colors ${currentPage === 'sfx-tool' ? 'text-[#6C2BD9] underline underline-offset-8 decoration-4 decoration-[#FF4D8D]' : 'text-[#1A1A1A]'}`}
            >
              🔊 SFX Tester
            </button>
            <button 
              onClick={() => navigateTo("contact")} 
              className={`hover:text-[#6C2BD9] transition-colors ${currentPage === 'contact' ? 'text-[#6C2BD9] underline underline-offset-8 decoration-4 decoration-[#FF4D8D]' : 'text-[#1A1A1A]'}`}
            >
              💬 Support
            </button>
          </nav>

          {/* Right Action Icons: Currency Toggle, My Vault, Cart */}
          <div className="flex items-center gap-2.5">
            {/* Currency Switcher */}
            <button
              onClick={() => setCurrency(c => c === 'BDT' ? 'USD' : 'BDT')}
              className="sticker-btn bg-white text-[#1A1A1A] px-2.5 py-1.5 rounded-xl text-xs font-display flex items-center gap-1"
              title="Toggle Currency"
            >
              <span>{currency === 'BDT' ? '৳ BDT' : '$ USD'}</span>
            </button>

            {/* My Vault (Access previous downloads) */}
            <button
              onClick={() => setIsVaultOpen(true)}
              className="sticker-btn bg-white text-[#1A1A1A] px-3 py-1.5 rounded-xl text-xs font-display hidden sm:flex items-center gap-1.5 hover:bg-[#FFF8EC]"
            >
              <Key size={14} className="text-[#6C2BD9]" />
              <span>MY VAULT</span>
            </button>

            {/* Cart Button with Counter */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="sticker-btn bg-[#FFD400] text-[#1A1A1A] px-3.5 py-1.5 rounded-xl text-xs font-display flex items-center gap-1.5 relative hover:bg-[#FFE033]"
            >
              <ShoppingBag size={16} />
              <span>CART</span>
              {totalCartCount > 0 && (
                <span className="w-5 h-5 bg-[#FF4D8D] text-white rounded-full flex items-center justify-center text-[10px] font-black border border-[#1A1A1A]">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Hamburger */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 bg-[#FF4D8D] border-2.5 border-[#1A1A1A] rounded-xl shadow-[2px_2px_0px_#1A1A1A] text-white focus:outline-none"
              aria-label="Toggle Navigation"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden pt-4 pb-4 px-2 flex flex-col gap-2.5 border-t-3 border-[#1A1A1A] mt-3 bg-[#FFF8EC]">
            <button 
              onClick={() => navigateTo("home")} 
              className="sticker-btn text-left p-3 rounded-xl bg-white text-[#1A1A1A] font-black flex justify-between items-center text-sm"
            >
              <span>🕹️ Home</span>
              <ArrowRight size={16} className="text-[#6C2BD9]" />
            </button>
            <button 
              onClick={() => navigateTo("products")} 
              className="sticker-btn text-left p-3 rounded-xl bg-white text-[#1A1A1A] font-black flex justify-between items-center text-sm"
            >
              <span>📦 All Bundles & Packs</span>
              <ArrowRight size={16} className="text-[#6C2BD9]" />
            </button>
            <button 
              onClick={() => navigateTo("lut-tool")} 
              className="sticker-btn text-left p-3 rounded-xl bg-white text-[#1A1A1A] font-black flex justify-between items-center text-sm"
            >
              <span>🎨 LUT Color Slider</span>
              <ArrowRight size={16} className="text-[#6C2BD9]" />
            </button>
            <button 
              onClick={() => navigateTo("sfx-tool")} 
              className="sticker-btn text-left p-3 rounded-xl bg-white text-[#1A1A1A] font-black flex justify-between items-center text-sm"
            >
              <span>🔊 SFX Sound Tester</span>
              <ArrowRight size={16} className="text-[#6C2BD9]" />
            </button>
            <button 
              onClick={() => { setIsVaultOpen(true); setIsMobileMenuOpen(false); }} 
              className="sticker-btn text-left p-3 rounded-xl bg-white text-[#1A1A1A] font-black flex justify-between items-center text-sm"
            >
              <span>🔑 My Downloads & Licenses</span>
              <ArrowRight size={16} className="text-[#6C2BD9]" />
            </button>
            <button 
              onClick={() => navigateTo("contact")} 
              className="sticker-btn text-left p-3 rounded-xl bg-white text-[#1A1A1A] font-black flex justify-between items-center text-sm"
            >
              <span>💬 Contact Support</span>
              <ArrowRight size={16} className="text-[#6C2BD9]" />
            </button>
          </div>
        )}
      </header>

      {/* MAIN VIEW CONTENT */}
      <main className="relative z-10">
        
        {/* VIEW 1: HOME PAGE */}
        {currentPage === 'home' && (
          <div>
            {/* ENRICHED HIGH-ENERGY HERO SECTION */}
            <section className="relative pt-10 pb-16 md:pt-16 md:pb-24 px-4 md:px-8 border-b-4 border-[#1A1A1A] overflow-hidden bg-[#FFF8EC]">
              <div className="absolute inset-0 bg-dot-pattern opacity-10 pointer-events-none"></div>
              <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#FFD400]/20 rounded-full blur-3xl pointer-events-none"></div>

              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
                
                {/* Hero Left Content */}
                <div className="lg:col-span-6 text-center lg:text-left">
                  
                  {/* Trust Pill */}
                  <div 
                    onClick={(e) => triggerConfetti(e)}
                    className="cursor-pointer inline-flex items-center gap-2.5 bg-white text-[#1A1A1A] border-3 border-[#1A1A1A] px-3.5 py-1.5 rounded-2xl font-black text-xs md:text-sm shadow-[4px_4px_0px_#1A1A1A] mb-6 transform -rotate-1 hover:rotate-1 transition-transform"
                  >
                    <div className="flex -space-x-2">
                      <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80" alt="" className="w-7 h-7 rounded-full border-2 border-[#1A1A1A] object-cover" />
                      <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80" alt="" className="w-7 h-7 rounded-full border-2 border-[#1A1A1A] object-cover" />
                      <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80" alt="" className="w-7 h-7 rounded-full border-2 border-[#1A1A1A] object-cover" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#00E5FF] animate-pulse border border-[#1A1A1A]"></span>
                      <span className="font-extrabold text-[#1A1A1A]">25,000+ CREATORS BOOSTED</span>
                      <div className="flex text-[#FFD400]">
                        <Star size={13} className="fill-[#FFD400] text-[#1A1A1A]" />
                        <Star size={13} className="fill-[#FFD400] text-[#1A1A1A]" />
                        <Star size={13} className="fill-[#FFD400] text-[#1A1A1A]" />
                      </div>
                    </div>
                  </div>

                  {/* Headline */}
                  <h1 className="font-display text-4xl sm:text-6xl md:text-7xl leading-[1.08] text-[#1A1A1A] mb-6 tracking-wide drop-shadow-[2px_2px_0px_#FFD400]">
                    EDIT <span className="bg-[#FF4D8D] text-white px-3.5 py-0.5 rounded-3xl inline-block transform rotate-2 border-3 border-[#1A1A1A] shadow-[5px_5px_0px_#1A1A1A]">FASTER.</span> <br />
                    CREATE <span className="bg-[#6C2BD9] text-white px-3.5 py-0.5 rounded-3xl inline-block transform -rotate-2 border-3 border-[#1A1A1A] shadow-[5px_5px_0px_#FFD400]">BIGGER.</span>
                  </h1>

                  <p className="text-base md:text-xl font-extrabold text-[#1A1A1A]/85 max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
                    Supercharge your video edits with high-octane editing presets, cinematic LUTs, 100K+ AI viral reels & complete lifetime software suites.
                  </p>

                  {/* CTAs */}
                  <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8">
                    <button 
                      onClick={(e) => { triggerConfetti(e); navigateTo("products"); }}
                      className="sticker-btn w-full sm:w-auto bg-[#FFD400] text-[#1A1A1A] px-8 py-4 rounded-2xl font-display text-base uppercase flex items-center justify-center gap-2.5 hover:bg-[#FFE033]"
                    >
                      <ShoppingBag size={20} />
                      <span>EXPLORE ALL BUNDLES</span>
                    </button>
                    <button 
                      onClick={handleBuyAllCombo}
                      className="sticker-btn w-full sm:w-auto bg-white text-[#1A1A1A] px-7 py-4 rounded-2xl font-display text-base uppercase flex items-center justify-center gap-2 hover:bg-[#FFF8EC]"
                    >
                      <Sparkles size={18} className="text-[#6C2BD9]" />
                      <span>BUY ALL-IN-ONE (399৳)</span>
                    </button>
                  </div>

                  {/* Trust Strip */}
                  <div className="pt-6 border-t-3 border-[#1A1A1A]/20 flex flex-wrap items-center justify-center lg:justify-start gap-3 text-xs font-black text-[#1A1A1A]">
                    <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]">
                      ⚡ Instant Google Drive
                    </span>
                    <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]">
                      🔒 Encrypted bKash & Card
                    </span>
                    <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]">
                      ♾️ Lifetime Updates
                    </span>
                  </div>
                </div>

                {/* Hero Right Floating 3-Card Showcase */}
                <div className="lg:col-span-6 relative flex justify-center items-center min-h-[460px] md:min-h-[500px]">
                  {/* Floating Badges */}
                  <div className="absolute -top-4 left-2 z-40 bg-[#FFD400] text-[#1A1A1A] border-3 border-[#1A1A1A] px-3.5 py-1.5 rounded-2xl font-display text-xs tracking-wider shadow-[4px_4px_0px_#1A1A1A] transform -rotate-12 cursor-pointer hover:scale-105 transition-transform">
                    ⚡ 100% INSTANT ACCESS
                  </div>
                  <div className="absolute top-8 -right-2 z-40 bg-[#FF4D8D] text-white border-3 border-[#1A1A1A] px-3.5 py-1.5 rounded-2xl font-display text-xs tracking-wider shadow-[4px_4px_0px_#1A1A1A] transform rotate-12 cursor-pointer hover:scale-105 transition-transform">
                    🔥 50% PROMO: CREATOR50
                  </div>
                  <div className="absolute -bottom-2 right-4 z-40 bg-[#6C2BD9] text-white border-3 border-[#1A1A1A] px-3.5 py-1.5 rounded-2xl font-display text-xs tracking-wider shadow-[4px_4px_0px_#1A1A1A] transform rotate-6 cursor-pointer hover:scale-105 transition-transform">
                    🎬 NO MONTHLY BILLS
                  </div>

                  {/* 3 Floating Interactive Product Cards */}
                  <div className="relative w-full max-w-lg h-full flex items-center justify-center">
                    
                    {/* Card 1: Ultimate Editing Pack */}
                    <div 
                      className="hero-floating-card animate-float-slow absolute top-0 left-0 w-64 md:w-72 bg-white border-3.5 border-[#1A1A1A] rounded-2xl p-3 shadow-[6px_6px_0px_#1A1A1A] z-20 cursor-pointer"
                      onClick={() => navigateTo("product-detail", PRODUCTS[0].id)}
                    >
                      <div className="relative rounded-xl overflow-hidden border-2 border-[#1A1A1A] mb-2.5 h-32">
                        <img src={PRODUCTS[0].image} alt="" className="w-full h-full object-cover" />
                        <span className="absolute top-2 left-2 bg-[#FFD400] text-[#1A1A1A] font-display text-[10px] px-2 py-0.5 rounded-lg border border-[#1A1A1A]">
                          {PRODUCTS[0].badge}
                        </span>
                      </div>
                      <h3 className="font-display text-sm text-[#1A1A1A] truncate">{PRODUCTS[0].name}</h3>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#1A1A1A]/20">
                        <PriceTag amountBDT={PRODUCTS[0].priceBDT} amountUSD={PRODUCTS[0].priceUSD} currency={currency} className="font-display text-lg text-[#6C2BD9]" />
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleInstantBuy(PRODUCTS[0], e); }}
                          className="sticker-btn bg-[#FFD400] text-[#1A1A1A] px-2.5 py-1 text-[10px] font-display uppercase"
                        >
                          BUY NOW
                        </button>
                      </div>
                    </div>

                    {/* Card 2: 100K AI Reels Bundle */}
                    <div 
                      className="hero-floating-card animate-float-medium absolute top-16 right-0 w-64 md:w-72 bg-white border-3.5 border-[#1A1A1A] rounded-2xl p-3 shadow-[6px_6px_0px_#1A1A1A] z-10 cursor-pointer"
                      onClick={() => navigateTo("product-detail", PRODUCTS[1].id)}
                    >
                      <div className="relative rounded-xl overflow-hidden border-2 border-[#1A1A1A] mb-2.5 h-32">
                        <img src={PRODUCTS[1].image} alt="" className="w-full h-full object-cover" />
                        <span className="absolute top-2 left-2 bg-[#FF4D8D] text-white font-display text-[10px] px-2 py-0.5 rounded-lg border border-[#1A1A1A]">
                          {PRODUCTS[1].badge}
                        </span>
                      </div>
                      <h3 className="font-display text-sm text-[#1A1A1A] truncate">{PRODUCTS[1].name}</h3>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#1A1A1A]/20">
                        <PriceTag amountBDT={PRODUCTS[1].priceBDT} amountUSD={PRODUCTS[1].priceUSD} currency={currency} className="font-display text-lg text-[#FF4D8D]" />
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleInstantBuy(PRODUCTS[1], e); }}
                          className="sticker-btn bg-[#FF4D8D] text-white px-2.5 py-1 text-[10px] font-display uppercase"
                        >
                          BUY NOW
                        </button>
                      </div>
                    </div>

                    {/* Card 3: Adobe Master Collection */}
                    <div 
                      className="hero-floating-card animate-float-fast absolute bottom-2 left-8 md:left-12 w-64 md:w-72 bg-white border-3.5 border-[#1A1A1A] rounded-2xl p-3 shadow-[6px_6px_0px_#1A1A1A] z-25 cursor-pointer"
                      onClick={() => navigateTo("product-detail", PRODUCTS[2].id)}
                    >
                      <div className="relative rounded-xl overflow-hidden border-2 border-[#1A1A1A] mb-2.5 h-32">
                        <img src={PRODUCTS[2].image} alt="" className="w-full h-full object-cover" />
                        <span className="absolute top-2 left-2 bg-[#00E5FF] text-[#1A1A1A] font-display text-[10px] px-2 py-0.5 rounded-lg border border-[#1A1A1A]">
                          {PRODUCTS[2].badge}
                        </span>
                      </div>
                      <h3 className="font-display text-sm text-[#1A1A1A] truncate">{PRODUCTS[2].name}</h3>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#1A1A1A]/20">
                        <PriceTag amountBDT={PRODUCTS[2].priceBDT} amountUSD={PRODUCTS[2].priceUSD} currency={currency} className="font-display text-lg text-[#00E5FF]" />
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleInstantBuy(PRODUCTS[2], e); }}
                          className="sticker-btn bg-[#00E5FF] text-[#1A1A1A] px-2.5 py-1 text-[10px] font-display uppercase"
                        >
                          BUY NOW
                        </button>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </section>

            {/* MARQUEE STRIP */}
            <section className="bg-[#6C2BD9] text-white border-b-4 border-[#1A1A1A] py-3.5 overflow-hidden font-display text-sm md:text-base tracking-wider uppercase">
              <div className="animate-marquee whitespace-nowrap flex gap-8 items-center font-black">
                <span className="text-[#FFD400]">⚡ INSTANT GOOGLE DRIVE ACCESS</span>
                <span>•</span>
                <span>👾 100% PRE-ACTIVATED</span>
                <span>•</span>
                <span className="text-[#00E5FF]">🔥 VIRAL CAPCUT & PREMIERE ASSETS</span>
                <span>•</span>
                <span>💬 24/7 WHATSAPP CREATOR DESK</span>
                <span>•</span>
                <span className="text-[#FFD400]">⚡ INSTANT GOOGLE DRIVE ACCESS</span>
                <span>•</span>
                <span>👾 100% PRE-ACTIVATED</span>
                <span>•</span>
                <span className="text-[#00E5FF]">🔥 VIRAL CAPCUT & PREMIERE ASSETS</span>
                <span>•</span>
                <span>💬 24/7 WHATSAPP CREATOR DESK</span>
                <span>•</span>
              </div>
            </section>

            {/* FEATURED ALL-IN-ONE MEGA CREATOR BUNDLE BANNER */}
            <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
              <div className="sticker-card bg-gradient-to-r from-[#FFD400] via-[#FFE566] to-[#FFD400] text-[#1A1A1A] p-6 sm:p-10 rounded-3xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="max-w-xl">
                  <div className="inline-flex items-center gap-2 bg-[#1A1A1A] text-[#FFD400] px-3.5 py-1 rounded-full font-display text-xs mb-3 shadow-[2px_2px_0px_#1A1A1A]">
                    <Flame size={14} className="text-[#FF4D8D]" />
                    <span>SPECIAL CREATOR COMBO • SAVE 40%</span>
                  </div>
                  <h2 className="font-display text-3xl sm:text-5xl text-[#1A1A1A] mb-3 leading-tight">
                    THE COMPLETE CREATOR VAULT
                  </h2>
                  <p className="text-sm font-extrabold text-[#1A1A1A]/85 mb-4 leading-relaxed">
                    Get all 3 flagship packs in one click: <strong>The Ultimate Editing Pack</strong> + <strong>100,000+ AI Reels Mega Bundle</strong> + <strong>Adobe Master Collection Suite</strong>.
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs font-black">
                    <span className="bg-white px-2.5 py-1 rounded-lg border border-[#1A1A1A]">✓ 1,800+ LUTs & Presets</span>
                    <span className="bg-white px-2.5 py-1 rounded-lg border border-[#1A1A1A]">✓ 100,000 HD AI Videos</span>
                    <span className="bg-white px-2.5 py-1 rounded-lg border border-[#1A1A1A]">✓ Full Adobe Lifetime</span>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border-3 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] text-center w-full lg:w-72 shrink-0">
                  <span className="text-xs font-black uppercase text-gray-400 block mb-1">ALL 3 BUNDLES VALUE</span>
                  <div className="flex items-baseline justify-center gap-2 mb-4">
                    <PriceTag
                      amountBDT={399}
                      amountUSD={9.99}
                      currency={currency}
                      className="font-display text-4xl text-[#6C2BD9]"
                    />
                    <span className="text-sm font-black text-gray-400 line-through">
                      {currency === 'BDT' ? '597৳' : '$14.97'}
                    </span>
                  </div>
                  <button
                    onClick={handleBuyAllCombo}
                    className="sticker-btn w-full bg-[#6C2BD9] text-white py-3.5 rounded-xl font-display text-sm uppercase flex items-center justify-center gap-2 hover:bg-[#5821B5]"
                  >
                    <Gift size={16} />
                    <span>CLAIM ALL 3 BUNDLES</span>
                  </button>
                </div>
              </div>
            </section>

            {/* PRODUCT CATALOG GRID */}
            <section id="featured-products" className="py-12 md:py-20 px-4 md:px-8 max-w-7xl mx-auto">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <div className="inline-block bg-[#FF4D8D] text-white font-display text-xs px-4 py-1.5 rounded-full border-3 border-[#1A1A1A] uppercase tracking-widest shadow-[3px_3px_0px_#1A1A1A] mb-3 transform rotate-1">
                  ✨ POPULAR DROPS
                </div>
                <h2 className="font-display text-3xl sm:text-5xl text-[#1A1A1A]">
                  INDIVIDUAL CREATOR PACKS
                </h2>
                <p className="text-sm sm:text-base font-extrabold text-[#1A1A1A]/70 mt-2">
                  Engineered specifically for creators, agencies, and theme pages.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {PRODUCTS.map((product, idx) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    currency={currency}
                    index={idx}
                    onQuickView={(id) => navigateTo("product-detail", id)}
                    onAddToCart={(p) => handleAddToCart(p)}
                    onInstantBuy={(p) => handleInstantBuy(p)}
                  />
                ))}
              </div>
            </section>

            {/* INTERACTIVE LUT TOOL EMBED */}
            <section className="py-12 px-4 md:px-8 max-w-5xl mx-auto">
              <InteractiveLutViewer />
            </section>

            {/* AUDIO SFX PREVIEW TOOL EMBED */}
            <section className="py-12 px-4 md:px-8 max-w-4xl mx-auto">
              <AudioPreviewer />
            </section>

            {/* WHY CHOOSE US */}
            <section className="py-16 md:py-24 bg-[#6C2BD9] text-white border-y-4 border-[#1A1A1A] px-4 md:px-8">
              <div className="max-w-7xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-16">
                  <h2 className="font-display text-3xl sm:text-5xl text-[#FFD400]">
                    WHY CREATORS CHOOSE US
                  </h2>
                  <p className="text-sm md:text-lg font-extrabold text-white/80 mt-2">
                    Zero monthly subscription traps. Pure creator power delivered instantly.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="sticker-card p-6 text-[#1A1A1A] transform -rotate-1">
                    <div className="w-14 h-14 bg-[#FFD400] rounded-2xl border-3 border-[#1A1A1A] flex items-center justify-center mb-4 shadow-[4px_4px_0px_#1A1A1A]">
                      <Zap size={28} className="text-[#1A1A1A]" />
                    </div>
                    <h3 className="font-display text-xl mb-2">INSTANT ACCESS</h3>
                    <p className="text-xs font-bold text-[#1A1A1A]/70">
                      Direct Google Drive cloud download links generated on-screen immediately after checkout.
                    </p>
                  </div>

                  <div className="sticker-card p-6 text-[#1A1A1A] transform rotate-1">
                    <div className="w-14 h-14 bg-[#FF4D8D] text-white rounded-2xl border-3 border-[#1A1A1A] flex items-center justify-center mb-4 shadow-[4px_4px_0px_#1A1A1A]">
                      <ShieldCheck size={28} />
                    </div>
                    <h3 className="font-display text-xl mb-2">PLUG & PLAY</h3>
                    <p className="text-xs font-bold text-[#1A1A1A]/70">
                      Drag-and-drop presets with easy step-by-step video installation guides included.
                    </p>
                  </div>

                  <div className="sticker-card p-6 text-[#1A1A1A] transform -rotate-1">
                    <div className="w-14 h-14 bg-[#00E5FF] text-[#1A1A1A] rounded-2xl border-3 border-[#1A1A1A] flex items-center justify-center mb-4 shadow-[4px_4px_0px_#1A1A1A]">
                      <Clock size={28} />
                    </div>
                    <h3 className="font-display text-xl mb-2">LIFETIME LICENSE</h3>
                    <p className="text-xs font-bold text-[#1A1A1A]/70">
                      Pay once, own forever. Receive free future updates without recurring monthly fees.
                    </p>
                  </div>

                  <div className="sticker-card p-6 text-[#1A1A1A] transform rotate-1">
                    <div className="w-14 h-14 bg-[#FFD400] text-[#1A1A1A] rounded-2xl border-3 border-[#1A1A1A] flex items-center justify-center mb-4 shadow-[4px_4px_0px_#1A1A1A]">
                      <MessageSquare size={28} />
                    </div>
                    <h3 className="font-display text-xl mb-2">24/7 SUPPORT</h3>
                    <p className="text-xs font-bold text-[#1A1A1A]/70">
                      Dedicated WhatsApp and Email support from actual video editors ready to assist you.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* REVIEWS SECTION */}
            <ReviewsSection triggerConfetti={triggerConfetti} />

            {/* FAQ SECTION */}
            <section className="py-16 md:py-24 px-4 md:px-8 max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <span className="font-display text-xs bg-[#FFD400] text-[#1A1A1A] px-3.5 py-1.5 rounded-full border-2 border-[#1A1A1A] inline-block mb-2 shadow-[2px_2px_0px_#1A1A1A]">
                  CLEAR ANSWERS
                </span>
                <h2 className="font-display text-3xl sm:text-5xl text-[#1A1A1A]">
                  FREQUENTLY ASKED
                </h2>
              </div>

              <div className="space-y-3.5">
                {FAQS.map((faq, index) => (
                  <div key={index} className="sticker-card overflow-hidden">
                    <button 
                      onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                      className="w-full p-5 text-left font-display text-base sm:text-lg text-[#1A1A1A] flex items-center justify-between gap-4 focus:outline-none"
                    >
                      <span>{faq.q}</span>
                      {activeFaq === index ? <ChevronUp size={20} className="text-[#6C2BD9]" /> : <ChevronDown size={20} className="text-[#6C2BD9]" />}
                    </button>
                    {activeFaq === index && (
                      <div className="px-5 pb-5 text-xs sm:text-sm font-bold text-[#1A1A1A]/80 border-t-2 border-[#1A1A1A]/10 pt-3 leading-relaxed">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* VIEW 2: ALL PRODUCTS PAGE */}
        {currentPage === 'products' && (
          <div className="py-12 md:py-20 px-4 md:px-8 max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="font-display text-xs bg-[#FFD400] text-[#1A1A1A] px-4 py-1.5 rounded-full border-3 border-[#1A1A1A] uppercase tracking-wider inline-block mb-3 shadow-[3px_3px_0px_#1A1A1A]">
                COMPLETE CATALOG
              </span>
              <h1 className="font-display text-4xl sm:text-6xl text-[#1A1A1A]">
                ALL DIGITAL BUNDLES
              </h1>
              <p className="text-sm sm:text-base font-bold text-[#1A1A1A]/70 mt-2">
                Browse our complete collection of editing presets, AI viral reels, and production tools.
              </p>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 bg-white p-4 rounded-2xl border-3 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A]">
              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                {[
                  { id: 'all', label: 'All Packs' },
                  { id: 'presets', label: 'Presets & LUTs' },
                  { id: 'reels', label: 'AI Reels' },
                  { id: 'software', label: 'Software Suites' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-display transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-[#1A1A1A] text-[#FFD400] shadow-[2px_2px_0px_#FFD400]'
                        : 'bg-[#FFF8EC] text-[#1A1A1A] border border-[#1A1A1A] hover:bg-gray-100'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Search input */}
              <div className="relative w-full md:w-72">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search LUTs, Premiere, CapCut..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#FFF8EC] border-2 border-[#1A1A1A] rounded-xl pl-9 pr-3 py-2 text-xs font-bold text-[#1A1A1A] focus:outline-none"
                />
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product, idx) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  currency={currency}
                  index={idx}
                  onQuickView={(id) => navigateTo("product-detail", id)}
                  onAddToCart={(p) => handleAddToCart(p)}
                  onInstantBuy={(p) => handleInstantBuy(p)}
                />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-16 bg-white rounded-3xl border-3 border-[#1A1A1A] p-8">
                <h3 className="font-display text-xl mb-2">NO BUNDLES MATCHED</h3>
                <p className="text-xs font-bold text-gray-500 mb-4">Try clearing your search terms or view all packs.</p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                  className="sticker-btn bg-[#FFD400] text-[#1A1A1A] px-5 py-2 rounded-xl text-xs font-display"
                >
                  RESET FILTERS
                </button>
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: PRODUCT DETAIL VIEW */}
        {currentPage === 'product-detail' && (
          <div className="pb-24 pt-8">
            <div className="py-6 px-4 md:px-8 max-w-7xl mx-auto">
              <button 
                onClick={() => navigateTo("products")}
                className="sticker-btn bg-white text-[#1A1A1A] px-4 py-2 rounded-xl text-xs uppercase font-display mb-8 inline-flex items-center gap-2"
              >
                ← BACK TO ALL PRODUCTS
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                
                {/* Left Media Column */}
                <div className="lg:col-span-7">
                  <div className="sticker-card p-4 rounded-3xl">
                    <img 
                      src={selectedProduct.image} 
                      alt={selectedProduct.name} 
                      className="w-full h-80 sm:h-96 md:h-[420px] object-cover rounded-2xl border-3 border-[#1A1A1A] mb-4"
                    />
                    <div className="grid grid-cols-3 gap-3">
                      <div className="rounded-xl border-2 border-[#1A1A1A] bg-[#6C2BD9] text-white flex flex-col items-center justify-center p-2.5 text-center">
                        <span className="font-display text-xs">FILE SIZE</span>
                        <span className="text-[11px] font-bold text-[#FFD400]">{selectedProduct.fileSize}</span>
                      </div>
                      <div className="rounded-xl border-2 border-[#1A1A1A] bg-[#FFD400] text-[#1A1A1A] flex flex-col items-center justify-center p-2.5 text-center">
                        <span className="font-display text-xs">FORMATS</span>
                        <span className="text-[10px] font-black truncate max-w-full">{selectedProduct.format}</span>
                      </div>
                      <div className="rounded-xl border-2 border-[#1A1A1A] bg-[#00E5FF] text-[#1A1A1A] flex flex-col items-center justify-center p-2.5 text-center">
                        <span className="font-display text-xs">ACCESS</span>
                        <span className="text-[11px] font-black">GOOGLE DRIVE</span>
                      </div>
                    </div>
                  </div>

                  {/* If editing pack, show the LUT slider and SFX audio tools right here! */}
                  {selectedProduct.category === 'presets' && (
                    <div className="mt-8 space-y-6">
                      <InteractiveLutViewer />
                      <AudioPreviewer />
                    </div>
                  )}
                </div>

                {/* Right Specs and Actions */}
                <div className="lg:col-span-5">
                  <span className={`inline-block font-display text-xs px-3.5 py-1.5 rounded-xl border-3 border-[#1A1A1A] mb-3 ${selectedProduct.badgeBg} ${selectedProduct.badgeText} ${selectedProduct.badgeShadow}`}>
                    {selectedProduct.badge}
                  </span>

                  <h1 className="font-display text-3xl sm:text-5xl text-[#1A1A1A] mb-2 leading-tight">
                    {selectedProduct.name}
                  </h1>

                  <p className="text-xs font-black text-[#6C2BD9] mb-4">
                    ★ {selectedProduct.rating}
                  </p>

                  <div className="flex items-baseline gap-3 mb-6 bg-white p-4 rounded-2xl border-3 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A]">
                    <PriceTag
                      amountBDT={selectedProduct.priceBDT}
                      amountUSD={selectedProduct.priceUSD}
                      currency={currency}
                      className="font-display text-4xl text-[#6C2BD9]"
                    />
                    <span className="text-sm font-black text-gray-400 line-through">
                      {currency === 'BDT' ? `${selectedProduct.oldPriceBDT}৳` : `$${selectedProduct.oldPriceUSD}`}
                    </span>
                    <span className="text-xs font-black text-white bg-[#FF4D8D] px-3 py-1 rounded-full border border-[#1A1A1A] ml-auto">
                      SPECIAL DEAL
                    </span>
                  </div>

                  <p className="text-sm font-bold text-[#1A1A1A]/80 mb-6 leading-relaxed">
                    {selectedProduct.description}
                  </p>

                  {/* Action Buttons */}
                  <div className="space-y-3 mb-8">
                    <button 
                      onClick={(e) => handleInstantBuy(selectedProduct, e)}
                      className="sticker-btn w-full bg-[#FFD400] text-[#1A1A1A] py-4 rounded-2xl font-display text-lg uppercase flex items-center justify-center gap-2.5 hover:bg-[#FFE033]"
                    >
                      <ShoppingBag size={20} />
                      <span>BUY NOW (INSTANT ACCESS)</span>
                      <ExternalLink size={18} />
                    </button>

                    <button 
                      onClick={(e) => handleAddToCart(selectedProduct, e)}
                      className="sticker-btn w-full bg-white text-[#1A1A1A] py-3.5 rounded-2xl font-display text-sm uppercase flex items-center justify-center gap-2 hover:bg-[#FFF8EC]"
                    >
                      <ShoppingBag size={16} />
                      <span>ADD TO CART</span>
                    </button>
                  </div>

                  {/* Features List */}
                  <div className="bg-white p-5 rounded-3xl border-3 border-[#1A1A1A] mb-6">
                    <h3 className="font-display text-base mb-3 text-[#1A1A1A]">CORE ASSETS INCLUDED:</h3>
                    <ul className="space-y-2.5">
                      {selectedProduct.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs font-black text-[#1A1A1A]">
                          <div className="bg-[#6C2BD9] p-0.5 rounded-full text-white mt-0.5 border border-[#1A1A1A] shrink-0">
                            <Check size={12} />
                          </div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Technical Specifications */}
                  <div className="bg-white p-5 rounded-3xl border-3 border-[#1A1A1A]">
                    <h3 className="font-display text-base mb-3 text-[#1A1A1A]">SPECIFICATIONS:</h3>
                    <div className="space-y-2 text-xs font-bold">
                      {selectedProduct.specs.map((spec, sIdx) => (
                        <div key={sIdx} className="flex justify-between border-b border-gray-100 pb-1.5">
                          <span className="text-gray-500">{spec.label}:</span>
                          <span className="font-black text-[#1A1A1A] text-right">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* Reviews for this product */}
              <div className="mt-16">
                <ReviewsSection productId={selectedProduct.id} triggerConfetti={triggerConfetti} />
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: LUT SLIDER DEDICATED TOOL */}
        {currentPage === 'lut-tool' && (
          <div className="py-12 px-4 md:px-8 max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <span className="font-display text-xs bg-[#FFD400] text-[#1A1A1A] px-3.5 py-1.5 rounded-full border-2 border-[#1A1A1A] inline-block mb-2">
                LIVE INTERACTIVE LAB
              </span>
              <h1 className="font-display text-4xl sm:text-6xl text-[#1A1A1A]">
                LUT COLOR GRADE PREVIEW
              </h1>
              <p className="text-sm font-bold text-gray-600 mt-2">
                Compare flat log camera footage directly against our Hollywood-grade .CUBE profiles.
              </p>
            </div>
            <InteractiveLutViewer />
          </div>
        )}

        {/* VIEW 5: SFX TESTER DEDICATED TOOL */}
        {currentPage === 'sfx-tool' && (
          <div className="py-12 px-4 md:px-8 max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <span className="font-display text-xs bg-[#FF4D8D] text-white px-3.5 py-1.5 rounded-full border-2 border-[#1A1A1A] inline-block mb-2">
                AUDIO ACOUSTICS LAB
              </span>
              <h1 className="font-display text-4xl sm:text-6xl text-[#1A1A1A]">
                SFX SOUND DESIGN TESTER
              </h1>
              <p className="text-sm font-bold text-gray-600 mt-2">
                Click any sound below to trigger live synthesized audio transients engineered for viral retention.
              </p>
            </div>
            <AudioPreviewer />
          </div>
        )}

        {/* VIEW 6: CONTACT & SUPPORT */}
        {currentPage === 'contact' && <ContactView />}

        {/* VIEW 7: MISSION / ABOUT */}
        {currentPage === 'about' && (
          <div className="py-16 px-4 md:px-8 max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <span className="font-display text-xs bg-[#FFD400] text-[#1A1A1A] px-4 py-1.5 rounded-full border-3 border-[#1A1A1A] uppercase tracking-wider inline-block mb-3">
                OUR MISSION
              </span>
              <h1 className="font-display text-4xl sm:text-6xl text-[#1A1A1A]">
                BUILT BY CREATORS FOR CREATORS
              </h1>
            </div>

            <div className="sticker-card p-8 md:p-10 space-y-5 text-sm md:text-base font-black text-[#1A1A1A]/80 leading-relaxed mb-8">
              <p>
                At <strong className="text-[#6C2BD9]">{STORE_CONFIG.brandName}</strong>, we believe editors waste too many hours organizing folders, hunting for royalty-free sound effects, and manually keyframing simple transitions.
              </p>
              <p>
                We built this vault to give creators production-grade tools: cinematic LUTs, kinetic sound design, pre-cleared AI reels, and lifetime software packages that let you focus on storytelling and audience growth.
              </p>
              <p>
                Every asset in our vault has been tested on commercial agency projects and viral TikTok/Instagram theme pages before release.
              </p>
            </div>

            <div className="text-center">
              <button 
                onClick={() => navigateTo("products")}
                className="sticker-btn bg-[#FFD400] text-[#1A1A1A] px-8 py-4 rounded-2xl font-display text-base uppercase inline-flex items-center gap-2"
              >
                <ShoppingBag size={18} />
                <span>EXPLORE ALL DIGITAL BUNDLES</span>
              </button>
            </div>
          </div>
        )}

        {/* VIEW 8: LEGAL PAGES */}
        {currentPage === 'terms' && (
          <div className="py-16 px-4 md:px-8 max-w-3xl mx-auto">
            <h1 className="font-display text-4xl mb-6 text-[#1A1A1A]">TERMS OF SERVICE</h1>
            <div className="sticker-card p-8 space-y-4 text-xs sm:text-sm font-black text-[#1A1A1A]/80">
              <p>By purchasing digital assets from {STORE_CONFIG.brandName}, you are granted a non-exclusive, worldwide lifetime license to use the files in unlimited commercial, client, and personal media projects.</p>
              <p>Directly re-selling, sharing, or re-distributing raw source folders without permission is prohibited.</p>
            </div>
          </div>
        )}

        {currentPage === 'privacy' && (
          <div className="py-16 px-4 md:px-8 max-w-3xl mx-auto">
            <h1 className="font-display text-4xl mb-6 text-[#1A1A1A]">PRIVACY POLICY</h1>
            <div className="sticker-card p-8 space-y-4 text-xs sm:text-sm font-black text-[#1A1A1A]/80">
              <p>We respect customer privacy. Customer email addresses are collected solely to dispatch instant download links, order receipts, and technical updates.</p>
              <p>We never sell or disclose your email or phone number to third-party marketing companies.</p>
            </div>
          </div>
        )}

        {currentPage === 'refund' && (
          <div className="py-16 px-4 md:px-8 max-w-3xl mx-auto">
            <h1 className="font-display text-4xl mb-6 text-[#1A1A1A]">30-DAY SATISFACTION GUARANTEE</h1>
            <div className="sticker-card p-8 space-y-4 text-xs sm:text-sm font-black text-[#1A1A1A]/80">
              <p>All assets are backed by our 100% technical compatibility guarantee. If you encounter any corrupted files or compatibility issues with supported software, our 24/7 team will resolve it or provide alternate download mirrors immediately.</p>
            </div>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-[#6C2BD9] text-white border-t-4 border-[#1A1A1A] pt-16 pb-12 px-4 md:px-8 relative overflow-hidden">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-block bg-[#FF4D8D] text-white px-5 py-1.5 rounded-full border-3 border-[#1A1A1A] font-display text-xs uppercase tracking-widest shadow-[3px_3px_0px_#1A1A1A] mb-4">
            ✨ CREATOR COMMUNITY
          </div>

          <h2 
            onClick={(e) => triggerConfetti(e)}
            className="font-display text-5xl sm:text-7xl md:text-8xl tracking-wider text-[#FFD400] cursor-pointer drop-shadow-[5px_5px_0px_#1A1A1A] hover:scale-105 transition-transform mb-4"
          >
            STAY WITH US
          </h2>

          <p className="text-base md:text-xl font-extrabold max-w-lg mx-auto text-white/90 mb-8">
            Follow our creator channels for secret asset drops, free presets, and daily editing shortcuts.
          </p>

          {/* Social Badges */}
          <div className="flex flex-wrap justify-center items-center gap-3.5 mb-12">
            <a 
              href={STORE_CONFIG.socials.instagram} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="sticker-btn bg-[#FF4D8D] text-white px-4 py-2.5 rounded-xl flex items-center gap-1.5 text-sm font-display"
            >
              <span>📸 INSTAGRAM</span>
              <ExternalLink size={14} />
            </a>
            <a 
              href={STORE_CONFIG.socials.tiktok} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="sticker-btn bg-[#00E5FF] text-[#1A1A1A] px-4 py-2.5 rounded-xl flex items-center gap-1.5 text-sm font-display"
            >
              <span>🎵 TIKTOK</span>
              <ExternalLink size={14} />
            </a>
            <a 
              href={STORE_CONFIG.socials.youtube} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="sticker-btn bg-[#FF0000] text-white px-4 py-2.5 rounded-xl flex items-center gap-1.5 text-sm font-display"
            >
              <span>📺 YOUTUBE</span>
              <ExternalLink size={14} />
            </a>
            <a 
              href={STORE_CONFIG.socials.telegram} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="sticker-btn bg-[#FFD400] text-[#1A1A1A] px-4 py-2.5 rounded-xl flex items-center gap-1.5 text-sm font-display"
            >
              <span>✈️ TELEGRAM</span>
              <ExternalLink size={14} />
            </a>
            <a 
              href={STORE_CONFIG.socials.whatsapp} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="sticker-btn bg-[#25D366] text-[#1A1A1A] px-4 py-2.5 rounded-xl flex items-center gap-1.5 text-sm font-display"
            >
              <span>💬 WHATSAPP</span>
              <ExternalLink size={14} />
            </a>
          </div>

          {/* Navigation Links */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto mb-10 text-xs sm:text-sm font-black">
            <button onClick={() => navigateTo("home")} className="hover:text-[#FFD400] transition-colors">🕹️ Home</button>
            <button onClick={() => navigateTo("products")} className="hover:text-[#FFD400] transition-colors">📦 Products</button>
            <button onClick={() => navigateTo("about")} className="hover:text-[#FFD400] transition-colors">✨ Our Story</button>
            <button onClick={() => navigateTo("contact")} className="hover:text-[#FFD400] transition-colors">💬 Support</button>
            <button onClick={() => navigateTo("terms")} className="hover:text-[#FFD400] transition-colors">Terms of Use</button>
            <button onClick={() => navigateTo("privacy")} className="hover:text-[#FFD400] transition-colors">Privacy Policy</button>
            <button onClick={() => navigateTo("refund")} className="hover:text-[#FFD400] transition-colors">30-Day Guarantee</button>
            <button onClick={() => setIsVaultOpen(true)} className="hover:text-[#FFD400] transition-colors">🔑 My Downloads</button>
          </div>

          <div className="border-t-2 border-white/20 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs font-black text-white/80">
            <div>
              © {new Date().getFullYear()} {STORE_CONFIG.brandName}. All rights reserved.
            </div>
            <div className="flex items-center gap-2 bg-[#1A1A1A] text-white px-3.5 py-1.5 rounded-full border border-[#1A1A1A]">
              <span>Made for creators</span>
              <Heart size={13} className="fill-[#FF4D8D] text-[#FF4D8D] inline" />
            </div>
          </div>
        </div>
      </footer>

      {/* CART DRAWER */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onCheckout={handleCheckoutFromCart}
        currency={currency}
      />

      {/* CHECKOUT & ORDER MODAL */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        productsToBuy={checkoutProducts}
        currency={currency}
        onOrderComplete={(order) => {
          // If items were checked out from cart, clear cart
          setCartItems([]);
          showToast(`Order #${order.id} complete! Check My Vault for files. 🚀`);
        }}
        triggerConfetti={triggerConfetti}
      />

      {/* MY VAULT / DOWNLOADS MODAL */}
      <DownloadsVaultModal
        isOpen={isVaultOpen}
        onClose={() => setIsVaultOpen(false)}
      />

    </div>
  );
}
