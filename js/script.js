"use strict";

const EVENT_CONFIG = {
  eventName: "Next Beauty Experience 2026",
  brandName: "Workshop Next Beauty",

  mainEventDate: "2026-10-10",
  vipEventDate: "2026-10-11",

  regularCheckoutUrl: "",
  vipCheckoutUrl: "",

  whatsappNumber: "",
  whatsappMessage:
    "Olá! Gostaria de receber informações sobre o Next Beauty Experience 2026.",

  venueName: "Pousada do PC",
  venueAddress: "",
  venueInstagram:
    "https://www.instagram.com/pousadadopc?igsh=MTF6ZGVlY3NoMmF5dg==",
  mapUrl: "",

  instagramUrl: "",
  officialUrl: "",

  regularPrice: "",
  regularInstallments: "",
  vipPrice: "",
  vipInstallments: "",

  speakersEnabled: false,
  sponsorsEnabled: false,
  testimonialsEnabled: false,

  officialEventImageEnabled: false,
  officialVenueImageEnabled: true,

  countdownEnabled: false,
  countdownDate: "",

  // Preencha os arrays apenas com dados reais e autorizados.
  speakers: [],
  sponsors: [],
  testimonials: [],

  // Campos necessários para ativar o JSON-LD do evento.
  eventStartTime: "",
  eventEndTime: "",
  venueCity: "",
  venueState: "",
  eventImageUrl: "",
  currency: "BRL",
  regularPriceNumeric: "",
  ticketAvailability: "",
};

document.documentElement.classList.add("js");

const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const desktopQuery = window.matchMedia("(min-width: 1024px)");

function getElement(selector, context = document) {
  return context.querySelector(selector);
}

function getElements(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

function isUsableUrl(value) {
  if (!value || typeof value !== "string") return false;

  try {
    const url = new URL(value, window.location.href);
    return ["http:", "https:"].includes(url.protocol);
  } catch (error) {
    return false;
  }
}

function buildWhatsAppUrl() {
  const number = String(EVENT_CONFIG.whatsappNumber || "").replace(/\D/g, "");
  if (!number) return "";

  return `https://wa.me/${number}?text=${encodeURIComponent(EVENT_CONFIG.whatsappMessage)}`;
}

function showNotice(message) {
  const notice = getElement(".config-notice");
  if (!notice) return;

  window.clearTimeout(showNotice.timeoutId);
  notice.textContent = message;
  notice.hidden = false;
  showNotice.timeoutId = window.setTimeout(() => {
    notice.hidden = true;
  }, 4600);
}

function scrollToSection(selector) {
  const target = getElement(selector);
  if (!target) return;

  target.scrollIntoView({
    behavior: reducedMotionQuery.matches ? "auto" : "smooth",
    block: "start",
  });
}

function trackCtaClick(button, action, destination) {
  const location = button.dataset.ctaLocation || "unknown";
  const detail = {
    action,
    location,
    destination,
    timestamp: new Date().toISOString(),
  };

  document.dispatchEvent(
    new CustomEvent("nextbeauty:cta-click", {
      bubbles: true,
      detail,
    }),
  );

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: "nextbeauty_cta_click", ...detail });
}

function openExternalUrl(url) {
  const newWindow = window.open(url, "_blank", "noopener,noreferrer");
  if (newWindow) newWindow.opener = null;
}

function resolveCtaDestination(action) {
  const checkoutUrl =
    action === "vip" ? EVENT_CONFIG.vipCheckoutUrl : EVENT_CONFIG.regularCheckoutUrl;

  if (isUsableUrl(checkoutUrl)) {
    return { type: "checkout", value: checkoutUrl };
  }

  const whatsappUrl = buildWhatsAppUrl();
  if (whatsappUrl) {
    return { type: "whatsapp", value: whatsappUrl };
  }

  return { type: "section", value: "#ingressos" };
}

function resolveSupportDestination() {
  const whatsappUrl = buildWhatsAppUrl();
  if (whatsappUrl) {
    return { type: "whatsapp", value: whatsappUrl };
  }

  return { type: "section", value: "#ingressos" };
}

function handleCtaClick(event) {
  const button = event.currentTarget;
  const action = button.dataset.action || "regular";
  const destination =
    action === "support" ? resolveSupportDestination() : resolveCtaDestination(action);

  trackCtaClick(button, action, destination.type);

  if (destination.type === "section") {
    scrollToSection(destination.value);
    showNotice(
      action === "support"
        ? "O WhatsApp oficial ainda será configurado. Confira abaixo as informações dos ingressos."
        : "Os links de compra serão liberados em breve. Confira os detalhes dos ingressos.",
    );
    return;
  }

  openExternalUrl(destination.value);
}

