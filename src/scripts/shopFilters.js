document.addEventListener("alpine:init", () => {
  Alpine.data("shopFilters", () => ({
    pageSize: 9,
    visibleLimit: 9,
    selectedCategory: "all",
    selectedSize: "all",
    selectedSort: "oldest",

    setCategory(value) {
      this.selectedCategory = value;
      if (value === "card") {
        this.selectedSize = "all";
      }
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

    isSizeActive(value) {
      return this.selectedSize === value;
    },

    clearFilters() {
      this.selectedCategory = "all";
      this.selectedSize = "all";
      this.resetVisibleItems();
    },

    hasActiveFilters() {
      if (this.selectedCategory !== "all") return true;
      if (this.selectedSize !== "all") return true;
      return false;
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
      if (this.selectedCategory !== "all" && !availableAs.includes(this.selectedCategory)) {
        return false;
      }

      if (this.selectedSize !== "all" && !sizeTags.includes(this.selectedSize)) {
        return false;
      }

      return true;
    },
  }));
});
