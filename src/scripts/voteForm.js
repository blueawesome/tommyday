document.addEventListener("alpine:init", () => {
  const fallbackErrorMessage =
    "Something went sideways sending those picks. Please screenshot this page or text Tommy your picks.";

  Alpine.data("voteForm", ({ max = 5 } = {}) => ({
    max,
    items: [],
    name: "",
    email: "",
    comments: "",
    printChoices: [],
    cardChoices: [],
    submitted: false,
    isSubmitting: false,
    statusMessage: "",
    statusState: "",

    init() {
      const dataEl = document.getElementById("vote-items-data");
      this.items = dataEl ? JSON.parse(dataEl.textContent || "[]") : [];
    },

    choicesFor(kind) {
      return kind === "print" ? this.printChoices : this.cardChoices;
    },

    isSelected(kind, id) {
      return this.choicesFor(kind).includes(id);
    },

    isLocked(kind, id) {
      const choices = this.choicesFor(kind);
      return choices.length >= this.max && !choices.includes(id);
    },

    toggle(kind, id) {
      if (this.isLocked(kind, id)) {
        this.statusMessage = `You can pick up to ${this.max} in each section.`;
        this.statusState = "error";
        return;
      }

      const choices = this.choicesFor(kind);
      const index = choices.indexOf(id);
      if (index >= 0) {
        choices.splice(index, 1);
      } else {
        choices.push(id);
      }

      this.statusMessage = "";
      this.statusState = "";
    },

    itemTitle(id) {
      return this.items.find((item) => item.id === id)?.title || id;
    },

    choiceTitles(kind) {
      return this.choicesFor(kind).map((id) => this.itemTitle(id)).join(", ");
    },

    choiceIds(kind) {
      return this.choicesFor(kind).join(", ");
    },

    hasChoices() {
      return this.printChoices.length > 0 || this.cardChoices.length > 0;
    },

    async submit() {
      if (!this.name.trim()) {
        this.statusMessage = "Add your name so I know whose excellent taste this is.";
        this.statusState = "error";
        return;
      }

      if (!this.hasChoices()) {
        this.statusMessage = "Pick at least one print or card before sending.";
        this.statusState = "error";
        return;
      }

      this.isSubmitting = true;
      this.statusMessage = "Sending...";
      this.statusState = "pending";

      try {
        const formData = new FormData(this.$refs.form);
        const response = await fetch(this.$refs.form.action, {
          method: "POST",
          body: formData,
        });
        const result = await response.json().catch(() => ({}));

        if (!response.ok || result.ok === false) {
          throw new Error(result.message || fallbackErrorMessage);
        }

        this.submitted = true;
        this.statusMessage = result.message || "Thank you. This genuinely helps.";
        this.statusState = "success";
        requestAnimationFrame(() => {
          document.querySelector(".vote-thanks")?.focus();
        });
      } catch (error) {
        this.statusMessage =
          error instanceof Error
            ? error.message
            : fallbackErrorMessage;
        this.statusState = "error";
      } finally {
        this.isSubmitting = false;
      }
    },
  }));
});
