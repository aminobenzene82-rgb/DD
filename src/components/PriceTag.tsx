import React from 'react';

interface PriceTagProps {
  amountBDT: number;
  amountUSD: number;
  currency: 'BDT' | 'USD';
  className?: string;
}

export const PriceTag: React.FC<PriceTagProps> = ({
  amountBDT,
  amountUSD,
  currency,
  className = ""
}) => {
  if (currency === 'BDT') {
    return (
      <span className={`inline-flex items-center ${className}`}>
        <span>{amountBDT}</span>
        <span className="taka-symbol font-black">৳</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center ${className}`}>
      <span>${amountUSD.toFixed(2)}</span>
    </span>
  );
};
