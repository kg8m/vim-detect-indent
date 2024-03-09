import * as path from "https://deno.land/std@0.219.1/path/mod.ts";

export const root = {
  toString(): string {
    const testHelperFilepath = path.fromFileUrl(import.meta.url);
    const denopsTestDirpath = path.dirname(testHelperFilepath);
    const testDirpath = path.dirname(denopsTestDirpath);

    return path.dirname(testDirpath);
  },

  join(...paths: string[]): string {
    return path.join(root.toString(), ...paths);
  },

  fixturePath(filepath: string): string {
    return root.join("test/fixtures", filepath);
  },
};
