document.querySelectorAll("[data-contact-form]").forEach((form) => {
  const status = form.querySelector("[data-contact-status]");
  const submitButton = form.querySelector('button[type="submit"]');

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!submitButton || !status) return;

    submitButton.disabled = true;
    status.textContent = "Sending...";
    status.dataset.state = "pending";

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.ok === false) {
        throw new Error(result.message || "That note did not send.");
      }

      form.reset();
      status.textContent = result.message || "Thanks. Your note was sent.";
      status.dataset.state = "success";
    } catch (error) {
      status.textContent =
        error instanceof Error
          ? error.message
          : "Something went sideways. Please email hey@tommyday.com.";
      status.dataset.state = "error";
    } finally {
      submitButton.disabled = false;
    }
  });
});
