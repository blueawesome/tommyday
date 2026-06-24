const WEB3FORMS_API_URL = "https://api.web3forms.com/submit";
const MAX_FIELD_LENGTH = 250;
const MAX_MESSAGE_LENGTH = 4000;
const MAX_VOTES = 5;
const FALLBACK_ERROR_MESSAGE =
  "Something went sideways sending those picks. Please screenshot this page or text Tommy your picks.";
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

function clean(value, maxLength = MAX_FIELD_LENGTH) {
  return String(value || "").trim().slice(0, maxLength);
}

function cleanList(value) {
  return String(value || "")
    .split(",")
    .map((item) => clean(item))
    .filter(Boolean)
    .slice(0, MAX_VOTES);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function json(data, status = 200) {
  return Response.json(data, { status });
}

async function readWeb3FormsResult(response) {
  const body = await response.text();
  if (!body) return {};

  try {
    return JSON.parse(body);
  } catch {
    return { body };
  }
}

function logWeb3FormsFailure({ response, result, form, submittedAt, error }) {
  console.error("Web3Forms vote submission failed", {
    status: response?.status,
    result,
    error: error instanceof Error ? error.message : error ? String(error) : undefined,
    name: form.name,
    printVoteIds: form.printVoteIds,
    cardVoteIds: form.cardVoteIds,
    submittedAt,
  });
}

async function ensureVotesTable(db) {
  await db.exec(CREATE_ARTWORK_VOTES_TABLE_SQL);
}

async function insertVote({ db, form, submittedAt, userAgent }) {
  await ensureVotesTable(db);

  return db
    .prepare(
      `INSERT INTO artwork_votes (
        name,
        email,
        print_votes,
        print_vote_ids,
        card_votes,
        card_vote_ids,
        comments,
        source,
        submitted_at,
        user_agent
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      form.name,
      form.email || null,
      JSON.stringify(form.printVotes),
      JSON.stringify(form.printVoteIds),
      JSON.stringify(form.cardVotes),
      JSON.stringify(form.cardVoteIds),
      form.comments || null,
      form.source || "/vote/",
      submittedAt,
      userAgent || null
    )
    .run();
}

async function notifyWeb3Forms({ form, submittedAt, env }) {
  if (!env.WEB3FORMS_ACCESS_KEY) return;

  const message = [
    `Name: ${form.name}`,
    form.email ? `Email: ${form.email}` : null,
    `Print votes: ${form.printVotes.join(", ") || "None"}`,
    `Print vote IDs: ${form.printVoteIds.join(", ") || "None"}`,
    `Card votes: ${form.cardVotes.join(", ") || "None"}`,
    `Card vote IDs: ${form.cardVoteIds.join(", ") || "None"}`,
    form.comments ? `Notes: ${form.comments}` : null,
    `Source: ${form.source || "/vote/"}`,
    `Submitted: ${submittedAt}`,
  ]
    .filter(Boolean)
    .join("\n");

  const web3FormsData = new FormData();
  web3FormsData.set("access_key", env.WEB3FORMS_ACCESS_KEY);
  web3FormsData.set("from_name", "Tommy Day Art");
  web3FormsData.set("subject", `Artwork vote from ${form.name}`);
  web3FormsData.set("name", form.name);
  web3FormsData.set("message", message);
  web3FormsData.set("print_votes", form.printVotes.join(", "));
  web3FormsData.set("print_vote_ids", form.printVoteIds.join(", "));
  web3FormsData.set("card_votes", form.cardVotes.join(", "));
  web3FormsData.set("card_vote_ids", form.cardVoteIds.join(", "));
  web3FormsData.set("comments", form.comments);
  web3FormsData.set("source", form.source || "/vote/");
  web3FormsData.set("submitted_at", submittedAt);

  if (form.email) {
    web3FormsData.set("email", form.email);
    web3FormsData.set("replyto", form.email);
  }

  let response;
  try {
    response = await fetch(WEB3FORMS_API_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: web3FormsData,
    });
  } catch (error) {
    logWeb3FormsFailure({ form, submittedAt, error });
    return;
  }

  const result = await readWeb3FormsResult(response);
  if (!response.ok || result.success === false) {
    logWeb3FormsFailure({ response, result, form, submittedAt });
  }
}

async function readForm(request) {
  const formData = await request.formData();
  return {
    name: clean(formData.get("name")),
    email: clean(formData.get("email")),
    comments: clean(formData.get("comments"), MAX_MESSAGE_LENGTH),
    printVotes: cleanList(formData.get("printVotes")),
    cardVotes: cleanList(formData.get("cardVotes")),
    printVoteIds: cleanList(formData.get("printVoteIds")),
    cardVoteIds: cleanList(formData.get("cardVoteIds")),
    source: clean(formData.get("source")),
    timestamp: clean(formData.get("timestamp")),
    website: clean(formData.get("website")),
  };
}

export async function onRequestPost({ request, env, waitUntil }) {
  try {
    const form = await readForm(request);

    if (form.website) {
      return json({ ok: true, message: "Thank you. This genuinely helps." });
    }

    if (!form.name) {
      return json({ ok: false, message: "Add your name before sending." }, 400);
    }

    if (form.email && !isValidEmail(form.email)) {
      return json({ ok: false, message: "That email address looks a little off." }, 400);
    }

    if (form.printVotes.length === 0 && form.cardVotes.length === 0) {
      return json({ ok: false, message: "Pick at least one print or card before sending." }, 400);
    }

    if (!env.VOTES_DB) {
      return json(
        {
          ok: false,
          message: FALLBACK_ERROR_MESSAGE,
        },
        500
      );
    }

    const submittedAt = form.timestamp || new Date().toISOString();

    try {
      await insertVote({
        db: env.VOTES_DB,
        form,
        submittedAt,
        userAgent: request.headers.get("user-agent"),
      });
    } catch (error) {
      console.error("D1 vote insert failed", {
        error: error instanceof Error ? error.message : String(error),
        name: form.name,
        printVoteIds: form.printVoteIds,
        cardVoteIds: form.cardVoteIds,
        submittedAt,
      });
      return json(
        {
          ok: false,
          message: FALLBACK_ERROR_MESSAGE,
        },
        502
      );
    }

    const notification = notifyWeb3Forms({ form, submittedAt, env }).catch((error) => {
      logWeb3FormsFailure({ form, submittedAt, error });
    });
    if (typeof waitUntil === "function") {
      waitUntil(notification);
    }

    return json({ ok: true, message: "Thank you. This genuinely helps me decide what to print first." });
  } catch (error) {
    console.error("Vote form failed", error);
    return json(
      {
        ok: false,
        message: FALLBACK_ERROR_MESSAGE,
      },
      500
    );
  }
}
