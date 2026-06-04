document.addEventListener("alpine:init", () => {
  Alpine.data("shopFilters", () => ({
    pageSize: 9,
    visibleLimit: 9,
    selectedBase: "all",
    selectedSize: "all",
    selectedSort: "oldest",
    toggles: {
      card: false,
      size9x12: false,
      size11x14: false,
      size425x55: false,
      bookmark: false,
      under25: false,
    },

    setBase(value) {
      this.selectedBase = value;
      this.resetVisibleItems();
    },

    setSize(value) {
      this.selectedSize = this.selectedSize === value ? "all" : value;
      this.resetVisibleItems();
    },

    setSort(value) {
      this.selectedSort = value;
      this.resetVisibleItems();
    },

    toggleFilter(key) {
      this.toggles[key] = !this.toggles[key];
      this.resetVisibleItems();
    },

    isSizeActive(value) {
      return this.selectedSize === value;
    },

    isActive(key) {
      return Boolean(this.toggles[key]);
    },

    clearFilters() {
      this.selectedBase = "all";
      this.selectedSize = "all";
      this.toggles = {
        card: false,
        size9x12: false,
        size11x14: false,
        size425x55: false,
        bookmark: false,
        under25: false,
      };
      this.resetVisibleItems();
    },

    hasActiveFilters() {
      if (this.selectedBase !== "all") return true;
      if (this.selectedSize !== "all") return true;
      return Object.values(this.toggles).some(Boolean);
    },

    matchedItems() {
      return Array.from(this.$root.querySelectorAll("[data-shop-item]"))
        .filter((el) => this.matches(el))
        .sort((a, b) => {
          const aSort = Number(a.dataset.catalogSort || 0);
          const bSort = Number(b.dataset.catalogSort || 0);

          return this.selectedSort === "newest" ? bSort - aSort : aSort - bSort;
        });
    },

    sortOrder(el) {
      const index = this.matchedItems().indexOf(el);
      return index === -1 ? 9999 : index + 1;
    },

    resultCount() {
      return this.matchedItems().length;
    },

    resultLabel() {
      const count = this.resultCount();
      const visible = Math.min(this.visibleLimit, count);
      const noun = count === 1 ? "piece" : "pieces";
      return count > visible
        ? `Showing ${visible} of ${count} available ${noun}`
        : `Showing ${count} available ${noun}`;
    },

    resetVisibleItems() {
      this.visibleLimit = this.pageSize;
    },

    visibleItems() {
      return Math.min(this.visibleLimit, this.resultCount());
    },

    remainingCount() {
      return Math.max(this.resultCount() - this.visibleLimit, 0);
    },

    hasMore() {
      return this.remainingCount() > 0;
    },

    loadMore() {
      this.visibleLimit += this.pageSize;
    },

    isVisible(el) {
      return this.matchedItems().indexOf(el) < this.visibleLimit;
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

      if (this.selectedSize !== "all" && !sizeTags.includes(this.selectedSize)) {
        return false;
      }

      if (this.toggles.size9x12 && !sizeTags.includes("9x12")) {
        return false;
      }

      if (this.toggles.size11x14 && !sizeTags.includes("11x14")) {
        return false;
      }

      if (this.toggles.size425x55 && !sizeTags.includes("4.25x5.5")) {
        return false;
      }

      if (this.toggles.under25 && !under25) {
        return false;
      }

      return true;
    },
  }));
});
