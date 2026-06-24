const RESEND_API_URL = "https://api.resend.com/emails";
const MAX_FIELD_LENGTH = 250;
const MAX_MESSAGE_LENGTH = 4000;
const MAX_VOTES = 5;
const FALLBACK_ERROR_MESSAGE =
  "Something went sideways sending those picks. Please screenshot this page or text Tommy your picks.";

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

async function insertVote({ db, form, submittedAt, userAgent }) {
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

async function notifyResend({ env, form, submittedAt }) {
  if (!env.RESEND_API_KEY || !env.VOTE_NOTIFICATION_TO || !env.VOTE_NOTIFICATION_FROM) {
    console.warn("Vote notification skipped: missing Resend env vars", {
      hasApiKey: Boolean(env.RESEND_API_KEY),
      hasTo: Boolean(env.VOTE_NOTIFICATION_TO),
      hasFrom: Boolean(env.VOTE_NOTIFICATION_FROM),
    });
    return;
  }

  const printLines = form.printVotes.length ? form.printVotes.map((item) => `- ${item}`).join("\n") : "- None";
  const cardLines = form.cardVotes.length ? form.cardVotes.map((item) => `- ${item}`).join("\n") : "- None";

  const text = [
    "New artwork vote submitted.",
    "",
    `Name: ${form.name}`,
    `Email: ${form.email || "none"}`,
    "",
    "Print picks:",
    printLines,
    "",
    "Card picks:",
    cardLines,
    "",
    "Comments:",
    form.comments || "none",
    "",
    `Submitted: ${submittedAt}`,
    `Source: ${form.source || "/vote/"}`,
  ].join("\n");

  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.VOTE_NOTIFICATION_FROM,
      to: [env.VOTE_NOTIFICATION_TO],
      subject: `Artwork vote from ${form.name}`,
      text,
      reply_to: form.email || undefined,
    }),
  });

  const resultText = await response.text();

  if (!response.ok) {
    console.error("Resend vote notification failed", {
      status: response.status,
      body: resultText,
      name: form.name,
      submittedAt,
    });
    return;
  }

  console.log("Resend vote notification sent", {
    name: form.name,
    submittedAt,
  });
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

    const notification = notifyResend({ form, submittedAt, env }).catch((error) => {
      console.error("Resend vote notification failed", {
        error: error instanceof Error ? error.message : String(error),
        name: form.name,
        submittedAt,
      });
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
