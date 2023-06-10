// Use denops' test() instead of built-in Deno.test()
import { test } from "https://deno.land/x/denops_test@v1.4.0/mod.ts";
import { assertEquals } from "https://deno.land/std@0.191.0/testing/asserts.ts";
import type { Denops } from "https://deno.land/x/denops_std@v5.0.0/mod.ts";
import * as vimOptions from "https://deno.land/x/denops_std@v5.0.0/option/mod.ts";
import * as vimVars from "https://deno.land/x/denops_std@v5.0.0/variable/mod.ts";
import * as bufferCache from "../../../denops/detect-indent/buffer-cache.ts";
import { isDetectable } from "../../../denops/detect-indent/detectable.ts";

test({
  mode: "all",
  name:
    "isDetectable() returns `true` for valid filetype, valid buftype, and valid count without global configuration variables",
  async fn(denops: Denops) {
    await vimOptions.filetype.set(denops, "vim");
    await vimOptions.buftype.set(denops, "");
    assertEquals(await bufferCache.get(denops), null);

    assertEquals(await getIgnoreFiletypes(denops), null);
    assertEquals(await getIgnoreBuftypes(denops), null);
    assertEquals(await getDetectOnce(denops), null);

    assertEquals(await isDetectable(denops), true);
  },
});

test({
  mode: "all",
  name:
    "isDetectable() returns `true` for valid filetype, valid buftype, and valid count with global configuration variables",
  async fn(denops: Denops) {
    await vimOptions.filetype.set(denops, "vim");
    await vimOptions.buftype.set(denops, "");
    assertEquals(await bufferCache.get(denops), null);

    await vimVars.g.set(denops, "detect_indent#ignore_filetypes", ["txt"]);
    await vimVars.g.set(denops, "detect_indent#ignore_buftypes", ["nofile"]);
    await vimVars.g.set(denops, "detect_indent#detect_once", true);

    assertEquals(await isDetectable(denops), true);

    await vimVars.g.set(denops, "detect_indent#ignore_filetypes", []);
    await vimVars.g.set(denops, "detect_indent#ignore_buftypes", []);
    await vimVars.g.set(denops, "detect_indent#detect_once", false);

    assertEquals(await isDetectable(denops), true);
  },
});

test({
  mode: "all",
  name: "isDetectable() returns `false` for invalid filetype",
  async fn(denops: Denops) {
    await vimOptions.filetype.set(denops, "txt");
    await vimOptions.buftype.set(denops, "");
    assertEquals(await bufferCache.get(denops), null);

    await vimVars.g.set(denops, "detect_indent#ignore_filetypes", ["txt"]);
    await vimVars.g.set(denops, "detect_indent#ignore_buftypes", ["nofile"]);
    await vimVars.g.set(denops, "detect_indent#detect_once", true);

    assertEquals(await isDetectable(denops), false);
  },
});

test({
  mode: "all",
  name: "isDetectable() returns `false` for invalid buftype",
  async fn(denops: Denops) {
    await vimOptions.filetype.set(denops, "vim");
    await vimOptions.buftype.set(denops, "nofile");
    assertEquals(await bufferCache.get(denops), null);

    await vimVars.g.set(denops, "detect_indent#ignore_filetypes", ["txt"]);
    await vimVars.g.set(denops, "detect_indent#ignore_buftypes", ["nofile"]);
    await vimVars.g.set(denops, "detect_indent#detect_once", true);

    assertEquals(await isDetectable(denops), false);
  },
});

test({
  mode: "all",
  name: "isDetectable() returns `false` for invalid count",
  async fn(denops: Denops) {
    await vimOptions.filetype.set(denops, "vim");
    await vimOptions.buftype.set(denops, "");
    await bufferCache.set(denops);

    await vimVars.g.set(denops, "detect_indent#ignore_filetypes", ["txt"]);
    await vimVars.g.set(denops, "detect_indent#ignore_buftypes", ["nofile"]);
    await vimVars.g.set(denops, "detect_indent#detect_once", true);

    assertEquals(await isDetectable(denops), false);
  },
});

async function getIgnoreFiletypes(denops: Denops): Promise<string[] | null> {
  return await vimVars.g.get(denops, "detect_indent#ignore_filetypes");
}

async function getIgnoreBuftypes(denops: Denops): Promise<string[] | null> {
  return await vimVars.g.get(denops, "detect_indent#ignore_buftypes");
}

async function getDetectOnce(denops: Denops): Promise<boolean | 1 | 0 | null> {
  return await vimVars.g.get(denops, "detect_indent#detect_once");
}
