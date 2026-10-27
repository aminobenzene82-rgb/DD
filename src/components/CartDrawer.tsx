import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Sparkles, Plus, Minus } from 'lucide-react';
import { CartItem } from '../types';
import { PriceTag } from './PriceTag';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onCheckout: () => void;
  currency: 'BDT' | 'USD';
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
  currency
}) => {
  if (!isOpen) return null;

  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Bundle Combo Bonus: If customer buys 2 or more products, give 15% bundle discount!
  const hasBundleDiscount = cartItems.length >= 2;
  const bundleDiscountRate = hasBundleDiscount ? 0.15 : 0;

  const subtotalBDT = cartItems.reduce((sum, item) => sum + item.product.priceBDT * item.quantity, 0);
  const subtotalUSD = cartItems.reduce((sum, item) => sum + item.product.priceUSD * item.quantity, 0);

  const discountBDT = Math.round(subtotalBDT * bundleDiscountRate);
  const discountUSD = Number((subtotalUSD * bundleDiscountRate).toFixed(2));

  const totalBDT = subtotalBDT - discountBDT;
  const totalUSD = Number((subtotalUSD - discountUSD).toFixed(2));

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-[#FFF8EC] h-full border-l-4 border-[#1A1A1A] shadow-[-10px_0px_0px_#1A1A1A] p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div>
          <div className="flex items-center justify-between border-b-3 border-[#1A1A1A] pb-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-[#FFD400] text-[#1A1A1A] rounded-xl border-2 border-[#1A1A1A] flex items-center justify-center font-display shadow-[2px_2px_0px_#1A1A1A]">
                <ShoppingBag size={18} />
              </div>
              <h2 className="font-display text-xl text-[#1A1A1A]">
                YOUR CREATOR CART ({totalItemsCount})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 bg-[#FF4D8D] text-white border-2 border-[#1A1A1A] rounded-xl flex items-center justify-center shadow-[2px_2px_0px_#1A1A1A] hover:rotate-6 transition-transform"
              aria-label="Close cart"
            >
              <X size={18} />
            </button>
          </div>

          {/* Combo Promotion Pill */}
          {cartItems.length < 2 && cartItems.length > 0 && (
            <div className="bg-[#00E5FF]/20 border-2 border-[#00E5FF] p-2.5 rounded-xl text-xs font-black text-[#1A1A1A] mb-4 flex items-center gap-2">
              <Sparkles size={16} className="text-[#6C2BD9] shrink-0" />
              <span>PRO TIP: Add 1 more bundle to unlock a <strong>15% Combo Discount</strong> automatically!</span>
            </div>
          )}

          {hasBundleDiscount && (
            <div className="bg-[#25D366]/20 border-2 border-[#25D366] p-2.5 rounded-xl text-xs font-black text-[#1A1A1A] mb-4 flex items-center gap-2">
              <span className="text-base">🎉</span>
              <span><strong>15% MULTI-BUNDLE DISCOUNT APPLIED!</strong> You unlocked creator combo pricing.</span>
            </div>
          )}

          {/* Cart Items List */}
          {cartItems.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-16 h-16 bg-white border-3 border-[#1A1A1A] rounded-2xl mx-auto flex items-center justify-center text-3xl mb-4 shadow-[4px_4px_0px_#1A1A1A]">
                🛒
              </div>
              <h3 className="font-display text-lg mb-2">YOUR CART IS EMPTY</h3>
              <p className="text-xs font-bold text-gray-500 max-w-xs mx-auto mb-6">
                Explore our viral video presets, 100K AI reels, or lifetime Adobe suite to boost your content game.
              </p>
              <button
                onClick={onClose}
                className="sticker-btn bg-[#FFD400] text-[#1A1A1A] px-6 py-2.5 rounded-xl text-xs font-display uppercase"
              >
                START SHOPPING
              </button>
            </div>
          ) : (
            <div className="space-y-3 mb-6">
              {cartItems.map((item) => (
                <div
                  key={item.product.id}
                  className="bg-white border-2.5 border-[#1A1A1A] rounded-2xl p-3 shadow-[3px_3px_0px_#1A1A1A] flex items-center justify-between gap-3"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-14 h-14 rounded-xl border border-[#1A1A1A] object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-display text-xs text-[#1A1A1A] truncate">{item.product.name}</h4>
                    <div className="font-display text-sm text-[#6C2BD9] mt-0.5">
                      <PriceTag
                        amountBDT={item.product.priceBDT * item.quantity}
                        amountUSD={item.product.priceUSD * item.quantity}
                        currency={currency}
                      />
                    </div>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-1.5 shrink-0 bg-[#FFF8EC] border border-[#1A1A1A] rounded-lg p-1">
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, -1)}
                      className="w-6 h-6 bg-white rounded border border-[#1A1A1A] flex items-center justify-center text-xs font-black hover:bg-gray-100"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-xs font-black px-1.5">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, 1)}
                      className="w-6 h-6 bg-white rounded border border-[#1A1A1A] flex items-center justify-center text-xs font-black hover:bg-gray-100"
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.product.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 transition-colors shrink-0"
                    title="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}

              <button
                onClick={onClearCart}
                className="text-[11px] font-bold text-gray-500 hover:text-red-600 underline block text-right mt-1"
              >
                Clear all items
              </button>
            </div>
          )}
        </div>

        {/* Footer with Checkout CTA */}
        {cartItems.length > 0 && (
          <div className="border-t-3 border-[#1A1A1A] pt-4 mt-4">
            <div className="space-y-1.5 text-xs font-bold text-gray-700 mb-3">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <PriceTag amountBDT={subtotalBDT} amountUSD={subtotalUSD} currency={currency} className="font-black text-[#1A1A1A]" />
              </div>
              {hasBundleDiscount && (
                <div className="flex justify-between text-[#FF4D8D]">
                  <span>Combo Discount (15%):</span>
                  <span>
                    -<PriceTag amountBDT={discountBDT} amountUSD={discountUSD} currency={currency} className="font-black" />
                  </span>
                </div>
              )}
              <div className="flex justify-between text-base font-display text-[#1A1A1A] pt-2 border-t border-gray-200">
                <span>TOTAL:</span>
                <PriceTag
                  amountBDT={totalBDT}
                  amountUSD={totalUSD}
                  currency={currency}
                  className="text-2xl text-[#6C2BD9]"
                />
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onCheckout();
              }}
              className="sticker-btn w-full bg-[#FFD400] text-[#1A1A1A] py-3.5 rounded-2xl font-display text-base uppercase flex items-center justify-center gap-2 hover:bg-[#FFE033]"
            >
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
