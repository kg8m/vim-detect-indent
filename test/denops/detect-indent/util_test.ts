import { assertEquals } from "https://deno.land/std@0.152.0/testing/asserts.ts";
import { isEmptyObject } from "../../../denops/detect-indent/util.ts";

Deno.test({
  name: "isEmptyObject() returns `true` when the argument is an empty object",
  fn() {
    assertEquals(isEmptyObject({}), true);
  },
});

Deno.test({
  name: "isEmptyObject() returns `false` when the argument object has conents",
  fn() {
    assertEquals(isEmptyObject({ foo: 1 }), false);
  },
});
