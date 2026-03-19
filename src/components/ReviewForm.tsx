import { useState } from 'react';

interface ReviewFormProps {
  onSubmit: (name: string, text: string, rating: number) => void;
}

export default function ReviewForm({ onSubmit }: ReviewFormProps) {
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !text.trim() || rating === 0) return;
    onSubmit(name.trim(), text.trim(), rating);
    setName('');
    setText('');
    setRating(0);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3500);
  }

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl card-shadow p-6 text-center fade-in">
        <div className="text-3xl mb-2">🎉</div>
        <p className="font-semibold text-foreground">Спасибо за отзыв!</p>
        <p className="text-sm text-muted-foreground mt-1">Он будет опубликован после проверки модератором.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl card-shadow p-6">
      <h2 className="font-semibold text-base text-foreground mb-4">Оставить отзыв</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Ваше имя</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Иван Иванов"
            className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10 transition-all placeholder:text-muted-foreground/60"
            maxLength={60}
          />
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Ваш рейтинг</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => setRating(star)}
                className="text-2xl star-hover focus:outline-none"
                style={{ color: star <= (hovered || rating) ? 'hsl(43, 96%, 50%)' : '#e2e0d8' }}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Ваш отзыв</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Расскажите о своём опыте..."
            rows={4}
            className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10 transition-all placeholder:text-muted-foreground/60 resize-none"
            maxLength={600}
          />
          <p className="text-xs text-muted-foreground/60 text-right mt-1">{text.length}/600</p>
        </div>

        <button
          type="submit"
          disabled={!name.trim() || !text.trim() || rating === 0}
          className="w-full bg-foreground text-primary-foreground rounded-xl py-2.5 text-sm font-medium transition-all hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Отправить на модерацию
        </button>
      </form>
    </div>
  );
}
