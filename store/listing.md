# Store listings

The Chrome Web Store and Firefox Add-ons listings already exist. Keep the copy here in sync with the dashboards when the extension changes.

# Chrome Web Store listing

## Store listing tab

**Name** (from the manifest, `appName` in `app/_locales/en/messages.json`): Copy Title and URL

**Summary** (from the manifest `description`, `appDescription`, max 132 characters): An extension to copy the title/selection and URL of the current page, adds a context menu on right-click.

**Category:** Productivity → Tools

**Language:** English

**Store icon:** `promo/Chrome-Webstore-Icon_128x128.png`

**Screenshots:** `promo/Screenshot_1280x800.png`, `promo/Screenshot_640x400.png`

**Promo tiles:** `promo/Promo-Image-Small_440x280.png`, `promo/Promo-Image-Large_920x680.png`, `promo/Promo-Image-Marquee_1400x560.png`

**Detailed description:**

```
Copy Title and URL adds two items to the right-click menu, so you can share or note a page in one click.

What it does
• "Copy Title and URL" (right-click anywhere on a page) copies the page title and its address.
• "Copy Selection and URL" (right-click on selected text) copies the selected text and the page address.

The clipboard gets two lines: the title or selection first, then the URL. Paste it into a chat, a ticket, an email or your notes.

Works in Chrome and Firefox. There are no settings.

Privacy
The title, URL and selection go to your clipboard and nowhere else. No accounts, no analytics, no network requests.
```

**Homepage URL:** https://github.com/casteroid/copy-title-url-ext

**Support URL:** https://github.com/casteroid/copy-title-url-ext/issues

## Privacy practices tab

**Single purpose:**

```
Copies the current page's title (or the selected text) together with its URL to the clipboard from a right-click context menu.
```

**Permission justifications:**

| Permission | Justification |
|---|---|
| `contextMenus` | Adds the two right-click menu items, "Copy Title and URL" and "Copy Selection and URL". |
| `clipboardWrite` | Writes the title or selection and the URL to the clipboard. |
| Host permissions `http://*/*`, `https://*/*` | Used only by the content script: after the user clicks one of the two menu items, it reads the page title, URL and selection and writes them to the clipboard. The background service worker cannot write to the clipboard and learns nothing about the page; it only tells the content script which menu item was clicked. The content script does nothing until then and sends no data anywhere. |

**Remote code:** No, I am not using remote code. (All code ships in the package; there is no `eval` and no remotely hosted script.)

**Data usage:** Tick **Website content** and **Web history**. The store requires disclosing data an extension handles even when it never leaves the device ([User Data FAQ, question 3](https://developer.chrome.com/docs/webstore/program-policies/user-data-faq)). The extension reads the page title and the selected text (website content) and the page URL, which the FAQ counts as web browsing activity (question 4). Each is read only when the user clicks a menu item, and only goes to the clipboard. Nothing else applies: no personal, health, financial, authentication, location or communication data, and no user activity tracking. Tick all three certifications (no selling or transferring of user data, no use unrelated to the single purpose, no use for creditworthiness or lending).

**Privacy policy URL:** https://github.com/casteroid/copy-title-url-ext/blob/main/PRIVACY.md

## Distribution tab

**Visibility:** Public. If you change visibility in the dashboard later, publish once by hand before the API can publish again.

**Regions:** All regions.

# Firefox Add-ons listing

**Slug:** `copy-title-and-url-ext` (<https://addons.mozilla.org/en-US/firefox/addon/copy-title-and-url-ext/>)

**Name, summary and description:** the same as the Chrome listing above.

**Category:** Tabs

**License:** MIT

**Privacy policy URL:** https://github.com/casteroid/copy-title-url-ext/blob/main/PRIVACY.md

**Support URL:** https://github.com/casteroid/copy-title-url-ext/issues
