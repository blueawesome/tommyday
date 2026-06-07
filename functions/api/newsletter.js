const MAILERLITE_SUBSCRIBERS_URL = "https://connect.mailerlite.com/api/subscribers";
const MAX_FIELD_LENGTH = 200;

function clean(value, maxLength = MAX_FIELD_LENGTH) {
  return String(value || "").trim().slice(0, maxLength);
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
    email: clean(formData.get("email")),
    website: clean(formData.get("website")),
  };
}

export async function onRequestPost({ request, env }) {
  try {
    const form = await readForm(request);

    if (form.website) {
      return json({ ok: true, message: "Thanks. You're on the list." });
    }

    if (!form.email || !isValidEmail(form.email)) {
      return json({ ok: false, message: "Please use a valid email address." }, 400);
    }

    if (!env.MAILERLITE_API_KEY) {
      return json({ ok: false, message: "The mailing list is not configured yet." }, 500);
    }

    const body = {
      email: form.email,
      ...(env.MAILERLITE_GROUP_ID ? { groups: [env.MAILERLITE_GROUP_ID] } : {}),
    };

    const response = await fetch(MAILERLITE_SUBSCRIBERS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${env.MAILERLITE_API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      const message =
        result?.message === "The email has already been taken."
          ? "Looks like you're already on the list."
          : "Something went sideways. Please try again in a minute.";
      const status = response.status === 422 ? 400 : 502;
      return json({ ok: false, message }, status);
    }

    return json({ ok: true, message: "Thanks. You're on the list." });
  } catch (error) {
    console.error("Newsletter signup failed", error);
    return json(
      { ok: false, message: "Something went sideways. Please try again in a minute." },
      500
    );
  }
}
