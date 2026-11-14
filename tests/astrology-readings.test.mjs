import test from "node:test";
import assert from "node:assert/strict";
import {
  signs,
  editionFor,
  readingFor,
  shortcutDate,
} from "../astrology/reading-engine.mjs";

test("all twelve signs have consistent teaser/detail and three placement lenses", () => {
  assert.equal(signs.length, 12);
  for (const sign of signs) {
    const sun = readingFor(sign.slug, "2026-11-13", "Sun");
    for (const role of ["Moon", "Rising"]) {
      const reading = readingFor(sign.slug, "2026-11-13", role);
      assert.equal(reading.teaser, sun.teaser);
      assert.notEqual(reading.paragraph, sun.paragraph);
      assert.ok(reading.paragraph.includes(reading.edition.theme.text));
    }
    assert.ok(sun.paragraph.length > 300);
  }
});

test("Sunday adds reflection to each sign without removing the daily reading", () => {
  for (const sign of signs) {
    const reading = readingFor(sign.slug, "2026-11-15");
    assert.equal(reading.edition.sunday, true);
    assert.ok(reading.paragraph.includes("look back over the week"));
    assert.ok(reading.paragraph.includes(sign.sections["Reflection prompt"]));
  }
});

test("Sunday plus month opening combines both editions", () => {
  const reading = readingFor("aries", "2026-02-01");
  assert.deepEqual(reading.edition.badges, [
    "Sunday reflection",
    "Month-ahead preview",
  ]);
  assert.ok(reading.paragraph.includes("As February begins"));
  assert.ok(reading.paragraph.includes("look back over the week"));
});

test("Sunday plus month closing combines reflection and growth", () => {
  const reading = readingFor("pisces", "2026-05-31", "Moon");
  assert.deepEqual(reading.edition.badges, [
    "Sunday reflection",
    "Month-end growth challenge",
  ]);
  assert.ok(reading.paragraph.includes("month-end challenge"));
  assert.ok(reading.paragraph.includes("look back over the week"));
});

test("month-end logic handles leap years and every month length", () => {
  assert.equal(editionFor("2028-02-29").last, true);
  assert.equal(editionFor("2028-02-28").last, false);
  assert.equal(editionFor("2027-02-28").last, true);
  assert.equal(editionFor("2026-04-30").last, true);
  assert.equal(editionFor("2026-12-31").last, true);
  for (const invalid of [
    "2026-02-29",
    "2026-11-31",
    "nope",
    "2026-1-01",
    "2200-01-01",
  ])
    assert.throws(() => editionFor(invalid), RangeError);
});

test("preview shortcuts use actual dates and cross year boundaries", () => {
  assert.equal(shortcutDate("sunday", "2026-12-31"), "2027-01-03");
  assert.equal(shortcutDate("sunday", "2026-11-15"), "2026-11-15");
  assert.equal(shortcutDate("first", "2026-11-13"), "2026-11-01");
  assert.equal(shortcutDate("last", "2028-02-03"), "2028-02-29");
});

test("editorial theme changes across dates and invalid signs are rejected", () => {
  assert.notEqual(
    readingFor("leo", "2026-11-13").paragraph,
    readingFor("leo", "2026-11-14").paragraph,
  );
  assert.throws(() => readingFor("nonsense", "2026-11-13"), RangeError);
  assert.throws(() => readingFor("aries", "2026-11-13", "Planet"), RangeError);
});
