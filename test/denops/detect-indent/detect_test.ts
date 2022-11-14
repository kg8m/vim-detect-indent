// Use denops' test() instead of built-in Deno.test()
import { test } from "https://deno.land/x/denops_core@v3.2.0/test/mod.ts";
import {
  assertEquals,
  assertNotEquals,
} from "https://deno.land/std@0.164.0/testing/asserts.ts";
import type { Denops } from "https://deno.land/x/denops_std@v3.9.1/mod.ts";
import * as vimFuncs from "https://deno.land/x/denops_std@v3.9.1/function/mod.ts";
import * as vimOptions from "https://deno.land/x/denops_std@v3.9.1/option/mod.ts";
import * as bufferCache from "../../../denops/detect-indent/buffer-cache.ts";
import { detect } from "../../../denops/detect-indent/detect.ts";
import * as testHelper from "../test-helper.ts";

test({
  mode: "all",
  name:
    "detect() sets a buffer cache and indentation options when the buffer content is indented with hard tabs",
  async fn(denops: Denops) {
    for (const fixtureExtension of ["ts", "yaml"]) {
      const fixtureFilename = `hard-tab-indentations.${fixtureExtension}`;
      const fixturePath = testHelper.root.fixturePath(fixtureFilename);
      const fixtureContent = await Deno.readTextFile(fixturePath);

      await denops.cmd("enew!");
      await vimFuncs.setline(denops, 1, fixtureContent.split("\n"));

      assertEquals(await bufferCache.get(denops), null);
      await vimOptions.expandtab.set(denops, true);
      await vimOptions.shiftwidth.set(denops, 8);

      await detect(denops);

      assertNotEquals(await bufferCache.get(denops), null);
      assertEquals(await vimOptions.expandtab.get(denops), false);
      assertEquals(await vimOptions.shiftwidth.get(denops), 8);
    }
  },
});

test({
  mode: "all",
  name:
    "detect() sets a buffer cache and indentation options when the buffer content is indented with 2 spaces",
  async fn(denops: Denops) {
    for (const fixtureExtension of ["ts", "yaml"]) {
      const fixtureFilename = `2-space-indentations.${fixtureExtension}`;
      const fixturePath = testHelper.root.fixturePath(fixtureFilename);
      const fixtureContent = await Deno.readTextFile(fixturePath);

      await denops.cmd("enew!");
      await vimFuncs.setline(denops, 1, fixtureContent.split("\n"));

      assertEquals(await bufferCache.get(denops), null);
      await vimOptions.expandtab.set(denops, false);
      await vimOptions.shiftwidth.set(denops, 8);

      await detect(denops);

      assertNotEquals(await bufferCache.get(denops), null);
      assertEquals<boolean | 1 | 0>(await vimOptions.expandtab.get(denops), 1);
      assertEquals(await vimOptions.shiftwidth.get(denops), 2);
    }
  },
});
