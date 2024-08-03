import type { Denops } from "jsr:@denops/std@^7.0.2";
import * as vimOptions from "jsr:@denops/std@^7.0.2/option";
import { is } from "jsr:@core/unknownutil@^4.0.0";
import * as logger from "./logger.ts";
import { isEmptyObject } from "./util.ts";

export type OptionsAsNonExpandtab = { expandtab: false };
export type OptionsAsExpandtab = {
  expandtab: true;
  shiftwidth: Awaited<ReturnType<typeof vimOptions.shiftwidth["get"]>>;
};
export type OptionsAsEmpty = Record<string | number | symbol, never>;
export type Options =
  | OptionsAsNonExpandtab
  | OptionsAsExpandtab
  | OptionsAsEmpty;

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

export function isOptions(maybeOptions: unknown): maybeOptions is Options {
  if (!is.Record(maybeOptions)) {
    return false;
  }

  if (isEmptyObject(maybeOptions)) {
    return true;
  }

  if ("expandtab" in maybeOptions) {
    if (maybeOptions.expandtab === true) {
      return "shiftwidth" in maybeOptions && is.Number(maybeOptions.shiftwidth);
    } else if (maybeOptions.expandtab === false) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}
