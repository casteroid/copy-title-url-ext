// Usage: node scripts/build.mjs <chrome|firefox> [--watch]
// Builds app/ into dist/<vendor>/ and, unless watching, zips it into packages/.
import { execFileSync } from "node:child_process";
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import * as esbuild from "esbuild";

const VENDORS = { chrome: "zip", firefox: "xpi" };

const watch = process.argv.includes("--watch");
const vendor = process.argv.slice(2).find((arg) => !arg.startsWith("--"));
if (!(vendor in VENDORS)) {
  console.error(`usage: node scripts/build.mjs <${Object.keys(VENDORS).join("|")}> [--watch]`);
  process.exit(2);
}

const outdir = `dist/${vendor}`;

// Keys named __<vendor>__foo are kept as foo for that vendor and dropped for the others.
const resolveManifest = (manifest) => {
  const resolved = {};
  for (const [key, value] of Object.entries(manifest)) {
    const match = /^__([a-z]+)__(.+)$/.exec(key);
    if (!match) resolved[key] = value;
    else if (match[1] === vendor) resolved[match[2]] = value;
  }
  return resolved;
};

const copyStatic = {
  name: "copy-static",
  setup(build) {
    build.onEnd(async (result) => {
      if (result.errors.length > 0) return;
      const manifest = JSON.parse(await readFile("app/manifest.json", "utf8"));
      await mkdir(outdir, { recursive: true });
      await writeFile(`${outdir}/manifest.json`, JSON.stringify(resolveManifest(manifest), null, 2) + "\n");
      await cp("app/_locales", `${outdir}/_locales`, { recursive: true });
      await cp("app/images", `${outdir}/images`, { recursive: true });
      console.log(`[build] ${new Date().toLocaleTimeString()} ${vendor} done`);
    });
  },
};

// A one-off build is what gets packaged, so it must not carry files from older builds.
if (!watch) await rm(outdir, { recursive: true, force: true });

const ctx = await esbuild.context({
  entryPoints: ["app/scripts/background.ts"],
  bundle: true,
  format: "iife",
  target: ["chrome120", "firefox115"],
  outdir: `${outdir}/scripts`,
  minify: !watch,
  sourcemap: watch ? "inline" : false,
  logLevel: "info",
  plugins: [copyStatic],
});

if (watch) {
  await ctx.watch();
} else {
  await ctx.rebuild();
  await ctx.dispose();
  const { name } = JSON.parse(await readFile("package.json", "utf8"));
  const { version } = JSON.parse(await readFile("app/manifest.json", "utf8"));
  const archive = `${name}.v${version}.${vendor}.${VENDORS[vendor]}`;
  await mkdir("packages", { recursive: true });
  await rm(`packages/${archive}`, { force: true });
  execFileSync("zip", ["-qrX", `../../packages/${archive}`, "."], { cwd: outdir, stdio: "inherit" });
  console.log(`[build] packages/${archive}`);
}
