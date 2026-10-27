import React from 'react';
import { Check, ShoppingBag, Eye, ExternalLink } from 'lucide-react';
import { ProductItem } from '../types';
import { PriceTag } from './PriceTag';

interface ProductCardProps {
  product: ProductItem;
  currency: 'BDT' | 'USD';
  onQuickView: (productId: string) => void;
  onAddToCart: (product: ProductItem) => void;
  onInstantBuy: (product: ProductItem) => void;
  index: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  onQuickView,
  onAddToCart,
  onInstantBuy,
  index
}) => {
  const rotationClass = index % 3 === 0 ? '-rotate-1' : index % 3 === 1 ? 'rotate-1' : '-rotate-0.5';

  return (
    <div className={`sticker-card p-6 flex flex-col justify-between relative transform ${rotationClass} hover:rotate-0 transition-transform`}>
      {/* Top Badge */}
      <div className="absolute -top-4 right-6 z-10">
        <span className={`inline-block font-display text-xs px-4 py-1.5 rounded-xl border-3 border-[#1A1A1A] uppercase tracking-wider ${product.badgeBg} ${product.badgeText} ${product.badgeShadow}`}>
          {product.badge}
        </span>
      </div>

      <div>
        {/* Product Image with Quick View Trigger */}
        <div
          onClick={() => onQuickView(product.id)}
          className="rounded-2xl border-3 border-[#1A1A1A] overflow-hidden mb-5 cursor-pointer group relative bg-black/5"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="sticker-btn bg-[#FFD400] text-[#1A1A1A] px-4 py-2 rounded-xl text-xs font-display flex items-center gap-1.5 shadow-[2px_2px_0px_#1A1A1A]">
              <Eye size={14} />
              <span>INSPECT PACK</span>
            </span>
          </div>

          <div className="absolute bottom-2 left-2 bg-[#1A1A1A]/85 backdrop-blur-xs text-white text-[10px] font-black px-2.5 py-1 rounded-lg border border-white/20">
            {product.fileSize} • {product.categoryLabel}
          </div>
        </div>

        <div className="flex items-center gap-2 mb-1.5 text-xs font-black text-[#6C2BD9]">
          <span>★ {product.rating}</span>
        </div>

        <h3
          onClick={() => onQuickView(product.id)}
          className="font-display text-2xl text-[#1A1A1A] hover:text-[#6C2BD9] cursor-pointer leading-tight mb-2 line-clamp-1"
        >
          {product.name}
        </h3>

        <p className="text-xs sm:text-sm font-bold text-[#1A1A1A]/70 mb-5 leading-relaxed line-clamp-2">
          {product.tagline}
        </p>

        {/* Feature Highlights */}
        <div className="space-y-2 mb-6 bg-[#FFF8EC] p-3.5 rounded-2xl border-2 border-[#1A1A1A]">
          {product.features.slice(0, 3).map((feat, fIdx) => (
            <div key={fIdx} className="flex items-start gap-2 text-xs font-black text-[#1A1A1A]">
              <div className="bg-[#6C2BD9] p-0.5 rounded-full text-white mt-0.5 border border-[#1A1A1A] shrink-0">
                <Check size={11} />
              </div>
              <span className="line-clamp-1">{feat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing & Actions */}
      <div className="pt-4 border-t-2 border-[#1A1A1A]/20">
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <PriceTag
              amountBDT={product.priceBDT}
              amountUSD={product.priceUSD}
              currency={currency}
              className="font-display text-3xl text-[#6C2BD9]"
            />
            <span className="line-through text-xs font-black text-gray-400 ml-2">
              {currency === 'BDT' ? `${product.oldPriceBDT}৳` : `$${product.oldPriceUSD}`}
            </span>
          </div>
          <span className="text-[11px] font-black text-[#1A1A1A] bg-[#FFD400] px-2.5 py-1 rounded-full border border-[#1A1A1A]">
            LIFETIME
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => onAddToCart(product)}
            className="sticker-btn bg-white text-[#1A1A1A] py-3 rounded-xl text-xs font-display uppercase tracking-wider text-center hover:bg-[#FFF8EC] flex items-center justify-center gap-1"
          >
            <ShoppingBag size={14} />
            <span>+ CART</span>
          </button>

          <button
            onClick={() => onInstantBuy(product)}
            className="sticker-btn bg-[#FFD400] text-[#1A1A1A] py-3 rounded-xl text-xs font-display uppercase tracking-wider flex items-center justify-center gap-1 hover:bg-[#FFE033]"
          >
            <span>BUY NOW</span>
            <ExternalLink size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};
