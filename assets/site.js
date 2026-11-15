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

// Repair older/missing navigation without making JavaScript a requirement.
(() => {
  const script = document.currentScript;
  if (!script?.src) return;
  const base = new URL("../", script.src);
  const stylesheetURL = new URL("assets/mobile-toolbar.css?v=3", base).href;
  let stylesheet = document.querySelector('link[href*="mobile-toolbar.css"]');
  if (!stylesheet) { stylesheet = document.createElement("link"); stylesheet.rel = "stylesheet"; document.head.append(stylesheet); }
  if (stylesheet.href !== stylesheetURL) stylesheet.href = stylesheetURL;
  let toolbar = document.querySelector(".mobile-toolbar");
  const entries = [
    ["Home", "index.html", ""],
    ["Astrology", "astrology/index.html", '<path d="m12 2 2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4Z"/>'],
    ["Tarot", "tarot/index.html", '<rect x="5" y="3" width="14" height="19" rx="2"/><path d="m12 8 3 4-3 4-3-4Z"/>'],
    ["Numerology", "numerology/index.html", '<path d="M9 3 6 21M18 3l-3 18M3 9h18M2 15h18"/>'],
    ["Shop", "merchandise/index.html", '<path d="M5 7h14l1 14H4L5 7Z"/><path d="M8 8V6a4 4 0 0 1 8 0v2"/>']
  ];
  const existing = [...(toolbar?.querySelectorAll("a") ?? [])];
  if (existing.length === entries.length && existing.every((link,i)=>link.href===new URL(entries[i][1],base).href)) return;
  if (!toolbar) { toolbar=document.createElement("nav");toolbar.className="mobile-toolbar";toolbar.setAttribute("aria-label","Explore Crystaleye");document.body.append(toolbar); }
  toolbar.replaceChildren(...entries.map(([label,path,icon])=>{
    const link=document.createElement("a");link.href=new URL(path,base).href;
    const current=label==='Home' ? [base.pathname,new URL('index.html',base).pathname].includes(location.pathname) : location.pathname.startsWith(new URL(path.replace('index.html',''),base).pathname)
      || (label==='Shop'&&location.pathname.startsWith(new URL('shop/',base).pathname))
      || (label==='Numerology'&&location.pathname.startsWith(new URL('numerology-calculator/',base).pathname));
    if(current)link.setAttribute('aria-current','true');
    link.className=label==='Home'?'mobile-home':'mobile-destination';
    if(label==='Home') { link.setAttribute('aria-label','Crystal Eye home');link.title='Crystal Eye home';link.innerHTML=`<img class="toolbar-logo" src="${new URL('assets/images/site-logo.webp',base).href}" alt="" width="32" height="32"><span class="visually-hidden">Home</span>`; }
    else link.innerHTML=`<svg viewBox="0 0 24 24" aria-hidden="true">${icon}</svg><span>${label}</span>`;
    return link;
  }));
})();
