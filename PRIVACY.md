# Privacy policy

Copy Title and URL does not collect, transmit, sell or share any personal or browsing data.

- **What it reads.** Only when you click one of its two context-menu items, the extension reads the title and URL of the current tab ("Copy Title and URL") or the text you selected and the URL ("Copy Selection and URL").
- **Where it goes.** That text is written to your clipboard with `navigator.clipboard.writeText`, and nowhere else.
- **How it runs.** The extension has no content script and no access to websites while you browse. When you click a menu item, the browser grants it access to that one tab (`activeTab`) and it runs a small function there that reads the title or selection and writes the clipboard. Nothing runs before the click.
- **Storage and network.** The extension stores nothing, makes no network requests, loads no remote code, and contains no analytics or tracking.

Because nothing is stored, nothing remains after you uninstall the extension.

Questions: open an issue at <https://github.com/casteroid/copy-title-url-ext/issues>.

Last updated: 2026-11-09.
