export type SortOption = 'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful';
export type RatingFilter = 0 | 1 | 2 | 3 | 4 | 5;

interface FilterBarProps {
  sort: SortOption;
  ratingFilter: RatingFilter;
  onSort: (s: SortOption) => void;
  onRating: (r: RatingFilter) => void;
  total: number;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Новые' },
  { value: 'oldest', label: 'Старые' },
  { value: 'highest', label: 'Хорошие' },
  { value: 'lowest', label: 'Плохие' },
  { value: 'helpful', label: 'Полезные' },
];

export default function FilterBar({ sort, ratingFilter, onSort, onRating, total }: FilterBarProps) {
  return (
    <div className="space-y-3 mb-6">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {total} {total === 1 ? 'отзыв' : total < 5 ? 'отзыва' : 'отзывов'}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSort(opt.value)}
            className={`text-xs px-3.5 py-1.5 rounded-full border font-medium transition-all slide-in ${
              sort === opt.value
                ? 'bg-foreground text-primary-foreground border-foreground'
                : 'bg-white border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Рейтинг:</span>
        <div className="flex gap-1.5">
          <button
            onClick={() => onRating(0)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
              ratingFilter === 0
                ? 'bg-foreground text-primary-foreground border-foreground'
                : 'bg-white border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground'
            }`}
          >
            Все
          </button>
          {([5, 4, 3, 2, 1] as RatingFilter[]).map((r) => (
            <button
              key={r}
              onClick={() => onRating(r)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all flex items-center gap-1 ${
                ratingFilter === r
                  ? 'bg-foreground text-primary-foreground border-foreground'
                  : 'bg-white border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground'
              }`}
            >
              <span style={{ color: ratingFilter === r ? 'hsl(43,96%,75%)' : 'hsl(43,96%,56%)' }}>★</span> {r}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
