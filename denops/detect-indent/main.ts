import type { Entrypoint } from "https://deno.land/x/denops_std@v6.5.1/mod.ts";
import { detect } from "./detect.ts";
import { restore } from "./restore.ts";

export const main: Entrypoint = (denops) => {
  denops.dispatcher = {
    detect: async () => await detect(denops),
    restore: async () => await restore(denops),
  };
};
