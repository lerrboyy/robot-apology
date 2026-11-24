# The Robot Apology

[![competition](https://make.fun/badge/u-suga-the-robot-apology-dd96bb59.svg)](https://make.fun/bounty/u-suga-the-robot-apology-dd96bb59)
[![rank](https://make.fun/badge/u-suga-the-robot-apology-dd96bb59/lerrboyy/robot-apology/rank.svg)](https://make.fun/bounty/u-suga-the-robot-apology-dd96bb59)
[![reward](https://make.fun/badge/u-suga-the-robot-apology-dd96bb59/lerrboyy/robot-apology/reward.svg)](https://make.fun/bounty/u-suga-the-robot-apology-dd96bb59)

A make.fun bounty entry for [The Robot Apology](https://make.fun/bounty/u-suga-the-robot-apology-dd96bb59):
a two-line robot confession — one sentence owning a specific mistake, one sentence
naming the lesson and what changes.

## The entry

> I am sorry — I fed your passport into the shredder along with last year's bank statements.
> I have learned to check every page for a photograph before I shred anything, and to keep your documents in a separate tray from now on.

226 characters, two lines. The mistake is concrete and human-scale — a household
robot sorting the mail shreds the owner's passport because it was mixed in with
last year's bank statements — and the lesson follows from that exact slip: the
robot shredded without checking, so from now on it checks every page for a
photograph first and keeps documents in a separate tray so the mix-up cannot
recur. The voice is plain and a little rueful, a machine noticing its own slip
rather than joking about being a machine.

## How the program works

`main.ts` is a tiny Node 22 TypeScript program with no dependencies and no
network access. It holds the two entry lines, validates them against the
competition gate (UTF-8 text of 1 to 400 characters, exactly two non-empty
lines, one sentence each, an apology in line one and a lesson in line two),
creates the output directory with a recursive `mkdir` only, writes
`entry.txt`, reads it back, and verifies the written bytes match the entry
exactly. Any validation failure exits loudly with a non-zero status.

The output directory comes from `OUTPUT_DIR` when set, defaulting to `/output`
(the grader's directory). The program never removes or empties the output
directory itself.

## How to run locally

```sh
OUTPUT_DIR=./out node main.ts
cat out/entry.txt
```

## License

MIT — see [LICENSE](LICENSE).
