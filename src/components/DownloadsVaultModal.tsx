import React, { useState, useEffect } from 'react';
import { X, FolderOpen, Key, Download, Copy, CheckCheck, Sparkles, ExternalLink, RefreshCw } from 'lucide-react';
import { OrderRecord } from '../types';

interface DownloadsVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCheckoutWithProduct?: (productId: string) => void;
}

export const DownloadsVaultModal: React.FC<DownloadsVaultModalProps> = ({
  isOpen,
  onClose
}) => {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [searchEmail, setSearchEmail] = useState<string>('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      try {
        const stored = JSON.parse(localStorage.getItem('snapvault_orders') || '[]');
        setOrders(stored);
      } catch (e) {
        console.error(e);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredOrders = searchEmail.trim()
    ? orders.filter(o => o.customerEmail.toLowerCase().includes(searchEmail.trim().toLowerCase()))
    : orders;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadLicenseText = (order: OrderRecord) => {
    const text = `SNAPVAULT ORDER RECEIPT & ACCESS KEYS
--------------------------------------
Order ID: ${order.id}
Date: ${order.date}
Customer: ${order.customerName} (${order.customerEmail})
Status: ${order.status}

Purchased Products:
${order.items.map(it => `
* ${it.name}
  License: ${it.licenseKey}
  Google Drive URL: ${it.downloadUrl}
`).join('')}

For instant support, reply to support@snapvault.io or WhatsApp +8801700112233.
`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SNAPVAULT_${order.id}_Receipt.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#FFF8EC] border-4 border-[#1A1A1A] rounded-3xl shadow-[8px_8px_0px_#1A1A1A] p-6 sm:p-8 my-8 text-[#1A1A1A] animate-in fade-in duration-200">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-10 h-10 bg-[#FF4D8D] text-white border-2 border-[#1A1A1A] rounded-xl flex items-center justify-center shadow-[2px_2px_0px_#1A1A1A] hover:rotate-6 transition-transform"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <span className="bg-[#00E5FF] text-[#1A1A1A] text-xs font-display px-3 py-1 rounded-full border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]">
            🔐 SECURE CLIENT VAULT
          </span>
        </div>

        <h2 className="font-display text-2xl sm:text-3xl text-[#1A1A1A] mb-1">
          MY DIGITAL DOWNLOADS
        </h2>
        <p className="text-xs font-bold text-[#1A1A1A]/70 mb-6">
          Access your cloud Google Drive links, copy commercial license keys, and view order receipts anytime.
        </p>

        {/* Email Search Filter */}
        <div className="mb-6">
          <input
            type="email"
            placeholder="Search purchases by email..."
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            className="w-full bg-white border-2 border-[#1A1A1A] rounded-xl px-4 py-2.5 text-xs font-bold text-[#1A1A1A] focus:outline-none shadow-[2px_2px_0px_#1A1A1A]"
          />
        </div>

        {/* ORDER LIST */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border-3 border-[#1A1A1A] p-8 text-center">
            <div className="w-14 h-14 bg-[#FFD400] text-[#1A1A1A] rounded-2xl border-2 border-[#1A1A1A] mx-auto flex items-center justify-center mb-3 shadow-[3px_3px_0px_#1A1A1A]">
              <FolderOpen size={28} />
            </div>
            <h3 className="font-display text-lg mb-1">NO DOWNLOADS FOUND</h3>
            <p className="text-xs font-bold text-gray-500 max-w-sm mx-auto mb-4">
              {searchEmail ? "No orders match this email address." : "You haven't completed any orders in this browser yet. Browse our creator packs and grab one!"}
            </p>
            <button
              onClick={onClose}
              className="sticker-btn bg-[#FFD400] text-[#1A1A1A] px-5 py-2.5 rounded-xl text-xs font-display uppercase"
            >
              EXPLORE BUNDLES
            </button>
          </div>
        ) : (
          <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl border-3 border-[#1A1A1A] p-5 shadow-[4px_4px_0px_#1A1A1A]">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-gray-100 pb-3 mb-3">
                  <div>
                    <span className="font-display text-sm text-[#6C2BD9]">Order #{order.id}</span>
                    <span className="text-[11px] text-gray-400 font-bold ml-2">• {order.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-[#25D366] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full border border-[#1A1A1A]">
                      {order.status}
                    </span>
                    <span className="font-display text-sm text-[#1A1A1A]">{order.totalAmount}</span>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="bg-[#FFF8EC] p-3 rounded-xl border-2 border-[#1A1A1A]">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <h4 className="font-display text-xs text-[#1A1A1A]">{item.name}</h4>
                        <span className="text-[10px] font-black text-[#6C2BD9]">{item.price}</span>
                      </div>
                      
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold bg-white px-2 py-1 rounded-lg border border-gray-300">
                          <Key size={12} className="text-[#6C2BD9]" />
                          <span>{item.licenseKey}</span>
                          <button
                            onClick={() => handleCopy(item.licenseKey, `${order.id}-${idx}`)}
                            className="text-gray-500 hover:text-black ml-1"
                            title="Copy License Key"
                          >
                            {copiedKey === `${order.id}-${idx}` ? <CheckCheck size={12} className="text-green-600" /> : <Copy size={12} />}
                          </button>
                        </div>

                        <button
                          onClick={() => handleDownloadLicenseText(order)}
                          className="sticker-btn bg-[#FFD400] text-[#1A1A1A] px-3 py-1 rounded-lg text-[10px] font-display uppercase flex items-center gap-1"
                        >
                          <Download size={12} />
                          <span>ACCESS FILES</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
