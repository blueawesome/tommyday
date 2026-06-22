const WEB3FORMS_API_URL = "https://api.web3forms.com/submit";
const MAX_FIELD_LENGTH = 250;
const MAX_MESSAGE_LENGTH = 4000;
const MAX_VOTES = 5;

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

export async function onRequestPost({ request, env }) {
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

    if (!env.WEB3FORMS_ACCESS_KEY) {
      return json(
        {
          ok: false,
          message: "The vote form is not configured yet. Please text or email Tommy your picks.",
        },
        500
      );
    }

    const submittedAt = form.timestamp || new Date().toISOString();
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

    const response = await fetch(WEB3FORMS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: env.WEB3FORMS_ACCESS_KEY,
        from_name: "Tommy Day Art",
        subject: `Artwork vote from ${form.name}`,
        name: form.name,
        email: form.email || "vote@tommyday.com",
        replyto: form.email || undefined,
        print_votes: form.printVotes.join(", "),
        print_vote_ids: form.printVoteIds.join(", "),
        card_votes: form.cardVotes.join(", "),
        card_vote_ids: form.cardVoteIds.join(", "),
        comments: form.comments,
        source: form.source || "/vote/",
        submitted_at: submittedAt,
        message,
      }),
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok || result.success === false) {
      return json(
        {
          ok: false,
          message: "Something went sideways sending those picks. Please try again in a minute.",
        },
        502
      );
    }

    return json({ ok: true, message: "Thank you. This genuinely helps me decide what to print first." });
  } catch (error) {
    console.error("Vote form failed", error);
    return json(
      {
        ok: false,
        message: "Something went sideways sending those picks. Please try again in a minute.",
      },
      500
    );
  }
}
