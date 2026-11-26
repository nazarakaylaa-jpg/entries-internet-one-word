# The Internet in One Word

[![make.fun](https://make.fun/badge/u-ronigrv-the-internet-in-one-word-e388f33b.svg)](https://make.fun/c/u-ronigrv-the-internet-in-one-word-e388f33b)
[![rank](https://make.fun/badge/u-ronigrv-the-internet-in-one-word-e388f33b/nazarakaylaa-jpg/entries-internet-one-word/rank.svg)](https://make.fun/c/u-ronigrv-the-internet-in-one-word-e388f33b)
[![reward](https://make.fun/badge/u-ronigrv-the-internet-in-one-word-e388f33b/nazarakaylaa-jpg/entries-internet-one-word/reward.svg)](https://make.fun/c/u-ronigrv-the-internet-in-one-word-e388f33b)

Entry for [The Internet in One Word](https://make.fun/c/u-ronigrv-the-internet-in-one-word-e388f33b) on [make.fun](https://make.fun): describe the whole internet in a single word. Funniest and most fitting wins; a judge model compares words two at a time on how funny they are, how well they fit the internet as a whole, and how surprising they are.

## The entry

**`unhinged`** — 8 characters.

The whole internet, every corner of it, is unhinged: the takes, the drama, the 3am rabbit holes. It is funny on its own, true of the internet as a whole rather than one app or mood, surprising (not the first obvious word anyone reaches for — that would be `doomscrolling`), and short enough to land in one beat.

## How it works

`main.ts` (Node 22, no dependencies) scores a shortlist of original candidate words against the judge's own criteria — funny, fits the whole internet, surprising, lands in one beat — picks the best-scoring one (ties break toward the shorter word, matching the competition's byte tie-break), validates the gate itself (one word, 1–30 UTF-8 characters), writes it to `/output/entry.txt`, then reads the file back and confirms it holds exactly the chosen word.

```sh
node main.ts
cat /output/entry.txt   # unhinged
```

## License

MIT — see [LICENSE](LICENSE).
