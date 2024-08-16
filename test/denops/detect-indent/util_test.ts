// Use denops' test() instead of built-in Deno.test()
import { test } from "jsr:@denops/test@^3.0.2";
import { assertEquals } from "jsr:@std/assert@^1.0.2";
import { isEmptyObject } from "../../../denops/detect-indent/util.ts";

test({
  mode: "all",
  name: "isEmptyObject() returns `true` when the argument is an empty object",
  fn() {
    assertEquals(isEmptyObject({}), true);
  },
});

test({
  mode: "all",
  name: "isEmptyObject() returns `false` when the argument object has contents",
  fn() {
    assertEquals(isEmptyObject({ foo: 1 }), false);
  },
});
