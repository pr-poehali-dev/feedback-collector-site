import { useState } from 'react';

interface ReviewFormProps {
  onSubmit: (name: string, text: string, rating: number) => Promise<void>;
}

export default function ReviewForm({ onSubmit }: ReviewFormProps) {
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !text.trim() || rating === 0 || submitting) return;
    setSubmitting(true);
    await onSubmit(name.trim(), text.trim(), rating);
    setName('');
    setText('');
    setRating(0);
    setSubmitting(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  }

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl card-shadow p-6 text-center fade-in">
        <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3">
          <span className="text-2xl">🎉</span>
        </div>
        <p className="font-semibold text-foreground">Спасибо за отзыв!</p>
        <p className="text-sm text-muted-foreground mt-1">
          Он будет опубликован после проверки модератором.
        </p>
      </div>
    );
  }

  const isValid = name.trim().length > 0 && text.trim().length > 0 && rating > 0;

  return (
    <div className="bg-white rounded-2xl card-shadow p-6">
      <h2 className="font-semibold text-base text-foreground mb-5">Оставить отзыв</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wide">
            Ваше имя
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Иван Иванов"
            maxLength={60}
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-foreground/40 focus:ring-2 focus:ring-foreground/8 transition-all placeholder:text-muted-foreground/50"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-2 block uppercase tracking-wide">
            Ваша оценка
          </label>
          <div className="flex gap-1 items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => setRating(star)}
                className="text-[28px] star-hover focus:outline-none leading-none"
                style={{ color: star <= (hovered || rating) ? 'hsl(43,96%,50%)' : '#ddd8cc' }}
              >
                ★
              </button>
            ))}
            {rating > 0 && (
              <span className="ml-2 text-xs text-muted-foreground">
                {['', 'Очень плохо', 'Плохо', 'Нормально', 'Хорошо', 'Отлично'][rating]}
              </span>
            )}
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wide">
            Ваш отзыв
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Расскажите о своём опыте..."
            rows={4}
            maxLength={1000}
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-foreground/40 focus:ring-2 focus:ring-foreground/8 transition-all placeholder:text-muted-foreground/50 resize-none"
          />
          <div className="flex justify-end mt-1">
            <span className="text-xs text-muted-foreground/60">{text.length}/1000</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={!isValid || submitting}
          className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed bg-foreground text-white hover:opacity-90 active:scale-[0.98]"
        >
          {submitting ? 'Отправляем...' : 'Отправить отзыв'}
        </button>
      </form>
    </div>
  );
}
