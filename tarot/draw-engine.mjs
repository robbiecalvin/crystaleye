import cards from "./card-data.mjs";
export { cards };
export const STORAGE_KEY = "crystaleye.tarot.session.v1";
const byId = new Map(cards.map((card) => [card.id, card]));
export const toneLabels = {
  easy: "An easier-day theme",
  mixed: "A mixed-day theme",
  hard: "A more demanding-day theme",
};
export function localDate(now = new Date()) {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}
export function validDate(iso) {
  if (typeof iso !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
  const date = new Date(`${iso}T12:00:00Z`);
  return (
    Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === iso
  );
}
export function dateLabel(iso) {
  if (!validDate(iso)) throw new RangeError("Invalid draw date.");
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T12:00:00Z`));
}
export function secureRandomInt(
  max,
  source = () => globalThis.crypto.getRandomValues(new Uint32Array(1))[0],
) {
  if (!Number.isInteger(max) || max < 1 || max > 0x100000000)
    throw new RangeError("Invalid random range.");
  // Rejection sampling avoids modulo bias in the card selection.
  const limit = Math.floor(0x100000000 / max) * max;
  for (let attempt = 0; attempt < 1000; attempt++) {
    const value = source();
    if (!Number.isInteger(value) || value < 0 || value >= 0x100000000)
      throw new RangeError("Invalid random source.");
    if (value < limit) return value % max;
  }
  throw new Error("Could not obtain a random card. Please try again.");
}
export function chooseCards(count, randomInt = secureRandomInt) {
  if (!Number.isInteger(count) || count < 1 || count > cards.length)
    throw new RangeError("Invalid card count.");
  const pool = cards.map((card) => card.id);
  for (let i = 0; i < count; i++) {
    const offset = randomInt(pool.length - i);
    if (!Number.isInteger(offset) || offset < 0 || offset >= pool.length - i)
      throw new RangeError("Invalid random selection.");
    const j = i + offset;
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}
function normalize(records, today) {
  if (!Array.isArray(records)) return [];
  const oldest = new Date(`${today}T12:00:00Z`);
  oldest.setUTCDate(oldest.getUTCDate() - 29);
  const cutoff = oldest.toISOString().slice(0, 10);
  const keys = new Set();
  return records
    .filter((record) => {
      if (
        !record ||
        !validDate(record.date) ||
        record.date < cutoff ||
        record.date > today ||
        !["free", "spread"].includes(record.kind) ||
        !Array.isArray(record.ids)
      )
        return false;
      if (
        record.ids.length !== (record.kind === "free" ? 1 : 3) ||
        new Set(record.ids).size !== record.ids.length ||
        !record.ids.every((id) => byId.has(id))
      )
        return false;
      const key = record.date + record.kind;
      if (keys.has(key)) return false;
      keys.add(key);
      return true;
    })
    .map((record) => ({
      date: record.date,
      kind: record.kind,
      ids: [...record.ids],
    }))
    .sort(
      (a, b) => b.date.localeCompare(a.date) || a.kind.localeCompare(b.kind),
    )
    .slice(0, 60);
}
export class SessionJournal {
  constructor(storage = null) {
    this.storage = storage;
    this.persistent = !!storage;
    this.memory = [];
  }
  records(today = localDate()) {
    if (!validDate(today)) throw new RangeError("Invalid draw date.");
    if (this.storage) {
      let raw;
      try {
        raw = this.storage.getItem(STORAGE_KEY);
      } catch {
        this.storage = null;
        this.persistent = false;
      }
      if (this.storage) {
        try {
          const state = raw ? JSON.parse(raw) : { version: 1, draws: [] };
          this.memory =
            state.version === 1 ? normalize(state.draws, today) : [];
        } catch {
          this.memory = [];
        }
      }
    }
    this.memory = normalize(this.memory, today);
    return this.memory.map((record) => ({ ...record, ids: [...record.ids] }));
  }
  get(kind, today = localDate()) {
    return (
      this.records(today).find(
        (record) => record.date === today && record.kind === kind,
      ) || null
    );
  }
  draw(kind, today = localDate(), randomInt = secureRandomInt) {
    if (!["free", "spread"].includes(kind) || !validDate(today))
      throw new RangeError("Invalid draw request.");
    const records = this.records(today);
    const existing = records.find(
      (record) => record.date === today && record.kind === kind,
    );
    if (existing) return { ...existing, ids: [...existing.ids] };
    const record = {
      date: today,
      kind,
      ids: chooseCards(kind === "free" ? 1 : 3, randomInt),
    };
    this.memory = normalize([record, ...records], today);
    if (this.storage) {
      try {
        this.storage.setItem(
          STORAGE_KEY,
          JSON.stringify({ version: 1, draws: this.memory }),
        );
      } catch {
        this.storage = null;
        this.persistent = false;
      }
    }
    return { ...record, ids: [...record.ids] };
  }
}
export function interpret(record) {
  if (
    !record ||
    !["free", "spread"].includes(record.kind) ||
    !validDate(record.date) ||
    !Array.isArray(record.ids) ||
    record.ids.length !== (record.kind === "free" ? 1 : 3) ||
    new Set(record.ids).size !== record.ids.length ||
    !record.ids.every((id) => byId.has(id))
  )
    throw new RangeError("Invalid saved draw.");
  const selected = record.ids.map((id) => byId.get(id));
  if (record.kind === "free") {
    const card = selected[0];
    const approach = {
      easy: "Let the easier theme be an invitation to notice what supports you and give one good thing your attention.",
      mixed:
        "Choose the part you can influence, and leave room to adapt if the day changes shape.",
      hard: "Allow more breathing room, share the load where you can, and choose a manageable response instead of demanding a flawless day.",
    }[card.tone];
    return [
      {
        card,
        title: toneLabels[card.tone],
        text: `${card.energy} ${approach} This is a symbolic daily prompt, not a promise about how the day will unfold.`,
      },
    ];
  }
  return selected.map((card, index) => ({
    card,
    title: [
      "Yesterday · A lesson to keep",
      "Today · Where your energy belongs",
      "Tomorrow · A possibility to welcome",
    ][index],
    text: [
      `Look back at yesterday through ${card.name}. ${card.lesson} Write down one example you can learn from without judging yourself for not having known it sooner.`,
      `Meet today through ${card.name}. ${card.energy} Choose one realistic action that gives this focus a place in your actual day.`,
      `Look toward tomorrow through ${card.name}. ${card.gratitude} Name one possibility you can appreciate or help cultivate; this is a gratitude practice, not a guarantee that a particular event is coming.`,
    ][index],
  }));
}
