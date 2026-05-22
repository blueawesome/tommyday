// Lightweight PJAX for small static site
// Intercepts internal link clicks, fetches HTML, and swaps <main> content

function isInternalLink(link) {
  return location.origin === link.origin && !link.hash && link.pathname !== location.pathname;
}

async function fetchAndReplace(url) {
  try {
    const res = await fetch(url, { headers: { 'X-PJAX': 'true' } });
    if (!res.ok) throw new Error('Network error');
    // show progress
    showProgress();
    const text = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');
    const newMain = doc.querySelector('main');
    if (newMain) {
      const main = document.querySelector('main');
      main.replaceWith(newMain);
      // update title
      const newTitle = doc.querySelector('title');
      if (newTitle) document.title = newTitle.textContent;
      // update meta description if present
      const newDesc = doc.querySelector('meta[name="description"]');
      if (newDesc) {
        let meta = document.querySelector('meta[name="description"]');
        if (!meta) {
          meta = document.createElement('meta');
          meta.name = 'description';
          document.head.appendChild(meta);
        }
        meta.content = newDesc.content;
      }
      // re-run Alpine init if available
      if (window.Alpine && typeof window.Alpine.initTree === 'function') {
        window.Alpine.initTree(newMain);
      }
      history.pushState({}, '', url);
      window.scrollTo(0, 0);
      // update active nav after client-side navigation
      updateActiveNav();
      hideProgress();
    }
  } catch (err) {
    // fallback to full navigation
    hideProgress();
    location.href = url;
  }
}

function onClick(e) {
  const a = e.target.closest('a');
  if (!a) return;
  if (a.target === '_blank' || a.hasAttribute('download')) return;
  if (!isInternalLink(a)) return;
  e.preventDefault();
  fetchAndReplace(a.href);
}

document.addEventListener('click', onClick);
window.addEventListener('popstate', () => {
  // handle back/forward
  fetchAndReplace(location.href);
});

// Normalize a pathname by removing trailing slashes (but keep root '/')
function normalizePath(path) {
  if (!path) return '/';
  try {
    const p = typeof path === 'string' ? path : path.pathname;
    const cleaned = p.replace(/\/+$|(?<!^)\/$/, '');
    return cleaned === '' ? '/' : cleaned;
  } catch (e) {
    return '/';
  }
}

// Set aria-current on the matching sidebar nav link so CSS active states work
function updateActiveNav() {
  const links = document.querySelectorAll('.sidebar-nav a[href]');
  const current = normalizePath(location.pathname);
  links.forEach((a) => {
    try {
      const href = new URL(a.href, location.origin).pathname;
      const linkPath = normalizePath(href);
      if (linkPath === current) {
        a.setAttribute('aria-current', 'page');
        a.classList.add('active');
      } else {
        a.removeAttribute('aria-current');
        a.classList.remove('active');
      }
    } catch (e) {
      // ignore malformed URLs
    }
  });
}

// initialize active nav on first load
document.addEventListener('DOMContentLoaded', () => updateActiveNav());
// also run immediately in case DOMContentLoaded already fired
updateActiveNav();

// Progress indicator helpers
function ensureProgressEl() {
  if (document.getElementById('pjax-progress')) return document.getElementById('pjax-progress');
  const el = document.createElement('div');
  el.id = 'pjax-progress';
  el.style.position = 'fixed';
  el.style.top = '0';
  el.style.left = '0';
  el.style.right = '0';
  el.style.height = '3px';
  el.style.background = 'linear-gradient(90deg,#111,rgba(0,0,0,0.15))';
  el.style.transform = 'scaleX(0)';
  el.style.transformOrigin = 'left';
  el.style.transition = 'transform 350ms ease';
  el.style.zIndex = '9999';
  document.body.appendChild(el);
  return el;
}

function showProgress() {
  const el = ensureProgressEl();
  requestAnimationFrame(() => {
    el.style.transform = 'scaleX(0.03)';
  });
}

function hideProgress() {
  const el = document.getElementById('pjax-progress');
  if (!el) return;
  el.style.transform = 'scaleX(1)';
  setTimeout(() => {
    el.style.transform = 'scaleX(0)';
  }, 200);
}

export {};
