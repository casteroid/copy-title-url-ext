import { Operation } from "./models";
import browser from "./browser";

const Menus = {
  CopyTitle: {
    ID: 'copy_title_url_menu',
    I18N_KEY: 'copyTitleUrlMenu',
    CONTEXTS: ["page"],
  },
  CopySelection: {
    ID: 'copy_selection_url_menu',
    I18N_KEY: 'copySelectionUrlMenu',
    CONTEXTS: ["selection"],
  }
};

const toPayload = (info, tab) => {
  const { url, title } = tab;
  switch (info.menuItemId) {

    case Menus.CopyTitle.ID:
      return { op: Operation.TITLE, data: { title, url } };

    case Menus.CopySelection.ID:
      return { op: Operation.SELECTION, data: { url } };
  }
};

const handleCopyRequest = (info, tab) => {
  browser.tabs.sendMessage(tab.id, toPayload(info, tab));
}

browser.runtime.onInstalled.addListener(() => {
  Object.keys(Menus).forEach(key => {
    const id = Menus[key].ID;
    const title = browser.i18n.getMessage(Menus[key].I18N_KEY);
    const contexts = Menus[key].CONTEXTS;
    browser.contextMenus.create({ id, title, contexts });
  });
  browser.contextMenus.onClicked.addListener(handleCopyRequest)
});
