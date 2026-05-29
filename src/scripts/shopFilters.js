document.addEventListener("alpine:init", () => {
  Alpine.data("shopFilters", () => ({
    selectedBase: "all",
    toggles: {
      card: false,
      size8x10: false,
      size5x7: false,
      bookmark: false,
      under25: false,
    },

    setBase(value) {
      this.selectedBase = value;
    },

    toggleFilter(key) {
      this.toggles[key] = !this.toggles[key];
    },

    isActive(key) {
      return Boolean(this.toggles[key]);
    },

    clearFilters() {
      this.selectedBase = "all";
      this.toggles = {
        card: false,
        size8x10: false,
        size5x7: false,
        bookmark: false,
        under25: false,
      };
    },

    hasActiveFilters() {
      if (this.selectedBase !== "all") return true;
      return Object.values(this.toggles).some(Boolean);
    },

    resultCount() {
      return Array.from(this.$root.querySelectorAll("[data-shop-item]")).filter((el) =>
        this.matches(el)
      ).length;
    },

    resultLabel() {
      const count = this.resultCount();
      const noun = count === 1 ? "piece" : "pieces";
      return `Showing ${count} available ${noun}`;
    },

    matches(el) {
      const availableAs = (el.dataset.availableAs || "")
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);
      const sizeTags = (el.dataset.sizeTags || "")
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);
      const under25 = el.getAttribute("data-under-25") === "true";

      if (this.selectedBase !== "all" && !availableAs.includes(this.selectedBase)) {
        return false;
      }

      if (this.toggles.card && !availableAs.includes("card")) {
        return false;
      }

      if (this.toggles.bookmark && !availableAs.includes("bookmark")) {
        return false;
      }

      if (this.toggles.size8x10 && !sizeTags.includes("8x10")) {
        return false;
      }

      if (this.toggles.size5x7 && !sizeTags.includes("5x7")) {
        return false;
      }

      if (this.toggles.under25 && !under25) {
        return false;
      }

      return true;
    },
  }));
});
