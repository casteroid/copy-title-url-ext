# Copy Title and URL

A Chrome and Firefox extension (Manifest V3) that copies the current page's title or selected text together with its URL.

## Features

| How | What it copies |
|---|---|
| Right-click → **Copy Title and URL** | The page title and the URL |
| Right-click selected text → **Copy Selection and URL** | The selected text and the URL |
| Toolbar button, or **Alt+Shift+C** (Option+Shift+C on macOS) | The selected text and the URL, or the title and the URL when nothing is selected |

- **Format:** the title or selection goes on the first line and the URL on the second. The clipboard also gets an HTML link, so rich-text apps such as Slack, Google Docs or Gmail paste a linked title, and editors that turn pasted HTML into Markdown, such as Obsidian, paste `[title](url)`. Firefox before 127 lacks `ClipboardItem` and gets plain text only.
- **Clean URLs:** tracking parameters (`utm_*`, `fbclid`, `gclid`, `mc_eid`) are removed. Every other parameter and the `#fragment` stay as they were.
- **Feedback:** after each copy the toolbar icon shows a green ✓ for a second, or a red ! when the copy failed, for example on `chrome://` and `about:` pages. You only see this when the icon is pinned.
- **Shortcut:** change it at `chrome://extensions/shortcuts` in Chrome, or in Firefox at about:addons → gear → **Manage Extension Shortcuts**.
- **Languages:** English, Portuguese (Portugal and Brazil), Spanish, French and German.

## Privacy

There are no settings, no storage, no network access and no content script. The extension only runs in a tab after you click one of its menu items or its toolbar button, or press its shortcut. See [PRIVACY.md](PRIVACY.md).

## Development

Requires Node 22.18 or newer.

```sh
npm install
npm run dev chrome          # or firefox; rebuilds dist/<vendor>/ on every change
npm run build chrome        # or firefox; builds dist/<vendor>/ and zips it into packages/
npm run package             # builds both: packages/copy-title-url-ext.v<version>.chrome.zip and .firefox.xpi
npm run typecheck           # tsc over scripts/release and app/
npm test                    # vitest
npm run icons               # renders the pixel art in scripts/icons.mjs into app/images/ and promo/
```

The code is TypeScript, bundled with [esbuild](https://esbuild.github.io/).

### Load the extension

**Chrome**

1. Run `npm run build chrome`.
2. Open `chrome://extensions`, switch on **Developer mode**, click **Load unpacked** and pick the `dist/chrome` folder.

**Firefox**

1. Run `npm run build firefox`.
2. Open `about:debugging#/runtime/this-firefox`, click **Load Temporary Add-on** and pick `dist/firefox/manifest.json`.

### Architecture

| Path | Purpose |
|---|---|
| `app/scripts/background.ts` | Creates the context-menu items. On a menu click, a toolbar-button click or the shortcut, runs the copy function in the tab with `scripting.executeScript` (`activeTab`). |
| `app/scripts/copy.ts` | The copy function that runs in the page: reads the title or selection and writes the clipboard. |
| `app/scripts/url.ts` | Removes tracking parameters from the copied URL. |
| `app/manifest.json` | Shared manifest. Keys named `__chrome__x` or `__firefox__x` are kept as `x` for that vendor only. |
| `scripts/build.mjs` | esbuild: bundles `background.ts`, resolves the manifest, copies `_locales` and images, zips `dist/<vendor>/`. |
| `scripts/icons.mjs` | Pixel art for the icons. `npm run icons` renders `app/images/*.png` and the store icon. |
| `scripts/release/` | Version planning, commit checks and the Chrome Web Store and Firefox Add-ons uploads, run by the GitHub workflows. |
| `test/` | Vitest. `test/app/` covers the extension and is typechecked with `app/tsconfig.json`; the rest covers the release scripts. |

The background script uses `globalThis.browser ?? chrome`, so one bundle serves both browsers. The only vendor differences are in the manifest (`background` and `browser_specific_settings`).

## Contributing and releases

- Commits follow Conventional Commits, which set the version number. See [CONTRIBUTING.md](CONTRIBUTING.md).
- Releases are started by hand from the GitHub Actions tab and published to the Chrome Web Store and Firefox Add-ons automatically. See [docs/releasing.md](docs/releasing.md).
- Store listing text for both stores is in [`store/listing.md`](store/listing.md); the images are in `promo/`.

## Credits

Website icons created by [Freepik - Flaticon](https://www.flaticon.com/free-icons/website).
