import React, { useState } from 'react';
import { Star, CheckCircle2, MessageSquarePlus, ThumbsUp } from 'lucide-react';
import { CustomerReview } from '../types';
import { REVIEWS } from '../data/products';

interface ReviewsSectionProps {
  productId?: string;
  triggerConfetti: (e?: React.MouseEvent) => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  productId,
  triggerConfetti
}) => {
  const [reviewsList, setReviewsList] = useState<CustomerReview[]>(REVIEWS);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [authorName, setAuthorName] = useState<string>('');
  const [authorRole, setAuthorRole] = useState<string>('Content Creator');
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [filterRating, setFilterRating] = useState<number | null>(null);

  const displayedReviews = reviewsList.filter(rev => {
    if (productId && rev.productId !== productId) return false;
    if (filterRating && rev.rating !== filterRating) return false;
    return true;
  });

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !authorName.trim()) return;

    const newRev: CustomerReview = {
      id: `rev-${Date.now()}`,
      productId: productId || 'ultimate-editing-pack',
      author: authorName.trim(),
      role: authorRole.trim() || 'Verified Creator',
      rating,
      date: 'Just now',
      comment: comment.trim(),
      avatarColor: ['bg-[#FFD400]', 'bg-[#FF4D8D]', 'bg-[#6C2BD9]', 'bg-[#00E5FF]'][Math.floor(Math.random() * 4)],
      verified: true
    };

    setReviewsList([newRev, ...reviewsList]);
    setShowAddModal(false);
    setAuthorName('');
    setComment('');
    triggerConfetti();
  };

  return (
    <section className="py-16 md:py-24 bg-[#FFF8EC] border-t-4 border-[#1A1A1A] px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="font-display text-xs bg-[#FFD400] text-[#1A1A1A] px-3.5 py-1.5 rounded-full border-2.5 border-[#1A1A1A] uppercase tracking-wider inline-block mb-3 shadow-[2px_2px_0px_#1A1A1A]">
              ⭐ 100% VERIFIED CREATOR FEEDBACK
            </span>
            <h2 className="font-display text-3xl sm:text-5xl text-[#1A1A1A]">
              WHAT CREATORS SAY
            </h2>
            <p className="text-sm md:text-base font-bold text-[#1A1A1A]/70 mt-2">
              Over 4,200+ creators editing faster every single day.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border-2 border-[#1A1A1A]">
              <button
                onClick={() => setFilterRating(null)}
                className={`px-3 py-1 rounded-lg text-xs font-black transition-colors ${
                  filterRating === null ? 'bg-[#1A1A1A] text-white' : 'text-gray-600 hover:text-black'
                }`}
              >
                All
              </button>
              {[5, 4].map((star) => (
                <button
                  key={star}
                  onClick={() => setFilterRating(star)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-black flex items-center gap-1 transition-colors ${
                    filterRating === star ? 'bg-[#FFD400] text-[#1A1A1A]' : 'text-gray-600 hover:text-black'
                  }`}
                >
                  <span>{star}</span>
                  <Star size={12} className="fill-current" />
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="sticker-btn bg-[#6C2BD9] text-white px-4 py-2 rounded-xl text-xs font-display uppercase flex items-center gap-1.5"
            >
              <MessageSquarePlus size={16} />
              <span>LEAVE REVIEW</span>
            </button>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedReviews.map((rev) => (
            <div
              key={rev.id}
              className="sticker-card p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex text-[#FFD400]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < rev.rating ? "fill-[#FFD400] text-[#1A1A1A]" : "text-gray-300"}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] font-bold text-gray-400">{rev.date}</span>
                </div>

                <p className="text-sm font-extrabold text-[#1A1A1A]/85 mb-6 leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t-2 border-gray-100">
                <div className={`w-10 h-10 ${rev.avatarColor} text-[#1A1A1A] font-display rounded-full border-2 border-[#1A1A1A] flex items-center justify-center text-xs shadow-[2px_2px_0px_#1A1A1A]`}>
                  {rev.author.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-display text-xs text-[#1A1A1A]">{rev.author}</h4>
                    {rev.verified && (
                      <CheckCircle2 size={13} className="text-[#25D366] fill-[#25D366] text-white" />
                    )}
                  </div>
                  <p className="text-[10px] font-black text-gray-500">{rev.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for adding new review */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <div className="w-full max-w-md bg-[#FFF8EC] border-4 border-[#1A1A1A] rounded-3xl shadow-[8px_8px_0px_#1A1A1A] p-6 text-[#1A1A1A]">
              <h3 className="font-display text-2xl text-[#1A1A1A] mb-1">LEAVE YOUR REVIEW</h3>
              <p className="text-xs font-bold text-gray-600 mb-4">
                Share your experience with the editing assets and help fellow creators!
              </p>

              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase mb-1">Your Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setRating(s)}
                        className="p-1 text-2xl focus:outline-none"
                      >
                        <Star
                          size={24}
                          className={s <= rating ? "fill-[#FFD400] text-[#1A1A1A]" : "text-gray-300"}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex M."
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full bg-white border-2 border-[#1A1A1A] rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase mb-1">Your Creator Role</label>
                  <input
                    type="text"
                    placeholder="e.g. YouTube Editor / Agency Lead"
                    value={authorRole}
                    onChange={(e) => setAuthorRole(e.target.value)}
                    className="w-full bg-white border-2 border-[#1A1A1A] rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase mb-1">Your Feedback</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="How did this pack improve your editing speed?"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-white border-2 border-[#1A1A1A] rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="w-1/2 py-2.5 rounded-xl border-2 border-[#1A1A1A] text-xs font-display uppercase bg-white"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2.5 rounded-xl border-2 border-[#1A1A1A] text-xs font-display uppercase bg-[#FFD400] text-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]"
                  >
                    POST REVIEW
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
