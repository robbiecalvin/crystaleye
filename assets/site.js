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
