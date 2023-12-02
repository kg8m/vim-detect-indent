import type { Denops } from "https://deno.land/x/denops_std@v5.1.0/mod.ts";
import { detect } from "./detect.ts";
import { restore } from "./restore.ts";

export function main(denops: Denops): void {
  denops.dispatcher = {
    detect: async () => await detect(denops),
    restore: async () => await restore(denops),
  };
}
