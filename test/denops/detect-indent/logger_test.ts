// Use denops' test() instead of built-in Deno.test()
import { test } from "https://deno.land/x/denops_test@v1.8.0/mod.ts";
import {
  assertMatch,
  assertNotMatch,
} from "https://deno.land/std@0.224.0/testing/asserts.ts";
import type { Denops } from "https://deno.land/x/denops_std@v6.5.0/mod.ts";
import * as vimFuncs from "https://deno.land/x/denops_std@v6.5.0/function/mod.ts";
import * as vimVars from "https://deno.land/x/denops_std@v6.5.0/variable/mod.ts";
import { assert, is } from "https://deno.land/x/unknownutil@v3.18.1/mod.ts";
import * as logger from "../../../denops/detect-indent/logger.ts";

test({
  mode: "all",
  name: "logger.debug() executes `:echomsg` with plugin name prefix",
  async fn(denops: Denops) {
    await denops.cmd("messages clear");

    await logger.debug(denops, "foo", "bar");

    const messages = await vimFuncs.execute(denops, "messages");
    assert(messages, is.String);
    assertMatch(messages, /\n\[detect-indent\] foo bar/);
  },
});

test({
  mode: "all",
  name: "logger.info() executes `:echomsg` with plugin name prefix",
  async fn(denops: Denops) {
    await denops.cmd("messages clear");

    await logger.info(denops, "foo", "bar");

    const messages = await vimFuncs.execute(denops, "messages");
    assert(messages, is.String);
    assertMatch(messages, /\n\[detect-indent\] foo bar/);
  },
});

test({
  mode: "all",
  name:
    "logger.info() executes `:echomsg` with plugin name prefix if `g:detect_indent#silence_information` is `0`",
  async fn(denops: Denops) {
    for (const varValue of [0, false]) {
      await vimVars.g.set(
        denops,
        "detect_indent#silence_information",
        varValue,
      );
      await denops.cmd("messages clear");

      await logger.info(denops, "foo", "bar");

      const messages = await vimFuncs.execute(denops, "messages");
      assert(messages, is.String);
      assertMatch(messages, /\n\[detect-indent\] foo bar/);
    }
  },
});

test({
  mode: "all",
  name:
    "logger.info() doesn't execute `:echomsg` with plugin name prefix if `g:detect_indent#silence_information` is `1`",
  async fn(denops: Denops) {
    for (const varValue of [1, true]) {
      await vimVars.g.set(
        denops,
        "detect_indent#silence_information",
        varValue,
      );
      await denops.cmd("messages clear");

      await logger.info(denops, "foo", "bar");

      const messages = await vimFuncs.execute(denops, "messages");
      assert(messages, is.String);
      assertNotMatch(messages, /\n\[detect-indent\] foo bar/);
    }
  },
});

test({
  mode: "all",
  name: "logger.warn() executes `:echomsg` with plugin name prefix",
  async fn(denops: Denops) {
    await denops.cmd("messages clear");

    await logger.warn(denops, "foo", "bar");

    const messages = await vimFuncs.execute(denops, "messages");
    assert(messages, is.String);
    assertMatch(messages, /\n\[detect-indent\] foo bar/);
  },
});

test({
  mode: "all",
  name:
    "logger.warn() executes `:echomsg` with plugin name prefix if `g:detect_indent#silence_warnings` is `0`",
  async fn(denops: Denops) {
    for (const varValue of [0, false]) {
      await vimVars.g.set(
        denops,
        "detect_indent#silence_warnings",
        varValue,
      );
      await denops.cmd("messages clear");

      await logger.warn(denops, "foo", "bar");

      const messages = await vimFuncs.execute(denops, "messages");
      assert(messages, is.String);
      assertMatch(messages, /\n\[detect-indent\] foo bar/);
    }
  },
});

test({
  mode: "all",
  name:
    "logger.warn() doesn't execute `:echomsg` with plugin name prefix if `g:detect_indent#silence_warnings` is `1`",
  async fn(denops: Denops) {
    for (const varValue of [1, true]) {
      await vimVars.g.set(
        denops,
        "detect_indent#silence_warnings",
        varValue,
      );
      await denops.cmd("messages clear");

      await logger.warn(denops, "foo", "bar");

      const messages = await vimFuncs.execute(denops, "messages");
      assert(messages, is.String);
      assertNotMatch(messages, /\n\[detect-indent\] foo bar/);
    }
  },
});

test({
  mode: "all",
  name: "logger.error() executes `:echomsg` with plugin name prefix",
  async fn(denops: Denops) {
    await denops.cmd("messages clear");

    await logger.error(denops, "foo", "bar");

    const messages = await vimFuncs.execute(denops, "messages");
    assert(messages, is.String);
    assertMatch(messages, /\n\[detect-indent\] foo bar/);
  },
});
