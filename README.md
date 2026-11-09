# Copy Title and URL

A Chrome and Firefox (Manifest V3) extension that adds two right-click menu items: **Copy Title and URL** copies the page title and its URL, and **Copy Selection and URL** copies the selected text and the URL. The clipboard gets the title or selection on the first line and the URL on the second. There are no settings, no storage, no network access and no content script: the extension only runs in a tab after you click one of its menu items. It is written in TypeScript and bundled with [esbuild](https://esbuild.github.io/).

## Build

```sh
npm install                 # Node 22.18 or newer
npm run dev chrome          # or firefox; rebuilds dist/<vendor>/ on every change
npm run build chrome        # or firefox; builds dist/<vendor>/ and zips it into packages/
npm run typecheck           # tsc over scripts/release and app/
npm run icons               # renders the pixel art in scripts/icons.mjs into app/images/ and promo/
npm test                    # vitest
npm run package             # builds both: packages/copy-title-url-ext.v<version>.chrome.zip and .firefox.xpi
```

## Contributing and releases

Commits follow Conventional Commits, which drive the version number: see [CONTRIBUTING.md](CONTRIBUTING.md). Releases are started by hand from the GitHub Actions tab and published to the Chrome Web Store automatically; the Firefox package is uploaded to AMO by hand. See [docs/releasing.md](docs/releasing.md). Store listing copy for both stores is in [`store/listing.md`](store/listing.md); the images are in `promo/`. The privacy policy is [PRIVACY.md](PRIVACY.md).

## Load it

Chrome:

1. Run `npm run build chrome`.
2. Open `chrome://extensions`, switch on **Developer mode**, click **Load unpacked** and pick the `dist/chrome` folder.

Firefox:

1. Run `npm run build firefox`.
2. Open `about:debugging#/runtime/this-firefox`, click **Load Temporary Add-on** and pick `dist/firefox/manifest.json`.

## Architecture

```
app/scripts/background.ts     creates the context-menu items; on a click, runs the copy function in the tab with scripting.executeScript (activeTab)
app/manifest.json             shared manifest; keys named __chrome__x or __firefox__x are kept as x for that vendor only
scripts/build.mjs             esbuild: bundles background.ts, resolves the manifest, copies _locales and images, zips dist/<vendor>/
scripts/icons.mjs             pixel art for the icons; npm run icons renders app/images/*.png and the store icon
scripts/release/              version planning, commit checks and Chrome Web Store upload, run by the GitHub workflows
```

The background script uses `globalThis.browser ?? chrome`, so one bundle serves both browsers; the only vendor differences are in the manifest (`background` and `browser_specific_settings`).

## Credits

Website icons created by [Freepik - Flaticon](https://www.flaticon.com/free-icons/website).
