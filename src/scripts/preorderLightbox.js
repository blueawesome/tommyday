function getLightboxParts() {
  const dialog = document.getElementById("preorder-lightbox");
  if (!dialog) return null;

  return {
    dialog,
    image: dialog.querySelector("[data-preorder-lightbox-image]"),
    caption: dialog.querySelector("[data-preorder-lightbox-caption]"),
  };
}

function openPreorderLightbox(trigger) {
  const parts = getLightboxParts();
  if (!parts || !parts.image || !parts.caption) return;

  const src = trigger.getAttribute("data-lightbox-src");
  const alt = trigger.getAttribute("data-lightbox-alt") || "";
  const title = trigger.getAttribute("data-lightbox-title") || alt;

  if (!src) return;

  parts.image.setAttribute("src", src);
  parts.image.setAttribute("alt", alt);
  parts.caption.textContent = title;

  if (typeof parts.dialog.showModal === "function") {
    parts.dialog.showModal();
  } else {
    parts.dialog.setAttribute("open", "");
  }
}

function closePreorderLightbox() {
  const parts = getLightboxParts();
  if (!parts) return;

  if (typeof parts.dialog.close === "function") {
    parts.dialog.close();
  } else {
    parts.dialog.removeAttribute("open");
  }
}

document.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-preorder-lightbox-trigger]");
  if (trigger) {
    event.preventDefault();
    openPreorderLightbox(trigger);
    return;
  }

  if (event.target.closest("[data-preorder-lightbox-close]")) {
    event.preventDefault();
    closePreorderLightbox();
    return;
  }

  const parts = getLightboxParts();
  if (parts && event.target === parts.dialog) {
    closePreorderLightbox();
  }
});

export {};
