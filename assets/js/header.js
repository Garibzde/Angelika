document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("top-header");
  const footerText = document.getElementById("footer-text");

  let lastScroll = 0;

  function showHeader() {
    if (!header) return;
    header.style.transform = "translateY(0)";
    header.style.boxShadow = "0 1px 0 rgba(255,255,255,0.03)";
  }

  function hideHeader() {
    if (!header) return;

    if (document.body.classList.contains("menu-open")) {
      showHeader();
      return;
    }

    header.style.transform = "translateY(-100%)";
  }

  showHeader();

  window.addEventListener(
    "scroll",
    () => {
      if (!header) return;

      const current = window.scrollY;

      if (current <= 10) {
        showHeader();
        lastScroll = current;
        return;
      }

      if (current > lastScroll && current > 80) {
        hideHeader();
      } else if (current < lastScroll) {
        showHeader();
      }

      lastScroll = current;
    },
    { passive: true }
  );

  
  let mobileMenuOpen = false;

  const burgerBtn = document.getElementById("burger-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileOverlay = document.getElementById("mobile-overlay");
  const burgerIcon = burgerBtn ? burgerBtn.querySelector("i") : null;
  const mobileCloseBtn = document.getElementById("mobile-close");

  function openMobileMenu() {
    if (!burgerBtn || !mobileMenu || !mobileOverlay) return;

    mobileMenuOpen = true;

    burgerBtn.setAttribute("aria-expanded", "true");
    mobileMenu.removeAttribute("hidden");

    requestAnimationFrame(() => {
      mobileMenu.style.transform = "translateX(0)";
      mobileOverlay.style.opacity = "1";
      mobileOverlay.style.pointerEvents = "auto";
    });

    document.body.style.overflow = "hidden";

    if (burgerIcon) {
      burgerIcon.classList.remove("fa-bars");
      burgerIcon.classList.add("fa-xmark");
    }
  }

  function closeMobileMenu() {
    if (!burgerBtn || !mobileMenu || !mobileOverlay) return;

    mobileMenuOpen = false;

    burgerBtn.setAttribute("aria-expanded", "false");
    mobileMenu.style.transform = "translateX(100%)";
    mobileOverlay.style.opacity = "0";
    mobileOverlay.style.pointerEvents = "none";

    document.body.style.overflow = "";

    if (burgerIcon) {
      burgerIcon.classList.remove("fa-xmark");
      burgerIcon.classList.add("fa-bars");
    }

    setTimeout(() => {
      if (!mobileMenuOpen) {
        mobileMenu.setAttribute("hidden", "");
      }
    }, 400);
  }

  if (burgerBtn) {
    burgerBtn.addEventListener("click", () => {
      mobileMenuOpen ? closeMobileMenu() : openMobileMenu();
    });
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener("click", closeMobileMenu);
  }

  if (mobileCloseBtn) {
    mobileCloseBtn.addEventListener("click", closeMobileMenu);
  }

  document.querySelectorAll("#mobile-menu button[aria-expanded]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const isOpen = btn.getAttribute("aria-expanded") === "true";
      const subList = btn.nextElementSibling;
      const icon = btn.querySelector("i");

      document.querySelectorAll("#mobile-menu button[aria-expanded]").forEach((otherBtn) => {
        if (otherBtn !== btn) {
          otherBtn.setAttribute("aria-expanded", "false");

          const otherSub = otherBtn.nextElementSibling;
          const otherIcon = otherBtn.querySelector("i");

          if (otherSub) otherSub.classList.add("hidden");

          if (otherIcon) {
            otherIcon.style.transform = "rotate(0deg)";
            otherIcon.style.transition = "transform 0.3s ease";
          }
        }
      });

      if (isOpen) {
        btn.setAttribute("aria-expanded", "false");
        if (subList) subList.classList.add("hidden");

        if (icon) {
          icon.style.transform = "rotate(0deg)";
          icon.style.transition = "transform 0.3s ease";
        }
      } else {
        btn.setAttribute("aria-expanded", "true");
        if (subList) subList.classList.remove("hidden");

        if (icon) {
          icon.style.transform = "rotate(180deg)";
          icon.style.transition = "transform 0.3s ease";
        }
      }
    });
  });

 
  const desktopToggles = document.querySelectorAll(".dropdown-toggle[aria-controls]");
  const megaMenus = document.querySelectorAll(".mega-menu");

  function closeAllMegaMenus() {
    megaMenus.forEach((menu) => {
      menu.classList.remove("open");
    });

    desktopToggles.forEach((toggle) => {
      toggle.setAttribute("aria-expanded", "false");
    });

    document.body.classList.remove("menu-open");

    if (header) {
      header.classList.remove("menu-active");
      showHeader();
    }
  }

  function openMegaMenu(toggle, panel) {
    if (!toggle || !panel) return;

    closeAllMegaMenus();

    panel.classList.add("open");
    toggle.setAttribute("aria-expanded", "true");

    document.body.classList.add("menu-open");

    if (header) {
      header.classList.add("menu-active");
      showHeader();
    }
  }

  desktopToggles.forEach((toggle) => {
    const targetId = toggle.getAttribute("aria-controls");
    const panel = targetId ? document.getElementById(targetId) : null;

    if (!panel) return;

    toggle.addEventListener("click", (e) => {
      e.preventDefault();

      const isOpen = panel.classList.contains("open");

      if (isOpen) {
        closeAllMegaMenus();
      } else {
        openMegaMenu(toggle, panel);
      }
    });
  });

  document.querySelectorAll(".mega-close").forEach((closeBtn) => {
    closeBtn.addEventListener("click", () => {
      closeAllMegaMenus();
    });
  });

  document.querySelectorAll(".mega-menu a").forEach((link) => {
    link.addEventListener("click", () => {
      closeAllMegaMenus();
    });
  });

  document.addEventListener("click", (e) => {
    const clickedToggle = e.target.closest(".dropdown-toggle[aria-controls]");
    const clickedInsidePanel = e.target.closest(".mega-menu");

    if (!clickedToggle && !clickedInsidePanel) {
      closeAllMegaMenus();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (mobileMenuOpen) closeMobileMenu();
      closeAllMegaMenus();
    }
  });

  if (footerText) {
    footerText.textContent = `© Студия Анжелики Прудниковой (ООО «Дизайн Интерьера Лакшери»), 2002– ${new Date().getFullYear()} г.`;
  }
});