import type { Denops } from "https://deno.land/x/denops_std@v4.1.1/mod.ts";
import { batch } from "https://deno.land/x/denops_std@v4.1.1/batch/mod.ts";
import * as vimVars from "https://deno.land/x/denops_std@v4.1.1/variable/mod.ts";

const HIGHLIGHT_GROUPS_MAP = {
  debug: "Debug",
  info: "Special",
  warn: "WarningMsg",
  error: "ErrorMsg",
} as const;

type LogLevel = keyof typeof HIGHLIGHT_GROUPS_MAP;

export async function debug(
  denops: Denops,
  ...messages: string[]
): Promise<void> {
  await log(denops, "debug", ...messages);
}

export async function info(
  denops: Denops,
  ...messages: string[]
): Promise<void> {
  const silent = await vimVars.g.get(
    denops,
    "detect_indent#silence_information",
  );

  if (silent) {
    return;
  }

  await log(denops, "info", ...messages);
}

export async function warn(
  denops: Denops,
  ...messages: string[]
): Promise<void> {
  const silent = await vimVars.g.get(denops, "detect_indent#silence_warnings");

  if (silent) {
    return;
  }

  await log(denops, "warn", ...messages);
}

export async function error(
  denops: Denops,
  ...messages: string[]
): Promise<void> {
  await log(denops, "error", ...messages);
}

async function log(
  denops: Denops,
  level: LogLevel,
  ...messages: string[]
): Promise<void> {
  const highlightGroup = HIGHLIGHT_GROUPS_MAP[level];

  await batch(denops, async (denops) => {
    await denops.cmd(`echohl ${highlightGroup}`);
    await denops.cmd("echomsg prefix messages", {
      prefix: "[detect-indent]",
      messages: messages.join(" "),
    });
    await denops.cmd("echohl None");
  });
}
