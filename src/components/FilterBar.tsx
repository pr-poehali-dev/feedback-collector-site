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
  { value: 'newest', label: 'Сначала новые' },
  { value: 'oldest', label: 'Сначала старые' },
  { value: 'highest', label: 'Сначала хорошие' },
  { value: 'lowest', label: 'Сначала плохие' },
  { value: 'helpful', label: 'Самые полезные' },
];

const STAR_FILTERS = [5, 4, 3, 2, 1] as const;

export default function FilterBar({ sort, ratingFilter, onSort, onRating, total }: FilterBarProps) {
  return (
    <div className="space-y-3 mb-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">
          {total}{' '}
          {total === 1 ? 'отзыв' : total >= 2 && total <= 4 ? 'отзыва' : 'отзывов'}
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSort(opt.value)}
            className={`text-xs px-3.5 py-1.5 rounded-full border font-medium transition-all ${
              sort === opt.value
                ? 'bg-foreground text-white border-foreground'
                : 'bg-white border-border text-muted-foreground hover:border-foreground/25 hover:text-foreground'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-muted-foreground">Рейтинг:</span>
        <button
          onClick={() => onRating(0)}
          className={`text-xs px-3 py-1.5 rounded-full border transition-all font-medium ${
            ratingFilter === 0
              ? 'bg-foreground text-white border-foreground'
              : 'bg-white border-border text-muted-foreground hover:border-foreground/25 hover:text-foreground'
          }`}
        >
          Все
        </button>
        {STAR_FILTERS.map((r) => (
          <button
            key={r}
            onClick={() => onRating(r)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all flex items-center gap-1 font-medium ${
              ratingFilter === r
                ? 'bg-foreground text-white border-foreground'
                : 'bg-white border-border text-muted-foreground hover:border-foreground/25 hover:text-foreground'
            }`}
          >
            <span style={{ color: ratingFilter === r ? 'hsl(43,96%,75%)' : 'hsl(43,96%,50%)' }}>★</span>
            {r}
          </button>
        ))}
      </div>
    </div>
  );
}
