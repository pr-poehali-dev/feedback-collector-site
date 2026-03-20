import { Review } from '@/data/reviews';

const BASE_URL = 'https://functions.poehali.dev/cd5f6327-6831-4674-9aaf-d9e4ae93f742';

export async function fetchReviews(): Promise<Review[]> {
  const res = await fetch(BASE_URL);
  return res.json();
}

export async function createReview(review: {
  name: string;
  text: string;
  rating: number;
  date: string;
}): Promise<Review> {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(review),
  });
  return res.json();
}

export async function updateStatus(id: string, status: string): Promise<void> {
  await fetch(`${BASE_URL}?action=status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, status }),
  });
}

export async function reactToReview(
  id: string,
  reaction: 'like' | 'dislike' | null,
  prev: 'like' | 'dislike' | null
): Promise<{ likes: number; dislikes: number }> {
  const res = await fetch(`${BASE_URL}?action=react`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, reaction, prev }),
  });
  return res.json();
}

export async function deleteReview(id: string): Promise<void> {
  await fetch(`${BASE_URL}?id=${id}`, { method: 'DELETE' });
}
