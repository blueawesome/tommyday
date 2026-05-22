document.addEventListener("alpine:init", () => {
  Alpine.data("artFilters", () => ({
  // scope: all | available | sold
    scope: "all",
  // selectedFormat: any | original | print | card | bookmark
    selectedFormat: "any",
    // size is not used for now but kept for future
    selectedSize: "all",

    setScope(value) {
      this.scope = value;
    },

    setFormat(value) {
      this.selectedFormat = value;
    },

    setSize(size) {
      this.selectedSize = size;
    },

    // UI helpers
    hasActiveFilters() {
      return (
        this.scope !== "all" ||
        (this.selectedSize && this.selectedSize !== "all") ||
        (this.selectedFormat && this.selectedFormat !== "any")
      );
    },

    clearFilters() {
      this.scope = "all";
      this.selectedSize = "all";
      this.selectedFormat = "any";
    },

    displayProduct(product) {
      if (!product || product === "all") return "";
      if (product === "bookmark") return "Bookmarks";
      if (product === "greeting-card") return "Greeting Cards";
      return product;
    },

    matches(el) {
      // scope handling using top-level status
      const status = (el.dataset.status || '').trim();
      const availableAs = (el.dataset.availableAs || '').split(',').map(s => s.trim()).filter(Boolean);

      if (this.scope === 'available') {
        if (status !== 'available') return false;
      } else if (this.scope === 'sold') {
        if (status !== 'sold') return false;
      }

      // format filtering
      if (this.selectedFormat && this.selectedFormat !== 'any' && this.scope !== 'sold') {
        if (!availableAs.includes(this.selectedFormat)) return false;
      }

      // size filtering placeholder (kept for future use)
      if (this.selectedSize && this.selectedSize !== 'all') {
        const sizes = el.dataset.sizes || '';
        const list = sizes.split(',').map((s) => s.trim()).filter(Boolean);
        if (!list.includes(this.selectedSize)) return false;
      }

      return true;
    },
  }));
});
