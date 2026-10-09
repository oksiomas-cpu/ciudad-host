import {
  ACTIONS4, QUESTION_ORDER4, QUESTIONS4, CATS4, TARGETS4,
  answerKey4, fullAnswer4,
} from "../src/game4Data.js";
import { readFileSync } from "node:fs";

let failed = 0;
function check(label, ok, detail = "") {
  if (ok) console.log(`  ✅ ${label}`);
  else {
    failed += 1;
    console.error(`  ❌ ${label}${detail ? ` · ${detail}` : ""}`);
  }
}
function distance(a, b) {
  let n = 0;
  for (let i = 0; i < a.length; i += 1) if (a[i] !== b[i]) n += 1;
  return n;
}
function minPairDistance(keys) {
  let min = Infinity;
  for (let i = 0; i < keys.length; i += 1) {
    for (let j = i + 1; j < keys.length; j += 1) min = Math.min(min, distance(keys[i], keys[j]));
  }
  return min;
}

console.log("\n📕 Игра №4 · проверка пульта ведущей\n");
check("7 действий · 3 оператора · 21 вопрос",
  ACTIONS4.length === 7 && CATS4.length === 3 && QUESTIONS4.length === 21 && QUESTION_ORDER4.length === 21);
check("15 предметов и полные ключи",
  TARGETS4.length === 15 &&
  TARGETS4.every((item) => QUESTION_ORDER4.every((id) => ["sí", "no"].includes(item.answers[id]) && ["sí", "no"].includes(item.fantAns[id]))));

const canonKeys = TARGETS4.map((item) => answerKey4(item, "canon"));
const fantasyKeys = TARGETS4.map((item) => answerKey4(item, "fantasy"));
check("Canon уникальны", new Set(canonKeys).size === 15);
check("Fantasía уникальны и не совпадают с Canon",
  new Set(fantasyKeys).size === 15 && fantasyKeys.every((key) => !canonKeys.includes(key)));
check("минимумы матрицы сохранены",
  minPairDistance(canonKeys) === 3 &&
  minPairDistance(fantasyKeys) === 3 &&
  Math.min(...fantasyKeys.flatMap((f) => canonKeys.map((c) => distance(f, c)))) === 2);
const ownDiffs = TARGETS4.map((item, i) => distance(canonKeys[i], fantasyKeys[i]));
check("каждое искажение Fantasía — на 5–6 ответов (v2)",
  ownDiffs.every((n) => n === 5 || n === 6), ownDiffs.join(","));
check("полные ответы банка доступны",
  QUESTION_ORDER4.every((id) => fullAnswer4(id, "sí").startsWith("Sí,") && fullAnswer4(id, "no").startsWith("No,")));

const host = readFileSync(new URL("../src/HostConsole.jsx", import.meta.url), "utf8");
const api = readFileSync(new URL("../api/game.js", import.meta.url), "utf8");
check("cap4 зарегистрирован в PACKS и меню ведущей",
  host.includes('id: "cap4"') && host.includes("card(PACKS.cap4"));
check("API принимает cap4 и сохраняет Главу 4",
  api.includes('"cap4"') && api.includes('cap4: "Глава 4"'));

if (failed) {
  console.error(`\n🔴 Провалов: ${failed}\n`);
  process.exit(1);
}
console.log("\n🟢 Пульт ведущей и API готовы к cap4.\n");
