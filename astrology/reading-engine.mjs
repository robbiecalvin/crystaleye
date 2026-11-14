/** Shared, deterministic editorial readings. No transits, tracking, or birth calculation. */
import data from "./reading-data.mjs";
export const signs = data.signs;
export function localDate(now = new Date()) {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}
export function parseDate(iso) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso))
    throw new RangeError("Choose a valid edition date.");
  const date = new Date(`${iso}T12:00:00Z`);
  if (
    !Number.isFinite(date.getTime()) ||
    date.toISOString().slice(0, 10) !== iso ||
    date.getUTCFullYear() < 1900 ||
    date.getUTCFullYear() > 2199
  )
    throw new RangeError("Choose a date between 1900 and 2199.");
  return date;
}
export function dateLabel(iso) {
  return new Intl.DateTimeFormat("en-CA", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(parseDate(iso));
}
export function editionFor(iso) {
  const date = parseDate(iso);
  const lastDay = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0),
  ).getUTCDate();
  const dayNumber = Math.floor(date.getTime() / 86400000);
  const theme =
    data.themes[
      ((dayNumber % data.themes.length) + data.themes.length) %
        data.themes.length
    ];
  const sunday = date.getUTCDay() === 0;
  const first = date.getUTCDate() === 1;
  const last = date.getUTCDate() === lastDay;
  const badges = [
    sunday && "Sunday reflection",
    first && "Month-ahead preview",
    last && "Month-end growth challenge",
  ].filter(Boolean);
  return {
    iso,
    date,
    dayNumber,
    theme,
    sunday,
    first,
    last,
    badges: badges.length ? badges : ["Daily edition"],
  };
}
export function readingFor(slug, iso, role = "Sun") {
  const signIndex = signs.findIndex((s) => s.slug === slug);
  if (signIndex < 0) throw new RangeError("Choose one of the twelve signs.");
  if (!["Sun", "Moon", "Rising"].includes(role))
    throw new RangeError("Choose Sun, Moon, or Rising.");
  const sign = signs[signIndex];
  const edition = editionFor(iso);
  const entries = data.readings[slug];
  const idx =
    (((edition.dayNumber + signIndex * 7) % entries.length) + entries.length) %
    entries.length;
  const entry = entries[idx];
  const lens = {
    Sun: `For your ${sign.name} Sun, consider where this theme touches your sense of purpose and the choices you make deliberately.`,
    Moon: `For your ${sign.name} Moon, bring this theme into your inner world: what you feel, what you need, and how you offer yourself care.`,
    Rising: `For ${sign.name} rising, explore this theme in how you enter a conversation, begin something unfamiliar, or make your intentions visible.`,
  }[role];
  const parts = [lens, entry.body, edition.theme.text];
  if (edition.sunday)
    parts.push(
      `For your Sunday reflection, look back over the week: where did this pattern support you, and where did it make things harder? ${sign.sections["Reflection prompt"]} Notice one example from your own experience, then choose a small adjustment to carry into the coming week. There is no need to turn reflection into a performance of having learned everything.`,
    );
  if (edition.first) {
    const month = new Intl.DateTimeFormat("en-CA", {
      month: "long",
      timeZone: "UTC",
    }).format(edition.date);
    parts.push(
      `As ${month} begins, use “${edition.theme.title.toLowerCase()}” as a theme to explore through the month ahead. Consider where it could open a useful conversation or help you approach a familiar situation differently. Choose one intention you can revisit each week, leaving room for events to change your plans. This is a reflective preview of possibilities, not a promise about what will happen.`,
    );
  }
  if (edition.last)
    parts.push(
      `Your month-end challenge: name one thing you learned about this pattern and one way your response has changed. ${sign.sections["Growth direction"]} Write down a specific example of that growth, including any unfinished work, then choose one practical action for the next month. If progress has been quiet, let it count; the challenge is honest noticing, not proving that every experience had a lesson.`,
    );
  return {
    sign,
    role,
    teaser: entry.teaser,
    paragraph: parts.join(" "),
    edition,
  };
}
export function shortcutDate(kind, today = localDate()) {
  const date = parseDate(today);
  if (kind === "sunday")
    date.setUTCDate(date.getUTCDate() + ((7 - date.getUTCDay()) % 7));
  else if (kind === "first") date.setUTCDate(1);
  else if (kind === "last") date.setUTCMonth(date.getUTCMonth() + 1, 0);
  else if (kind !== "today") throw new RangeError("Unknown edition shortcut.");
  return date.toISOString().slice(0, 10);
}
