if (!browser) {
    var browser = chrome;
}

const MENU_ID = 'copy_title_url_menu';

const handleCopyRequest = (info, tab) => {
    if (info.menuItemId !== MENU_ID) {
        return;
    }
    const { url, title } = tab;
    browser.tabs.sendMessage(tab.id, { url, title });
}


browser.runtime.onInstalled.addListener(() => {
    browser.contextMenus.create({
        id: MENU_ID,
        title: "Copy title and URL",
        contexts: ["page"]
    });
    browser.contextMenus.onClicked.addListener(handleCopyRequest)
});