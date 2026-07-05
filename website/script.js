/* Holton Brothers Inc. — script.js (shared by index.html and projects.html) */

const SITE_PASSWORD = "mydemo";

/* ==========================================================================
   Password gate
   ========================================================================== */

(function gate() {
  const gateEl = document.getElementById("fn-gate");

  function unlock() {
    sessionStorage.setItem("fn-unlocked", "1");
    document.body.classList.add("unlocked");
    document.body.classList.remove("gated");
    if (gateEl) gateEl.remove();
  }

  if (sessionStorage.getItem("fn-unlocked") === "1") {
    unlock();
    return;
  }

  document.body.classList.add("unlocked"); // body visible; gate overlay covers it
  const form = document.getElementById("fn-gate-form");
  const input = document.getElementById("fn-gate-input");

  if (form && input) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (input.value === SITE_PASSWORD) {
        unlock();
      } else {
        input.value = "";
        input.classList.remove("shake");
        // restart the shake animation
        void input.offsetWidth;
        input.classList.add("shake");
      }
    });
    input.focus();
  }
})();

/* ==========================================================================
   Sticky header shadow
   ========================================================================== */

(function headerShadow() {
  const header = document.querySelector(".site-header");
  if (!header) return;
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();

/* ==========================================================================
   Mobile navigation toggle
   ========================================================================== */

(function mobileNav() {
  const toggle = document.getElementById("nav-toggle");
  if (!toggle) return;
  toggle.addEventListener("click", function () {
    const open = document.body.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  // Close the menu when a nav link is chosen
  document.querySelectorAll(".site-nav a").forEach(function (link) {
    link.addEventListener("click", function () {
      document.body.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
})();

/* ==========================================================================
   Scroll-triggered reveals — 10px fade-up, 200ms, 80ms stagger within groups
   ========================================================================== */

(function reveals() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("in"); });
    return;
  }

  // Stagger: 80ms per item within each data-reveal-group
  document.querySelectorAll("[data-reveal-group]").forEach(function (group) {
    group.querySelectorAll(".reveal").forEach(function (el, i) {
      el.style.setProperty("--reveal-delay", (i * 80) + "ms");
    });
  });

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -40px 0px", threshold: 0.1 });

  items.forEach(function (el) { observer.observe(el); });
})();

/* ==========================================================================
   Wistia video toggles — iframe injected on first open (lazy)
   ========================================================================== */

(function videoToggles() {
  document.querySelectorAll(".video-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const id = btn.getAttribute("data-video");
      const frame = document.querySelector('[data-video-frame="' + id + '"]');
      if (!frame) return;
      const open = frame.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      if (open && !frame.querySelector("iframe")) {
        const iframe = document.createElement("iframe");
        iframe.src = "https://fast.wistia.net/embed/iframe/" + id;
        iframe.title = "Holton Brothers video";
        iframe.setAttribute("allow", "autoplay; fullscreen");
        iframe.setAttribute("allowfullscreen", "");
        iframe.loading = "lazy";
        frame.appendChild(iframe);
      }
    });
  });
})();

/* ==========================================================================
   Lightbox for before/after photos
   ========================================================================== */

(function lightbox() {
  const box = document.getElementById("lightbox");
  const img = document.getElementById("lightbox-img");
  const close = document.getElementById("lightbox-close");
  if (!box || !img) return;

  let lastFocus = null;

  function openBox(src, alt) {
    img.src = src;
    img.alt = alt || "";
    box.classList.add("open");
    lastFocus = document.activeElement;
    if (close) close.focus();
  }

  function closeBox() {
    box.classList.remove("open");
    img.src = "";
    if (lastFocus) lastFocus.focus();
  }

  document.querySelectorAll("[data-lightbox]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const inner = btn.querySelector("img");
      openBox(btn.getAttribute("data-lightbox"), inner ? inner.alt : "");
    });
  });

  box.addEventListener("click", function (e) {
    if (e.target === box || e.target === img) closeBox();
  });
  if (close) close.addEventListener("click", closeBox);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && box.classList.contains("open")) closeBox();
  });
})();

/* ==========================================================================
   Contact form — demo notice while the Formspree ID is a placeholder
   ========================================================================== */

(function contactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;
  if (form.action.indexOf("REPLACE_WITH_FORM_ID") !== -1) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const note = document.getElementById("form-note");
      if (note) note.classList.add("visible");
    });
  }
})();
