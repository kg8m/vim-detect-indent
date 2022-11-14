import type { Denops } from "https://deno.land/x/denops_std@v3.9.1/mod.ts";
import * as vimFuncs from "https://deno.land/x/denops_std@v3.9.1/function/mod.ts";
import { ensureNumber } from "https://deno.land/x/unknownutil@v2.1.0/mod.ts";
import type { Options } from "./options.ts";
import * as logger from "./logger.ts";
import { isEmptyObject } from "./util.ts";

const MIN_BUFLINE = 1;
const MAX_BUFLINE = 1000;
const INDENTATION_PATTERN = /^(\s*)/;

type Counts = {
  diffs: { [diff: number]: number };
  indentedLines: number;
  tabLines: number;
};

export async function calculate(denops: Denops): Promise<Options> {
  const lines = await vimFuncs.getline(denops, MIN_BUFLINE, MAX_BUFLINE);
  const counts: Counts = { diffs: {}, indentedLines: 0, tabLines: 0 };

  let prevIndentationWidth = 0;

  for (const line of lines) {
    if (line.length === 0) {
      continue;
    }

    const currentIndentationWidth = await indentationWidth(denops, line);

    countIndentedLines(counts, currentIndentationWidth);
    countTabLines(counts, line);
    countDiffs(counts, currentIndentationWidth, prevIndentationWidth);

    prevIndentationWidth = currentIndentationWidth;
  }

  if (isEmptyObject(counts.diffs)) {
    await logger.warn(denops, "Failed to detect indentation.");
    return {};
  }

  if (counts.tabLines >= counts.indentedLines / 2) {
    return { expandtab: false };
  } else {
    return { expandtab: true, shiftwidth: maxDiff(counts) };
  }
}

async function indentationWidth(denops: Denops, line: string): Promise<number> {
  // TODO: fix denops-std's definition (https://github.com/vim-denops/deno-denops-std/issues/44)
  return ensureNumber(
    await vimFuncs.strdisplaywidth(denops, indentation(line)),
  );
}

function indentation(line: string): string {
  const match = line.match(INDENTATION_PATTERN);

  if (match == null) {
    throw new Error(`Invalid line: ${line.toString()}`);
  }

  return match[1];
}

function countIndentedLines(counts: Counts, indentationWidth: number): void {
  if (indentationWidth > 0) {
    counts.indentedLines++;
  }
}

function countTabLines(counts: Counts, line: string): void {
  if (line.startsWith("\t")) {
    counts.tabLines++;
  }
}

function countDiffs(
  counts: Counts,
  currentIndentationWidth: number,
  prevIndentationWidth: number,
): void {
  const diff = currentIndentationWidth - prevIndentationWidth;

  if (diff > 0) {
    if (counts.diffs[diff] == null) {
      counts.diffs[diff] = 0;
    }

    counts.diffs[diff]++;
  }
}

function maxDiff(counts: Counts): number {
  const max = { diff: 0, count: 0 };

  for (const diff in counts.diffs) {
    const count = counts.diffs[diff];

    if (count > max.count) {
      max.diff = Number(diff);
      max.count = count;
    }
  }

  return max.diff;
}
