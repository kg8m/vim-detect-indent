// Use denops' test() instead of built-in Deno.test()
import { test } from "https://deno.land/x/denops_core@v3.0.2/test/mod.ts";
import {
  assertEquals,
  assertRejects,
} from "https://deno.land/std@0.146.0/testing/asserts.ts";
import type { Denops } from "https://deno.land/x/denops_std@v3.3.2/mod.ts";
import * as vimOptions from "https://deno.land/x/denops_std@v3.3.2/option/mod.ts";
import * as vimVars from "https://deno.land/x/denops_std@v3.3.2/variable/mod.ts";
import * as bufferCache from "../../../denops/detect-indent/buffer-cache.ts";

test({
  mode: "all",
  name: "bufferCache.get() returns `b:detect_indent` value",
  async fn(denops: Denops) {
    assertEquals(await bufferCache.get(denops), null);

    const cache = { prev: { expandtab: true, shiftwidth: 2 } };
    await vimVars.b.set(denops, "detect_indent", cache);

    assertEquals(await bufferCache.get(denops), cache);
  },
});

test({
  mode: "all",
  name:
    "bufferCache.get() throws an error if `b:detect_indent` value is invalid",
  async fn(denops: Denops) {
    const cache = { expandtab: true, shiftwidth: 2 };
    await vimVars.b.set(denops, "detect_indent", cache);

    await assertRejects(() => bufferCache.get(denops));
  },
});

test({
  mode: "all",
  name: "bufferCache.set() sets current options as `b:detect_indent`",
  async fn(denops: Denops) {
    const expandtab = await vimOptions.expandtab.getLocal(denops);
    const shiftwidth = await vimOptions.shiftwidth.getLocal(denops);
    const cache = { prev: { expandtab, shiftwidth } };

    assertEquals(await vimVars.b.get(denops, "detect_indent"), null);

    await bufferCache.set(denops);

    assertEquals(await vimVars.b.get(denops, "detect_indent"), cache);
  },
});
