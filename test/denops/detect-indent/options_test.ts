// Use denops' test() instead of built-in Deno.test()
import { test } from "https://deno.land/x/denops_test@v1.1.0/mod.ts";
import { assertEquals } from "https://deno.land/std@0.182.0/testing/asserts.ts";
import type { Denops } from "https://deno.land/x/denops_std@v4.1.1/mod.ts";
import * as vimOptions from "https://deno.land/x/denops_std@v4.1.1/option/mod.ts";
import * as options from "../../../denops/detect-indent/options.ts";

test({
  mode: "all",
  name:
    "options.set() sets `expandtab` and `shiftwidth` when both of them are given",
  async fn(denops: Denops) {
    await vimOptions.expandtab.set(denops, false);
    await vimOptions.shiftwidth.set(denops, 8);

    await options.set(denops, { expandtab: true, shiftwidth: 2 });

    assertEquals<boolean | 1 | 0>(await vimOptions.expandtab.get(denops), 1);
    assertEquals(await vimOptions.shiftwidth.get(denops), 2);
  },
});

test({
  mode: "all",
  name: "options.set() sets only `expandtab` when `shiftwidth` is missing",
  async fn(denops: Denops) {
    await vimOptions.expandtab.set(denops, true);
    await vimOptions.shiftwidth.set(denops, 8);

    await options.set(denops, { expandtab: false });

    assertEquals(await vimOptions.expandtab.get(denops), false);
    assertEquals(await vimOptions.shiftwidth.get(denops), 8);
  },
});

test({
  mode: "all",
  name: "options.set() does nothing when the argument is empty",
  async fn(denops: Denops) {
    await vimOptions.expandtab.set(denops, false);
    await vimOptions.shiftwidth.set(denops, 8);

    await options.set(denops, {});

    assertEquals(await vimOptions.expandtab.get(denops), false);
    assertEquals(await vimOptions.shiftwidth.get(denops), 8);
  },
});
