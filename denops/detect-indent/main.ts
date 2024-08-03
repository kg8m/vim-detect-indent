import type { Entrypoint } from "jsr:@denops/std@7.0.2";
import { detect } from "./detect.ts";
import { restore } from "./restore.ts";

export const main: Entrypoint = (denops) => {
  denops.dispatcher = {
    detect: async () => await detect(denops),
    restore: async () => await restore(denops),
  };
};
