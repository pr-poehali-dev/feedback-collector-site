export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface Review {
  id: string;
  name: string;
  text: string;
  rating: number;
  date: string;
  status: ReviewStatus;
  likes: number;
  dislikes: number;
  userReaction: 'like' | 'dislike' | null;
}

export const AVATAR_COLORS = [
  'bg-rose-100 text-rose-600',
  'bg-sky-100 text-sky-600',
  'bg-emerald-100 text-emerald-600',
  'bg-violet-100 text-violet-600',
  'bg-amber-100 text-amber-600',
  'bg-pink-100 text-pink-600',
  'bg-teal-100 text-teal-600',
];

export function getAvatarColor(name: string): string {
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

export const INITIAL_REVIEWS: Review[] = [
  {
    id: '1',
    name: 'Анна Морозова',
    text: 'Отличный сервис! Всё работает чётко, поддержка отвечает быстро. Пользуюсь уже полгода и очень доволен результатом.',
    rating: 5,
    date: '2026-03-15',
    status: 'approved',
    likes: 14,
    dislikes: 1,
    userReaction: null,
  },
  {
    id: '2',
    name: 'Дмитрий Козлов',
    text: 'Хорошее качество за свои деньги. Были небольшие задержки, но в целом остался доволен.',
    rating: 4,
    date: '2026-03-10',
    status: 'approved',
    likes: 8,
    dislikes: 2,
    userReaction: null,
  },
  {
    id: '3',
    name: 'Светлана Попова',
    text: 'Ожидала большего. Интерфейс запутан, пришлось долго разбираться. Поддержка помогла, но хотелось бы лучше.',
    rating: 3,
    date: '2026-03-05',
    status: 'approved',
    likes: 3,
    dislikes: 5,
    userReaction: null,
  },
  {
    id: '4',
    name: 'Игорь Белов',
    text: 'Превзошло все ожидания! Быстро, удобно, современно. Рекомендую всем.',
    rating: 5,
    date: '2026-02-28',
    status: 'approved',
    likes: 21,
    dislikes: 0,
    userReaction: null,
  },
  {
    id: '5',
    name: 'Мария Новикова',
    text: 'Нужно доработать мобильную версию, но в остальном всё хорошо.',
    rating: 4,
    date: '2026-02-20',
    status: 'approved',
    likes: 6,
    dislikes: 1,
    userReaction: null,
  },
  {
    id: '6',
    name: 'Алексей Сидоров',
    text: 'Ужасный опыт. Всё зависает, ничего не работает как надо.',
    rating: 1,
    date: '2026-02-14',
    status: 'pending',
    likes: 0,
    dislikes: 0,
    userReaction: null,
  },
];
