import { removeTrackingParams } from "./url";

// Firefox exposes the promise-based `browser`; Chrome exposes `chrome` (and `browser` from 137).
declare var browser: typeof chrome | undefined;
const api = globalThis.browser ?? chrome;

type Menu = {
  id: string;
  i18nKey: string;
  contexts: [`${chrome.contextMenus.ContextType}`, ...`${chrome.contextMenus.ContextType}`[]];
};

const Menus = {
  copyTitle: { id: "copy_title_url_menu", i18nKey: "copyTitleUrlMenu", contexts: ["page"] },
  copySelection: { id: "copy_selection_url_menu", i18nKey: "copySelectionUrlMenu", contexts: ["selection"] },
  copyMarkdown: { id: "copy_markdown_menu", i18nKey: "copyMarkdownMenu", contexts: ["page", "selection"] },
} satisfies Record<string, Menu>;

// "lines" is the title or selection and the URL on two lines; "markdown" is [title](url).
type Format = "lines" | "markdown";

// Runs inside the page via scripting.executeScript: it is serialised, so it
// must not reference anything from this module. Chrome resolves executeScript
// with a null result when this rejects, so success is signalled by returning true.
const copyToClipboard = async (useSelection: boolean, format: Format, url: string) => {
  const selection = useSelection ? (getSelection()?.toString().trim() ?? "") : "";
  const text = selection || document.title;
  if (format === "markdown") {
    const label = text.replace(/\s+/g, " ").replace(/[\\[\]]/g, "\\$&");
    await navigator.clipboard.writeText(`[${label}](${url.replace(/\(/g, "%28").replace(/\)/g, "%29")})`);
    return true;
  }
  const plain = `${text}\n${url}`;
  // ClipboardItem is missing in Firefox before 127: copy plain text only there.
  if (typeof ClipboardItem === "undefined") {
    await navigator.clipboard.writeText(plain);
    return true;
  }
  const escapeHtml = (value: string) =>
    value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const html = `<a href="${escapeHtml(url)}">${escapeHtml(text)}</a>`;
  await navigator.clipboard.write([
    new ClipboardItem({
      "text/plain": new Blob([plain], { type: "text/plain" }),
      "text/html": new Blob([html], { type: "text/html" }),
    }),
  ]);
  return true;
};

const BADGE_MS = 1000;
const badgeTimers = new Map<number, number>();

const flashBadge = (tabId: number, copied: boolean) => {
  clearTimeout(badgeTimers.get(tabId));
  // The tab may close before the badge is set or cleared.
  const ignore = () => {};
  api.action.setBadgeBackgroundColor({ tabId, color: copied ? "#1a7f37" : "#d1242f" }).catch(ignore);
  api.action.setBadgeText({ tabId, text: copied ? "✓" : "!" }).catch(ignore);
  badgeTimers.set(
    tabId,
    setTimeout(() => {
      badgeTimers.delete(tabId);
      api.action.setBadgeText({ tabId, text: "" }).catch(ignore);
    }, BADGE_MS),
  );
};

const copy = (target: chrome.scripting.InjectionTarget, useSelection: boolean, format: Format, url: string) => {
  api.scripting
    .executeScript({ target, func: copyToClipboard, args: [useSelection, format, removeTrackingParams(url)] })
    .then((results) => {
      if (!results.every(({ result }) => result === true)) throw new Error("the page did not write the clipboard");
    })
    .then(
      () => flashBadge(target.tabId, true),
      (error: unknown) => {
        console.error("Copy Title and URL: copy failed", error);
        flashBadge(target.tabId, false);
      },
    );
};

const handleMenuClick = (info: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab) => {
  if (tab?.id === undefined || info.pageUrl === undefined) return;
  let useSelection: boolean;
  let format: Format = "lines";
  switch (info.menuItemId) {
    case Menus.copyTitle.id:
      useSelection = false;
      break;
    case Menus.copySelection.id:
      useSelection = true;
      break;
    case Menus.copyMarkdown.id:
      useSelection = info.selectionText !== undefined;
      format = "markdown";
      break;
    default:
      return;
  }
  // The selection lives in the frame that was clicked; the title is the tab's.
  const target: chrome.scripting.InjectionTarget = useSelection
    ? { tabId: tab.id, frameIds: [info.frameId ?? 0] }
    : { tabId: tab.id };
  copy(target, useSelection, format, info.pageUrl);
};

api.contextMenus.onClicked.addListener(handleMenuClick);

// The toolbar button and its shortcut (_execute_action) do not say which frame holds the
// selection, so only the top frame's selection is used, falling back to the title.
api.action.onClicked.addListener((tab) => {
  if (tab.id === undefined) return;
  // No URL means the browser withheld activeTab, as on chrome:// and about: pages.
  if (tab.url === undefined) return flashBadge(tab.id, false);
  copy({ tabId: tab.id }, true, "lines", tab.url);
});

api.runtime.onInstalled.addListener(() => {
  api.contextMenus.removeAll().then(() => {
    for (const { id, i18nKey, contexts } of Object.values(Menus)) {
      api.contextMenus.create({ id, title: api.i18n.getMessage(i18nKey), contexts });
    }
  });
});