function initCtaButtons() {
  getElements("[data-action]").forEach((button) => {
    button.addEventListener("click", handleCtaClick);
  });
}

function setMenuState(isOpen) {
  const header = getElement(".site-header");
  const toggle = getElement(".menu-toggle");
  const nav = getElement(".site-nav");
  if (!header || !toggle || !nav) return;

  const shouldOpen = Boolean(isOpen) && !desktopQuery.matches;
  toggle.setAttribute("aria-expanded", String(shouldOpen));
  toggle.setAttribute(
    "aria-label",
    shouldOpen ? "Fechar menu de navegação" : "Abrir menu de navegação",
  );
  nav.classList.toggle("is-open", shouldOpen);
  header.classList.toggle("is-menu-open", shouldOpen);
  document.body.classList.toggle("menu-open", shouldOpen);

  if (shouldOpen) {
    const firstLink = getElement("a", nav);
    if (firstLink) firstLink.focus();
  }
}

function initMenu() {
  const toggle = getElement(".menu-toggle");
  const nav = getElement(".site-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    setMenuState(toggle.getAttribute("aria-expanded") !== "true");
  });

  getElements("a", nav).forEach((link) => {
    link.addEventListener("click", () => setMenuState(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || toggle.getAttribute("aria-expanded") !== "true") {
      return;
    }

    setMenuState(false);
    toggle.focus();
  });

  desktopQuery.addEventListener("change", () => setMenuState(false));
}

function initHeader() {
  const header = getElement(".site-header");
  if (!header) return;

  let ticking = false;
  const updateHeader = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 24);
    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateHeader);
    },
    { passive: true },
  );

  updateHeader();
}

function initAnchorScrolling() {
  getElements('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const selector = link.getAttribute("href");
      if (!selector || selector === "#") return;

      const target = getElement(selector);
      if (!target) return;

      event.preventDefault();
      if (target instanceof HTMLDetailsElement) target.open = true;
      scrollToSection(selector);

      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, "", selector);
      }
    });
  });
}

function toggleFaq(button, shouldOpen) {
  const panelId = button.getAttribute("aria-controls");
  const panel = panelId ? document.getElementById(panelId) : null;
  if (!panel) return;

  button.setAttribute("aria-expanded", String(shouldOpen));
  panel.hidden = !shouldOpen;
}

function initFaq() {
  const buttons = getElements(".faq-item button");
  if (!buttons.length) return;

  buttons.forEach((button, index) => {
    toggleFaq(button, false);

    button.addEventListener("click", () => {
      const isOpen = button.getAttribute("aria-expanded") === "true";

      buttons.forEach((otherButton) => {
        if (otherButton !== button) toggleFaq(otherButton, false);
      });

      toggleFaq(button, !isOpen);
    });

    button.addEventListener("keydown", (event) => {
      const keyMap = {
        ArrowDown: (index + 1) % buttons.length,
        ArrowUp: (index - 1 + buttons.length) % buttons.length,
        Home: 0,
        End: buttons.length - 1,
      };

      if (keyMap[event.key] === undefined) return;
      event.preventDefault();
      buttons[keyMap[event.key]].focus();
    });
  });
}

