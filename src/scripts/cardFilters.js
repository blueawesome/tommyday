document.addEventListener("alpine:init", () => {
  Alpine.data("cardFilters", () => ({
    pageSize: 24,
    visibleLimit: 24,
    search: "",
    occasion: "all",
    tone: "all",
    subject: "all",
    sort: "featured",

    setOccasion(value) {
      this.occasion = value;
      this.resetVisibleItems();
    },

    setTone(value) {
      this.tone = value;
      this.resetVisibleItems();
    },

    setSort(value) {
      this.sort = value;
      this.resetVisibleItems();
    },

    clearFilters() {
      this.search = "";
      this.occasion = "all";
      this.tone = "all";
      this.subject = "all";
      this.sort = "featured";
      this.resetVisibleItems();
    },

    matchedItems() {
      return Array.from(this.$root.querySelectorAll("[data-card-item]"))
        .filter((el) => this.matches(el))
        .sort((a, b) => {
          if (this.sort === "price-low") {
            return Number(a.dataset.price || 0) - Number(b.dataset.price || 0);
          }
          if (this.sort === "title") {
            return (a.dataset.cardTitle || "").localeCompare(b.dataset.cardTitle || "");
          }
          if (this.sort === "newest") {
            return Number(b.dataset.sortOrder || 0) - Number(a.dataset.sortOrder || 0);
          }

          const aFeatured = a.dataset.featured === "true" ? -1000 : 0;
          const bFeatured = b.dataset.featured === "true" ? -1000 : 0;
          return Number(a.dataset.sortOrder || 999) + aFeatured - (Number(b.dataset.sortOrder || 999) + bFeatured);
        });
    },

    sortOrder(el) {
      const index = this.matchedItems().indexOf(el);
      return index === -1 ? 9999 : index + 1;
    },

    matches(el) {
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
      const subjects = (el.dataset.subjects || "").split(",");

      if (this.search && !haystack.includes(this.search.toLowerCase())) return false;
      if (this.occasion !== "all" && !occasions.includes(this.occasion)) return false;
      if (this.tone !== "all" && !tones.includes(this.tone)) return false;
      if (this.subject !== "all" && !subjects.includes(this.subject)) return false;

      return true;
    },

    resultCount() {
      return this.matchedItems().length;
    },

    resultLabel() {
      const count = this.resultCount();
      const visible = Math.min(this.visibleLimit, count);
      return count > visible
        ? `Showing ${visible} of ${count} cards`
        : `Showing ${count} cards`;
    },

    resetVisibleItems() {
      this.visibleLimit = this.pageSize;
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
  }));
});
