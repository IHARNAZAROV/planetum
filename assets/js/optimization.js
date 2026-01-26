(function () {
  "use strict";

  // ==================================================
  // Helpers
  // ==================================================
  function throttle(func, limit) {
    let inThrottle = false;

    return function () {
      if (inThrottle) return;

      func.apply(this, arguments);
      inThrottle = true;

      setTimeout(() => {
        inThrottle = false;
      }, limit);
    };
  }


  // ==================================================
  // UI: Lightbox for images (.popup-image)
  // ==================================================
  function initLightbox() {
    const links = document.querySelectorAll(".popup-image");
    if (!links.length) return;

    links.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();

        const overlay = document.createElement("div");
        overlay.style.cssText =
          "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); display: flex; align-items: center; justify-content: center; z-index: 9999; cursor: zoom-out; opacity: 0; transition: opacity 0.3s ease;";

        const img = document.createElement("img");
        img.src = link.getAttribute("href");
        img.style.cssText =
          "max-width: 90%; max-height: 90%; border-radius: 8px; transform: scale(0.9); transition: transform 0.3s ease;";

        overlay.appendChild(img);
        document.body.appendChild(overlay);

        setTimeout(() => {
          overlay.style.opacity = "1";
          img.style.transform = "scale(1)";
        }, 10);

        const close = () => {
          overlay.style.opacity = "0";
          setTimeout(() => overlay.remove(), 300);
        };

        overlay.addEventListener("click", close);
      });
    });
  }

  // ==================================================
  // UI: Smooth anchors + ScrollToTop
  // ==================================================
  function initSmoothScroll() {
    const headerOffset = 90;

    // Anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        const href = this.getAttribute("href");

        // ignore empty anchors and menu toggler
        if (href === "#" || href === "" || this.classList.contains("vs-menu-toggle")) {
          return;
        }

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();

        // Close any open menus
        document.querySelectorAll(".vs-menu-wrapper, .sidemenu-wrapper").forEach((menu) => {
          menu.classList.remove("vs-body-visible", "show");
          menu.setAttribute("inert", "");
        });
        document.body.classList.remove("menu-open");

        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      });
    });

    // ScrollToTop button
    document.querySelectorAll(".scrollToTop").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });
  }

  // ==================================================
  // Layout: Shape mockups positioning (.shape-mockup)
  // ==================================================
  function initShapeMockup() {
    const elements = document.querySelectorAll(".shape-mockup");
    if (!elements.length) return;

    elements.forEach((el) => {
      const d = el.dataset;

      if (d.top) el.style.top = !isNaN(d.top) ? d.top + "px" : d.top;
      if (d.right) el.style.right = !isNaN(d.right) ? d.right + "px" : d.right;
      if (d.bottom) el.style.bottom = !isNaN(d.bottom) ? d.bottom + "px" : d.bottom;
      if (d.left) el.style.left = !isNaN(d.left) ? d.left + "px" : d.left;

      el.removeAttribute("data-top");
      el.removeAttribute("data-right");
      el.removeAttribute("data-bottom");
      el.removeAttribute("data-left");

      if (el.parentElement) el.parentElement.classList.add("shape-mockup-wrap");
    });
  }

  // ==================================================
  // Layout: Apply data-bg-src / data-mask-src
  // ==================================================
  function initDataAttributes() {
    document.querySelectorAll("[data-bg-src]").forEach((el) => {
      el.style.backgroundImage = `url(${el.dataset.bgSrc})`;
      el.removeAttribute("data-bg-src");
    });

    document.querySelectorAll("[data-mask-src]").forEach((el) => {
      const maskUrl = `url(${el.dataset.maskSrc})`;
      el.style.maskImage = maskUrl;
      el.style.webkitMaskImage = maskUrl;
      el.removeAttribute("data-mask-src");
    });
  }

  // ==================================================
  // UI: Menu system (mobile + side menu)
  // ==================================================
  function initMenuSystem() {
    const menuConfigs = [
      {
        trigger: ".vs-menu-toggle",
        drawer: ".vs-menu-wrapper",
        content: ".vs-mobile-menu",
        activeClass: "vs-body-visible",
      },
      {
        trigger: ".sideMenuToggler",
        drawer: ".sidemenu-wrapper",
        content: ".sidemenu-content",
        activeClass: "show",
      },
    ];

    // initial inert for accessibility
    menuConfigs.forEach((cfg) => {
      const drawer = document.querySelector(cfg.drawer);
      if (drawer) drawer.setAttribute("inert", "");
    });

    function openDrawer(cfg) {
      const drawer = document.querySelector(cfg.drawer);
      if (!drawer) return;

      drawer.classList.add(cfg.activeClass);
      drawer.removeAttribute("inert");
      document.body.classList.add("menu-open");
    }

    function closeDrawer(cfg) {
      const drawer = document.querySelector(cfg.drawer);
      if (!drawer) return;

      drawer.classList.remove(cfg.activeClass);
      drawer.setAttribute("inert", "");

      // remove body class only if no drawers are open
      if (!document.querySelector(".vs-body-visible, .sidemenu-wrapper.show")) {
        document.body.classList.remove("menu-open");
      }
    }

    // open handlers (delegation)
    document.body.addEventListener("click", (e) => {
      const cfg = menuConfigs.find((c) => e.target.closest(c.trigger));
      if (!cfg) return;

      e.preventDefault();
      openDrawer(cfg);
    });

    // close handlers
    menuConfigs.forEach((cfg) => {
      const drawer = document.querySelector(cfg.drawer);
      if (!drawer) return;

      drawer.querySelectorAll(".closeButton, .sideMenuCls").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          closeDrawer(cfg);
        });
      });

      // click outside content closes drawer
      drawer.addEventListener("click", (e) => {
        if (!e.target.closest(cfg.content)) closeDrawer(cfg);
      });
    });

    // Esc closes all
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      menuConfigs.forEach((cfg) => closeDrawer(cfg));
    });
  }

  // ==================================================
  // UI: Wave buttons (.wave-btn)
  // ==================================================
  function initWaveButtons() {
    const buttons = document.querySelectorAll(".wave-btn");
    if (!buttons.length) return;

    const waveHtml =
      "<span class='btn-hover'><span class='btn-hover-inner'>" +
      "<span class='part'></span>".repeat(4) +
      "</span></span>";

    buttons.forEach((btn) => {
      btn.insertAdjacentHTML("beforeend", waveHtml);
    });
  }

  // ==================================================
  // UI: Sticky header + ScrollToTop visibility
  // ==================================================
  function initStickyHeader() {
    const header = document.querySelector(".sticky-active");
    if (!header) return;

    const headerParent = header.parentElement;
    if (!headerParent) return;

    const scrollTopButton = document.querySelector(".scrollToTop");
    let lastScrollTop = 0;

    window.addEventListener(
      "scroll",
      throttle(() => {
        const scrollTop = window.scrollY;
        const height = header.offsetHeight;

        // prevent layout jump
        headerParent.style.minHeight = height + "px";

        if (scrollTop > 800) {
          headerParent.classList.add("will-sticky");
          header.classList.toggle("active", scrollTop < lastScrollTop);
        } else {
          headerParent.classList.remove("will-sticky");
          headerParent.style.minHeight = "";
          header.classList.remove("active");
        }

        lastScrollTop = scrollTop;

        if (scrollTopButton) {
          scrollTopButton.classList.toggle("show", scrollTop > 500);
        }
      }, 150)
    );
  }

  // ==================================================
  // PREMIUM Parallax + Breathing (hero section)
  // ==================================================
  function initPremiumHeroParallax() {
    const scene = document.querySelector(".parallax");
    if (!scene) return;

    const depthLayers = Array.from(scene.querySelectorAll("[data-depth]"));
    const mockups = Array.from(scene.querySelectorAll(".shape-mockup"));

    if (!depthLayers.length && !mockups.length) return;

    // feel tuning
    const strengthLayers = 70;
    const strengthMockups = 22;
    const ease = 0.10;
    const resetOnLeave = true;

    // idle breathing
    const idleAmplitudeX = 0.10;
    const idleAmplitudeY = 0.08;
    const idleSpeed = 0.0009;
    const idleStartDelay = 900;

    let rect = scene.getBoundingClientRect();

    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

    const updateRect = () => {
      rect = scene.getBoundingClientRect();
    };

    // depths for your mockups by id
    const mockupDepthMap = {
      cloud: 0.08,
      cloud2: 0.06,
      fire: 0.14,
      star: 0.12,
      rocket: 0.16,
      emoji: 0.10,
    };

    const mockupItems = mockups.map((el, index) => {
      const id = el.id || "";
      const depth =
        (id && mockupDepthMap[id] !== undefined ? mockupDepthMap[id] : null) ??
        (0.08 + (index % 5) * 0.02);

      return { el, depth };
    });

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    let lastMouseMoveAt = Date.now();
    let rafId = null;

    const inside = (x, y) =>
      x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;

    const apply = (finalX, finalY) => {
      // foreground layers
      depthLayers.forEach((layer) => {
        const depth = parseFloat(layer.getAttribute("data-depth")) || 0;

        const moveX = finalX * strengthLayers * depth;
        const moveY = finalY * strengthLayers * depth;

        layer.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
        layer.style.willChange = "transform";
      });

      // background mockups (counter-move)
      mockupItems.forEach((item) => {
        const moveX = -finalX * strengthMockups * item.depth;
        const moveY = -finalY * strengthMockups * item.depth;

        item.el.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
        item.el.style.willChange = "transform";
      });
    };

    const animate = () => {
      currentX += (targetX - currentX) * ease;
      currentY += (targetY - currentY) * ease;

      const now = Date.now();
      const idle = now - lastMouseMoveAt > idleStartDelay;

      let breatheX = 0;
      let breatheY = 0;

      if (idle) {
        const t = now * idleSpeed;
        breatheX = Math.sin(t) * idleAmplitudeX + Math.sin(t * 0.7) * (idleAmplitudeX * 0.35);
        breatheY = Math.cos(t * 0.9) * idleAmplitudeY + Math.cos(t * 0.55) * (idleAmplitudeY * 0.35);
      }

      const finalX = currentX + breatheX;
      const finalY = currentY + breatheY;

      apply(finalX, finalY);

      rafId = requestAnimationFrame(animate);
    };

    const start = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(animate);
    };

    const setTargetFromMouse = (clientX, clientY) => {
      const px = (clientX - rect.left) / rect.width;
      const py = (clientY - rect.top) / rect.height;

      targetX = clamp(px * 2 - 1, -1, 1);
      targetY = clamp(py * 2 - 1, -1, 1);
    };

    const reset = () => {
      targetX = 0;
      targetY = 0;
    };

    window.addEventListener("scroll", updateRect, { passive: true });
    window.addEventListener("resize", updateRect);

    window.addEventListener("mousemove", (e) => {
      if (!inside(e.clientX, e.clientY)) return;

      lastMouseMoveAt = Date.now();
      setTargetFromMouse(e.clientX, e.clientY);
    });

    window.addEventListener("mouseleave", () => {
      if (!resetOnLeave) return;
      lastMouseMoveAt = Date.now();
      reset();
    });

    if (resetOnLeave) {
      scene.addEventListener("mouseleave", () => {
        lastMouseMoveAt = Date.now();
        reset();
      });
    }

    updateRect();
    reset();
    start();
  }



  (function () {
  "use strict";

  /*---------- Set Mask (нужно для data-mask-src в секции teachers) ----------*/
  const maskNodes = document.querySelectorAll("[data-mask-src]");

  if (maskNodes.length > 0) {
    maskNodes.forEach((el) => {
      const mask = el.getAttribute("data-mask-src");

      if (mask) {
        el.style.maskImage = `url(${mask})`;
        el.style.webkitMaskImage = `url(${mask})`;
      }

      el.removeAttribute("data-mask-src");
    });
  }

  /*---------- WOW Js (Scroll Animation) ----------*/
  if (typeof WOW === "function") {
    new WOW({
      boxClass: "wow",
      animateClass: "animate__animated",
      offset: 0,
      mobile: true,
      live: true,
    }).init();
  }

  /*---------- Shape Mockup (позиционирование декора) ----------*/
  function shapeMockup(elements) {
    elements.forEach((el) => {
      const shapeTop = el.dataset.top;
      const shapeRight = el.dataset.right;
      const shapeBottom = el.dataset.bottom;
      const shapeLeft = el.dataset.left;

      if (shapeTop !== undefined) el.style.top = shapeTop;
      if (shapeRight !== undefined) el.style.right = shapeRight;
      if (shapeBottom !== undefined) el.style.bottom = shapeBottom;
      if (shapeLeft !== undefined) el.style.left = shapeLeft;

      el.removeAttribute("data-top");
      el.removeAttribute("data-right");
      el.removeAttribute("data-bottom");
      el.removeAttribute("data-left");

      const parent = el.parentElement;
      if (parent) parent.classList.add("shape-mockup-wrap");
    });
  }

  const shapeNodes = document.querySelectorAll(".shape-mockup");
  if (shapeNodes.length > 0) {
    shapeMockup(Array.from(shapeNodes));
  }
})();




 (function () {
    const menuWrapper = document.querySelector(".vs-menu-wrapper");
    const menu = document.querySelector("#mobileMenu");
    const toggleBtn = document.querySelector(".menu-toggle");
    const closeBtn = menuWrapper ? menuWrapper.querySelector(".closeButton") : null;

    if (!menuWrapper || !menu || !toggleBtn || !closeBtn) return;

    let isOpen = false;
    let lastFocusedElement = null;

    function lockScroll(lock) {
      document.documentElement.style.overflow = lock ? "hidden" : "";
      document.body.style.overflow = lock ? "hidden" : "";
    }

    function openMenu() {
      if (isOpen) return;
      isOpen = true;

      lastFocusedElement = document.activeElement;

      menuWrapper.hidden = false;
      menuWrapper.classList.add("is-open");
      menuWrapper.removeAttribute("inert");

      toggleBtn.setAttribute("aria-expanded", "true");
      lockScroll(true);

      closeBtn.focus();
    }

    function closeMenu() {
      if (!isOpen) return;
      isOpen = false;

      menuWrapper.classList.remove("is-open");
      menuWrapper.setAttribute("inert", "");

      toggleBtn.setAttribute("aria-expanded", "false");
      lockScroll(false);

      setTimeout(() => {
        menuWrapper.hidden = true;
      }, 250);

      if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
        lastFocusedElement.focus();
      }
    }

    function toggleMenu() {
      isOpen ? closeMenu() : openMenu();
    }

    toggleBtn.addEventListener("click", toggleMenu);
    closeBtn.addEventListener("click", closeMenu);

    menu.addEventListener("click", (e) => {
      const link = e.target.closest("a");
      if (!link) return;
      closeMenu();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });
  })();




   // ==================================================
  // Cookie Consent: Planetum banner
  // ==================================================
  function initPlanetumCookieBanner() {
    const banner = document.getElementById("planetumCookie");
    const btnAccept = document.getElementById("planetumCookieAccept");
    const btnDecline = document.getElementById("planetumCookieDecline");
    const btnClose = document.getElementById("planetumCookieClose");

    // Если баннера нет на странице — ничего не делаем
    if (!banner || !btnAccept || !btnDecline || !btnClose) return;

    const COOKIE_NAME = "cookie_consent";
    const COOKIE_DAYS = 180;

    function setCookie(name, value, days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);

      const expires = "expires=" + date.toUTCString();
      const secure = location.protocol === "https:" ? "; Secure" : "";

      document.cookie =
        name +
        "=" +
        encodeURIComponent(value) +
        "; " +
        expires +
        "; path=/" +
        "; SameSite=Lax" +
        secure;
    }

    function getCookie(name) {
      const cookies = document.cookie ? document.cookie.split("; ") : [];
      for (let i = 0; i < cookies.length; i++) {
        const parts = cookies[i].split("=");
        const key = parts.shift();
        const val = parts.join("=");
        if (key === name) return decodeURIComponent(val);
      }
      return null;
    }

    function showBanner() {
      banner.classList.add("is-show");
    }

    function hideBanner() {
      banner.classList.remove("is-show");
    }

    // ✅ Подключай аналитику только после "accepted"
    function enableAnalytics() {
      // Пример:
      // loadYandexMetrika();
      // loadGA4();
    }

    function disableAnalytics() {
      // Если аналитику НЕ вставляешь в <head>, то обычно тут ничего не надо.
    }

    function initConsent() {
      const consent = getCookie(COOKIE_NAME);

      if (consent === "accepted") {
        enableAnalytics();
        return;
      }

      if (consent === "declined") {
        disableAnalytics();
        return;
      }

      showBanner();

      // лёгкий UX: фокус на кнопку "Принять"
      setTimeout(() => btnAccept.focus(), 150);
    }

    let locked = false;

    btnAccept.addEventListener("click", function () {
      if (locked) return;
      locked = true;

      setCookie(COOKIE_NAME, "accepted", COOKIE_DAYS);
      enableAnalytics();
      hideBanner();
    });

    btnDecline.addEventListener("click", function () {
      if (locked) return;
      locked = true;

      setCookie(COOKIE_NAME, "declined", COOKIE_DAYS);
      disableAnalytics();
      hideBanner();
    });

    btnClose.addEventListener("click", function () {
      hideBanner();
    });

    initConsent();
  }




  // ==================================================
  // Boot
  // ==================================================
  document.addEventListener("DOMContentLoaded", () => {
    initDataAttributes();
    initShapeMockup();
    initMenuSystem();
    initWaveButtons();
    initLightbox();
    initPlanetumCookieBanner();
    initSmoothScroll();
    initStickyHeader();
    initPremiumHeroParallax();
  });


})();
