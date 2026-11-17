# Copy Title and URL

A Chrome and Firefox (Manifest V3) extension that adds three right-click menu items: **Copy Title and URL** copies the page title and its URL, **Copy Selection and URL** copies the selected text and the URL, and **Copy as Markdown** copies `[title](url)`, using the selected text instead of the title when there is a selection. Clicking the toolbar button, or pressing **Alt+Shift+C** (Option+Shift+C on macOS), copies the selected text and the URL, or the title and the URL when nothing is selected. The shortcut can be changed at `chrome://extensions/shortcuts` in Chrome, or in Firefox at about:addons → gear → **Manage Extension Shortcuts**. The clipboard gets the title or selection on the first line and the URL on the second, plus an HTML link so that rich-text apps paste a linked title (not in Firefox before 127, which lacks `ClipboardItem`). After each copy the toolbar icon shows a green ✓ for a second, or a red ! when the copy failed (for example on `chrome://` and `about:` pages); this is only visible when the icon is pinned. There are no settings, no storage, no network access and no content script: the extension only runs in a tab after you click one of its menu items or its toolbar button, or press its shortcut. It is written in TypeScript and bundled with [esbuild](https://esbuild.github.io/).

Copied URLs lose their tracking parameters (`utm_*`, `fbclid`, `gclid`, `mc_eid`); every other parameter and the `#fragment` stay as they were.

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
app/scripts/background.ts     creates the context-menu items; on a menu click, a toolbar-button click or the shortcut, runs the copy function in the tab with scripting.executeScript (activeTab)
app/scripts/copy.ts           the copy function that runs in the page: reads the title or selection and writes the clipboard
app/scripts/url.ts            removes tracking parameters from the copied URL
app/manifest.json             shared manifest; keys named __chrome__x or __firefox__x are kept as x for that vendor only
scripts/build.mjs             esbuild: bundles background.ts, resolves the manifest, copies _locales and images, zips dist/<vendor>/
scripts/icons.mjs             pixel art for the icons; npm run icons renders app/images/*.png and the store icon
scripts/release/              version planning, commit checks and Chrome Web Store upload, run by the GitHub workflows
test/                         vitest: test/app/ covers the extension (typechecked with app/tsconfig.json), the rest covers the release scripts
```

The background script uses `globalThis.browser ?? chrome`, so one bundle serves both browsers; the only vendor differences are in the manifest (`background` and `browser_specific_settings`).

## Credits

Website icons created by [Freepik - Flaticon](https://www.flaticon.com/free-icons/website).
