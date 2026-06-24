const CREATE_ARTWORK_VOTES_TABLE_SQL = `
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
`;

function json(data, status = 200) {
  return Response.json(data, { status });
}

function isAuthorized(request, env) {
  const token = new URL(request.url).searchParams.get("token");
  return Boolean(env.VOTES_EXPORT_TOKEN && token && token === env.VOTES_EXPORT_TOKEN);
}

async function ensureVotesTable(db) {
  await db.exec(CREATE_ARTWORK_VOTES_TABLE_SQL);
}

function parseStoredList(value) {
  try {
    const parsed = JSON.parse(value || "[]");
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return [];
  }
}

function incrementCounts(counts, ids, titles) {
  ids.forEach((id, index) => {
    const title = titles[index] || id;
    const current = counts.get(id) || { id, title, count: 0 };
    current.count += 1;
    counts.set(id, current);
  });
}

function sortedCounts(counts) {
  return [...counts.values()].sort((a, b) => b.count - a.count || a.title.localeCompare(b.title));
}

export async function onRequestGet({ request, env }) {
  if (!isAuthorized(request, env)) {
    return json({ ok: false, message: "Unauthorized." }, 401);
  }

  if (!env.VOTES_DB) {
    return json({ ok: false, message: "Votes database is not configured." }, 500);
  }

  await ensureVotesTable(env.VOTES_DB);

  const { results } = await env.VOTES_DB
    .prepare(
      `SELECT
        print_votes,
        print_vote_ids,
        card_votes,
        card_vote_ids
      FROM artwork_votes`
    )
    .all();

  const printCounts = new Map();
  const cardCounts = new Map();

  for (const row of results || []) {
    incrementCounts(
      printCounts,
      parseStoredList(row.print_vote_ids),
      parseStoredList(row.print_votes)
    );
    incrementCounts(
      cardCounts,
      parseStoredList(row.card_vote_ids),
      parseStoredList(row.card_votes)
    );
  }

  return json({
    ok: true,
    prints: sortedCounts(printCounts),
    cards: sortedCounts(cardCounts),
  });
}
