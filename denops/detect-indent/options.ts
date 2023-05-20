import type { Denops } from "https://deno.land/x/denops_std@v4.3.3/mod.ts";
import * as vimOptions from "https://deno.land/x/denops_std@v4.3.3/option/mod.ts";
import * as logger from "./logger.ts";
import { isEmptyObject } from "./util.ts";

export type Options =
  | { expandtab: false }
  | {
    expandtab: true;
    shiftwidth: Awaited<ReturnType<typeof vimOptions.shiftwidth["get"]>>;
  }
  | Record<never, never>;

export async function set(denops: Denops, options: Options): Promise<void> {
  if (isEmptyObject(options)) {
    return;
  }

  let reallyChanged = false;
  const changes = [];

  if ("expandtab" in options && options.expandtab != null) {
    changes.push(`${options.expandtab ? "" : "no"}expandtab`);
    const currentExpandtab = await vimOptions.expandtab.getLocal(denops);

    if (!!options.expandtab !== !!currentExpandtab) {
      reallyChanged = true;
      await vimOptions.expandtab.setLocal(denops, options.expandtab);
    }
  }

  if ("shiftwidth" in options && options.shiftwidth != null) {
    changes.push(`shiftwidth=${options.shiftwidth}`);
    const currentShiftwidth = await vimOptions.shiftwidth.getLocal(denops);

    if (options.shiftwidth !== currentShiftwidth) {
      reallyChanged = true;
      await vimOptions.shiftwidth.setLocal(denops, options.shiftwidth);
    }
  }

  if (reallyChanged) {
    await logger.info(denops, ...["Executed:", "setlocal", ...changes]);
  }
}
