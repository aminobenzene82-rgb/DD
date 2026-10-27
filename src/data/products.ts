import { ProductItem, CustomerReview } from '../types';

export const STORE_CONFIG = {
  brandName: "SNAPVAULT",
  brandSubtitle: "CREATOR DIGITAL STOREFRONT",
  tagline: "Edit faster. Create bigger.",
  supportEmail: "support@snapvault.io",
  supportWhatsApp: "+8801700112233",
  supportTelegram: "https://t.me/snapvault_creators",
  guaranteeDays: 30,
  promoCodes: {
    "CREATOR50": 0.50, // 50% off
    "LAUNCH20": 0.20,  // 20% off
    "VIP10": 0.10      // 10% off
  } as Record<string, number>,
  socials: {
    instagram: "https://instagram.com/snapvault.hq",
    tiktok: "https://tiktok.com/@snapvault.official",
    youtube: "https://youtube.com/@snapvault",
    telegram: "https://t.me/snapvault_creators",
    whatsapp: "https://wa.me/8801700112233"
  }
};

export const PRODUCTS: ProductItem[] = [
  {
    id: "ultimate-editing-pack",
    name: "The Ultimate Editing Pack",
    tagline: "Presets, transitions, LUTs, overlays & sound effects that make your videos go viral.",
    priceBDT: 199,
    oldPriceBDT: 999,
    priceUSD: 4.99,
    oldPriceUSD: 24.99,
    badge: "👾 BEST SELLER",
    badgeBg: "bg-[#FFD400]",
    badgeText: "text-[#1A1A1A]",
    badgeShadow: "shadow-[3px_3px_0px_#1A1A1A]",
    linkKey: "editingPack",
    rating: "4.9/5 (1,240+ reviews)",
    ratingValue: 4.9,
    reviewCount: 1240,
    category: "presets",
    categoryLabel: "Presets & LUTs",
    image: "/assets/aistudio/ChatGPT_Image_Oct_5__2026__02_00_20_AM_e2208339.png",
    fileSize: "8.4 GB",
    format: ".cube, .prproj, .drp, .wav, .mp4",
    driveFolderSampleId: "SV-EDIT-PK-2026",
    features: [
      "500+ Cinematic LUTs & Color Grading Presets",
      "200+ Dynamic Kinetic Transitions (with synchronized SFX)",
      "100+ 4K Overlay Textures, Film Burn & Light Leaks",
      "1,000+ Royalty-Free Cinematic Sound Effects (.WAV 24-bit)",
      "Universal drag-and-drop: Premiere, DaVinci, Final Cut & CapCut"
    ],
    specs: [
      { label: "Asset Count", value: "1,800+ Elements" },
      { label: "Resolution", value: "4K UHD (3840x2160) & 1080p" },
      { label: "Audio Quality", value: "24-bit / 48kHz WAV Studio Grade" },
      { label: "Compatibility", value: "Premiere Pro 2020+, DaVinci 17+, CapCut PC/Mac, FCPX" },
      { label: "License", value: "Commercial & Personal Lifetime Use" }
    ],
    description: "Stop spending endless hours tweaking keyframes and hunting for decent sound effects. The Ultimate Editing Pack gives you instant access to production-grade assets used by top-earning creators, commercial agencies, and viral YouTube editors worldwide. Seamlessly drag into your timeline and make every second pop."
  },
  {
    id: "100k-ai-reels-mega-bundle",
    name: "100,000+ AI Reels Mega Bundle",
    tagline: "Massive library of ready-to-post AI reels to skyrocket your Instagram & TikTok growth.",
    priceBDT: 199,
    oldPriceBDT: 1499,
    priceUSD: 4.99,
    oldPriceUSD: 39.99,
    badge: "🔥 HOT & VIRAL",
    badgeBg: "bg-[#FF4D8D]",
    badgeText: "text-white",
    badgeShadow: "shadow-[3px_3px_0px_#1A1A1A]",
    linkKey: "aiReels",
    rating: "4.8/5 (890+ reviews)",
    ratingValue: 4.8,
    reviewCount: 890,
    category: "reels",
    categoryLabel: "Viral AI Reels",
    image: "/assets/aistudio/AI_Reels_Bundle_Promotional_Poster__1__c7b5a480.png",
    fileSize: "142 GB (Cloud Folders)",
    format: "Vertical 9:16 MP4 (1080x1920)",
    driveFolderSampleId: "SV-REELS-100K-DRV",
    features: [
      "100,000+ Full HD Short-Form Videos (Zero Watermark)",
      "Categorized into 24 High-CPM Niches (Crypto, Luxury, AI, Motivation, Health)",
      "Hook captions, viral script outlines & trending audio tags included",
      "Organized Google Drive folders with instant 1-click cloud sync",
      "Full Resell & Commercial Rights included with your purchase"
    ],
    specs: [
      { label: "Video Count", value: "100,000+ Ready-To-Post Clips" },
      { label: "Aspect Ratio", value: "9:16 Vertical (1080 x 1920)" },
      { label: "Watermarks", value: "100% Watermark Free" },
      { label: "Niches", value: "Finance, Luxury, Motivation, Fitness, Tech & AI" },
      { label: "Storage", value: "Google Drive One-Click Add to Shortcut" }
    ],
    description: "Scale faceless theme pages, TikTok accounts, and brand channels effortlessly with our 100,000+ HD AI video vault. Skip hours of generative rendering and editing — download viral hooks proven to command high retention, insert your logo or text, and publish daily content consistently."
  },
  {
    id: "adobe-master-collection",
    name: "Adobe Master Collection",
    tagline: "Complete suite of essential Adobe creation software for lifetime productivity.",
    priceBDT: 199,
    oldPriceBDT: 1999,
    priceUSD: 4.99,
    oldPriceUSD: 49.99,
    badge: "🚀 MEGA DEAL",
    badgeBg: "bg-[#00E5FF]",
    badgeText: "text-[#1A1A1A]",
    badgeShadow: "shadow-[3px_3px_0px_#1A1A1A]",
    linkKey: "adobe",
    rating: "5.0/5 (2,100+ reviews)",
    ratingValue: 5.0,
    reviewCount: 2100,
    category: "software",
    categoryLabel: "Software Suites",
    image: "/assets/aistudio/Adobe_Master_Collection_Neon_Showcase_9277f38e.png",
    fileSize: "28 GB",
    format: "Windows / Mac Pre-Activated Installer",
    driveFolderSampleId: "SV-ADOBE-MC-2026",
    features: [
      "Full Access to Premiere Pro, After Effects, Photoshop, Illustrator & Audition",
      "Full compatibility with Windows 10/11 & macOS (Intel & Apple Silicon M1/M2/M3/M4)",
      "One-time payment: Lifetime pre-activated usage (Never pay monthly $59/mo fees)",
      "Step-by-step video installation guide with verified virus-scan certificate",
      "Dedicated 24/7 technical team standby via WhatsApp & Telegram"
    ],
    specs: [
      { label: "Programs Included", value: "Premiere, After Effects, Photoshop, Illustrator, Audition, Media Encoder" },
      { label: "OS Support", value: "Windows 10/11 & macOS (Apple Silicon + Intel)" },
      { label: "Billing", value: "Zero Monthly Subscriptions (One-Time)" },
      { label: "Activation", value: "Pre-Activated & Offline Capable" },
      { label: "Support", value: "Remote assistance via AnyDesk/TeamViewer if required" }
    ],
    description: "Unlock complete creative independence without paying recurring subscription fees every month. The Adobe Master Collection provides fully pre-activated, genuine installation packages tested for rock-solid stability during intense render sessions and multi-layer timelines."
  }
];

