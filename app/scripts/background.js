import { CopyMessage } from "./models";
import browser from "./browser";

const Menu = {
  CopyTitleAndUrl: {
    ID: 'copy_title_url_menu',
    I18N_KEY: 'copyTitleUrlMenu',
  }
}

const handleCopyRequest = (info, tab) => {
  if (info.menuItemId !== Menu.CopyTitleAndUrl.ID) {
    return;
  }
  const { url, title } = tab;
  const message = new CopyMessage(url, title);
  browser.tabs.sendMessage(tab.id, { message });
}


browser.runtime.onInstalled.addListener(() => {
  browser.contextMenus.create({
    id: Menu.CopyTitleAndUrl.ID,
    title: browser.i18n.getMessage(Menu.CopyTitleAndUrl.I18N_KEY),
    contexts: ["page"]
  });
  browser.contextMenus.onClicked.addListener(handleCopyRequest)
});
