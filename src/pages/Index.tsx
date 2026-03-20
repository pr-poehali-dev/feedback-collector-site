import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReviewCard from '@/components/ReviewCard';
import ReviewForm from '@/components/ReviewForm';
import FilterBar, { SortOption, RatingFilter } from '@/components/FilterBar';
import { Review } from '@/data/reviews';
import Icon from '@/components/ui/icon';
import { fetchReviews, createReview, reactToReview } from '@/api/reviews';

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
      <div className="flex items-center gap-8">
        <div className="text-center flex-shrink-0">
          <div className="text-5xl font-bold text-foreground leading-none tabular-nums">
            {avg.toFixed(1)}
          </div>
          <div className="flex justify-center gap-0.5 mt-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <span
                key={s}
                className="text-xl"
                style={{ color: s <= Math.round(avg) ? 'hsl(43,96%,50%)' : '#ddd8cc' }}
              >
                ★
              </span>
            ))}
          </div>
          <div className="text-xs text-muted-foreground mt-1.5">
            {approved.length} {approved.length === 1 ? 'отзыв' : approved.length < 5 ? 'отзыва' : 'отзывов'}
          </div>
        </div>

        <div className="flex-1 space-y-2">
          {counts.map(({ star, count }) => (
            <div key={star} className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground w-3 text-right">{star}</span>
              <span className="text-xs" style={{ color: 'hsl(43,96%,50%)' }}>★</span>
              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: approved.length ? `${(count / approved.length) * 100}%` : '0%',
                    background: 'linear-gradient(90deg, hsl(43,96%,50%), hsl(43,80%,68%))',
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
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<SortOption>('newest');
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>(0);

  useEffect(() => {
    fetchReviews().then((data) => {
      setReviews(data);
      setLoading(false);
    });
  }, []);

  async function handleReact(id: string, reaction: 'like' | 'dislike') {
    const review = reviews.find((r) => r.id === id);
    if (!review) return;
    const same = review.userReaction === reaction;
    const newReaction = same ? null : reaction;
    const updated = await reactToReview(id, newReaction, review.userReaction);
    setReviews((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, userReaction: newReaction, likes: updated.likes, dislikes: updated.dislikes }
          : r
      )
    );
  }

  async function handleSubmit(name: string, text: string, rating: number) {
    const date = new Date().toISOString().split('T')[0];
    const newReview = await createReview({ name, text, rating, date });
    setReviews((prev) => [newReview, ...prev]);
  }

  const displayed = useMemo(() => {
    let list = reviews.filter((r) => r.status === 'approved');
    if (ratingFilter !== 0) list = list.filter((r) => r.rating === ratingFilter);
    switch (sort) {
      case 'oldest':
        return [...list].sort((a, b) => a.date.localeCompare(b.date));
      case 'highest':
        return [...list].sort((a, b) => b.rating - a.rating);
      case 'lowest':
        return [...list].sort((a, b) => a.rating - b.rating);
      case 'helpful':
        return [...list].sort((a, b) => b.likes - b.dislikes - (a.likes - a.dislikes));
      default:
        return [...list].sort((a, b) => b.date.localeCompare(a.date));
    }
  }, [reviews, sort, ratingFilter]);

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white/80 backdrop-blur-sm border-b border-border sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-foreground flex items-center justify-center">
              <span className="text-sm" style={{ color: 'hsl(43,96%,56%)' }}>★</span>
            </div>
            <span className="font-semibold text-sm text-foreground">Отзывы клиентов</span>
          </div>
          <Link
            to="/moderator"
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-full border border-border hover:border-foreground/20 bg-white"
          >
            <Icon name="Shield" size={12} />
            Модератор
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8 fade-in">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            Что говорят клиенты
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Реальные отзывы от наших покупателей — ничего лишнего
          </p>
        </div>

        <RatingSummary reviews={reviews} />

        <ReviewForm onSubmit={handleSubmit} />

        <div className="mt-10">
          <FilterBar
            sort={sort}
            ratingFilter={ratingFilter}
            onSort={setSort}
            onRating={setRatingFilter}
            total={displayed.length}
          />

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl card-shadow p-5 animate-pulse">
                  <div className="flex gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-muted flex-shrink-0" />
                    <div className="flex-1 space-y-2 pt-1">
                      <div className="h-3 bg-muted rounded w-32" />
                      <div className="h-3 bg-muted rounded w-20" />
                    </div>
                  </div>
                  <div className="space-y-2 pl-[52px]">
                    <div className="h-3 bg-muted rounded w-full" />
                    <div className="h-3 bg-muted rounded w-4/5" />
                  </div>
                </div>
              ))}
            </div>
          ) : displayed.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground fade-in">
              <div className="text-4xl mb-3">🔍</div>
              <p className="text-sm font-medium">Нет отзывов по выбранным фильтрам</p>
              <p className="text-xs mt-1 opacity-60">Попробуйте изменить параметры фильтрации</p>
            </div>
          ) : (
            <div className="space-y-3">
              {displayed.map((review, i) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  onReact={handleReact}
                  animationDelay={i * 50}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
