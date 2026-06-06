const WEB3FORMS_API_URL = "https://api.web3forms.com/submit";
const MAX_FIELD_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 4000;

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
    name: clean(formData.get("name")),
    email: clean(formData.get("email")),
    subject: clean(formData.get("subject")),
    message: clean(formData.get("message"), MAX_MESSAGE_LENGTH),
    website: clean(formData.get("website")),
  };
}

export async function onRequestPost({ request, env }) {
  try {
    const form = await readForm(request);

    if (form.website) {
      return json({ ok: true, message: "Thanks. Your note was sent." });
    }

    if (!form.name || !form.email || !form.message) {
      return json({ ok: false, message: "Please add your name, email, and message." }, 400);
    }

    if (!isValidEmail(form.email)) {
      return json({ ok: false, message: "Please use a valid email address." }, 400);
    }

    if (!env.WEB3FORMS_ACCESS_KEY) {
      return json(
        {
          ok: false,
          message: "The contact form is not configured yet. Please email hey@tommyday.com.",
        },
        500
      );
    }

    const response = await fetch(WEB3FORMS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: env.WEB3FORMS_ACCESS_KEY,
        from_name: "Tommy Day Art",
        subject: `Tommy Day Art contact: ${form.subject || "New message"}`,
        name: form.name,
        email: form.email,
        replyto: form.email,
        message: form.message,
      }),
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok || result.success === false) {
      return json(
        {
          ok: false,
          message: "Something went sideways sending that note. Please email hey@tommyday.com.",
        },
        502
      );
    }

    return json({ ok: true, message: "Thanks. Your note was sent." });
  } catch (error) {
    console.error("Contact form failed", error);
    return json(
      {
        ok: false,
        message: "Something went sideways sending that note. Please email hey@tommyday.com.",
      },
      500
    );
  }
}
