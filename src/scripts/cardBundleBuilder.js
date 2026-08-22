const STORAGE_KEY = "td-card-pack";
const PACK_SIZE = 5;

function readSavedPack() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
  } catch (error) {
    console.warn("Could not restore card pack", error);
    return null;
  }
}

function writeSavedPack(packSize, selectedCards) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      packSize,
      selectedCards,
    })
  );
  window.dispatchEvent(new CustomEvent("td-card-pack-updated"));
}

function withSelectionKey(card) {
  return {
    ...card,
    selectionKey:
      card.selectionKey ||
      `${card.id}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  };
}

document.addEventListener("alpine:init", () => {
  Alpine.data("cardBundleTray", () => ({
    selectedCards: [],

    init() {
      this.restore();
      window.addEventListener("td-card-pack-updated", () => this.restore());
    },

    restore() {
      const saved = readSavedPack();
      this.selectedCards = Array.isArray(saved?.selectedCards) ? saved.selectedCards : [];
    },

    count() {
      return this.selectedCards.length;
    },

    isBuilderPage() {
      return window.location.pathname.replace(/\/+$/, "") === "/cards/build-a-pack";
    },

    isReadyOnBuilderPage() {
      return this.isBuilderPage() && this.count() >= PACK_SIZE;
    },

    submitPack() {
      window.dispatchEvent(new CustomEvent("td-card-pack-submit"));
    },
  }));

  Alpine.data("cardBundleBuilder", ({ cards = [], prices = {} } = {}) => ({
    allCards: cards,
    prices,
    packSize: PACK_SIZE,
    selectedCards: [],
    search: "",
    occasion: "all",
    tone: "all",
    isAddingToCart: false,
    cartError: "",

    init() {
      this.restore();

      const params = new URLSearchParams(window.location.search);
      const occasion = params.get("occasion");
      const start = params.get("start");

      this.packSize = PACK_SIZE;
      if (occasion) this.occasion = occasion;
      if (start) this.consumeStartParam(params, start);
      this.trimToPackSize();
      this.persist();
      window.addEventListener("td-card-pack-submit", () => this.addPackToCart());
    },

    restore() {
      const saved = readSavedPack();
      if (!saved) return;

      this.packSize = PACK_SIZE;
      if (Array.isArray(saved.selectedCards)) {
        const cardsById = new Map(this.allCards.map((card) => [card.id, card]));
        this.selectedCards = saved.selectedCards
          .map((savedCard) => {
            const currentCard = cardsById.get(savedCard.id);
            return currentCard
              ? withSelectionKey({
                  ...currentCard,
                  selectionKey: savedCard.selectionKey,
                })
              : null;
          })
          .filter(Boolean);
      }
    },

    persist() {
      writeSavedPack(this.packSize, this.selectedCards);
    },

    setPackSize(size) {
      this.packSize = PACK_SIZE;
      this.trimToPackSize();
      this.persist();
    },

    trimToPackSize() {
      if (this.selectedCards.length > this.packSize) {
        this.selectedCards = this.selectedCards.slice(0, this.packSize);
      }
    },

    addCard(card) {
      if (!card) return;
      if (this.selectedCards.length >= this.packSize) return;
      this.selectedCards.push(withSelectionKey(card));
      this.persist();
    },

    addCardBySlug(slug) {
      const card = this.allCards.find((item) => item.slug === slug);
      if (card) this.addCard(card);
    },

    consumeStartParam(params, slug) {
      if (!this.selectedCards.some((card) => card.slug === slug)) {
        this.addCardBySlug(slug);
      }

      params.delete("start");
      const query = params.toString();
      const nextUrl = `${window.location.pathname}${query ? `?${query}` : ""}${
        window.location.hash
      }`;
      window.history.replaceState({}, "", nextUrl);
    },

    removeCard(selectionKey) {
      this.selectedCards = this.selectedCards.filter(
        (card) => card.selectionKey !== selectionKey
      );
      this.persist();
    },

    removeOneCard(cardId) {
      const index = this.selectedCards.map((card) => card.id).lastIndexOf(cardId);
      if (index === -1) return;
      this.selectedCards.splice(index, 1);
      this.persist();
    },

    isSelected(cardId) {
      return this.selectedCards.some((card) => card.id === cardId);
    },

    selectedCount(cardId) {
      return this.selectedCards.filter((card) => card.id === cardId).length;
    },

    canAddMore() {
      return this.selectedCards.length < this.packSize;
    },

    clear() {
      this.selectedCards = [];
      this.cartError = "";
      this.persist();
    },

    remainingCount() {
      return Math.max(this.packSize - this.selectedCards.length, 0);
    },

    packStatusMessage() {
      const remaining = this.remainingCount();
      if (this.selectedCards.length === 0) return "Start building your pack.";
      if (remaining === 0) return "Your pack is ready.";
      return `Almost there. Add ${remaining} more.`;
    },

    packActionLabel() {
      if (this.isAddingToCart) return "Adding cards...";
      const remaining = this.remainingCount();
      if (remaining === 0) return "Add 5 cards to cart";
      return `Pick ${remaining} more card${remaining === 1 ? "" : "s"}`;
    },

    isComplete() {
      return this.selectedCards.length === this.packSize;
    },

    bundlePrice() {
      return this.prices[PACK_SIZE];
    },

    bundlePriceLabel() {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(this.bundlePrice() || 0);
    },

    completionPercent() {
      return Math.min(100, Math.round((this.selectedCards.length / this.packSize) * 100));
    },

    selectedSummary() {
      return this.selectedCards
        .map((card) => `${card.sku} - ${card.title}`)
        .join(" | ");
    },

    bundleName() {
      return "Build Your Own 5-Card Pack";
    },

    bundleItemId() {
      const skuList = this.selectedCards
        .map((card) => card.sku)
        .sort()
        .join("-");
      return `build-your-own-${this.packSize}-card-pack-${skuList}`.toLowerCase();
    },

    groupedCartItems() {
      const byId = new Map();

      for (const card of this.selectedCards) {
        const existing = byId.get(card.id);
        if (existing) {
          existing.quantity += 1;
          continue;
        }

        byId.set(card.id, {
          id: card.id,
          name: card.name || `${card.title} Greeting Card`,
          description: card.description || "",
          image: card.image,
          price: card.price,
          url: card.url,
          quantity: 1,
          stackable: true,
          categories: card.categories || ["greeting-card"],
          alternatePrices: card.alternatePrices || { card5: 6 },
          metadata: {
            bundleGroupId: this.bundleItemId(),
            bundleName: this.bundleName(),
            bundleSize: PACK_SIZE,
          },
        });
      }

      return [...byId.values()];
    },

    waitForSnipcart() {
      if (window.Snipcart?.api?.cart?.items?.add) {
        return Promise.resolve(window.Snipcart);
      }

      return new Promise((resolve, reject) => {
        const timeout = window.setTimeout(() => {
          document.removeEventListener("snipcart.ready", onReady);
          reject(new Error("Snipcart did not finish loading."));
        }, 10000);
        const onReady = () => {
          window.clearTimeout(timeout);
          if (window.Snipcart?.api?.cart?.items?.add) {
            resolve(window.Snipcart);
          } else {
            reject(new Error("Snipcart cart API is unavailable."));
          }
        };
        document.addEventListener("snipcart.ready", onReady, { once: true });
      });
    },

    async addPackToCart() {
      if (!this.isComplete() || this.isAddingToCart) return;

      this.isAddingToCart = true;
      this.cartError = "";

      try {
        const snipcart = await this.waitForSnipcart();
        for (const item of this.groupedCartItems()) {
          await snipcart.api.cart.items.add(item);
        }
        this.clear();
      } catch (error) {
        console.error("Could not add card pack to Snipcart", error);
        this.cartError =
          error instanceof Error ? error.message : "Could not add card pack to cart.";
      } finally {
        this.isAddingToCart = false;
      }
    },

    matchesCard(el) {
      const haystack = [
        el.dataset.cardTitle,
        el.dataset.occasions,
        el.dataset.tones,
        el.dataset.subjects,
        el.dataset.themes,
      ]
        .join(" ")
        .toLowerCase();
      const occasions = (el.dataset.occasions || "").split(",");
      const tones = (el.dataset.tones || "").split(",");

      if (this.search && !haystack.includes(this.search.toLowerCase())) return false;
      if (this.occasion !== "all" && !occasions.includes(this.occasion)) return false;
      if (this.tone !== "all" && !tones.includes(this.tone)) return false;

      return true;
    },

    surpriseMe() {
      const matchingCards = this.allCards.filter((card) => {
        if (this.occasion !== "all" && !card.occasions.includes(this.occasion)) return false;
        if (this.tone !== "all" && !card.tones.includes(this.tone)) return false;
        return true;
      });

      if (!matchingCards.length) return;

      let shuffled = [...matchingCards].sort(() => Math.random() - 0.5);
      while (this.selectedCards.length < this.packSize) {
        if (!shuffled.length) {
          shuffled = [...matchingCards].sort(() => Math.random() - 0.5);
        }
        const card = shuffled.shift();
        if (!card) break;
        if (this.selectedCards.length >= this.packSize) break;
        this.selectedCards.push(withSelectionKey(card));
      }
      this.persist();
    },
  }));
});
