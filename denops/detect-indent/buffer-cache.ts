import type { Denops } from "jsr:@denops/std@^7.0.2";
import * as vimOptions from "jsr:@denops/std@^7.0.2/option";
import * as vimVars from "jsr:@denops/std@^7.0.2/variable";
import { assert, is } from "jsr:@core/unknownutil@^4.0.0";
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
