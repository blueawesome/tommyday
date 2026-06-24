CREATE TABLE IF NOT EXISTS artwork_votes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT,
  print_votes TEXT NOT NULL,
  print_vote_ids TEXT NOT NULL,
  card_votes TEXT NOT NULL,
  card_vote_ids TEXT NOT NULL,
  comments TEXT,
  source TEXT,
  submitted_at TEXT NOT NULL,
  user_agent TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
