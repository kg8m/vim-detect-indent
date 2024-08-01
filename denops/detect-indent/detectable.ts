import type { Denops } from "jsr:@denops/std@7.0.1";
import { collect } from "jsr:@denops/std@7.0.1/batch";
import * as vimOptions from "jsr:@denops/std@7.0.1/option";
import * as vimVars from "jsr:@denops/std@7.0.1/variable";
import type { Predicate } from "jsr:@core/unknownutil@3.18.1";
import { assert, is } from "jsr:@core/unknownutil@3.18.1";
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
