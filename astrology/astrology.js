import {
  signs,
  localDate,
  dateLabel,
  editionFor,
  readingFor,
  shortcutDate,
} from "./reading-engine.mjs";

let today = localDate();
function renderDaily() {
  today = localDate();
  const edition = editionFor(today);
  for (const element of document.querySelectorAll("[data-teaser]")) {
    element.textContent = readingFor(element.dataset.teaser, today).teaser;
  }
  const label = document.querySelector("#daily-date");
  if (label)
    label.textContent = `${dateLabel(today)} · your local date · ${edition.theme.title}`;
}
renderDaily();
// Keep open tabs accurate across midnight without changing a visitor's chosen preview date.
setInterval(() => {
  if (today !== localDate()) renderDaily();
}, 60000);
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) renderDaily();
});

const filters = document.querySelector("#element-filters");
if (filters) {
  filters.hidden = false;
  const buttons = [...filters.querySelectorAll("button")];
  for (const button of buttons)
    button.addEventListener("click", () => {
      const selection = button.dataset.elementFilter;
      let visible = 0;
      for (const card of document.querySelectorAll(".zodiac-card")) {
        card.hidden = selection !== "all" && card.dataset.element !== selection;
        if (!card.hidden) visible++;
      }
      buttons.forEach((item) =>
        item.setAttribute("aria-pressed", String(item === button)),
      );
      document.querySelector("#sign-count").textContent =
        selection === "all" ? "All 12 signs" : `${visible} ${selection} signs`;
    });
}
const form = document.querySelector("#preview-form");
if (form) {
  const dateInput = document.querySelector("#preview-date");
  const output = document.querySelector("#preview-readings");
  const signParam = new URLSearchParams(location.search).get("sun");
  if (signs.some((sign) => sign.slug === signParam))
    form.elements.sun.value = signParam;
  dateInput.value = today;
  form.hidden = false;
  function renderPreview() {
    if (!form.reportValidity()) return;
    let edition;
    try {
      edition = editionFor(dateInput.value);
    } catch (error) {
      dateInput.setCustomValidity(error.message);
      dateInput.reportValidity();
      return;
    }
    dateInput.setCustomValidity("");
    const paragraphs = [];
    for (const role of ["Sun", "Moon", "Rising"]) {
      const reading = readingFor(
        form.elements[role.toLowerCase()].value,
        dateInput.value,
        role,
      );
      const article = document.createElement("article");
      article.className = "email-paragraph";
      const heading = document.createElement("p");
      heading.className = "eyebrow";
      heading.textContent = `${role} · ${reading.sign.name}`;
      const text = document.createElement("p");
      text.textContent = reading.paragraph;
      article.append(heading, text);
      paragraphs.push(article);
    }
    output.replaceChildren(...paragraphs);
    document.querySelector("#preview-status").textContent =
      `${dateLabel(dateInput.value)} · on-page email preview`;
    document.querySelector("#preview-theme").textContent =
      edition.theme.title + ".";
    const badges = edition.badges.map((label) => {
      const badge = document.createElement("span");
      badge.textContent = label;
      return badge;
    });
    document.querySelector("#preview-badges").replaceChildren(...badges);
  }
  dateInput.addEventListener("input", () => dateInput.setCustomValidity(""));
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    renderPreview();
  });
  for (const button of document.querySelectorAll("[data-edition]"))
    button.addEventListener("click", () => {
      dateInput.value = shortcutDate(button.dataset.edition);
      dateInput.setCustomValidity("");
      renderPreview();
    });
  renderPreview();
}
