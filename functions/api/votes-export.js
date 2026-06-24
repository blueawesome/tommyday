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

const CSV_COLUMNS = [
  "id",
  "name",
  "email",
  "print_votes",
  "print_vote_ids",
  "card_votes",
  "card_vote_ids",
  "comments",
  "source",
  "submitted_at",
  "created_at",
];

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

function csvEscape(value) {
  const stringValue = value == null ? "" : String(value);
  return `"${stringValue.replaceAll('"', '""')}"`;
}

function toCsv(rows) {
  const header = CSV_COLUMNS.join(",");
  const body = rows
    .map((row) => CSV_COLUMNS.map((column) => csvEscape(row[column])).join(","))
    .join("\n");

  return `${header}${body ? `\n${body}` : ""}\n`;
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
        id,
        name,
        email,
        print_votes,
        print_vote_ids,
        card_votes,
        card_vote_ids,
        comments,
        source,
        submitted_at,
        created_at
      FROM artwork_votes
      ORDER BY id ASC`
    )
    .all();

  const format = new URL(request.url).searchParams.get("format");
  if (format === "json") {
    return json({ ok: true, votes: results });
  }

  return new Response(toCsv(results || []), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="artwork-votes.csv"`,
    },
  });
}