export const REVIEWS: CustomerReview[] = [
  {
    id: "rev-1",
    productId: "ultimate-editing-pack",
    author: "Tanvir Rahman",
    role: "YouTube Creator (380K Subs)",
    rating: 5,
    date: "2 days ago",
    comment: "The Ultimate Editing Pack is insane. The sound design alone is worth 10x the price. My retention graph on Premiere went up 14% just from using the kinetic whoosh and punch transitions.",
    avatarColor: "bg-[#FF4D8D]",
    verified: true
  },
  {
    id: "rev-2",
    productId: "100k-ai-reels-mega-bundle",
    author: "Sarah L.",
    role: "Digital Growth Manager",
    rating: 5,
    date: "5 days ago",
    comment: "I manage 4 faceless Instagram theme pages. Having 100K reels organized in neatly categorized Google Drive folders saved my team hundreds of hours. We gained 45k followers this month!",
    avatarColor: "bg-[#00E5FF]",
    verified: true
  },
  {
    id: "rev-3",
    productId: "adobe-master-collection",
    author: "Afridi Hasan",
    role: "Freelance Motion Graphic Designer",
    rating: 5,
    date: "1 week ago",
    comment: "I was skeptical about the price, but the installation was seamless on my M2 MacBook Pro. Download links arrived within 30 seconds after payment via bKash. 10/10 service!",
    avatarColor: "bg-[#FFD400]",
    verified: true
  },
  {
    id: "rev-4",
    productId: "ultimate-editing-pack",
    author: "David Ross",
    role: "CapCut & TikTok Editor",
    rating: 5,
    date: "1 week ago",
    comment: "All LUTs loaded right into CapCut without issue. The teal & orange cine-look presets give phone footage that expensive cinema camera look instantly.",
    avatarColor: "bg-[#6C2BD9]",
    verified: true
  },
  {
    id: "rev-5",
    productId: "100k-ai-reels-mega-bundle",
    author: "Mehedi Hasan",
    role: "Content Creator",
    rating: 4,
    date: "2 weeks ago",
    comment: "Super massive collection. The motivational and luxury clips are top tier resolution. Instant delivery worked seamlessly.",
    avatarColor: "bg-[#10B981]",
    verified: true
  }
];

export const FAQS = [
  {
    q: "How do I receive my digital files after payment?",
    a: "Immediately upon completing checkout, you will receive an on-screen instant access dashboard with direct Google Drive cloud links, license key, and an instant ZIP starter file. You will also get a confirmation receipt sent to your email."
  },
  {
    q: "What payment methods are supported?",
    a: "We support seamless payment via bKash, Nagad, Rocket, Credit/Debit Cards (Visa & Mastercard), and international crypto/PayPal options. Checkout is 100% encrypted and safe."
  },
  {
    q: "Are these assets compatible with my video editing software?",
    a: "Yes! Our presets, LUTs, overlays, and sound design files use universal formats (.cube, .wav, .mp4, .png) and are fully tested on Adobe Premiere Pro, Final Cut Pro, DaVinci Resolve, After Effects, and CapCut (PC & Mobile)."
  },
  {
    q: "Is this a recurring subscription or a one-time fee?",
    a: "All items on SNAPVAULT are 100% one-time payments. Pay once and enjoy lifetime access, including future library updates, with zero monthly recurring charges."
  },
  {
    q: "Can I use these assets for client projects and monetization?",
    a: "Yes! Every bundle comes with full commercial licensing. You can use these assets across client work, brand sponsorships, and monetized social media accounts without copyright claims."
  },
  {
    q: "What if I experience download issues or need installation help?",
    a: "Our customer success team is online 24/7! You can chat directly via WhatsApp or email us at support@snapvault.io and we'll resolve any questions within minutes."
  }
];
