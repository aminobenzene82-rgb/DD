import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { STORE_CONFIG } from '../data/products';

export const ContactView: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) return;
    setSubmitted(true);
  };

  return (
    <div className="py-16 px-4 md:px-8 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <span className="font-display text-xs bg-[#FF4D8D] text-white px-4 py-1.5 rounded-full border-3 border-[#1A1A1A] uppercase tracking-wider inline-block mb-3 shadow-[3px_3px_0px_#1A1A1A]">
          24/7 CREATOR DESK
        </span>
        <h1 className="font-display text-4xl sm:text-6xl text-[#1A1A1A]">
          WE'RE HERE TO HELP
        </h1>
        <p className="text-base font-bold text-[#1A1A1A]/70 mt-2 max-w-lg mx-auto">
          Need help installing a preset pack, accessing a Google Drive folder, or asking a compatibility question? Our video team responds quickly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {/* Direct WhatsApp Action Card */}
        <a
          href={STORE_CONFIG.socials.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="sticker-card p-8 flex flex-col items-center text-center group hover:border-[#25D366]"
        >
          <div className="w-16 h-16 bg-[#25D366] text-white rounded-2xl border-3 border-[#1A1A1A] flex items-center justify-center mb-4 shadow-[4px_4px_0px_#1A1A1A] group-hover:scale-105 transition-transform">
            <MessageSquare size={32} />
          </div>
          <h3 className="font-display text-2xl mb-1 text-[#1A1A1A]">WHATSAPP CHAT</h3>
          <p className="text-xs font-bold text-[#1A1A1A]/70 mb-4">Instant direct chat for download issues</p>
          <span className="sticker-btn bg-[#25D366] text-[#1A1A1A] px-4 py-2 rounded-xl text-xs font-display">
            MESSAGE ON WHATSAPP
          </span>
        </a>

        {/* Direct Email Action Card */}
        <a
          href={`mailto:${STORE_CONFIG.supportEmail}`}
          className="sticker-card p-8 flex flex-col items-center text-center group hover:border-[#6C2BD9]"
        >
          <div className="w-16 h-16 bg-[#FFD400] text-[#1A1A1A] rounded-2xl border-3 border-[#1A1A1A] flex items-center justify-center mb-4 shadow-[4px_4px_0px_#1A1A1A] group-hover:scale-105 transition-transform">
            <Mail size={32} />
          </div>
          <h3 className="font-display text-2xl mb-1 text-[#1A1A1A]">EMAIL SUPPORT</h3>
          <p className="text-xs font-bold text-[#1A1A1A]/70 mb-4">Fast email response within 2 hours</p>
          <span className="sticker-btn bg-[#6C2BD9] text-white px-4 py-2 rounded-xl text-xs font-display">
            {STORE_CONFIG.supportEmail}
          </span>
        </a>
      </div>

      {/* Ticket Submission Form */}
      <div className="sticker-card p-6 md:p-10 bg-white">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-[#FFD400] text-[#1A1A1A] text-xs font-display px-3 py-1 rounded-full border-2 border-[#1A1A1A]">
            SUBMIT A TICKET
          </span>
        </div>

        {submitted ? (
          <div className="py-8 text-center animate-in fade-in">
            <div className="w-16 h-16 bg-[#25D366] text-white rounded-2xl border-3 border-[#1A1A1A] mx-auto flex items-center justify-center mb-4 shadow-[4px_4px_0px_#1A1A1A]">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="font-display text-2xl text-[#1A1A1A] mb-2">TICKET RECEIVED!</h3>
            <p className="text-sm font-bold text-gray-600 max-w-md mx-auto mb-6">
              Thank you, {name || 'Creator'}! Our senior editing support specialist has received your inquiry and will reply to <strong>{email}</strong> shortly.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setMessage('');
              }}
              className="sticker-btn bg-[#FFD400] text-[#1A1A1A] px-6 py-2.5 rounded-xl text-xs font-display uppercase"
            >
              SEND ANOTHER MESSAGE
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase text-[#1A1A1A] mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#FFF8EC] border-2 border-[#1A1A1A] rounded-xl px-4 py-2.5 text-xs font-bold text-[#1A1A1A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-[#1A1A1A] mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#FFF8EC] border-2 border-[#1A1A1A] rounded-xl px-4 py-2.5 text-xs font-bold text-[#1A1A1A] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-[#1A1A1A] mb-1">
                Order Number (If applicable)
              </label>
              <input
                type="text"
                placeholder="e.g. SV-948201"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="w-full bg-[#FFF8EC] border-2 border-[#1A1A1A] rounded-xl px-4 py-2.5 text-xs font-bold text-[#1A1A1A] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-[#1A1A1A] mb-1">
                How Can We Help? <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                placeholder="Describe your question or request..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-[#FFF8EC] border-2 border-[#1A1A1A] rounded-xl px-4 py-2.5 text-xs font-bold text-[#1A1A1A] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="sticker-btn bg-[#FFD400] text-[#1A1A1A] px-8 py-3.5 rounded-2xl font-display text-sm uppercase flex items-center justify-center gap-2 hover:bg-[#FFE033]"
            >
              <Send size={16} />
              <span>SUBMIT SUPPORT REQUEST</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
