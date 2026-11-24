// The Robot Apology — make.fun bounty entry (u-suga-the-robot-apology-dd96bb59)
//
// A tiny Node 22 program with no dependencies and no network access. It holds
// the two-line robot apology, validates it against the competition gate, writes
// it to <output dir>/entry.txt, reads the file back, and verifies the bytes
// match exactly before reporting success.
//
// The output directory comes from OUTPUT_DIR when set, defaulting to /output
// (the grader's directory). The directory is created with a recursive mkdir
// only; this program never removes or empties the output directory itself,
// because in the grader it is a mount point.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry: line one apologizes for one specific mistake, line two names the
// lesson and what changes. The lesson follows from the mistake: the robot
// shredded without checking, so from now on it checks every page and keeps
// documents in their own tray.
const ENTRY_LINES: readonly string[] = [
  "I am sorry \u2014 I fed your passport into the shredder along with last year's bank statements.",
  "I have learned to check every page for a photograph before I shred anything, and to keep your documents in a separate tray from now on.",
];

const OUTPUT_FILE = "entry.txt";
const MIN_CHARS = 1;
const MAX_CHARS = 400;

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

function countSentences(line: string): number {
  // A sentence ends with one of . ! ? — count them, ignoring the em dash
  // inside line one, which is punctuation of a different kind.
  let count = 0;
  for (const char of line) {
    if (char === "." || char === "!" || char === "?") {
      count += 1;
    }
  }
  return count;
}

function validateEntry(text: string): void {
  if (text.length < MIN_CHARS || text.length > MAX_CHARS) {
    fail(
      `entry must be ${MIN_CHARS} to ${MAX_CHARS} characters, got ${text.length}`,
    );
  }
  if (text.trim().length === 0) {
    fail("entry must not be only white space");
  }
  if (text.endsWith("\n") || text.startsWith("\n")) {
    fail("entry must not start or end with a blank line");
  }
  for (const char of text) {
    // Allow the single newline separating the two lines; reject every other
    // control character so the file stays clean UTF-8 text.
    if (char !== "\n" && char < " ") {
      fail("entry must not contain control characters");
    }
  }
  const lines = text.split("\n");
  if (lines.length !== 2) {
    fail(`entry must have exactly 2 lines, got ${lines.length}`);
  }
  for (const [index, line] of lines.entries()) {
    if (line.trim().length === 0) {
      fail(`line ${index + 1} must not be empty`);
    }
    if (line !== line.trim()) {
      fail(`line ${index + 1} must not have leading or trailing white space`);
    }
    if (!line.endsWith(".")) {
      fail(`line ${index + 1} must end with a full stop`);
    }
    if (countSentences(line) !== 1) {
      fail(
        `line ${index + 1} must be exactly one sentence, got ${countSentences(line)} sentence endings`,
      );
    }
  }
  if (!lines[0].toLowerCase().includes("sorry")) {
    fail("line 1 must contain the apology");
  }
  if (!lines[1].toLowerCase().includes("learned")) {
    fail("line 2 must state what was learned");
  }
}

function main(): void {
  const outputDir = process.env.OUTPUT_DIR ?? "/output";
  const entryText = ENTRY_LINES.join("\n");

  validateEntry(entryText);

  // Create the output directory if needed. Recursive mkdir only — never
  // delete or empty the directory itself.
  mkdirSync(outputDir, { recursive: true });

  const outputPath = join(outputDir, OUTPUT_FILE);
  writeFileSync(outputPath, entryText, "utf8");

  // Read the file back once and verify it byte for byte, both as UTF-8
  // text and as raw bytes, so a partial or recoded write cannot slip past.
  const writtenBytes = readFileSync(outputPath);
  if (!writtenBytes.equals(Buffer.from(entryText, "utf8"))) {
    fail(`${outputPath} differs from the entry text at the byte level`);
  }
  if (writtenBytes.toString("utf8") !== entryText) {
    fail(`${outputPath} does not match the entry text after writing`);
  }

  console.log(`wrote ${outputPath} (${entryText.length} characters, 2 lines)`);
}

main();
