# Copy Title and URL

A Chrome and Firefox (Manifest V3) extension that adds two right-click menu items: **Copy Title and URL** copies the page title and its URL, and **Copy Selection and URL** copies the selected text and the URL. The clipboard gets the title or selection on the first line and the URL on the second. There are no settings, no storage and no network access. It is built with [webextension-toolbox](https://github.com/webextension-toolbox/webextension-toolbox).

## Build

```sh
npm install                 # Node 22.18 or newer
npm run dev chrome          # or firefox; rebuilds dist/<vendor>/ on every change
npm run build chrome        # or firefox; builds dist/<vendor>/ and packs it into packages/
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
app/scripts/background.js     background script: creates the context-menu items, sends the clicked one to the tab
app/scripts/contentscript.js  content script: receives { op, data } from the background script and copies
app/scripts/ext.js            copyTitle and copySelection, which write to the clipboard
app/scripts/browser.js        the chrome or browser global, picked at build time by process.env.VENDOR
app/scripts/models.js         Operation, the message types
scripts/release/              version planning, commit checks and Chrome Web Store upload, run by the GitHub workflows
```

`app/manifest.json` uses webextension-toolbox vendor prefixes: `__chrome__background` becomes a service worker and `__firefox__background` a background script, and `__firefox__browser_specific_settings` holds the Gecko id.

## Credits

Website icons created by [Freepik - Flaticon](https://www.flaticon.com/free-icons/website).
