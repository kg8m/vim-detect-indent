import type { Denops } from "https://deno.land/x/denops_std@v3.6.0/mod.ts";
import * as vimOptions from "https://deno.land/x/denops_std@v3.6.0/option/mod.ts";
import { batch } from "https://deno.land/x/denops_std@v3.6.0/batch/mod.ts";
import * as logger from "./logger.ts";
import { isEmptyObject } from "./util.ts";

export type Options = {
  expandtab: false;
} | {
  expandtab: true;
  shiftwidth: Awaited<ReturnType<typeof vimOptions.shiftwidth["get"]>>;
} | Record<never, never>;

export async function set(denops: Denops, options: Options): Promise<void> {
  if (isEmptyObject(options)) {
    return;
  }

  const executionMessage = ["Executed:", "setlocal"];

  await batch(denops, async (denops) => {
    if ("expandtab" in options && options.expandtab != null) {
      await vimOptions.expandtab.setLocal(denops, options.expandtab);
      executionMessage.push(
        `${options.expandtab ? "" : "no"}expandtab`,
      );
    }

    if ("shiftwidth" in options && options.shiftwidth != null) {
      await vimOptions.shiftwidth.setLocal(denops, options.shiftwidth);
      executionMessage.push(`shiftwidth=${options.shiftwidth}`);
    }
  });

  await logger.info(denops, ...executionMessage);
}
