import browser from "./browser";

const Menus = {
  CopyTitle: {
    ID: "copy_title_url_menu",
    I18N_KEY: "copyTitleUrlMenu",
    CONTEXTS: ["page"],
  },
  CopySelection: {
    ID: "copy_selection_url_menu",
    I18N_KEY: "copySelectionUrlMenu",
    CONTEXTS: ["selection"],
  },
};

// Runs inside the page via scripting.executeScript: it is serialised, so it
// must not reference anything from this module.
const copyToClipboard = (useSelection, url) => {
  const first = useSelection ? getSelection().toString().trim() : document.title;
  return navigator.clipboard.writeText(`${first}\n${url}`);
};

const handleMenuClick = (info, tab) => {
  let useSelection;
  switch (info.menuItemId) {
    case Menus.CopyTitle.ID:
      useSelection = false;
      break;
    case Menus.CopySelection.ID:
      useSelection = true;
      break;
    default:
      return;
  }
  // The selection lives in the frame that was clicked; the title is the tab's.
  const target = useSelection
    ? { tabId: tab.id, frameIds: [info.frameId] }
    : { tabId: tab.id };
  browser.scripting
    .executeScript({ target, func: copyToClipboard, args: [useSelection, info.pageUrl] })
    .catch((error) => console.error("Copy Title and URL: copy failed", error));
};

browser.contextMenus.onClicked.addListener(handleMenuClick);

browser.runtime.onInstalled.addListener(() => {
  browser.contextMenus.removeAll().then(() => {
    for (const { ID: id, I18N_KEY, CONTEXTS: contexts } of Object.values(Menus)) {
      browser.contextMenus.create({ id, title: browser.i18n.getMessage(I18N_KEY), contexts });
    }
  });
});
