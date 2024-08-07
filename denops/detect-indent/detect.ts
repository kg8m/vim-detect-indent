import type { Denops } from "jsr:@denops/std@^7.0.2";
import { isDetectable } from "./detectable.ts";
import { calculate } from "./calculate.ts";
import * as options from "./options.ts";
import * as bufferCache from "./buffer-cache.ts";

let timer: ReturnType<typeof globalThis["setTimeout"]> = -1;

export function detect(denops: Denops): Promise<void> {
  return new Promise((resolve) => {
    clearTimeout(timer);

    timer = setTimeout(async () => {
      if (!await isDetectable(denops)) {
        return;
      }

      const calculated = await calculate(denops);
      await bufferCache.set(denops);
      await options.set(denops, calculated);

      resolve();
    }, 200);
  });
}
