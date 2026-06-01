const THANK_YOU_PATH = "/thank-you/";
let checkoutRedirectBound = false;

function getOrderReference(cart) {
  return (
    cart?.invoiceNumber ||
    cart?.token ||
    cart?.reference ||
    cart?.order?.invoiceNumber ||
    cart?.order?.token ||
    null
  );
}

function redirectToThankYou(cart) {
  if (window.location.pathname === THANK_YOU_PATH) return;

  const url = new URL(THANK_YOU_PATH, window.location.origin);
  const reference = getOrderReference(cart);
  if (reference) url.searchParams.set("order", reference);

  window.location.assign(url.href);
}

function bindCheckoutRedirect() {
  if (checkoutRedirectBound) return;
  if (!window.Snipcart?.events?.on) return;

  checkoutRedirectBound = true;
  window.Snipcart.events.on("cart.confirmed", redirectToThankYou);
}

document.addEventListener("snipcart.ready", bindCheckoutRedirect);
bindCheckoutRedirect();
