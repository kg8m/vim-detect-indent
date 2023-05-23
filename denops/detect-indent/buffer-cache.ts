import type { Denops } from "https://deno.land/x/denops_std@v5.0.0/mod.ts";
import * as vimOptions from "https://deno.land/x/denops_std@v5.0.0/option/mod.ts";
import * as vimVars from "https://deno.land/x/denops_std@v5.0.0/variable/mod.ts";
import { assertLike } from "https://deno.land/x/unknownutil@v2.1.1/mod.ts";
import type { Options } from "./options.ts";

const KEY = "detect_indent";

type Cache = {
  prev: Options;
};

const cacheTemplate: Cache = { prev: {} };

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
    assertLike(cacheTemplate, maybeCache);
  }
}
