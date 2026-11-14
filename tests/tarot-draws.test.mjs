import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import {
  cards,
  SessionJournal,
  STORAGE_KEY,
  chooseCards,
  secureRandomInt,
  interpret,
  validDate,
} from "../tarot/draw-engine.mjs";
function memoryStorage(initial = null) {
  const values = new Map(initial ? [[STORAGE_KEY, initial]] : []);
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
}
test("the complete deck has 22 majors and 14 cards per suit, with usable artwork and meanings", () => {
  assert.equal(cards.length, 78);
  assert.equal(new Set(cards.map((c) => c.id)).size, 78);
  assert.equal(cards.filter((c) => c.arcana === "major").length, 22);
  for (const suit of ["swords", "cups", "pentacles", "wands"])
    assert.equal(cards.filter((c) => c.suit === suit).length, 14);
  for (const card of cards) {
    assert.ok(
      existsSync(
        new URL(`../assets/images/tarot/${card.id}.webp`, import.meta.url),
      ),
    );
    assert.ok(["easy", "mixed", "hard"].includes(card.tone));
    for (const key of ["energy", "lesson", "gratitude"])
      assert.ok(card[key].length > 35);
  }
});
test("every card can be selected and spreads never repeat a card", () => {
  for (let i = 0; i < 78; i++)
    assert.equal(chooseCards(1, () => i)[0], cards[i].id);
  for (let i = 0; i < 200; i++) {
    const ids = chooseCards(3);
    assert.equal(new Set(ids).size, 3);
  }
  assert.equal(new Set(chooseCards(78, () => 0)).size, 78);
  assert.throws(() => chooseCards(3, () => 78), RangeError);
});
test("secure selection rejects out-of-range words without modulo bias", () => {
  const words = [0xffffffff, 15];
  let calls = 0;
  assert.equal(
    secureRandomInt(78, () => {
      calls++;
      return words.shift();
    }),
    15,
  );
  assert.equal(calls, 2);
  assert.throws(() => secureRandomInt(0), RangeError);
  assert.throws(() => secureRandomInt(78, () => -1), RangeError);
});
test("reloads keep the same daily card, including a draw saved before its animation completes", () => {
  const storage = memoryStorage();
  const session = new SessionJournal(storage);
  const record = session.draw("free", "2026-11-13", () => 12);
  const restored = new SessionJournal(storage).draw(
    "free",
    "2026-11-13",
    () => {
      throw new Error("No reroll allowed");
    },
  );
  assert.deepEqual(restored, record);
  record.ids[0] = "not-a-card";
  assert.notEqual(session.get("free", "2026-11-13").ids[0], "not-a-card");
});
test("free and three-card previews are independent once per date, then a new date allows a new draw", () => {
  const journal = new SessionJournal(memoryStorage());
  journal.draw("free", "2026-11-13", () => 0);
  const spread = journal.draw("spread", "2026-11-13", (max) => max - 1);
  assert.equal(new Set(spread.ids).size, 3);
  assert.equal(journal.records("2026-11-13").length, 2);
  assert.deepEqual(
    journal.draw("spread", "2026-11-13", () => {
      throw Error("Reroll");
    }),
    spread,
  );
  assert.equal(journal.draw("free", "2026-11-14", () => 1).date, "2026-11-14");
  assert.equal(journal.records("2026-11-14").length, 3);
});
test("blocked storage still preserves draws for the open page", () => {
  for (const storage of [
    {
      getItem() {
        throw Error("blocked");
      },
      setItem() {},
    },
    {
      getItem() {
        return null;
      },
      setItem() {
        throw Error("quota");
      },
    },
  ]) {
    const journal = new SessionJournal(storage);
    const first = journal.draw("free", "2026-11-13", () => 5);
    assert.equal(journal.persistent, false);
    assert.deepEqual(
      journal.draw("free", "2026-11-13", () => {
        throw Error("Reroll");
      }),
      first,
    );
  }
});
test("malformed, future, duplicate, and stale journal records are rejected", () => {
  const bad = {
    version: 1,
    draws: [
      { date: "2026-11-13", kind: "free", ids: ["<script>"] },
      { date: "2026-11-14", kind: "free", ids: [cards[0].id] },
      { date: "2026-09-01", kind: "free", ids: [cards[0].id] },
      {
        date: "2026-11-13",
        kind: "spread",
        ids: [cards[0].id, cards[0].id, cards[1].id],
      },
    ],
  };
  assert.deepEqual(
    new SessionJournal(memoryStorage(JSON.stringify(bad))).records(
      "2026-11-13",
    ),
    [],
  );
  assert.deepEqual(
    new SessionJournal(memoryStorage("{broken")).records("2026-11-13"),
    [],
  );
  assert.equal(validDate("2028-02-29"), true);
  assert.equal(validDate("2026-02-29"), false);
});
test("history is capped to 30 calendar dates and interpretation respects all three positions", () => {
  const journal = new SessionJournal(memoryStorage());
  for (let day = 1; day <= 31; day++)
    for (const kind of ["free", "spread"])
      journal.draw(kind, `2026-10-${String(day).padStart(2, "0")}`, () => 0);
  assert.equal(journal.records("2026-10-31").length, 60);
  assert.equal(journal.get("free", "2026-10-31").date, "2026-10-31");
  const readings = interpret(journal.get("spread", "2026-10-31"));
  assert.match(readings[0].text, /Look back at yesterday/);
  assert.match(readings[1].text, /Meet today/);
  assert.match(readings[2].text, /gratitude practice/);
  assert.throws(
    () => interpret({ kind: "free", date: "2026-11-13", ids: ["bad"] }),
    RangeError,
  );
});
