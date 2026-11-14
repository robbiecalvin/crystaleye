import { calculate, localDate } from "./number-engine.mjs";
const form = document.querySelector("#mini-form");
if (form) {
  const output = document.querySelector("#mini-output");
  const initial = output.innerHTML;
  const error = document.querySelector("#mini-error");
  const submit = document.querySelector("#mini-submit");
  const date = form.elements.birthDate;
  date.max = localDate() < "2026-12-31" ? localDate() : "2026-12-31";
  submit.disabled = false;
  submit.textContent = "Show my three numbers →";
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    error.textContent = "";
    let result;
    try {
      result = calculate(form.elements.birthName.value, date.value);
    } catch (problem) {
      error.textContent = problem.message;
      output.innerHTML = initial;
      return;
    }
    const intro = document.createElement("p");
    intro.className = "eyebrow";
    intro.textContent = "Your first three · calculated in this tab";
    const grid = document.createElement("div");
    grid.className = "mini-results";
    for (const [label, key, slug, meaning] of [
      [
        "Personality",
        "personality",
        "personality",
        "A lens on outward impression",
      ],
      ["Life Path", "life", "life-path", "A theme for development"],
      ["Destiny", "destiny", "destiny", "The app’s contribution lens"],
    ]) {
      const article = document.createElement("article");
      article.className = "mini-result";
      const heading = document.createElement("h3");
      heading.textContent = label;
      const value = document.createElement("strong");
      value.textContent = result[key] === 0 ? "—" : String(result[key]);
      const description = document.createElement("p");
      description.textContent =
        result[key] === 0
          ? "No counted consonants; this guide has no Personality 0 profile."
          : meaning;
      const link = document.createElement("a");
      link.href =
        result[key] === 0
          ? `${slug}/#calculation`
          : `${slug}/number-${result[key]}/`;
      link.textContent =
        result[key] === 0 ? "Read the method →" : "Explore this result →";
      article.append(heading, value, description, link);
      grid.append(article);
    }
    const note = document.createElement("p");
    note.className = "fine-print";
    note.textContent =
      "Destiny uses the same Personality + Soul’s Desire rule as the full calculator. The Expression guide uses an all-letter method; master totals can differ.";
    const details = document.createElement("details");
    details.className = "mini-details";
    const summary = document.createElement("summary");
    summary.textContent = "See how these were calculated";
    const list = document.createElement("ul");
    const items = [
      ...result.words.map(
        (word) =>
          `${word.word}: consonants ${word.consonants} → ${word.personalityPart}; vowels ${word.vowels} → ${word.soulPart}.`,
      ),
      `Personality: add the reduced consonant parts, then reduce → ${result.personality}.`,
      `Life Path: month ${result.components[0]} + day ${result.components[1]} + year ${result.components[2]}, then reduce → ${result.life}.`,
      `App Destiny: Personality ${result.personality} + Soul’s Desire ${result.soul}, then reduce → ${result.destiny}.`,
      `Completed guide’s all-letter Expression method → ${result.guideExpression}${result.guideExpression !== result.destiny ? " (different from the app’s Destiny convention)" : ""}.`,
    ];
    for (const text of items) {
      const item = document.createElement("li");
      item.textContent = text;
      list.append(item);
    }
    details.append(summary, list);
    output.replaceChildren(intro, grid, note, details);
  });
  form.addEventListener("reset", () => {
    error.textContent = "";
    output.innerHTML = initial;
  });
}
const controls = document.querySelector("#topic-controls");
if (controls) {
  controls.hidden = false;
  const search = document.querySelector("#topic-search");
  const buttons = [...document.querySelectorAll("[data-group-filter]")];
  const topics = [...document.querySelectorAll(".topic-card")];
  let group = "All";
  const normalize = (value) =>
    value
      .normalize("NFKD")
      .replace(/[\u0300-\u036f’']/g, "")
      .toLowerCase();
  const update = () => {
    const terms = normalize(search.value).trim().split(/\s+/).filter(Boolean);
    let count = 0;
    for (const topic of topics) {
      topic.hidden =
        !(group === "All" || topic.dataset.group === group) ||
        !terms.every((term) =>
          normalize(topic.dataset.search + " " + topic.dataset.group).includes(
            term,
          ),
        );
      if (!topic.hidden) count++;
    }
    buttons.forEach((button) =>
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.groupFilter === group),
      ),
    );
    document.querySelector("#topic-count").textContent =
      `${count} ${count === 1 ? "topic" : "topics"}`;
    document.querySelector("#topic-empty").hidden = count !== 0;
  };
  buttons.forEach((button) =>
    button.addEventListener("click", () => {
      group = button.dataset.groupFilter;
      update();
    }),
  );
  search.addEventListener("input", update);
}
