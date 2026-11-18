// Usage: node scripts/site.mjs
// Builds the GitHub Pages site into _site/: the static files in site/, the icons, and site/demo.ts bundled.
import { cp, mkdir, rm } from "node:fs/promises";
import * as esbuild from "esbuild";

const outdir = "_site";

await rm(outdir, { recursive: true, force: true });
await cp("site", outdir, { recursive: true, filter: (source) => !source.endsWith(".ts") });
await mkdir(`${outdir}/img`, { recursive: true });
for (const size of [32, 128]) await cp(`app/images/icon-${size}.png`, `${outdir}/img/icon-${size}.png`);

await esbuild.build({
  entryPoints: ["site/demo.ts"],
  bundle: true,
  format: "iife",
  target: ["chrome120", "firefox115", "safari16"],
  outfile: `${outdir}/demo.js`,
  minify: true,
  logLevel: "info",
});
