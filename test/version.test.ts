import { expect, it } from "vitest";
import manifest from "../app/manifest.json";
import pkg from "../package.json";

it("package.json and the manifest carry the same version", () => {
  expect(pkg.version).toBe(manifest.version);
});
