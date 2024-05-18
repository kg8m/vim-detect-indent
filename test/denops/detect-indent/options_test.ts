// Use denops' test() instead of built-in Deno.test()
import { test } from "https://deno.land/x/denops_test@v1.8.0/mod.ts";
import { assertEquals } from "https://deno.land/std@0.224.0/testing/asserts.ts";
import { assertType } from "https://deno.land/std@0.224.0/testing/types.ts";
import type { Denops } from "https://deno.land/x/denops_std@v6.5.0/mod.ts";
import * as vimOptions from "https://deno.land/x/denops_std@v6.5.0/option/mod.ts";
import type {
  Options,
  OptionsAsEmpty,
  OptionsAsExpandtab,
  OptionsAsNonExpandtab,
} from "../../../denops/detect-indent/options.ts";
import {
  isOptions,
  set as setOptions,
} from "../../../denops/detect-indent/options.ts";

test({
  mode: "all",
  name: "set() sets `expandtab` and `shiftwidth` when both of them are given",
  async fn(denops: Denops) {
    await vimOptions.expandtab.set(denops, false);
    await vimOptions.shiftwidth.set(denops, 8);

    await setOptions(denops, { expandtab: true, shiftwidth: 2 });

    assertEquals(await vimOptions.expandtab.get(denops), true);
    assertEquals(await vimOptions.shiftwidth.get(denops), 2);
  },
});

test({
  mode: "all",
  name: "set() sets only `expandtab` when `shiftwidth` is missing",
  async fn(denops: Denops) {
    await vimOptions.expandtab.set(denops, true);
    await vimOptions.shiftwidth.set(denops, 8);

    await setOptions(denops, { expandtab: false });

    assertEquals(await vimOptions.expandtab.get(denops), false);
    assertEquals(await vimOptions.shiftwidth.get(denops), 8);
  },
});

test({
  mode: "all",
  name: "set() does nothing when the argument is empty",
  async fn(denops: Denops) {
    await vimOptions.expandtab.set(denops, false);
    await vimOptions.shiftwidth.set(denops, 8);

    await setOptions(denops, {});

    assertEquals(await vimOptions.expandtab.get(denops), false);
    assertEquals(await vimOptions.shiftwidth.get(denops), 8);
  },
});

Deno.test({
  name: "isOptions() returns true if the argument is a Options",
  fn() {
    const nonExpandtabOptions: OptionsAsNonExpandtab = { expandtab: false };
    const expandtabOptions: OptionsAsExpandtab = {
      expandtab: true,
      shiftwidth: 2,
    };
    const emptyOptions: OptionsAsEmpty = {};

    assertType<typeof nonExpandtabOptions extends Options ? true : false>(true);
    assertType<typeof expandtabOptions extends Options ? true : false>(true);
    assertType<typeof emptyOptions extends Options ? true : false>(true);

    assertEquals(isOptions(nonExpandtabOptions), true);
    assertEquals(isOptions(expandtabOptions), true);
    assertEquals(isOptions(emptyOptions), true);
  },
});

Deno.test({
  name: "isOptions() returns false unless the argument is a Options",
  fn() {
    const withOnlyUnknownKeys = { foo: 42 };
    const withInvalidExpandtab = { expandtab: 42 };
    const expandtabButWithoutShiftwidth: { expandtab: true } = {
      expandtab: true,
    };
    const expandtabButWithInvalidShiftwidth: {
      expandtab: true;
      shiftwidth: "";
    } = {
      expandtab: true,
      shiftwidth: "",
    };

    assertType<
      typeof withOnlyUnknownKeys extends Options ? true : false
    >(false);
    assertType<
      typeof withInvalidExpandtab extends Options ? true : false
    >(false);
    assertType<
      typeof expandtabButWithoutShiftwidth extends Options ? true : false
    >(false);
    assertType<
      typeof expandtabButWithInvalidShiftwidth extends Options ? true : false
    >(false);

    assertEquals(isOptions(withOnlyUnknownKeys), false);
    assertEquals(isOptions(withInvalidExpandtab), false);
    assertEquals(isOptions(expandtabButWithoutShiftwidth), false);
    assertEquals(isOptions(expandtabButWithInvalidShiftwidth), false);
  },
});
