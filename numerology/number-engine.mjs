/** The quick calculator follows the established app; it does not modify that app. */
export function reduceNumber(n) {
  if (!Number.isSafeInteger(n) || n < 0)
    throw new RangeError("A whole nonnegative number is required.");
  while (n > 9 && ![11, 22, 33].includes(n))
    n = String(n)
      .split("")
      .reduce((sum, digit) => sum + Number(digit), 0);
  return n;
}
const valueOf = (letter) => ((letter.charCodeAt(0) - 65) % 9) + 1;
export function normalizeName(name) {
  if (typeof name !== "string" || name.length > 240)
    throw new RangeError("Use a name of no more than 240 characters.");
  const words = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .trim()
    .split(/\s+/)
    .map((word) => word.replace(/['’\-]/g, ""))
    .filter(Boolean);
  if (!words.length || words.some((word) => !/^[A-Z]+$/.test(word)))
    throw new RangeError(
      "Enter your birth name using A–Z letters. Accented Latin letters, spaces, apostrophes, and hyphens are supported.",
    );
  return words;
}
export function nameNumbers(name) {
  const words = normalizeName(name).map((word) => {
    let consonants = 0,
      vowels = 0;
    for (const letter of word)
      if ("AEIOU".includes(letter)) vowels += valueOf(letter);
      else consonants += valueOf(letter);
    return {
      word,
      consonants,
      vowels,
      personalityPart: reduceNumber(consonants),
      soulPart: reduceNumber(vowels),
      expressionPart: reduceNumber(consonants + vowels),
    };
  });
  const personality = reduceNumber(
    words.reduce((sum, word) => sum + word.personalityPart, 0),
  );
  const soul = reduceNumber(
    words.reduce((sum, word) => sum + word.soulPart, 0),
  );
  return {
    personality,
    soul,
    destiny: reduceNumber(personality + soul),
    guideExpression: reduceNumber(
      words.reduce((sum, word) => sum + word.expressionPart, 0),
    ),
    words,
  };
}
export function dateNumbers(month, day, year) {
  const test = new Date(Date.UTC(year, month - 1, day));
  if (
    ![month, day, year].every(Number.isInteger) ||
    year < 1800 ||
    year > 2026 ||
    test.getUTCFullYear() !== year ||
    test.getUTCMonth() !== month - 1 ||
    test.getUTCDate() !== day
  )
    throw new RangeError(
      "Choose a valid birth date in the supported years 1800–2026.",
    );
  const components = [month, day, year].map(reduceNumber);
  return {
    components,
    life: reduceNumber(components.reduce((sum, value) => sum + value, 0)),
  };
}
export function localDate(now = new Date()) {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}
export function calculate(name, iso, today = localDate()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso || ""))
    throw new RangeError("Choose a complete birth date.");
  const [year, month, day] = iso.split("-").map(Number);
  const dates = dateNumbers(month, day, year);
  if (iso > today)
    throw new RangeError("Your birth date cannot be in the future.");
  return {
    ...nameNumbers(name),
    life: dates.life,
    components: dates.components,
  };
}
