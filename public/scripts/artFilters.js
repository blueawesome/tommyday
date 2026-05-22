document.addEventListener("alpine:init", () => {
  Alpine.data("artFilters", () => ({
    filter: "all",

    setFilter(filter) {
      this.filter = filter;
    },

    matches(el) {
      if (this.filter === "all") return true;
      if (this.filter === "originals") return el.dataset.original === "true";
      if (this.filter === "prints") return el.dataset.print === "true";
      if (this.filter === "sold") return el.dataset.sold === "true";
      if (this.filter === "not-for-sale") {
        return el.dataset.notForSale === "true";
      }

      return true;
    },
  }));
});
