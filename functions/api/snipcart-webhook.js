const DEFAULT_REPOSITORY = "blueawesome/tommyday";
const DISPATCH_EVENT = "snipcart-order-completed";
const SNIPCART_API_BASE = "https://app.snipcart.com/api";

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

function getOrder(payload) {
  return payload?.content || payload?.order || payload?.invoice || payload;
}

function getLineItems(order) {
  const candidates = [
    order?.items,
    order?.products,
    order?.cart?.items,
    order?.details?.items,
  ];

  return candidates.find((candidate) => Array.isArray(candidate)) || [];
}

function getLineItemId(item) {
  return (
    item?.id ||
    item?.uniqueId ||
    item?.productId ||
    item?.userDefinedId ||
    item?.sku ||
    item?.metadata?.id ||
    item?.customFields?.id ||
    null
  );
}

function getProductId(product) {
  return product?.userDefinedId || product?.id || product?.uniqueId || product?.sku || null;
}

function getProductStock(product) {
  const stock =
    product?.stock ??
    product?.inventory ??
    product?.quantity ??
    product?.availableStock ??
    product?.availableQuantity ??
    product?.stockCount ??
    null;

  const numericStock = Number(stock);
  return Number.isFinite(numericStock) ? numericStock : null;
}

function getProductsFromResponse(response) {
  const products = response?.items || response?.data || response?.products || response;
  return Array.isArray(products) ? products : [];
}

async function snipcartApiFetch(env, path) {
  const response = await fetch(`${SNIPCART_API_BASE}${path}`, {
    headers: {
      Authorization: `Basic ${btoa(`${env.SNIPCART_SECRET_API_KEY}:`)}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Snipcart API request failed (${response.status}): ${await response.text()}`);
  }

  return response.json();
}

async function fetchSnipcartProductsById(env, productIds) {
  if (!env.SNIPCART_SECRET_API_KEY || !productIds.length) return {};

  const productsResponse = await snipcartApiFetch(env, "/products");
  const products = getProductsFromResponse(productsResponse);
  const wanted = new Set(productIds);
  const stockByProductId = {};

  for (const product of products) {
    const id = getProductId(product);
    if (!id || !wanted.has(id)) continue;

    const inventory = getProductStock(product);
    if (inventory === null) continue;

    stockByProductId[id] = {
      inventory,
      source: "snipcart-products-api",
    };
  }

  return stockByProductId;
}

async function enrichPayloadWithSnipcartStock({ env, payload }) {
  const order = getOrder(payload);
  const itemIds = [
    ...new Set(getLineItems(order).map(getLineItemId).filter(Boolean)),
  ];

  try {
    const stockByProductId = await fetchSnipcartProductsById(env, itemIds);
    return {
      ...payload,
      _tommyDay: {
        ...payload._tommyDay,
        snipcartStock: stockByProductId,
      },
    };
  } catch (error) {
    console.error("Snipcart stock lookup failed", error);
    return {
      ...payload,
      _tommyDay: {
        ...payload._tommyDay,
        snipcartStock: {},
        snipcartStockLookupError:
          error instanceof Error ? error.message : "Unknown Snipcart stock lookup error.",
      },
    };
  }
}

async function dispatchWorkflow({ env, payload }) {
  if (!env.GITHUB_DISPATCH_TOKEN) {
    return {
      ok: false,
      status: 500,
      reason: "Missing GITHUB_DISPATCH_TOKEN Cloudflare environment variable.",
    };
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
    return {
      ok: false,
      status: 502,
      reason: "GitHub repository dispatch failed.",
      githubStatus: response.status,
      githubResponse: await response.text(),
    };
  }

  return { ok: true, repository };
}

export async function onRequestPost({ request, env }) {
  try {
    const valid = await validateSnipcartRequest({ request, env });
    if (!valid) {
      return new Response("Unauthorized", { status: 401 });
    }

    const payload = await readJson(request);
    if (!isCompletedOrder(payload)) {
      return Response.json({ ok: true, skipped: true, reason: "Not an order completion event." });
    }

    const enrichedPayload = await enrichPayloadWithSnipcartStock({ env, payload });
    const dispatchResult = await dispatchWorkflow({ env, payload: enrichedPayload });
    if (!dispatchResult.ok) {
      console.error("Snipcart webhook dispatch failed", dispatchResult);
      return Response.json(dispatchResult, { status: dispatchResult.status });
    }

    return Response.json({
      ok: true,
      dispatched: true,
      repository: dispatchResult.repository,
    });
  } catch (error) {
    console.error("Snipcart webhook failed", error);
    return Response.json(
      {
        ok: false,
        reason: error instanceof Error ? error.message : "Unknown webhook error.",
      },
      { status: 500 }
    );
  }
}

export function onRequest() {
  return new Response("Method not allowed", { status: 405 });
}
