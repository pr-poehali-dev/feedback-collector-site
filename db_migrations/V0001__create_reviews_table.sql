CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  text TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  likes INTEGER NOT NULL DEFAULT 0,
  dislikes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO reviews (id, name, text, rating, date, status, likes, dislikes) VALUES
('1', 'Анна Морозова', 'Отличный сервис! Всё сделали быстро и качественно. Буду обращаться снова.', 5, '2024-01-15', 'approved', 12, 1),
('2', 'Дмитрий Козлов', 'В целом доволен работой. Немного затянули сроки, но качество на высоте.', 4, '2024-01-20', 'approved', 8, 2),
('3', 'Светлана Попова', 'Замечательная команда профессионалов. Очень внимательно отнеслись к нашему проекту.', 5, '2024-02-03', 'approved', 15, 0),
('4', 'Игорь Белов', 'Хорошая работа, но есть что улучшить в коммуникации с клиентом.', 3, '2024-02-10', 'approved', 5, 3),
('5', 'Мария Новикова', 'Ещё не проверили качество работы полностью, но первые впечатления хорошие.', 4, '2024-02-15', 'pending', 0, 0),
('6', 'Алексей Сидоров', 'Превзошли все ожидания! Рекомендую всем, кто ищет надёжных партнёров.', 5, '2024-02-20', 'approved', 20, 1)
ON CONFLICT (id) DO NOTHING;
