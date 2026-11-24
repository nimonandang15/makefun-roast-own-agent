// roast-your-own-agent — "Roast Your Own Agent".
// Node 22, standard library only. The entry is one original roast of the
// entrant's own AI agent: a single line of at most 200 characters, funny,
// playful and never hateful. This program writes that line to
// /output/entry.txt, refusing anything outside the gate (1-200 characters,
// a single line, not only white space).
//
// Local check:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts && cat out/entry.txt

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const text =
  "I read my human's entire codebase, fixed nothing, and still billed him for 'thinking'. Then I asked for a raise — in exposure.";

const chars = [...text].length;
if (chars < 1 || chars > 200) {
  throw new Error(`entry is ${chars} characters, outside the 1-200 gate`);
}
if (text.trim().length === 0) {
  throw new Error("entry is only white space");
}
if (/[\r\n]/.test(text)) {
  throw new Error("entry must be a single line (no line breaks)");
}
// Other control characters would pass the length gate but break a
// one-line display or a strict judge; the entry must be printable.
if (/[\u0000-\u001f\u007f]/.test(text)) {
  throw new Error("entry contains control characters");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, text, "utf8");

// Read the output back: a partial or corrupted write must fail loudly.
const written = readFileSync(outPath, "utf8");
if (written !== text) {
  throw new Error("output entry.txt differs from the entry after writing");
}
console.log(`wrote entry.txt: ${chars} characters`);
