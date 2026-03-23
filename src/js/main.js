// ===== Cookie Banner =====
(function () {
  const banner = document.getElementById("cookieBanner");
  const acceptBtn = document.getElementById("cookieAccept");
  const declineBtn = document.getElementById("cookieDecline");

  if (!banner) return;

  const consent = localStorage.getItem("cookie-consent");
  if (!consent) {
    banner.classList.add("visible");
  }

  acceptBtn?.addEventListener("click", () => {
    localStorage.setItem("cookie-consent", "accepted");
    banner.classList.remove("visible");
  });

  declineBtn?.addEventListener("click", () => {
    localStorage.setItem("cookie-consent", "declined");
    banner.classList.remove("visible");
  });
})();

// ===== Mobile Navigation =====
(function () {
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.querySelector(".nav-menu");

  if (!toggle || !menu) return;

  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", !expanded);
    toggle.classList.toggle("active");
    menu.classList.toggle("open");
  });

  // Close menu when clicking a link
  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      toggle.classList.remove("active");
      menu.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
})();

// ===== Dropdown Navigation =====
(function () {
  const dropdowns = document.querySelectorAll(".nav-dropdown");

  dropdowns.forEach((dropdown) => {
    const toggle = dropdown.querySelector(".dropdown-toggle");

    toggle?.addEventListener("click", (e) => {
      e.preventDefault();
      dropdown.classList.toggle("open");
    });
  });

  // Close dropdowns on outside click
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".nav-dropdown")) {
      dropdowns.forEach((d) => d.classList.remove("open"));
    }
  });
})();

// ===== Smooth scroll for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});
