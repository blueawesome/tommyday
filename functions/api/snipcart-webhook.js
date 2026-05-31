const DEFAULT_REPOSITORY = "blueawesome/tommyday";
const DISPATCH_EVENT = "snipcart-order-completed";

async function readJson(request) {
  const text = await request.text();
  return text ? JSON.parse(text) : {};
}

async function validateSnipcartRequest({ request, env }) {
  const secret = env.SNIPCART_WEBHOOK_SECRET;
  const url = new URL(request.url);

  if (secret) {
    const providedSecret =
      request.headers.get("x-tommyday-webhook-secret") ||
      url.searchParams.get("secret");

    if (providedSecret === secret) return true;
  }

  if (!env.SNIPCART_SECRET_API_KEY) return false;

  const requestToken = request.headers.get("x-snipcart-requesttoken");
  if (!requestToken) return false;

  const validation = await fetch(
    `https://app.snipcart.com/api/requestvalidation/${encodeURIComponent(requestToken)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Basic ${btoa(`${env.SNIPCART_SECRET_API_KEY}:`)}`,
        Accept: "application/json",
      },
    }
  );

  if (!validation.ok) return false;

  const result = await validation.json().catch(() => ({}));
  if (typeof result.isValid === "boolean") return result.isValid;

  return true;
}

function isCompletedOrder(payload) {
  const eventName = String(payload.eventName || payload.event || payload.type || "").toLowerCase();
  if (!eventName) return true;

  return (
    eventName.includes("order") &&
    (eventName.includes("completed") ||
      eventName.includes("paid") ||
      eventName.includes("processed") ||
      eventName.includes("created"))
  );
}

async function dispatchWorkflow({ env, payload }) {
  if (!env.GITHUB_DISPATCH_TOKEN) {
    throw new Error("Missing GITHUB_DISPATCH_TOKEN.");
  }

  const repository = env.GITHUB_REPOSITORY || DEFAULT_REPOSITORY;
  const response = await fetch(`https://api.github.com/repos/${repository}/dispatches`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.GITHUB_DISPATCH_TOKEN}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      "User-Agent": "tommyday-snipcart-webhook",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: JSON.stringify({
      event_type: DISPATCH_EVENT,
      client_payload: payload,
    }),
  });

  if (!response.ok) {
    throw new Error(`GitHub dispatch failed (${response.status}): ${await response.text()}`);
  }
}

export async function onRequestPost({ request, env }) {
  const valid = await validateSnipcartRequest({ request, env });
  if (!valid) {
    return new Response("Unauthorized", { status: 401 });
  }

  const payload = await readJson(request);
  if (!isCompletedOrder(payload)) {
    return Response.json({ ok: true, skipped: true, reason: "Not an order completion event." });
  }

  await dispatchWorkflow({ env, payload });
  return Response.json({ ok: true });
}

export function onRequest() {
  return new Response("Method not allowed", { status: 405 });
}
