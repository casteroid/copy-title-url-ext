// Firefox exposes the promise-based `browser`; Chrome exposes `chrome` (and `browser` from 137).
declare var browser: typeof chrome | undefined;
const api = globalThis.browser ?? chrome;

type Menu = { id: string; i18nKey: string; contexts: [`${chrome.contextMenus.ContextType}`] };

const Menus = {
  copyTitle: { id: "copy_title_url_menu", i18nKey: "copyTitleUrlMenu", contexts: ["page"] },
  copySelection: { id: "copy_selection_url_menu", i18nKey: "copySelectionUrlMenu", contexts: ["selection"] },
} satisfies Record<string, Menu>;

// Runs inside the page via scripting.executeScript: it is serialised, so it
// must not reference anything from this module.
const copyToClipboard = (useSelection: boolean, url: string) => {
  const selection = useSelection ? (getSelection()?.toString().trim() ?? "") : "";
  return navigator.clipboard.writeText(`${selection || document.title}\n${url}`);
};

const copy = (target: chrome.scripting.InjectionTarget, useSelection: boolean, url: string) => {
  api.scripting
    .executeScript({ target, func: copyToClipboard, args: [useSelection, url] })
    .catch((error: unknown) => console.error("Copy Title and URL: copy failed", error));
};

const handleMenuClick = (info: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab) => {
  if (tab?.id === undefined || info.pageUrl === undefined) return;
  let useSelection: boolean;
  switch (info.menuItemId) {
    case Menus.copyTitle.id:
      useSelection = false;
      break;
    case Menus.copySelection.id:
      useSelection = true;
      break;
    default:
      return;
  }
  // The selection lives in the frame that was clicked; the title is the tab's.
  const target: chrome.scripting.InjectionTarget = useSelection
    ? { tabId: tab.id, frameIds: [info.frameId ?? 0] }
    : { tabId: tab.id };
  copy(target, useSelection, info.pageUrl);
};

api.contextMenus.onClicked.addListener(handleMenuClick);

// The toolbar button and its shortcut (_execute_action) do not say which frame holds the
// selection, so only the top frame's selection is used, falling back to the title.
api.action.onClicked.addListener((tab) => {
  if (tab.id === undefined || tab.url === undefined) return;
  copy({ tabId: tab.id }, true, tab.url);
});

api.runtime.onInstalled.addListener(() => {
  api.contextMenus.removeAll().then(() => {
    for (const { id, i18nKey, contexts } of Object.values(Menus)) {
      api.contextMenus.create({ id, title: api.i18n.getMessage(i18nKey), contexts });
    }
  });
});
