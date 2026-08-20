import { getTrackedSnipcartStock } from "../../src/lib/snipcartInventory.js";

const DEFAULT_API_BASE = "https://app.snipcart.com/api";
const DEFAULT_PAGE_LIMIT = 100;

function sleepFor(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function limitedText(value, limit = 500) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, limit);
}

export function parseRetryAfter(value, now = Date.now()) {
  if (!value) return null;

  const seconds = Number(value);
  if (Number.isFinite(seconds) && seconds >= 0) return seconds * 1000;

  const date = Date.parse(value);
  return Number.isFinite(date) ? Math.max(0, date - now) : null;
}

export function getSnipcartProductId(product) {
  return typeof product?.userDefinedId === "string" && product.userDefinedId
    ? product.userDefinedId
    : null;
}

export function getTrackedStock(product) {
  return getTrackedSnipcartStock(product);
}

export function createSnipcartClient({
  apiKey,
  fetchImpl = globalThis.fetch,
  sleep = sleepFor,
  apiBase = DEFAULT_API_BASE,
  logger = console,
} = {}) {
  if (!apiKey) throw new Error("Missing SNIPCART_SECRET_API_KEY.");
  if (typeof fetchImpl !== "function") throw new Error("A fetch implementation is required.");

  const authorization = `Basic ${Buffer.from(`${apiKey}:`).toString("base64")}`;

  async function request(
    path,
    {
      method = "GET",
      body,
      retryRateLimit = false,
      maxAttempts = 5,
      baseDelayMs = 1_000,
    } = {}
  ) {
    let attempt = 0;

    while (attempt < maxAttempts) {
      attempt += 1;
      const response = await fetchImpl(`${apiBase}${path}`, {
        method,
        headers: {
          Authorization: authorization,
          Accept: "application/json",
          ...(body === undefined ? {} : { "Content-Type": "application/json" }),
        },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      });

      if (response.status === 429 && retryRateLimit && attempt < maxAttempts) {
        const retryAfter = parseRetryAfter(response.headers.get("retry-after"));
        const delay = Math.min(
          retryAfter ?? baseDelayMs * 2 ** (attempt - 1),
          30_000
        );
        logger.warn(
          `Snipcart rate limit reached; retrying in ${Math.ceil(delay / 1000)}s (attempt ${attempt + 1}/${maxAttempts}).`
        );
        await sleep(delay);
        continue;
      }

      if (!response.ok) {
        const detail = limitedText(await response.text());
        throw new Error(
          `Snipcart API ${method} ${path} failed (${response.status})${detail ? `: ${detail}` : "."}`
        );
      }

      if (response.status === 204) return null;

      try {
        return await response.json();
      } catch {
        throw new Error(`Snipcart API ${method} ${path} returned invalid JSON.`);
      }
    }

    throw new Error(`Snipcart API ${method} ${path} exceeded its retry limit.`);
  }

  async function listAllProducts({ limit = DEFAULT_PAGE_LIMIT } = {}) {
    const products = [];
    let offset = 0;
    let totalItems = null;

    while (totalItems === null || products.length < totalItems) {
      const page = await request(`/products?limit=${limit}&offset=${offset}`);
      const items = Array.isArray(page) ? page : page?.items;
      if (!Array.isArray(items)) {
        throw new Error("Unexpected Snipcart products response shape.");
      }

      if (totalItems === null) {
        const parsedTotal = Number(page?.totalItems);
        totalItems = Number.isInteger(parsedTotal) && parsedTotal >= 0
          ? parsedTotal
          : Number.POSITIVE_INFINITY;
      }

      products.push(...items);
      if (items.length === 0 || (totalItems === Number.POSITIVE_INFINITY && items.length < limit)) {
        break;
      }
      offset += items.length;
    }

    return products;
  }

  return {
    request,
    listAllProducts,
    getProduct(id) {
      return request(`/products/${encodeURIComponent(id)}`);
    },
    crawlUrl(fetchUrl) {
      return request("/products", {
        method: "POST",
        body: { fetchUrl },
        retryRateLimit: true,
      });
    },
    updateInventory(id, inventory) {
      return request(`/products/${encodeURIComponent(id)}`, {
        method: "PUT",
        body: inventory,
      });
    },
    sleep,
  };
}
