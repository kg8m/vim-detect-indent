import { assertEquals } from "jsr:@std/assert@1.0.2";
import { isEmptyObject } from "../../../denops/detect-indent/util.ts";

Deno.test({
  name: "isEmptyObject() returns `true` when the argument is an empty object",
  fn() {
    assertEquals(isEmptyObject({}), true);
  },
});

Deno.test({
  name: "isEmptyObject() returns `false` when the argument object has contents",
  fn() {
    assertEquals(isEmptyObject({ foo: 1 }), false);
  },
});
