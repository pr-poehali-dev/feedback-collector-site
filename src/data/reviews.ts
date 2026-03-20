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
