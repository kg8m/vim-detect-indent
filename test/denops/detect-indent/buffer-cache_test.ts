// Use denops' test() instead of built-in Deno.test()
import { test } from "https://deno.land/x/denops_test@v1.6.1/mod.ts";
import {
  assertEquals,
  assertRejects,
} from "https://deno.land/std@0.212.0/testing/asserts.ts";
import { assertType } from "https://deno.land/std@0.212.0/testing/types.ts";
import type { Denops } from "https://deno.land/x/denops_std@v5.2.0/mod.ts";
import * as vimOptions from "https://deno.land/x/denops_std@v5.2.0/option/mod.ts";
import * as vimVars from "https://deno.land/x/denops_std@v5.2.0/variable/mod.ts";
import type { Cache } from "../../../denops/detect-indent/buffer-cache.ts";
import {
  get as getBufferCache,
  isCache,
  set as setBufferCache,
} from "../../../denops/detect-indent/buffer-cache.ts";

test({
  mode: "all",
  name: "get() returns `b:detect_indent` value",
  async fn(denops: Denops) {
    assertEquals(await getBufferCache(denops), null);

    const cache = { prev: { expandtab: true, shiftwidth: 2 } };
    await vimVars.b.set(denops, "detect_indent", cache);

    assertEquals(await getBufferCache(denops), cache);
  },
});

test({
  mode: "all",
  name: "get() throws an error if `b:detect_indent` value is invalid",
  async fn(denops: Denops) {
    const cache = { expandtab: true, shiftwidth: 2 };
    await vimVars.b.set(denops, "detect_indent", cache);

    await assertRejects(async () => await getBufferCache(denops));
  },
});

test({
  mode: "all",
  name: "set() sets current options as `b:detect_indent`",
  async fn(denops: Denops) {
    const expandtab = await vimOptions.expandtab.getLocal(denops);
    const shiftwidth = await vimOptions.shiftwidth.getLocal(denops);
    const cache = { prev: { expandtab, shiftwidth } };

    assertEquals(await vimVars.b.get(denops, "detect_indent"), null);

    await setBufferCache(denops);

    assertEquals(await vimVars.b.get(denops, "detect_indent"), cache);
  },
});

Deno.test({
  name: "isCache() returns true if the argument is a Cache",
  fn() {
    const cache = { prev: {} };

    assertType<
      typeof cache extends Cache ? true : false
    >(true);

    assertEquals(isCache(cache), true);
  },
});

Deno.test({
  name: "isCache() returns false unless the argument is a Cache",
  fn() {
    const empty = {};
    const withInvalidOptions = {
      prev: { foo: 42 },
    };
    const withUnknownKeys = {
      prev: { expandtab: 42 },
      next: true,
    };

    assertType<
      typeof empty extends Cache ? true : false
    >(false);
    assertType<
      typeof withInvalidOptions extends Cache ? true : false
    >(false);
    assertType<
      typeof withUnknownKeys extends Cache ? true : false
    >(false);

    assertEquals(isCache(empty), false);
    assertEquals(isCache(withInvalidOptions), false);
    assertEquals(isCache(withUnknownKeys), false);
  },
});
