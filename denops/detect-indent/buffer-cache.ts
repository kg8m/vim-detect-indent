import type { Denops } from "https://deno.land/x/denops_std@v6.0.1/mod.ts";
import * as vimOptions from "https://deno.land/x/denops_std@v6.0.1/option/mod.ts";
import * as vimVars from "https://deno.land/x/denops_std@v6.0.1/variable/mod.ts";
import { assert, is } from "https://deno.land/x/unknownutil@v3.15.0/mod.ts";
import type { Options } from "./options.ts";
import { isOptions } from "./options.ts";

const KEY = "detect_indent";

export type Cache = {
  prev: Options;
};

export async function get(denops: Denops): Promise<Cache | null> {
  const cache = await vimVars.b.get(denops, KEY);
  assertCacheOrNull(cache);
  return cache;
}

export async function set(denops: Denops): Promise<void> {
  const expandtab = await vimOptions.expandtab.getLocal(denops);
  const shiftwidth = await vimOptions.shiftwidth.getLocal(denops);
  const cache: Cache = { prev: { expandtab, shiftwidth } };

  await vimVars.b.set(denops, KEY, cache);
}

function assertCacheOrNull(
  maybeCache: unknown,
): asserts maybeCache is Cache | null {
  if (maybeCache !== null) {
    assert(maybeCache, isCache);
  }
}

export function isCache(maybeCache: unknown): maybeCache is Cache {
  if (!is.Record(maybeCache)) {
    return false;
  }

  if ("prev" in maybeCache) {
    return isOptions(maybeCache.prev);
  }

  return false;
}