function initRevealAnimations() {
  const elements = getElements(".reveal");
  if (!elements.length || reducedMotionQuery.matches || !("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  document.documentElement.classList.add("motion-enabled");

  const observer = new IntersectionObserver(
    (entries, activeObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        activeObserver.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8%", threshold: 0.1 },
  );

  elements.forEach((element) => observer.observe(element));
}

function initMobileCta() {
  const hero = getElement(".hero");
  const footer = getElement(".site-footer");
  const mobileCta = getElement(".mobile-cta");
  const closeButton = getElement(".mobile-cta-close");
  if (!hero || !footer || !mobileCta || !closeButton || !("IntersectionObserver" in window)) {
    return;
  }

  let heroVisible = true;
  let footerVisible = false;
  let dismissed = false;

  try {
    dismissed = window.sessionStorage.getItem("nextbeauty-mobile-cta-dismissed") === "true";
  } catch (error) {
    dismissed = false;
  }

  const syncVisibility = () => {
    const shouldShow = !desktopQuery.matches && !heroVisible && !footerVisible && !dismissed;
    mobileCta.classList.toggle("is-visible", shouldShow);
    mobileCta.setAttribute("aria-hidden", String(!shouldShow));
    document.body.classList.toggle("has-mobile-cta", shouldShow);
  };

  const heroObserver = new IntersectionObserver(
    ([entry]) => {
      heroVisible = entry.isIntersecting;
      syncVisibility();
    },
    { threshold: 0.05 },
  );

  const footerObserver = new IntersectionObserver(
    ([entry]) => {
      footerVisible = entry.isIntersecting;
      syncVisibility();
    },
    { threshold: 0.01 },
  );

  heroObserver.observe(hero);
  footerObserver.observe(footer);

  closeButton.addEventListener("click", () => {
    dismissed = true;
    try {
      window.sessionStorage.setItem("nextbeauty-mobile-cta-dismissed", "true");
    } catch (error) {
      // O fechamento continua válido mesmo quando o armazenamento é bloqueado.
    }
    syncVisibility();
  });

  desktopQuery.addEventListener("change", syncVisibility);
}

function updatePrice(type, price, installments) {
  const priceBox = getElement(`[data-price="${type}"]`);
  if (!priceBox) return;

  const priceElement = getElement("strong", priceBox);
  const installmentElement = getElement("[data-installments]", priceBox);
  if (!priceElement || !installmentElement) return;

  priceElement.textContent = price || "Em breve";
  installmentElement.textContent = price && installments ? installments : "";
  installmentElement.hidden = !(price && installments);
}

function syncContactLinks() {
  const whatsappUrl = buildWhatsAppUrl();

  getElements("[data-whatsapp-link]").forEach((link) => {
    if (!whatsappUrl) {
      link.hidden = true;
      link.removeAttribute("href");
      return;
    }
    link.href = whatsappUrl;
    link.hidden = false;
  });

  getElements("[data-event-instagram]").forEach((link) => {
    if (!isUsableUrl(EVENT_CONFIG.instagramUrl)) {
      link.hidden = true;
      link.removeAttribute("href");
      return;
    }
    link.href = EVENT_CONFIG.instagramUrl;
    link.hidden = false;
  });

  const venueLink = getElement("[data-venue-instagram]");
  if (venueLink && isUsableUrl(EVENT_CONFIG.venueInstagram)) {
    venueLink.href = EVENT_CONFIG.venueInstagram;
  }

  const mapLink = getElement("[data-map-link]");
  if (mapLink && isUsableUrl(EVENT_CONFIG.mapUrl)) {
    mapLink.href = EVENT_CONFIG.mapUrl;
    mapLink.hidden = false;
  }
}

function syncVenue() {
  const venueName = getElement("[data-venue-name]");
  const venueAddress = getElement("[data-venue-address]");

  if (venueName) venueName.textContent = EVENT_CONFIG.venueName || "Local em confirmação";

  if (venueAddress && EVENT_CONFIG.venueAddress) {
    venueAddress.textContent = EVENT_CONFIG.venueAddress;
    venueAddress.hidden = false;
  }
}

function loadImageIntoElement(image, source, onSuccess) {
  const preloader = new Image();
  preloader.onload = () => {
    image.src = source;
    image.hidden = false;
    if (typeof onSuccess === "function") onSuccess();
  };
  preloader.onerror = () => {
    image.hidden = true;
  };
  preloader.src = source;
}

function loadConfiguredAssets() {
  getElements("[data-image-frame]").forEach((frame) => {
    const isVenue = frame.classList.contains("venue-media");
    const enabled = isVenue
      ? EVENT_CONFIG.officialVenueImageEnabled
      : EVENT_CONFIG.officialEventImageEnabled;
    const image = getElement("img", frame);
    const source = frame.dataset.src;

    if (!enabled || !image || !source) return;
    loadImageIntoElement(image, source, () => frame.classList.add("has-image"));
  });
}

function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
}

function renderSpeakers() {
  const section = getElement('[data-optional-section="speakers"]');
  const grid = getElement("[data-speakers-grid]");
  if (!section || !grid || !EVENT_CONFIG.speakersEnabled || !EVENT_CONFIG.speakers.length) {
    if (section) section.hidden = true;
    return;
  }

  EVENT_CONFIG.speakers.forEach((speaker) => {
    const card = createElement("article", "speaker-card");
    if (speaker.photo) {
      const image = createElement("img");
      image.src = speaker.photo;
      image.alt = `Retrato de ${speaker.name}`;
      image.width = 640;
      image.height = 800;
      image.loading = "lazy";
      card.appendChild(image);
    }
    card.appendChild(createElement("h3", "", speaker.name));
    card.appendChild(createElement("p", "speaker-role", speaker.role));
    card.appendChild(createElement("strong", "speaker-topic", speaker.topic));
    card.appendChild(createElement("p", "", speaker.bio));
    if (isUsableUrl(speaker.instagram)) {
      const link = createElement("a", "", "Ver Instagram");
      link.href = speaker.instagram;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      card.appendChild(link);
    }
    grid.appendChild(card);
  });

  section.hidden = false;
}

function renderSponsors() {
  const section = getElement('[data-optional-section="sponsors"]');
  const grid = getElement("[data-sponsors-grid]");
  if (!section || !grid || !EVENT_CONFIG.sponsorsEnabled || !EVENT_CONFIG.sponsors.length) {
    if (section) section.hidden = true;
    return;
  }

  EVENT_CONFIG.sponsors.forEach((sponsor) => {
    const card = createElement(isUsableUrl(sponsor.url) ? "a" : "div", "sponsor-card");
    if (card.tagName === "A") {
      card.href = sponsor.url;
      card.target = "_blank";
      card.rel = "noopener noreferrer";
      card.setAttribute("aria-label", `Conhecer ${sponsor.name}`);
    }
    const image = createElement("img");
    image.src = sponsor.logo;
    image.alt = `Logo ${sponsor.name}`;
    image.width = 300;
    image.height = 140;
    image.loading = "lazy";
    card.appendChild(image);
    grid.appendChild(card);
  });

  section.hidden = false;
}

function renderTestimonials() {
  const section = getElement('[data-optional-section="testimonials"]');
  const grid = getElement("[data-testimonials-grid]");
  if (
    !section ||
    !grid ||
    !EVENT_CONFIG.testimonialsEnabled ||
    !EVENT_CONFIG.testimonials.length
  ) {
    if (section) section.hidden = true;
    return;
  }

  EVENT_CONFIG.testimonials.forEach((testimonial) => {
    const card = createElement("article", "testimonial-card");
    if (testimonial.photo) {
      const image = createElement("img");
      image.src = testimonial.photo;
      image.alt = `Foto de ${testimonial.name}`;
      image.width = 480;
      image.height = 600;
      image.loading = "lazy";
      card.appendChild(image);
    }
    const quote = createElement("blockquote");
    quote.textContent = testimonial.text;
    card.appendChild(quote);
    card.appendChild(createElement("h3", "", testimonial.name));
    card.appendChild(
      createElement("p", "", `${testimonial.profession} · ${testimonial.city}`),
    );
    if (isUsableUrl(testimonial.video)) {
      const link = createElement("a", "", "Assistir ao depoimento");
      link.href = testimonial.video;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      card.appendChild(link);
    }
    grid.appendChild(card);
  });

  section.hidden = false;
}

function initOptionalSections() {
  renderSpeakers();
  renderSponsors();
  renderTestimonials();
}

function updateCountdown() {
  const countdown = getElement("[data-countdown]");
  if (!countdown || !EVENT_CONFIG.countdownEnabled || !EVENT_CONFIG.countdownDate) return;

  const targetTime = new Date(EVENT_CONFIG.countdownDate).getTime();
  if (Number.isNaN(targetTime)) return;

  const remaining = Math.max(0, targetTime - Date.now());
  const days = Math.floor(remaining / 86400000);
  const hours = Math.floor((remaining % 86400000) / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);

  const values = { days, hours, minutes, seconds };
  Object.entries(values).forEach(([key, value]) => {
    const element = getElement(`[data-${key}]`, countdown);
    if (element) element.textContent = String(value).padStart(2, "0");
  });

  countdown.hidden = false;

  if (remaining > 0) {
    window.setTimeout(updateCountdown, 1000 - (Date.now() % 1000));
  }
}

function syncSeoMetadata() {
  if (!isUsableUrl(EVENT_CONFIG.officialUrl)) return;

  let canonical = getElement('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.appendChild(canonical);
  }
  canonical.href = EVENT_CONFIG.officialUrl;

  let openGraphUrl = getElement('meta[property="og:url"]');
  if (!openGraphUrl) {
    openGraphUrl = document.createElement("meta");
    openGraphUrl.setAttribute("property", "og:url");
    document.head.appendChild(openGraphUrl);
  }
  openGraphUrl.content = EVENT_CONFIG.officialUrl;
}

function buildEventJsonLd() {
  const requiredValues = [
    EVENT_CONFIG.officialUrl,
    EVENT_CONFIG.venueAddress,
    EVENT_CONFIG.venueCity,
    EVENT_CONFIG.venueState,
    EVENT_CONFIG.eventStartTime,
    EVENT_CONFIG.eventEndTime,
    EVENT_CONFIG.eventImageUrl,
    EVENT_CONFIG.regularPriceNumeric,
    EVENT_CONFIG.currency,
    EVENT_CONFIG.ticketAvailability,
  ];

  if (requiredValues.some((value) => !value)) return;
  if (!isUsableUrl(EVENT_CONFIG.officialUrl) || !isUsableUrl(EVENT_CONFIG.eventImageUrl)) return;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: EVENT_CONFIG.eventName,
    startDate: EVENT_CONFIG.eventStartTime,
    endDate: EVENT_CONFIG.eventEndTime,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    image: [EVENT_CONFIG.eventImageUrl],
    url: EVENT_CONFIG.officialUrl,
    location: {
      "@type": "Place",
      name: EVENT_CONFIG.venueName,
      address: {
        "@type": "PostalAddress",
        streetAddress: EVENT_CONFIG.venueAddress,
        addressLocality: EVENT_CONFIG.venueCity,
        addressRegion: EVENT_CONFIG.venueState,
        addressCountry: "BR",
      },
    },
    offers: {
      "@type": "Offer",
      url: EVENT_CONFIG.regularCheckoutUrl || EVENT_CONFIG.officialUrl,
      price: EVENT_CONFIG.regularPriceNumeric,
      priceCurrency: EVENT_CONFIG.currency,
      availability: EVENT_CONFIG.ticketAvailability,
      validFrom: new Date().toISOString().slice(0, 10),
    },
    organizer: {
      "@type": "Organization",
      name: EVENT_CONFIG.brandName,
      url: EVENT_CONFIG.officialUrl,
    },
  };

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(jsonLd);
  document.head.appendChild(script);
}

function validateConfig() {
  const pending = [];
  const recommended = [];

  if (!EVENT_CONFIG.regularCheckoutUrl) pending.push("regularCheckoutUrl");
  if (!EVENT_CONFIG.vipCheckoutUrl) pending.push("vipCheckoutUrl");
  if (!EVENT_CONFIG.whatsappNumber) pending.push("whatsappNumber");
  if (!EVENT_CONFIG.regularPrice) pending.push("regularPrice");
  if (!EVENT_CONFIG.vipPrice) pending.push("vipPrice");
  if (!EVENT_CONFIG.instagramUrl) recommended.push("instagramUrl");
  if (!EVENT_CONFIG.officialUrl) recommended.push("officialUrl/canonical");
  if (!EVENT_CONFIG.venueAddress) recommended.push("venueAddress");

  if (pending.length) {
    console.info(`[Next Beauty] Configurações comerciais pendentes: ${pending.join(", ")}.`);
  }

  if (recommended.length) {
    console.info(`[Next Beauty] Configurações recomendadas antes de publicar: ${recommended.join(", ")}.`);
  }

  if (EVENT_CONFIG.speakersEnabled && !EVENT_CONFIG.speakers.length) {
    console.warn("[Next Beauty] speakersEnabled está ativo, mas nenhum palestrante foi cadastrado.");
  }
  if (EVENT_CONFIG.sponsorsEnabled && !EVENT_CONFIG.sponsors.length) {
    console.warn("[Next Beauty] sponsorsEnabled está ativo, mas nenhum patrocinador foi cadastrado.");
  }
  if (EVENT_CONFIG.testimonialsEnabled && !EVENT_CONFIG.testimonials.length) {
    console.warn("[Next Beauty] testimonialsEnabled está ativo, mas nenhum depoimento foi cadastrado.");
  }
}

function syncPageContent() {
  updatePrice("regular", EVENT_CONFIG.regularPrice, EVENT_CONFIG.regularInstallments);
  updatePrice("vip", EVENT_CONFIG.vipPrice, EVENT_CONFIG.vipInstallments);
  syncContactLinks();
  syncVenue();
  loadConfiguredAssets();
  syncSeoMetadata();

  getElements("[data-current-year]").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });
}

function init() {
  syncPageContent();
  initMenu();
  initHeader();
  initAnchorScrolling();
  initCtaButtons();
  initFaq();
  initOptionalSections();
  initRevealAnimations();
  initMobileCta();
  updateCountdown();
  buildEventJsonLd();
  validateConfig();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}
