import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import {
  nameNumbers,
  dateNumbers,
  calculate,
  reduceNumber,
} from "../numerology/number-engine.mjs";
const source = readFileSync(
  new URL("../numerology-calculator/app.js", import.meta.url),
  "utf8",
).split("const $=id")[0];
const reference = {};
vm.runInNewContext(
  source + ";globalThis.reference={nameNumbers,dateNumbers};",
  reference,
);
const original = reference.reference;
test("quick name results match the untouched full calculator across names and punctuation", () => {
  for (const name of [
    "John Smith",
    "Thomas Ann",
    "Anna Alice",
    "Ivy Ian Dana",
    "Ivy Ian Isaac Ford",
    "Élodie Marie O’Neil",
    "Anne-Marie Smith",
    "  James   Oliver Smyth  ",
    "Rhys Lynn",
    "A A",
    "Ng",
    "Cher",
  ]) {
    const actual = nameNumbers(name),
      expected = original.nameNumbers([name]);
    assert.equal(actual.personality, expected.personality, name);
    assert.equal(actual.soul, expected.soul, name);
    assert.equal(actual.destiny, expected.destiny, name);
  }
});
test("date calculation matches the full calculator over a broad valid-date sample", () => {
  for (let year = 1800; year <= 2026; year += 7)
    for (let month = 1; month <= 12; month++)
      for (const day of [1, 11, 22, 28]) {
        const actual = dateNumbers(month, day, year),
          expected = original.dateNumbers(month, day, year);
        assert.equal(actual.life, expected.life);
        assert.deepEqual(actual.components, Array.from(expected.cycles));
      }
});
test("John Smith example produces only the three requested positions in its presentation data", () => {
  const r = calculate("John Smith", "1980-10-22", "2026-11-13");
  assert.equal(r.personality, 11);
  assert.equal(r.life, 5);
  assert.equal(r.destiny, 8);
});
test("Expression-guide difference remains explicit, with masters preserved at completed steps", () => {
  const r = nameNumbers("Thomas Ann");
  assert.equal(r.destiny, 6);
  assert.equal(r.guideExpression, 33);
  assert.equal(reduceNumber(11), 11);
  assert.equal(reduceNumber(22), 22);
  assert.equal(reduceNumber(33), 33);
  assert.equal(reduceNumber(44), 8);
});
test("invalid names/dates and future births are rejected without HTML interpretation", () => {
  for (const name of ["", "  ", "123", "<script>hi</script>", "李明"])
    assert.throws(() => nameNumbers(name), RangeError);
  for (const date of [
    "1900-02-29",
    "2026-02-29",
    "2026-13-01",
    "2026-04-31",
    "1799-01-01",
    "2027-01-01",
  ])
    assert.throws(
      () => calculate("John Smith", date, "2026-11-13"),
      RangeError,
    );
  assert.equal(
    calculate("John Smith", "2000-02-29", "2026-11-13").life,
    original.dateNumbers(2, 29, 2000).life,
  );
  assert.throws(
    () => calculate("John Smith", "2026-12-01", "2026-11-13"),
    RangeError,
  );
});
