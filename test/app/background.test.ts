import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

type MenuListener = (info: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab) => void;
type ActionListener = (tab: chrome.tabs.Tab) => void;

let onMenuClick: MenuListener = () => {};
let onActionClick: ActionListener = () => {};
const executeScript = vi.fn();
const setBadgeText = vi.fn();

const fakeChrome = {
  contextMenus: { onClicked: { addListener: (listener: MenuListener) => (onMenuClick = listener) } },
  action: {
    onClicked: { addListener: (listener: ActionListener) => (onActionClick = listener) },
    setBadgeText,
    setBadgeBackgroundColor: () => Promise.resolve(),
  },
  scripting: { executeScript },
  runtime: { onInstalled: { addListener: () => {} } },
};

const URL = "https://a.com/p?id=7&utm_source=x";
const CLEAN_URL = "https://a.com/p?id=7";
const menuClick = (info: Partial<chrome.contextMenus.OnClickData>) =>
  onMenuClick({ pageUrl: URL, ...info } as chrome.contextMenus.OnClickData, { id: 1 } as chrome.tabs.Tab);
const actionClick = (tab: Partial<chrome.tabs.Tab>) => onActionClick({ id: 1, ...tab } as chrome.tabs.Tab);
const badge = (text: string) => ({ tabId: 1, text });

beforeAll(async () => {
  vi.stubGlobal("chrome", fakeChrome);
  // Imported after the stub: the module reads `chrome` and registers its listeners on load.
  await import("../../app/scripts/background");
});

beforeEach(() => {
  vi.useFakeTimers();
  vi.spyOn(console, "error").mockImplementation(() => {});
  executeScript.mockReset().mockResolvedValue([{ result: true }]);
  setBadgeText.mockReset().mockResolvedValue(undefined);
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("copy triggers", () => {
  it.each([
    { menuItemId: "copy_title_url_menu", target: { tabId: 1 }, args: [false, "lines"] },
    { menuItemId: "copy_selection_url_menu", target: { tabId: 1, frameIds: [3] }, args: [true, "lines"] },
    { menuItemId: "copy_markdown_menu", target: { tabId: 1, frameIds: [3] }, args: [true, "markdown"] },
  ])("$menuItemId runs in $target with $args", ({ menuItemId, target, args }) => {
    menuClick({ menuItemId, frameId: 3, selectionText: "x" });
    expect(executeScript).toHaveBeenCalledWith(expect.objectContaining({ target, args: [...args, CLEAN_URL] }));
  });

  it("copies the title as Markdown when nothing is selected", () => {
    menuClick({ menuItemId: "copy_markdown_menu", frameId: 3 });
    expect(executeScript).toHaveBeenCalledWith(
      expect.objectContaining({ target: { tabId: 1 }, args: [false, "markdown", CLEAN_URL] }),
    );
  });

  it("copies the top frame's selection or title from the toolbar button", () => {
    actionClick({ url: URL });
    expect(executeScript).toHaveBeenCalledWith(
      expect.objectContaining({ target: { tabId: 1 }, args: [true, "lines", CLEAN_URL] }),
    );
  });
});

describe("badge", () => {
  it("shows ✓ after a copy and clears it a second later", async () => {
    actionClick({ url: URL });
    await vi.waitFor(() => expect(setBadgeText).toHaveBeenLastCalledWith(badge("✓")));
    vi.advanceTimersByTime(1000);
    expect(setBadgeText).toHaveBeenLastCalledWith(badge(""));
  });

  it.each([
    {
      name: "the page did not write the clipboard",
      outcome: () => executeScript.mockResolvedValue([{ result: null }]),
    },
    { name: "the script could not run", outcome: () => executeScript.mockRejectedValue(new Error("Cannot access")) },
  ])("shows ! when $name", async ({ outcome }) => {
    outcome();
    menuClick({ menuItemId: "copy_title_url_menu" });
    await vi.waitFor(() => expect(setBadgeText).toHaveBeenLastCalledWith(badge("!")));
  });

  it("shows ! without running anything when the browser withholds the tab's URL", () => {
    actionClick({});
    expect(executeScript).not.toHaveBeenCalled();
    expect(setBadgeText).toHaveBeenLastCalledWith(badge("!"));
  });
});
