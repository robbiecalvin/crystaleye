"use strict";

document.documentElement.classList.add("js");

const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#site-nav");

if (menuButton && navigation) {
  const closeMenu = () => {
    menuButton.setAttribute("aria-expanded", "false");
    navigation.classList.remove("is-open");
  };
  menuButton.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(open));
    navigation.classList.toggle("is-open", open);
  });
  navigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      menuButton.getAttribute("aria-expanded") === "true"
    ) {
      closeMenu();
      menuButton.focus();
    }
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".site-header")) closeMenu();
  });
  window.matchMedia("(min-width: 761px)").addEventListener("change", closeMenu);
}

const search = document.querySelector("#guide-search");
const filterButtons = [...document.querySelectorAll("[data-filter]")];
const guides = [...document.querySelectorAll(".guide-row")];
const count = document.querySelector("#guide-count");
const empty = document.querySelector("#empty-search");
let activeFilter = "all";

if (search && count && empty) {
  document.querySelectorAll("[data-enhanced-controls]").forEach((control) => {
    control.hidden = false;
  });
  const normalize = (value) =>
    value
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[’']/g, "")
      .toLowerCase();
  const updateGuides = () => {
    const terms = normalize(search.value).trim().split(/\s+/).filter(Boolean);
    let visible = 0;
    guides.forEach((guide) => {
      const matchesCategory =
        activeFilter === "all" || guide.dataset.category === activeFilter;
      const searchable = normalize(
        guide.dataset.search +
          " " +
          guide.querySelector(".guide-info").textContent,
      );
      const matchesSearch = terms.every((term) => searchable.includes(term));
      guide.hidden = !(matchesCategory && matchesSearch);
      if (!guide.hidden) visible += 1;
    });
    filterButtons.forEach((button) =>
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.filter === activeFilter),
      ),
    );
    count.textContent = `${visible} ${visible === 1 ? "guide" : "guides"}`;
    empty.hidden = visible !== 0;
  };
  search.addEventListener("input", updateGuides);
  filterButtons.forEach((button) =>
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter;
      updateGuides();
    }),
  );
  document.querySelector("#clear-search").addEventListener("click", () => {
    search.value = "";
    activeFilter = "all";
    updateGuides();
    search.focus();
  });
}

// Repair navigation on a legacy page that loads this shared script without a current toolbar.
(() => {
  const script = document.currentScript;
  if (!script?.src) return;
  const base = new URL("../", script.src);
  const stylesheetURL = new URL("assets/mobile-toolbar.css?v=2", base).href;
  let stylesheet = document.querySelector('link[href*="mobile-toolbar.css"]');
  if (!stylesheet) {
    stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    document.head.append(stylesheet);
  }
  if (stylesheet.href !== stylesheetURL) stylesheet.href = stylesheetURL;
  let toolbar = document.querySelector(".mobile-toolbar");
  const expectedDestinations = [
    "astrology",
    "tarot",
    "numerology",
    "merchandise",
  ].map((directory) => new URL(`${directory}/index.html`, base).href);
  const currentLinks = [...(toolbar?.querySelectorAll("a") ?? [])];
  if (
    currentLinks.length === 4 &&
    currentLinks.every((link, i) => link.href === expectedDestinations[i])
  )
    return;
  if (!toolbar) {
    toolbar = document.createElement("nav");
    toolbar.className = "mobile-toolbar";
    toolbar.setAttribute("aria-label", "Explore Crystaleye");
    document.body.append(toolbar);
  }
  const links = [
    [
      "Astrology",
      "astrology",
      '<path d="m12 2 2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4Z"/>',
    ],
    [
      "Tarot",
      "tarot",
      '<rect x="5" y="3" width="14" height="19" rx="2"/><path d="m12 8 3 4-3 4-3-4Z"/>',
    ],
    [
      "Numerology",
      "numerology",
      '<path d="M9 3 6 21M18 3l-3 18M3 9h18M2 15h18"/>',
    ],
    [
      "Shop",
      "merchandise",
      '<path d="M5 7h14l1 14H4L5 7Z"/><path d="M8 8V6a4 4 0 0 1 8 0v2"/>',
    ],
  ].map(([label, directory, icon]) => {
    const link = document.createElement("a");
    link.href = new URL(`${directory}/index.html`, base).href;
    const current =
      location.pathname.startsWith(new URL(`${directory}/`, base).pathname) ||
      (directory === "merchandise" &&
        location.pathname.startsWith(new URL("shop/", base).pathname)) ||
      (directory === "numerology" &&
        location.pathname.startsWith(
          new URL("numerology-calculator/", base).pathname,
        ));
    if (current) link.setAttribute("aria-current", "true");
    link.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${icon}</svg><span>${label}</span>`;
    return link;
  });
  toolbar.replaceChildren(...links);
})();
