function bindNewsletterForms() {
  document.querySelectorAll("[data-newsletter-form]").forEach((form) => {
    const status = form.querySelector("[data-newsletter-status]");
    const submitButton = form.querySelector('button[type="submit"]');

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!submitButton || !status) return;

      submitButton.disabled = true;
      status.textContent = "Signing up...";
      status.dataset.state = "pending";

      try {
        const response = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
        });
        const result = await response.json().catch(() => ({}));

        if (!response.ok || result.ok === false) {
          throw new Error(result.message || "That signup did not go through.");
        }

        form.reset();
        status.textContent = result.message || "Thanks. You're on the list.";
        status.dataset.state = "success";
      } catch (error) {
        status.textContent =
          error instanceof Error
            ? error.message
            : "Something went sideways. Please try again in a minute.";
        status.dataset.state = "error";
      } finally {
        submitButton.disabled = false;
      }
    });
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bindNewsletterForms, { once: true });
} else {
  bindNewsletterForms();
}
