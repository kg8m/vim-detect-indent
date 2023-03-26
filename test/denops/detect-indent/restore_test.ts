// Use denops' test() instead of built-in Deno.test()
import { test } from "https://deno.land/x/denops_test@v1.1.0/mod.ts";
import {
  assertEquals,
  assertMatch,
} from "https://deno.land/std@0.181.0/testing/asserts.ts";
import type { Denops } from "https://deno.land/x/denops_std@v4.1.0/mod.ts";
import * as vimFuncs from "https://deno.land/x/denops_std@v4.1.0/function/mod.ts";
import * as vimOptions from "https://deno.land/x/denops_std@v4.1.0/option/mod.ts";
import { assertString } from "https://deno.land/x/unknownutil@v2.1.0/mod.ts";
import * as bufferCache from "../../../denops/detect-indent/buffer-cache.ts";
import { restore } from "../../../denops/detect-indent/restore.ts";

test({
  mode: "all",
  name:
    "restore() sets a buffer cache and restores previous indentation options",
  async fn(denops: Denops) {
    await vimOptions.expandtab.set(denops, false);
    await vimOptions.shiftwidth.set(denops, 8);

    await bufferCache.set(denops);
    await vimOptions.expandtab.set(denops, true);
    await vimOptions.shiftwidth.set(denops, 2);

    await restore(denops);

    const cache = { prev: { expandtab: 1, shiftwidth: 2 } };
    assertEquals(await bufferCache.get(denops), cache);
    assertEquals(await vimOptions.expandtab.get(denops), false);
    assertEquals(await vimOptions.shiftwidth.get(denops), 8);
  },
});

test({
  mode: "all",
  name: "restore() does nothing and warns when the buffer cache doesn't exist",
  async fn(denops: Denops) {
    assertEquals(await bufferCache.get(denops), null);
    await vimOptions.expandtab.set(denops, true);
    await vimOptions.shiftwidth.set(denops, 2);
    await denops.cmd("messages clear");

    await restore(denops);

    assertEquals(await bufferCache.get(denops), null);
    assertEquals<boolean | 1 | 0>(await vimOptions.expandtab.get(denops), 1);
    assertEquals(await vimOptions.shiftwidth.get(denops), 2);

    const messages = await vimFuncs.execute(denops, "messages");
    assertString(messages);
    assertMatch(
      messages,
      /\n\[detect-indent\] Indentation previously not detected\/set yet\./,
    );
  },
});
