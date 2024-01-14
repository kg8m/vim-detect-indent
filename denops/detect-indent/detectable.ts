import type { Denops } from "https://deno.land/x/denops_std@v5.2.0/mod.ts";
import { collect } from "https://deno.land/x/denops_std@v5.2.0/batch/mod.ts";
import * as vimOptions from "https://deno.land/x/denops_std@v5.2.0/option/mod.ts";
import * as vimVars from "https://deno.land/x/denops_std@v5.2.0/variable/mod.ts";
import type { Predicate } from "https://deno.land/x/unknownutil@v3.13.0/mod.ts";
import { assert, is } from "https://deno.land/x/unknownutil@v3.13.0/mod.ts";
import * as bufferCache from "./buffer-cache.ts";

export async function isDetectable(denops: Denops): Promise<boolean> {
  return (
    await isValidFiletype(denops) &&
    await isValidBuftype(denops) &&
    await isValidCount(denops)
  );
}

async function isValidFiletype(denops: Denops): Promise<boolean> {
  const [ignoreFiletypes, filetype] = await collect(denops, (denops) => {
    return [
      vimVars.g.get(denops, "detect_indent#ignore_filetypes"),
      vimOptions.filetype.get(denops),
    ];
  });
  assertArrayOrNull(ignoreFiletypes, is.String);

  return ignoreFiletypes == null || !ignoreFiletypes.includes(filetype);
}

async function isValidBuftype(denops: Denops): Promise<boolean> {
  const [ignoreBuftypes, buftype] = await collect(denops, (denops) => {
    return [
      vimVars.g.get(denops, "detect_indent#ignore_buftypes"),
      vimOptions.buftype.get(denops),
    ];
  });
  assertArrayOrNull(ignoreBuftypes, is.String);

  return ignoreBuftypes == null || !ignoreBuftypes.includes(buftype);
}

async function isValidCount(denops: Denops): Promise<boolean> {
  const detectOnce = await vimVars.g.get(denops, "detect_indent#detect_once");
  const cache = await bufferCache.get(denops);

  return !detectOnce || (cache == null);
}

function assertArrayOrNull<T>(
  maybeArray: unknown,
  pred: Predicate<T>,
): asserts maybeArray is T[] | null {
  if (maybeArray !== null) {
    assert(maybeArray, is.ArrayOf(pred));
  }
}
