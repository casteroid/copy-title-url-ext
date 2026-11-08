# Privacy policy

Copy Title and URL does not collect, transmit, sell or share any personal or browsing data.

- **What it reads.** Only when you click one of its two context-menu items, the extension reads the title and URL of the current tab ("Copy Title and URL") or the text you selected and the URL ("Copy Selection and URL").
- **Where it goes.** That text is written to your clipboard with `navigator.clipboard.writeText`, and nowhere else.
- **Content script.** The extension's content script is present on `http` and `https` pages because only a script in the page can read the selection and write the clipboard. It does nothing until the extension's own background script sends it a message after you click a menu item.
- **Storage and network.** The extension stores nothing, makes no network requests, loads no remote code, and contains no analytics or tracking.

Because nothing is stored, nothing remains after you uninstall the extension.

Questions: open an issue at <https://github.com/casteroid/copy-title-url-ext/issues>.

Last updated: 2026-11-08.
