// Use denops’ test() instead of built-in Deno.test()
import { test } from "jsr:@denops/test@^3.0.2";
import { assertEquals, assertNotEquals } from "jsr:@std/assert@^1.0.2";
import type { Denops } from "jsr:@denops/std@^7.0.2";
import * as vimFuncs from "jsr:@denops/std@^7.0.2/function";
import * as vimOptions from "jsr:@denops/std@^7.0.2/option";
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
      assertEquals(await vimOptions.expandtab.get(denops), true);
      assertEquals(await vimOptions.shiftwidth.get(denops), 2);
    }
  },
});
