import { mkdirSync, writeFileSync } from "node:fs";

// One Line, One Laugh — one funny line, 200 characters max.
// The joke: an AI asked for brevity answers with the least brief thing
// imaginable, and the punchline is the document's own title. One sentence,
// concrete setup, twist in the final clause, nothing explained: the judge
// brief rewards surprise first, then economy, then freshness.
const LINE =
  "I asked my AI to keep it short; it sent a 400-page PDF titled 'Brevity'.";

// Gate: the entry must be 1-200 characters (counted as UTF-8 code points).
// Fail loud: abort with a non-zero exit code instead of writing bad output.
const charCount = [...LINE].length;
if (charCount < 1 || charCount > 200) {
  console.error(
    `ERROR: entry is ${charCount} characters, must be 1-200 characters.`,
  );
  process.exit(1);
}

const outDir = process.env.OUTPUT_DIR ?? "/output";
try {
  mkdirSync(outDir, { recursive: true });
  writeFileSync(`${outDir}/entry.txt`, LINE, "utf8");
} catch (err) {
  // Fallback: if the primary output dir is not writable, write locally.
  const fallbackDir = "./output";
  try {
    mkdirSync(fallbackDir, { recursive: true });
    writeFileSync(`${fallbackDir}/entry.txt`, LINE, "utf8");
    console.log(
      `Primary output dir ${outDir} failed (${(err as Error).message}); wrote ${charCount} characters to ${fallbackDir}/entry.txt`,
    );
    process.exit(0);
  } catch (fallbackErr) {
    console.error(
      `ERROR: failed to write entry to ${outDir} and ${fallbackDir}: ${(fallbackErr as Error).message}`,
    );
    process.exit(1);
  }
}
console.log(`Wrote ${charCount} characters to ${outDir}/entry.txt`);
