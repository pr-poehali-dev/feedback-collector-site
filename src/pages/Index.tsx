import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import ReviewCard from '@/components/ReviewCard';
import ReviewForm from '@/components/ReviewForm';
import FilterBar, { SortOption, RatingFilter } from '@/components/FilterBar';
import { INITIAL_REVIEWS, Review } from '@/data/reviews';
import Icon from '@/components/ui/icon';

function RatingSummary({ reviews }: { reviews: Review[] }) {
  const approved = reviews.filter((r) => r.status === 'approved');
  if (approved.length === 0) return null;
  const avg = approved.reduce((a, r) => a + r.rating, 0) / approved.length;
  const counts = [5, 4, 3, 2, 1].map((s) => ({
    star: s,
    count: approved.filter((r) => r.rating === s).length,
  }));

  return (
    <div className="bg-white rounded-2xl card-shadow p-6 mb-6 fade-in">
      <div className="flex items-center gap-6">
        <div className="text-center">
          <div className="text-5xl font-bold text-foreground leading-none">{avg.toFixed(1)}</div>
          <div className="flex justify-center gap-0.5 mt-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <span key={s} className="text-lg" style={{ color: s <= Math.round(avg) ? 'hsl(43,96%,50%)' : '#e2e0d8' }}>★</span>
            ))}
          </div>
          <div className="text-xs text-muted-foreground mt-1">{approved.length} отзывов</div>
        </div>
        <div className="flex-1 space-y-1.5">
          {counts.map(({ star, count }) => (
            <div key={star} className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground w-4 text-right">{star}</span>
              <span style={{ color: 'hsl(43,96%,50%)', fontSize: '11px' }}>★</span>
              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: approved.length ? `${(count / approved.length) * 100}%` : '0%',
                    background: 'linear-gradient(90deg, hsl(43,96%,56%), hsl(43,80%,70%))',
                  }}
                />
              </div>
              <span className="text-xs text-muted-foreground w-4">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Index() {
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [sort, setSort] = useState<SortOption>('newest');
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>(0);

  function handleReact(id: string, reaction: 'like' | 'dislike') {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const same = r.userReaction === reaction;
        const wasLike = r.userReaction === 'like';
        const wasDislike = r.userReaction === 'dislike';
        return {
          ...r,
          userReaction: same ? null : reaction,
          likes:
            reaction === 'like'
              ? r.likes + (same ? -1 : 1)
              : wasLike
              ? r.likes - 1
              : r.likes,
          dislikes:
            reaction === 'dislike'
              ? r.dislikes + (same ? -1 : 1)
              : wasDislike
              ? r.dislikes - 1
              : r.dislikes,
        };
      })
    );
  }

  function handleSubmit(name: string, text: string, rating: number) {
    const newReview: Review = {
      id: Date.now().toString(),
      name,
      text,
      rating,
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      likes: 0,
      dislikes: 0,
      userReaction: null,
    };
    setReviews((prev) => [newReview, ...prev]);
  }

  const displayed = useMemo(() => {
    let list = reviews.filter((r) => r.status === 'approved');
    if (ratingFilter !== 0) list = list.filter((r) => r.rating === ratingFilter);
    switch (sort) {
      case 'oldest': return [...list].sort((a, b) => a.date.localeCompare(b.date));
      case 'highest': return [...list].sort((a, b) => b.rating - a.rating);
      case 'lowest': return [...list].sort((a, b) => a.rating - b.rating);
      case 'helpful': return [...list].sort((a, b) => (b.likes - b.dislikes) - (a.likes - a.dislikes));
      default: return [...list].sort((a, b) => b.date.localeCompare(a.date));
    }
  }, [reviews, sort, ratingFilter]);

  return (
    <div className="min-h-screen bg-background font-golos">
      <header className="bg-white border-b border-border sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
              <span style={{ color: 'hsl(43,96%,56%)', fontSize: '16px' }}>★</span>
            </div>
            <span className="font-semibold text-foreground">Отзывы</span>
          </div>
          <Link
            to="/moderator"
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-full border border-border hover:border-foreground/30"
          >
            <Icon name="Shield" size={13} />
            Модератор
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8 fade-in">
          <h1 className="text-2xl font-bold text-foreground">Что говорят клиенты</h1>
          <p className="text-sm text-muted-foreground mt-1">Реальные отзывы от наших покупателей</p>
        </div>

        <RatingSummary reviews={reviews} />

        <ReviewForm onSubmit={handleSubmit} />

        <div className="mt-8">
          <FilterBar
            sort={sort}
            ratingFilter={ratingFilter}
            onSort={setSort}
            onRating={setRatingFilter}
            total={displayed.length}
          />

          {displayed.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground fade-in">
              <div className="text-3xl mb-2">🔍</div>
              <p className="text-sm">Нет отзывов по выбранным фильтрам</p>
            </div>
          ) : (
            <div className="space-y-3">
              {displayed.map((review, i) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  onReact={handleReact}
                  animationDelay={i * 60}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
