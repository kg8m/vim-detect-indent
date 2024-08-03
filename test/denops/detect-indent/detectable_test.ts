// Use denops' test() instead of built-in Deno.test()
import { test } from "jsr:@denops/test@3.0.2";
import { assertEquals, assertRejects } from "jsr:@std/assert@1.0.2";
import type { Denops } from "jsr:@denops/std@7.0.2";
import * as vimOptions from "jsr:@denops/std@7.0.2/option";
import * as vimVars from "jsr:@denops/std@7.0.2/variable";
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

test({
  mode: "all",
  name:
    "isDetectable() throws an error if g:detect_indent#ignore_filetypes is not `null` nor `string[]`",
  async fn(denops: Denops) {
    await vimOptions.filetype.set(denops, "vim");
    await vimOptions.buftype.set(denops, "");
    assertEquals(await bufferCache.get(denops), null);

    await vimVars.g.set(denops, "detect_indent#ignore_filetypes", [42]);
    await vimVars.g.set(denops, "detect_indent#ignore_buftypes", ["nofile"]);
    await vimVars.g.set(denops, "detect_indent#detect_once", true);

    await assertRejects(async () => await isDetectable(denops));
  },
});

test({
  mode: "all",
  name:
    "isDetectable() throws an error if g:detect_indent#ignore_buftypes is not `null` nor `string[]`",
  async fn(denops: Denops) {
    await vimOptions.filetype.set(denops, "vim");
    await vimOptions.buftype.set(denops, "");
    assertEquals(await bufferCache.get(denops), null);

    await vimVars.g.set(denops, "detect_indent#ignore_buftypes", ["txt"]);
    await vimVars.g.set(denops, "detect_indent#ignore_buftypes", [42]);
    await vimVars.g.set(denops, "detect_indent#detect_once", true);

    await assertRejects(async () => await isDetectable(denops));
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
