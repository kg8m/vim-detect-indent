import type { Denops } from "https://deno.land/x/denops_std@v4.0.0/mod.ts";
import * as bufferCache from "./buffer-cache.ts";
import * as options from "./options.ts";
import * as logger from "./logger.ts";

export async function restore(denops: Denops): Promise<void> {
  const cache = await bufferCache.get(denops);

  if (cache == null) {
    await logger.warn(denops, "Indentation previously not detected/set yet.");
  } else {
    await bufferCache.set(denops);
    await options.set(denops, cache.prev);
  }
}
