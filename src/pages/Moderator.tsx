import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { INITIAL_REVIEWS, Review, ReviewStatus, getAvatarColor } from '@/data/reviews';
import Icon from '@/components/ui/icon';

type StatusFilter = 'all' | ReviewStatus;

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

const STATUS_LABELS: Record<ReviewStatus, { label: string; cls: string }> = {
  pending: { label: 'На модерации', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  approved: { label: 'Опубликован', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  rejected: { label: 'Отклонён', cls: 'bg-rose-50 text-rose-700 border-rose-200' },
};

interface ModCardProps {
  review: Review;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDelete: (id: string) => void;
}

function ModCard({ review, onApprove, onReject, onDelete }: ModCardProps) {
  const avatarColor = getAvatarColor(review.name);
  const initial = review.name.charAt(0).toUpperCase();
  const status = STATUS_LABELS[review.status];

  return (
    <div className="bg-white rounded-2xl card-shadow p-5 fade-in">
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${avatarColor}`}>
          {initial}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm text-foreground">{review.name}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${status.cls}`}>
              {status.label}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <span key={s} className="text-sm" style={{ color: s <= review.rating ? 'hsl(43,96%,50%)' : '#e2e0d8' }}>★</span>
              ))}
            </div>
            <span className="text-xs text-muted-foreground">{formatDate(review.date)}</span>
          </div>
        </div>
        <button
          onClick={() => onDelete(review.id)}
          className="text-muted-foreground hover:text-rose-500 transition-colors p-1 rounded-lg hover:bg-rose-50 flex-shrink-0"
          title="Удалить"
        >
          <Icon name="Trash2" size={15} />
        </button>
      </div>

      <p className="text-sm text-foreground/80 leading-relaxed mb-4 pl-13">{review.text}</p>

      {review.status !== 'approved' && review.status !== 'rejected' ? (
        <div className="flex gap-2 pt-3 border-t border-border/60">
          <button
            onClick={() => onApprove(review.id)}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-all font-medium"
          >
            <Icon name="Check" size={13} /> Одобрить
          </button>
          <button
            onClick={() => onReject(review.id)}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs py-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-all font-medium"
          >
            <Icon name="X" size={13} /> Отклонить
          </button>
        </div>
      ) : (
        <div className="flex gap-2 pt-3 border-t border-border/60">
          {review.status === 'approved' && (
            <button
              onClick={() => onReject(review.id)}
              className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-all font-medium"
            >
              <Icon name="X" size={13} /> Скрыть
            </button>
          )}
          {review.status === 'rejected' && (
            <button
              onClick={() => onApprove(review.id)}
              className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-all font-medium"
            >
              <Icon name="Check" size={13} /> Восстановить
            </button>
          )}
        </div>
      )}
    </div>
  );
}

const STATUS_TABS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'Все' },
  { value: 'pending', label: 'На модерации' },
  { value: 'approved', label: 'Опубликованные' },
  { value: 'rejected', label: 'Отклонённые' },
];

const RATING_FILTERS = [0, 5, 4, 3, 2, 1] as const;

export default function Moderator() {
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [ratingFilter, setRatingFilter] = useState<0 | 1 | 2 | 3 | 4 | 5>(0);

  function approve(id: string) {
    setReviews((prev) => prev.map((r) => r.id === id ? { ...r, status: 'approved' } : r));
  }
  function reject(id: string) {
    setReviews((prev) => prev.map((r) => r.id === id ? { ...r, status: 'rejected' } : r));
  }
  function remove(id: string) {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  }

  const pendingCount = reviews.filter((r) => r.status === 'pending').length;

  const displayed = useMemo(() => {
    let list = reviews;
    if (statusFilter !== 'all') list = list.filter((r) => r.status === statusFilter);
    if (ratingFilter !== 0) list = list.filter((r) => r.rating === ratingFilter);
    return [...list].sort((a, b) => b.date.localeCompare(a.date));
  }, [reviews, statusFilter, ratingFilter]);

  return (
    <div className="min-h-screen bg-background font-golos">
      <header className="bg-white border-b border-border sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
              <Icon name="Shield" size={15} className="text-white" />
            </div>
            <span className="font-semibold text-foreground">Панель модератора</span>
          </div>
          <Link
            to="/"
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-full border border-border hover:border-foreground/30"
          >
            <Icon name="ArrowLeft" size={13} />
            На сайт
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-6 fade-in">
          <h1 className="text-2xl font-bold text-foreground">Управление отзывами</h1>
          <p className="text-sm text-muted-foreground mt-1">Всего: {reviews.length} отзывов</p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6 fade-in">
          {[
            { label: 'На модерации', count: reviews.filter(r => r.status === 'pending').length, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
            { label: 'Опубликовано', count: reviews.filter(r => r.status === 'approved').length, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
            { label: 'Отклонено', count: reviews.filter(r => r.status === 'rejected').length, color: 'text-rose-600', bg: 'bg-rose-50 border-rose-200' },
          ].map((stat) => (
            <div key={stat.label} className={`rounded-2xl border p-4 text-center ${stat.bg}`}>
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.count}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex flex-wrap gap-2">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setStatusFilter(tab.value)}
                className={`text-xs px-3.5 py-1.5 rounded-full border font-medium transition-all relative ${
                  statusFilter === tab.value
                    ? 'bg-foreground text-primary-foreground border-foreground'
                    : 'bg-white border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground'
                }`}
              >
                {tab.label}
                {tab.value === 'pending' && pendingCount > 0 && (
                  <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 text-xs rounded-full bg-amber-500 text-white font-bold">
                    {pendingCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Рейтинг:</span>
            <div className="flex gap-1.5">
              {RATING_FILTERS.map((r) => (
                <button
                  key={r}
                  onClick={() => setRatingFilter(r)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all flex items-center gap-1 ${
                    ratingFilter === r
                      ? 'bg-foreground text-primary-foreground border-foreground'
                      : 'bg-white border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground'
                  }`}
                >
                  {r === 0 ? 'Все' : <><span style={{ color: ratingFilter === r ? 'hsl(43,96%,75%)' : 'hsl(43,96%,56%)' }}>★</span> {r}</>}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground mb-4">{displayed.length} отзывов</div>

        {displayed.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground fade-in">
            <div className="text-3xl mb-2">📭</div>
            <p className="text-sm">Нет отзывов по выбранным фильтрам</p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayed.map((review, i) => (
              <ModCard
                key={review.id}
                review={review}
                onApprove={approve}
                onReject={reject}
                onDelete={remove}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
