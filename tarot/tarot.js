import {
  SessionJournal,
  localDate,
  dateLabel,
  interpret,
} from "./draw-engine.mjs";
const freeButton = document.querySelector("#free-draw");
if (freeButton) {
  let storage = null;
  try {
    storage = window.sessionStorage;
  } catch {
    /* In-memory draws still work if storage is blocked. */
  }
  const journal = new SessionJournal(storage);
  const spreadButton = document.querySelector("#spread-draw");
  const freeWidget = document.querySelector("#free-widget");
  const spreadWidget = document.querySelector("#spread-widget");
  const storageNotice = document.querySelector("#storage-notice");
  let today = localDate();
  let busy = { free: false, spread: false };
  let generation = 0;
  function notice() {
    storageNotice.textContent = journal.persistent
      ? "Your journal stays in this tab’s session. No tracking cookie, account, or server log is created."
      : "Session storage is unavailable. Draws stay in memory while this page remains open; refreshing or closing it may clear them.";
  }
  function history() {
    const list = document.querySelector("#draw-history");
    const records = journal.records(today);
    const rows = records.map((record) => {
      const li = document.createElement("li");
      const names = interpret(record)
        .map((reading) => reading.card.name)
        .join(" · ");
      li.textContent = `${dateLabel(record.date)} — ${record.kind === "free" ? "Daily card" : "Three-card preview"}: ${names}`;
      return li;
    });
    if (!rows.length) {
      const li = document.createElement("li");
      li.textContent =
        "No draws yet. Your first card is a good place to begin.";
      rows.push(li);
    }
    list.replaceChildren(...rows);
    notice();
  }
  function slotsFor(kind) {
    return [
      ...(kind === "free" ? freeWidget : spreadWidget).querySelectorAll(
        ".card-slot",
      ),
    ];
  }
  function render(kind, record, revealed = true) {
    const readings = interpret(record);
    slotsFor(kind).forEach((slot, i) => {
      const image = slot.querySelector("[data-front]");
      image.src = `../assets/images/tarot/${readings[i].card.id}.webp`;
      image.alt = `${readings[i].card.name}, upright tarot card`;
      slot.classList.toggle("is-revealed", revealed);
      slot
        .querySelector(".card-front")
        .setAttribute("aria-hidden", String(!revealed));
      slot
        .querySelector(".card-back")
        .setAttribute("aria-hidden", String(revealed));
      slot.querySelector("[data-card-name]").textContent = revealed
        ? readings[i].card.name
        : "Your card is being revealed";
    });
    if (!revealed) return;
    if (kind === "free") {
      const reading = readings[0];
      const result = document.querySelector("#free-result");
      const badge = document.createElement("span");
      badge.className = "day-tone";
      badge.dataset.tone = reading.card.tone;
      badge.textContent = reading.title;
      const heading = document.createElement("h3");
      heading.textContent = reading.card.name;
      const text = document.createElement("p");
      text.textContent = reading.text;
      const keys = document.createElement("p");
      keys.className = "fine-print";
      keys.textContent = reading.card.keywords;
      result.replaceChildren(badge, heading, text, keys);
    } else {
      readings.forEach((reading, i) => {
        const heading = document.createElement("h3");
        heading.textContent = reading.title;
        const text = document.createElement("p");
        text.textContent = reading.text;
        spreadWidget
          .querySelector(`[data-reading="${i}"]`)
          .replaceChildren(heading, text);
      });
    }
    const button = kind === "free" ? freeButton : spreadButton;
    button.disabled = true;
    button.textContent =
      kind === "free" ? "Today’s card is saved" : "Today’s preview is saved";
    document.querySelector(`#${kind}-status`).textContent =
      `Saved for ${dateLabel(record.date)} in this tab’s session.`;
    history();
  }
  const initialFree = document.querySelector("#free-result").innerHTML;
  const initialSpread = [
    ...spreadWidget.querySelectorAll("[data-reading]"),
  ].map((el) => el.innerHTML);
  function resetDay() {
    today = localDate();
    generation++;
    busy = { free: false, spread: false };
    document.querySelector("[data-today]").textContent =
      `${dateLabel(today)} · your local date`;
    for (const kind of ["free", "spread"]) {
      const record = journal.get(kind, today);
      slotsFor(kind).forEach((slot) => {
        slot.classList.remove("is-animating", "is-revealed");
        slot.querySelector("[data-card-name]").textContent =
          "Waiting for your draw";
        slot.querySelector(".card-front").setAttribute("aria-hidden", "true");
        slot.querySelector(".card-back").setAttribute("aria-hidden", "false");
      });
      if (record) render(kind, record);
      else {
        const button = kind === "free" ? freeButton : spreadButton;
        button.disabled = false;
        button.textContent =
          kind === "free"
            ? "Reveal today’s card →"
            : "Try a three-card preview →";
        document.querySelector(`#${kind}-status`).textContent = "";
        if (kind === "free")
          document.querySelector("#free-result").innerHTML = initialFree;
        else
          spreadWidget
            .querySelectorAll("[data-reading]")
            .forEach((el, i) => (el.innerHTML = initialSpread[i]));
      }
    }
    history();
  }
  async function reveal(kind) {
    if (today !== localDate()) resetDay();
    if (busy[kind]) return;
    const button = kind === "free" ? freeButton : spreadButton;
    const status = document.querySelector(`#${kind}-status`);
    const token = generation;
    busy[kind] = true;
    button.disabled = true;
    let record;
    try {
      // Save before animation: a refresh in the middle must restore the same card(s).
      record = journal.draw(kind, today);
      render(kind, record, false);
      history();
      status.textContent =
        "Shuffling, dealing, and turning your card" +
        (kind === "spread" ? "s…" : "…");
      const slots = slotsFor(kind);
      await Promise.all(
        slots.map((slot) =>
          slot
            .querySelector("[data-front]")
            .decode()
            .catch(() => {}),
        ),
      );
      if (token !== generation) return;
      if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
        slots.forEach((slot) => slot.classList.add("is-animating"));
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
      if (token !== generation) return;
      slots.forEach((slot) => slot.classList.remove("is-animating"));
      render(kind, record);
    } catch (error) {
      if (token !== generation) return;
      status.textContent =
        "The draw could not be shown. Please try again; any saved card will be kept.";
      button.disabled = false;
      button.textContent = "Try revealing again →";
    } finally {
      if (token === generation) busy[kind] = false;
    }
  }
  freeButton.addEventListener("click", () => reveal("free"));
  spreadButton.addEventListener("click", () => reveal("spread"));
  setInterval(() => {
    if (today !== localDate()) resetDay();
  }, 30000);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && today !== localDate()) resetDay();
  });
  resetDay();
}
