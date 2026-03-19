import { Review, getAvatarColor } from '@/data/reviews';

interface ReviewCardProps {
  review: Review;
  onReact: (id: string, reaction: 'like' | 'dislike') => void;
  animationDelay?: number;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className="text-lg star-hover"
          style={{ color: star <= rating ? 'hsl(43, 96%, 50%)' : '#e2e0d8' }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function ReviewCard({ review, onReact, animationDelay = 0 }: ReviewCardProps) {
  const avatarColor = getAvatarColor(review.name);
  const initial = review.name.charAt(0).toUpperCase();

  return (
    <div
      className="bg-white rounded-2xl card-shadow transition-shadow duration-300 p-5 fade-in"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${avatarColor}`}>
          {initial}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="font-semibold text-foreground text-sm">{review.name}</span>
            <span className="text-xs text-muted-foreground">{formatDate(review.date)}</span>
          </div>
          <StarRating rating={review.rating} />
        </div>
      </div>

      <p className="text-sm text-foreground/80 leading-relaxed mb-4">{review.text}</p>

      <div className="flex items-center gap-2 pt-3 border-t border-border/60">
        <button
          onClick={() => onReact(review.id, 'like')}
          className={`reaction-btn flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-all ${
            review.userReaction === 'like'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-medium'
              : 'bg-transparent border-border text-muted-foreground hover:border-emerald-200 hover:text-emerald-600 hover:bg-emerald-50'
          }`}
        >
          👍 Полезно {review.likes > 0 && <span className="font-medium">{review.likes}</span>}
        </button>
        <button
          onClick={() => onReact(review.id, 'dislike')}
          className={`reaction-btn flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-all ${
            review.userReaction === 'dislike'
              ? 'bg-rose-50 border-rose-200 text-rose-700 font-medium'
              : 'bg-transparent border-border text-muted-foreground hover:border-rose-200 hover:text-rose-600 hover:bg-rose-50'
          }`}
        >
          👎 Не полезно {review.dislikes > 0 && <span className="font-medium">{review.dislikes}</span>}
        </button>
      </div>
    </div>
  );
}
