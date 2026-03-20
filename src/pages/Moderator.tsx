import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Review, ReviewStatus, getAvatarColor } from '@/data/reviews';
import Icon from '@/components/ui/icon';
import { fetchReviews, updateStatus, deleteReview } from '@/api/reviews';

type StatusFilter = 'all' | ReviewStatus;

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

const STATUS_META: Record<ReviewStatus, { label: string; cls: string }> = {
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
  const meta = STATUS_META[review.status];

  return (
    <div className="bg-white rounded-2xl card-shadow p-5 fade-in">
      <div className="flex items-start gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${avatarColor}`}
        >
          {initial}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-sm text-foreground">{review.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${meta.cls}`}>
                  {meta.label}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span
                      key={s}
                      className="text-sm"
                      style={{ color: s <= review.rating ? 'hsl(43,96%,50%)' : '#ddd8cc' }}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">{formatDate(review.date)}</span>
              </div>
            </div>
            <button
              onClick={() => onDelete(review.id)}
              title="Удалить навсегда"
              className="text-muted-foreground hover:text-rose-500 transition-colors p-1.5 rounded-lg hover:bg-rose-50 flex-shrink-0"
            >
              <Icon name="Trash2" size={14} />
            </button>
          </div>

          <p className="text-sm text-foreground/70 leading-relaxed mt-2 mb-3">{review.text}</p>

          <div className="flex gap-2 pt-3 border-t border-border/50">
            {review.status !== 'approved' && (
              <button
                onClick={() => onApprove(review.id)}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-all font-medium"
              >
                <Icon name="Check" size={12} />
                {review.status === 'rejected' ? 'Восстановить' : 'Одобрить'}
              </button>
            )}
            {review.status !== 'rejected' && (
              <button
                onClick={() => onReject(review.id)}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-all font-medium"
              >
                <Icon name="X" size={12} />
                {review.status === 'approved' ? 'Скрыть' : 'Отклонить'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const STATUS_TABS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'Все' },
  { value: 'pending', label: 'На модерации' },
  { value: 'approved', label: 'Опубликованные' },
  { value: 'rejected', label: 'Отклонённые' },
];

export default function Moderator() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [ratingFilter, setRatingFilter] = useState<0 | 1 | 2 | 3 | 4 | 5>(0);

  useEffect(() => {
    fetchReviews().then((data) => {
      setReviews(data);
      setLoading(false);
    });
  }, []);

  async function approve(id: string) {
    await updateStatus(id, 'approved');
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'approved' as ReviewStatus } : r)));
  }

  async function reject(id: string) {
    await updateStatus(id, 'rejected');
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'rejected' as ReviewStatus } : r)));
  }

  async function remove(id: string) {
    if (!confirm('Удалить отзыв навсегда?')) return;
    await deleteReview(id);
    setReviews((prev) => prev.filter((r) => r.id !== id));
  }

  const pendingCount = reviews.filter((r) => r.status === 'pending').length;

  const displayed = useMemo(() => {
    let list = reviews;
    if (statusFilter !== 'all') list = list.filter((r) => r.status === statusFilter);
    if (ratingFilter !== 0) list = list.filter((r) => r.rating === ratingFilter);
    return [...list].sort((a, b) => b.date.localeCompare(a.date));
  }, [reviews, statusFilter, ratingFilter]);

  const stats = [
    {
      label: 'На модерации',
      count: reviews.filter((r) => r.status === 'pending').length,
      color: 'text-amber-600',
      bg: 'bg-amber-50 border-amber-100',
    },
    {
      label: 'Опубликовано',
      count: reviews.filter((r) => r.status === 'approved').length,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 border-emerald-100',
    },
    {
      label: 'Отклонено',
      count: reviews.filter((r) => r.status === 'rejected').length,
      color: 'text-rose-600',
      bg: 'bg-rose-50 border-rose-100',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white/80 backdrop-blur-sm border-b border-border sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-foreground flex items-center justify-center">
              <Icon name="Shield" size={14} className="text-white" />
            </div>
            <span className="font-semibold text-sm text-foreground">Панель модератора</span>
          </div>
          <Link
            to="/"
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-full border border-border hover:border-foreground/20 bg-white"
          >
            <Icon name="ArrowLeft" size={12} />
            На сайт
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-6 fade-in">
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Управление отзывами</h1>
          <p className="text-sm text-muted-foreground mt-1">Всего отзывов: {reviews.length}</p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6 fade-in">
          {stats.map((s) => (
            <div key={s.label} className={`rounded-2xl border p-4 text-center ${s.bg}`}>
              <div className={`text-2xl font-bold ${s.color}`}>{s.count}</div>
              <div className="text-xs text-muted-foreground mt-0.5 leading-tight">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="space-y-3 mb-6 fade-in">
          <div className="flex flex-wrap gap-1.5">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setStatusFilter(tab.value)}
                className={`text-xs px-3.5 py-1.5 rounded-full border font-medium transition-all relative ${
                  statusFilter === tab.value
                    ? 'bg-foreground text-white border-foreground'
                    : 'bg-white border-border text-muted-foreground hover:border-foreground/25 hover:text-foreground'
                }`}
              >
                {tab.label}
                {tab.value === 'pending' && pendingCount > 0 && (
                  <span className="ml-1.5 inline-flex items-center justify-center min-w-[16px] h-4 px-1 text-[10px] rounded-full bg-amber-500 text-white font-bold">
                    {pendingCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground">Рейтинг:</span>
            {([0, 5, 4, 3, 2, 1] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRatingFilter(r)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all flex items-center gap-1 font-medium ${
                  ratingFilter === r
                    ? 'bg-foreground text-white border-foreground'
                    : 'bg-white border-border text-muted-foreground hover:border-foreground/25 hover:text-foreground'
                }`}
              >
                {r === 0 ? (
                  'Все'
                ) : (
                  <>
                    <span style={{ color: ratingFilter === r ? 'hsl(43,96%,75%)' : 'hsl(43,96%,50%)' }}>★</span>
                    {r}
                  </>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-muted-foreground mb-4">{displayed.length} отзывов</div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl card-shadow p-5 animate-pulse">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex-shrink-0" />
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="h-3 bg-muted rounded w-32" />
                    <div className="h-3 bg-muted rounded w-full" />
                    <div className="h-3 bg-muted rounded w-3/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : displayed.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground fade-in">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-sm font-medium">Нет отзывов по выбранным фильтрам</p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayed.map((review) => (
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
