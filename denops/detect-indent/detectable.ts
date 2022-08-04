import type { Denops } from "https://deno.land/x/denops_std@v3.7.1/mod.ts";
import { gather } from "https://deno.land/x/denops_std@v3.7.1/batch/mod.ts";
import * as vimOptions from "https://deno.land/x/denops_std@v3.7.1/option/mod.ts";
import * as vimVars from "https://deno.land/x/denops_std@v3.7.1/variable/mod.ts";
import {
  assertArray,
  assertString,
} from "https://deno.land/x/unknownutil@v2.0.0/mod.ts";
import * as bufferCache from "./buffer-cache.ts";

export async function isDetectable(denops: Denops): Promise<boolean> {
  return (
    await isValidFiletype(denops) &&
    await isValidBuftype(denops) &&
    await isValidCount(denops)
  );
}

async function isValidFiletype(denops: Denops): Promise<boolean> {
  const [ignoreFiletypes, filetype] = await gather(denops, async (denops) => {
    await vimVars.g.get(denops, "detect_indent#ignore_filetypes");
    await vimOptions.filetype.get(denops);
  });
  assertArrayOrNull<string>(ignoreFiletypes);
  assertString(filetype);

  return ignoreFiletypes == null || !ignoreFiletypes.includes(filetype);
}

async function isValidBuftype(denops: Denops): Promise<boolean> {
  const [ignoreBuftypes, buftype] = await gather(denops, async (denops) => {
    await vimVars.g.get(denops, "detect_indent#ignore_buftypes");
    await vimOptions.buftype.get(denops);
  });
  assertArrayOrNull<string>(ignoreBuftypes);
  assertString(buftype);

  return ignoreBuftypes == null || !ignoreBuftypes.includes(buftype);
}

async function isValidCount(denops: Denops): Promise<boolean> {
  const detectOnce = await vimVars.g.get(denops, "detect_indent#detect_once");
  const cache = await bufferCache.get(denops);

  return !detectOnce || (cache == null);
}

function assertArrayOrNull<T>(
  maybeArray: unknown,
): asserts maybeArray is T[] | null {
  if (maybeArray !== null) {
    assertArray<T>(maybeArray);
  }
}
