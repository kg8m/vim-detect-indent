// Use denops’ test() instead of built-in Deno.test()
import { test } from "jsr:@denops/test@^3.0.2";
import { assertEquals } from "jsr:@std/assert@^1.0.2";
import type { Denops } from "jsr:@denops/std@^7.0.2";
import * as vimFuncs from "jsr:@denops/std@^7.0.2/function";
import { calculate } from "../../../denops/detect-indent/calculate.ts";
import * as testHelper from "../test-helper.ts";

test({
  mode: "all",
  name: "calculate() returns `{}` when the buffer content is empty",
  async fn(denops: Denops) {
    const fixturePath = testHelper.root.fixturePath("no-contents.txt");
    const content = await Deno.readTextFile(fixturePath);
    await vimFuncs.setline(denops, 1, content);

    assertEquals(await calculate(denops), {});
  },
});

test({
  mode: "all",
  name: "calculate() returns `{}` when the buffer content has no indentations",
  async fn(denops: Denops) {
    for (const fixtureExtension of ["ts", "yaml"]) {
      const fixtureFilename = `no-indentations.${fixtureExtension}`;
      const fixturePath = testHelper.root.fixturePath(fixtureFilename);
      const fixtureContent = await Deno.readTextFile(fixturePath);

      await denops.cmd("enew!");
      await vimFuncs.setline(denops, 1, fixtureContent.split("\n"));

      assertEquals(await calculate(denops), {});
    }
  },
});

test({
  mode: "all",
  name:
    "calculate() returns `{ expandtab: false }` when the buffer content is indented with hard tabs",
  async fn(denops: Denops) {
    for (const fixtureExtension of ["ts", "yaml"]) {
      const fixtureFilename = `hard-tab-indentations.${fixtureExtension}`;
      const fixturePath = testHelper.root.fixturePath(fixtureFilename);
      const fixtureContent = await Deno.readTextFile(fixturePath);

      await denops.cmd("enew!");
      await vimFuncs.setline(denops, 1, fixtureContent.split("\n"));

      assertEquals(await calculate(denops), { expandtab: false });
    }
  },
});

test({
  mode: "all",
  name:
    "calculate() returns `{ expandtab: true, shiftwidth: 2 }` when the buffer content is indented with 2 spaces",
  async fn(denops: Denops) {
    for (const fixtureExtension of ["ts", "yaml"]) {
      const fixtureFilename = `2-space-indentations.${fixtureExtension}`;
      const fixturePath = testHelper.root.fixturePath(fixtureFilename);
      const fixtureContent = await Deno.readTextFile(fixturePath);

      await denops.cmd("enew!");
      await vimFuncs.setline(denops, 1, fixtureContent.split("\n"));

      assertEquals(await calculate(denops), { expandtab: true, shiftwidth: 2 });
    }
  },
});

test({
  mode: "all",
  name:
    "calculate() returns `{ expandtab: true, shiftwidth: 4 }` when the buffer content is indented with 4 spaces",
  async fn(denops: Denops) {
    for (const fixtureExtension of ["ts", "yaml"]) {
      const fixtureFilename = `4-space-indentations.${fixtureExtension}`;
      const fixturePath = testHelper.root.fixturePath(fixtureFilename);
      const fixtureContent = await Deno.readTextFile(fixturePath);

      await denops.cmd("enew!");
      await vimFuncs.setline(denops, 1, fixtureContent.split("\n"));

      assertEquals(await calculate(denops), { expandtab: true, shiftwidth: 4 });
    }
  },
});

test({
  mode: "all",
  name:
    "calculate() returns `{ expandtab: true, shiftwidth: 8 }` when the buffer content is indented with 8 spaces",
  async fn(denops: Denops) {
    for (const fixtureExtension of ["ts", "yaml"]) {
      const fixtureFilename = `8-space-indentations.${fixtureExtension}`;
      const fixturePath = testHelper.root.fixturePath(fixtureFilename);
      const fixtureContent = await Deno.readTextFile(fixturePath);

      await denops.cmd("enew!");
      await vimFuncs.setline(denops, 1, fixtureContent.split("\n"));

      assertEquals(await calculate(denops), { expandtab: true, shiftwidth: 8 });
    }
  },
});

test({
  mode: "all",
  name:
    "calculate() returns `{ expandtab: false }` when the buffer content is mainly indented with hard tabs",
  async fn(denops: Denops) {
    for (const fixtureExtension of ["ts", "yaml"]) {
      const fixtureFilename =
        `hard-tab-indentations-with-a-few-2-space-indentations.${fixtureExtension}`;
      const fixturePath = testHelper.root.fixturePath(fixtureFilename);
      const fixtureContent = await Deno.readTextFile(fixturePath);

      await denops.cmd("enew!");
      await vimFuncs.setline(denops, 1, fixtureContent.split("\n"));

      assertEquals(await calculate(denops), { expandtab: false });
    }
  },
});

test({
  mode: "all",
  name:
    "calculate() returns `{ expandtab: true, shiftwidth: 4 }` when the buffer content is mainly indented with 4 spaces",
  async fn(denops: Denops) {
    for (const fixtureExtension of ["ts", "yaml"]) {
      const fixtureFilename =
        `4-space-indentations-with-a-few-hard-tab-indentations.${fixtureExtension}`;
      const fixturePath = testHelper.root.fixturePath(fixtureFilename);
      const fixtureContent = await Deno.readTextFile(fixturePath);

      await denops.cmd("enew!");
      await vimFuncs.setline(denops, 1, fixtureContent.split("\n"));

      assertEquals(await calculate(denops), { expandtab: true, shiftwidth: 4 });
    }
  },
});
