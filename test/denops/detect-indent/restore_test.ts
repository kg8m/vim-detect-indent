// Use denops' test() instead of built-in Deno.test()
import { test } from "jsr:@denops/test@3.0.2";
import { assertEquals, assertMatch } from "jsr:@std/testing@0.225.3/asserts";
import type { Denops } from "jsr:@denops/std@7.0.1";
import * as vimFuncs from "jsr:@denops/std@7.0.1/function";
import * as vimOptions from "jsr:@denops/std@7.0.1/option";
import { assert, is } from "jsr:@core/unknownutil@3.18.1";
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

    const cache = { prev: { expandtab: true, shiftwidth: 2 } };
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
    assertEquals(await vimOptions.expandtab.get(denops), true);
    assertEquals(await vimOptions.shiftwidth.get(denops), 2);

    const messages = await vimFuncs.execute(denops, "messages");
    assert(messages, is.String);
    assertMatch(
      messages,
      /\n\[detect-indent\] Indentation previously not detected\/set yet\./,
    );
  },
});
