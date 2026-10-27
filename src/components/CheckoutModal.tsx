import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Sparkles, 
  Check, 
  ArrowRight, 
  Download, 
  Copy, 
  CheckCheck, 
  Lock, 
  Gift, 
  Zap,
  FolderOpen
} from 'lucide-react';
import { ProductItem, OrderRecord } from '../types';
import { STORE_CONFIG, PRODUCTS } from '../data/products';
import { PriceTag } from './PriceTag';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  productsToBuy: { product: ProductItem; quantity: number }[];
  currency: 'BDT' | 'USD';
  onOrderComplete: (order: OrderRecord) => void;
  triggerConfetti: (e?: React.MouseEvent) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  productsToBuy,
  currency,
  onOrderComplete,
  triggerConfetti
}) => {
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [processingStage, setProcessingStage] = useState<string>('Validating order...');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [selectedPayment, setSelectedPayment] = useState<string>('bkash');
  const [couponCode, setCouponCode] = useState<string>('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [includeUpsell, setIncludeUpsell] = useState<boolean>(false);
  const [completedOrder, setCompletedOrder] = useState<OrderRecord | null>(null);
  const [copiedKey, setCopiedKey] = useState<boolean>(false);

  if (!isOpen) return null;

  // Potential upsell product: if buying editing pack, suggest AI reels; if buying AI reels, suggest adobe or editing pack
  const firstProdId = productsToBuy[0]?.product.id;
  const upsellCandidate = PRODUCTS.find(p => p.id !== firstProdId) || PRODUCTS[1];

  // Price calculations
  let subtotalBDT = productsToBuy.reduce((sum, item) => sum + item.product.priceBDT * item.quantity, 0);
  let subtotalUSD = productsToBuy.reduce((sum, item) => sum + item.product.priceUSD * item.quantity, 0);

  if (includeUpsell && upsellCandidate) {
    // 50% off on upsell
    subtotalBDT += Math.round(upsellCandidate.priceBDT * 0.5);
    subtotalUSD += Number((upsellCandidate.priceUSD * 0.5).toFixed(2));
  }

  const discountAmountBDT = Math.round(subtotalBDT * appliedDiscount);
  const discountAmountUSD = Number((subtotalUSD * appliedDiscount).toFixed(2));

  const totalBDT = Math.max(0, subtotalBDT - discountAmountBDT);
  const totalUSD = Math.max(0, Number((subtotalUSD - discountAmountUSD).toFixed(2)));

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = couponCode.trim().toUpperCase();
    if (STORE_CONFIG.promoCodes[cleanCode]) {
      const disc = STORE_CONFIG.promoCodes[cleanCode];
      setAppliedDiscount(disc);
      setCouponMessage(`🎉 Coupon applied! ${disc * 100}% DISCOUNT.`);
    } else {
      setCouponMessage(`❌ Invalid code. Try "CREATOR50" or "LAUNCH20"`);
    }
  };

  const handleCompletePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerEmail.trim()) {
      alert("Please enter a valid email to receive your download links.");
      return;
    }

    setStep('processing');
    setProcessingStage('Encrypting order & securing instant access...');

    setTimeout(() => {
      setProcessingStage('Generating your unique commercial license key...');
    }, 900);

    setTimeout(() => {
      setProcessingStage('Syncing Google Drive cloud folder permissions...');
    }, 1800);

    setTimeout(() => {
      const orderId = `SV-${Date.now().toString().slice(-6)}`;
      const licenseCode = `SV-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-LIFETIME`;

      const allItems = [...productsToBuy];
      if (includeUpsell && upsellCandidate) {
        allItems.push({ product: upsellCandidate, quantity: 1 });
      }

      const newOrder: OrderRecord = {
        id: orderId,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        customerName: customerName || 'Valued Creator',
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        paymentMethod: selectedPayment.toUpperCase(),
        items: allItems.map(item => ({
          id: item.product.id,
          name: item.product.name,
          price: currency === 'BDT' ? `${item.product.priceBDT}৳` : `$${item.product.priceUSD}`,
          downloadUrl: `https://drive.google.com/drive/folders/sample-${item.product.id}`,
          licenseKey: licenseCode
        })),
        totalAmount: currency === 'BDT' ? `${totalBDT}৳` : `$${totalUSD}`,
        currency,
        status: 'Completed'
      };

      // Save order to localStorage
      try {
        const stored = JSON.parse(localStorage.getItem('snapvault_orders') || '[]');
        stored.unshift(newOrder);
        localStorage.setItem('snapvault_orders', JSON.stringify(stored));
      } catch (err) {
        console.error(err);
      }

      setCompletedOrder(newOrder);
      setStep('success');
      onOrderComplete(newOrder);
      triggerConfetti();
    }, 2800);
  };

  const handleDownloadStarterKit = () => {
    if (!completedOrder) return;
    const content = `=====================================================
SNAPVAULT - CREATOR DIGITAL STOREFRONT ACCESS GUIDE
=====================================================

ORDER ID: ${completedOrder.id}
DATE: ${completedOrder.date}
CUSTOMER: ${completedOrder.customerName} (${completedOrder.customerEmail})
PAYMENT METHOD: ${completedOrder.paymentMethod}
STATUS: LIFETIME ACTIVATED

YOUR PURCHASED DIGITAL PRODUCTS:
${completedOrder.items.map(it => `
- ${it.name}
  License Key: ${it.licenseKey}
  Cloud Access URL: https://drive.google.com/drive/folders/${it.id}-vault-access
  File Format: 4K UHD / Studio 24-bit WAV / Pre-Activated
`).join('')}

HOW TO INSTALL & IMPORT:
1. PRESETS & LUTS (.cube):
   Open Premiere / DaVinci / CapCut -> Color -> Creative -> Browse -> Select downloaded .cube file.
2. SFX & TRANSITIONS (.wav):
   Drag into project media bin, snap to audio track beneath your visual cut.
3. 100K AI REELS BUNDLE:
   Open the Google Drive link -> Click "Add shortcut to Drive" for 1-click cloud sync.
4. ADOBE MASTER COLLECTION:
   Run the pre-activated installer executable; no account login required.

SUPPORT & COMMUNITY:
Email: ${STORE_CONFIG.supportEmail}
WhatsApp: ${STORE_CONFIG.supportWhatsApp}
Telegram: ${STORE_CONFIG.supportTelegram}

Thank you for choosing SNAPVAULT. Create faster. Edit bigger!
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SNAPVAULT_Order_${completedOrder.id}_Access_Kit.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyLicense = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#FFF8EC] border-4 border-[#1A1A1A] rounded-3xl shadow-[8px_8px_0px_#1A1A1A] p-6 sm:p-8 my-8 text-[#1A1A1A] animate-in fade-in zoom-in duration-200">
        
        {/* Close Button */}
        {step !== 'processing' && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-10 h-10 bg-[#FF4D8D] text-white border-2 border-[#1A1A1A] rounded-xl flex items-center justify-center shadow-[2px_2px_0px_#1A1A1A] hover:rotate-6 transition-transform"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        )}

        {/* STEP 1: CHECKOUT FORM */}
        {step === 'form' && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-[#FFD400] text-[#1A1A1A] text-xs font-display px-3 py-1 rounded-full border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]">
                ⚡ INSTANT DOWNLOAD CHECKOUT
              </span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl text-[#1A1A1A] mb-1">
              FINALIZE YOUR ORDER
            </h2>
            <p className="text-xs font-bold text-[#1A1A1A]/70 mb-6">
              Enter your email to receive direct Google Drive cloud keys immediately after checkout.
            </p>

            {/* ORDER ITEMS LIST */}
            <div className="bg-white rounded-2xl border-3 border-[#1A1A1A] p-4 mb-5 space-y-3">
              <span className="text-[11px] font-black uppercase text-gray-500 tracking-wider block">
                Selected Products:
              </span>
              {productsToBuy.map((item) => (
                <div key={item.product.id} className="flex items-center justify-between gap-3 text-sm font-black border-b border-gray-100 pb-2">
                  <div className="flex items-center gap-2.5 truncate">
                    <img src={item.product.image} alt="" className="w-10 h-10 rounded-lg border border-[#1A1A1A] object-cover" />
                    <div className="truncate">
                      <div className="truncate text-xs sm:text-sm">{item.product.name}</div>
                      <div className="text-[10px] text-gray-400 font-bold">Qty: {item.quantity} • Lifetime Access</div>
                    </div>
                  </div>
                  <div className="font-display text-[#6C2BD9] text-base whitespace-nowrap">
                    <PriceTag
                      amountBDT={item.product.priceBDT * item.quantity}
                      amountUSD={item.product.priceUSD * item.quantity}
                      currency={currency}
                    />
                  </div>
                </div>
              ))}

              {/* 1-Click Upsell Offer */}
              {upsellCandidate && (
                <div className="mt-3 pt-2 bg-[#FFF8EC] border-2 border-dashed border-[#6C2BD9] rounded-xl p-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="upsellCheck"
                      checked={includeUpsell}
                      onChange={(e) => setIncludeUpsell(e.target.checked)}
                      className="w-5 h-5 rounded accent-[#6C2BD9] cursor-pointer"
                    />
                    <label htmlFor="upsellCheck" className="text-xs font-black cursor-pointer leading-tight">
                      <span className="text-[#FF4D8D] font-display">BONUS DEAL:</span> Add <span className="underline">{upsellCandidate.name}</span> for{' '}
                      <PriceTag
                        amountBDT={Math.round(upsellCandidate.priceBDT * 0.5)}
                        amountUSD={Number((upsellCandidate.priceUSD * 0.5).toFixed(2))}
                        currency={currency}
                        className="text-[#6C2BD9] font-black"
                      />{' '}
                      <span className="bg-[#FFD400] text-[#1A1A1A] px-1.5 py-0.5 rounded text-[10px] border border-[#1A1A1A]">50% OFF</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* FORM */}
            <form onSubmit={handleCompletePayment} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-[#1A1A1A] mb-1">
                  Delivery Email Address <span className="text-[#FF4D8D]">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="yourname@gmail.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full bg-white border-2.5 border-[#1A1A1A] rounded-xl px-4 py-2.5 text-sm font-bold text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#6C2BD9] shadow-[2px_2px_0px_#1A1A1A]"
                />
                <span className="text-[10px] font-bold text-gray-500 mt-1 block">
                  Cloud links & license details will be dispatched to this email immediately.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black uppercase text-[#1A1A1A] mb-1">
                    Your Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Creator Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-white border-2.5 border-[#1A1A1A] rounded-xl px-4 py-2.5 text-sm font-bold text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#6C2BD9] shadow-[2px_2px_0px_#1A1A1A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-[#1A1A1A] mb-1">
                    WhatsApp / Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="+880 1700..."
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-white border-2.5 border-[#1A1A1A] rounded-xl px-4 py-2.5 text-sm font-bold text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#6C2BD9] shadow-[2px_2px_0px_#1A1A1A]"
                  />
                </div>
              </div>

              {/* PAYMENT METHODS */}
              <div>
                <label className="block text-xs font-black uppercase text-[#1A1A1A] mb-2">
                  Select Payment Method:
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {[
                    { id: 'bkash', label: 'bKash', color: 'border-[#E2136E] text-[#E2136E]' },
                    { id: 'nagad', label: 'Nagad', color: 'border-[#F7931E] text-[#F7931E]' },
                    { id: 'rocket', label: 'Rocket', color: 'border-[#8C3494] text-[#8C3494]' },
                    { id: 'card', label: 'Card (Visa/MC)', color: 'border-[#1A1A1A] text-[#1A1A1A]' },
                    { id: 'crypto', label: 'Crypto/PayPal', color: 'border-[#00E5FF] text-[#1A1A1A]' }
                  ].map((pm) => (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setSelectedPayment(pm.id)}
                      className={`p-2.5 rounded-xl border-2 font-display text-[11px] text-center transition-all ${
                        selectedPayment === pm.id
                          ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-[3px_3px_0px_#FFD400] -translate-y-0.5'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                      }`}
                    >
                      {pm.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* COUPON CODE INPUT */}
              <div className="pt-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Discount code (e.g. CREATOR50)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 bg-white border-2 border-[#1A1A1A] rounded-xl px-3 py-2 text-xs font-bold text-[#1A1A1A] uppercase focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="sticker-btn bg-white text-[#1A1A1A] px-4 py-2 rounded-xl text-xs font-display uppercase"
                  >
                    APPLY
                  </button>
                </div>
                {couponMessage && (
                  <p className="text-xs font-black mt-1 text-[#6C2BD9]">{couponMessage}</p>
                )}
              </div>

              {/* TOTAL & SUBMIT BUTTON */}
              <div className="pt-4 border-t-2 border-[#1A1A1A]/20">
                <div className="flex items-baseline justify-between mb-4">
                  <span className="font-display text-lg text-[#1A1A1A]">TOTAL TO PAY:</span>
                  <div className="text-right">
                    <PriceTag
                      amountBDT={totalBDT}
                      amountUSD={totalUSD}
                      currency={currency}
                      className="font-display text-3xl text-[#6C2BD9]"
                    />
                    {appliedDiscount > 0 && (
                      <span className="block text-[11px] font-black text-[#FF4D8D]">
                        Saved {Math.round(appliedDiscount * 100)}%!
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="sticker-btn w-full bg-[#FFD400] text-[#1A1A1A] py-4 rounded-2xl font-display text-lg uppercase flex items-center justify-center gap-2 hover:bg-[#FFE033]"
                >
                  <Lock size={18} />
                  <span>PAY & ACCESS INSTANT DOWNLOADS</span>
                  <ArrowRight size={18} />
                </button>

                <div className="flex items-center justify-center gap-4 text-[10px] font-black text-gray-500 mt-3">
                  <span className="flex items-center gap-1">
                    <ShieldCheck size={14} className="text-[#6C2BD9]" /> 256-Bit SSL Encrypted
                  </span>
                  <span>•</span>
                  <span>⚡ Direct Drive Access</span>
                  <span>•</span>
                  <span>♾️ Lifetime License</span>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* STEP 2: PROCESSING ANIMATION */}
        {step === 'processing' && (
          <div className="py-12 text-center">
            <div className="w-20 h-20 bg-[#FFD400] border-4 border-[#1A1A1A] rounded-3xl mx-auto flex items-center justify-center mb-6 shadow-[6px_6px_0px_#1A1A1A] animate-spin">
              <Zap size={36} className="text-[#1A1A1A]" />
            </div>

            <h3 className="font-display text-2xl text-[#1A1A1A] mb-3">
              PROCESSING YOUR ORDER
            </h3>

            <p className="text-sm font-extrabold text-[#6C2BD9] animate-pulse max-w-sm mx-auto mb-6">
              {processingStage}
            </p>

            <div className="w-full bg-white h-4 rounded-full border-2 border-[#1A1A1A] overflow-hidden p-0.5">
              <div className="bg-[#6C2BD9] h-full rounded-full animate-[marquee_2s_ease-in-out_infinite] w-2/3"></div>
            </div>
          </div>
        )}

        {/* STEP 3: ORDER SUCCESS & INSTANT DOWNLOAD VAULT */}
        {step === 'success' && completedOrder && (
          <div>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-[#25D366] text-white border-3 border-[#1A1A1A] rounded-2xl mx-auto flex items-center justify-center mb-3 shadow-[4px_4px_0px_#1A1A1A]">
                <Check size={36} />
              </div>

              <span className="bg-[#FFD400] text-[#1A1A1A] font-display text-xs px-3.5 py-1 rounded-full border-2 border-[#1A1A1A] inline-block mb-1 shadow-[2px_2px_0px_#1A1A1A]">
                🎉 ORDER COMPLETED!
              </span>

              <h2 className="font-display text-2xl sm:text-3xl text-[#1A1A1A]">
                WELCOME TO THE VAULT
              </h2>
              <p className="text-xs font-bold text-[#1A1A1A]/70">
                Order <span className="font-black text-[#6C2BD9]">{completedOrder.id}</span> • Delivery email: <span className="font-black">{completedOrder.customerEmail}</span>
              </p>
            </div>

            {/* LICENSE KEY CARD */}
            <div className="bg-[#1A1A1A] text-white p-4 rounded-2xl border-3 border-[#1A1A1A] mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#FFD400]">
                  YOUR LIFETIME LICENSE KEY:
                </span>
                <span className="text-[10px] font-bold text-gray-400">COMMERCIAL USE</span>
              </div>
              <div className="flex items-center justify-between gap-2 bg-black/40 p-2.5 rounded-xl border border-white/10 font-mono text-xs sm:text-sm font-black">
                <span className="text-[#00E5FF] tracking-wider truncate">
                  {completedOrder.items[0]?.licenseKey}
                </span>
                <button
                  onClick={() => handleCopyLicense(completedOrder.items[0]?.licenseKey || '')}
                  className="sticker-btn bg-[#FFD400] text-[#1A1A1A] px-2.5 py-1 rounded-lg text-xs font-display flex items-center gap-1 shrink-0"
                >
                  {copiedKey ? <CheckCheck size={14} /> : <Copy size={14} />}
                  <span>{copiedKey ? 'COPIED' : 'COPY'}</span>
                </button>
              </div>
            </div>

            {/* DOWNLOAD LINKS & CLOUD FOLDERS */}
            <div className="space-y-3 mb-6">
              {completedOrder.items.map((item, idx) => (
                <div key={idx} className="bg-white p-3.5 rounded-2xl border-2.5 border-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A] flex items-center justify-between gap-3">
                  <div className="truncate">
                    <h4 className="font-display text-xs sm:text-sm text-[#1A1A1A] truncate">{item.name}</h4>
                    <span className="text-[10px] font-black text-[#6C2BD9] flex items-center gap-1">
                      <FolderOpen size={12} /> Google Drive High-Speed Link Ready
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      triggerConfetti();
                      handleDownloadStarterKit();
                    }}
                    className="sticker-btn bg-[#FFD400] text-[#1A1A1A] px-3 py-1.5 rounded-xl text-xs font-display shrink-0 flex items-center gap-1.5"
                  >
                    <Download size={14} />
                    <span>DOWNLOAD</span>
                  </button>
                </div>
              ))}
            </div>

            {/* STARTER KIT DOWNLOAD BUTTON */}
            <div className="space-y-2">
              <button
                onClick={handleDownloadStarterKit}
                className="sticker-btn w-full bg-[#6C2BD9] text-white py-3.5 rounded-2xl font-display text-sm uppercase flex items-center justify-center gap-2 hover:bg-[#5821B5]"
              >
                <Download size={18} />
                <span>SAVE LICENSE & DIRECT ACCESS KEYS (.TXT)</span>
              </button>

              <button
                onClick={onClose}
                className="w-full text-center py-2 text-xs font-black text-gray-500 hover:text-black transition-colors"
              >
                Back to Storefront (Order saved in My Vault)
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
