import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { copyToClipboard } from "../../app/scripts/copy";

const TITLE = 'A [weird] "title" & <stuff>';
const writeText = vi.fn<(text: string) => Promise<void>>();
const write = vi.fn<(items: ClipboardItem[]) => Promise<void>>();
let selection = "";

class FakeClipboardItem {
  items: Record<string, Blob>;
  constructor(items: Record<string, Blob>) {
    this.items = items;
  }
}

// What the last clipboard.write call put on the clipboard, by MIME type.
const written = async () => {
  const item = write.mock.calls.at(-1)?.[0][0] as unknown as FakeClipboardItem | undefined;
  if (!item) throw new Error("clipboard.write was not called");
  const entries = Object.entries(item.items).map(async ([type, blob]) => [type, await blob.text()] as const);
  return Object.fromEntries(await Promise.all(entries));
};

beforeEach(() => {
  selection = "";
  writeText.mockReset().mockResolvedValue(undefined);
  write.mockReset().mockResolvedValue(undefined);
  vi.stubGlobal("document", { title: TITLE });
  vi.stubGlobal("getSelection", () => ({ toString: () => selection }));
  vi.stubGlobal("navigator", { clipboard: { writeText, write } });
  vi.stubGlobal("ClipboardItem", FakeClipboardItem);
});

afterEach(() => vi.unstubAllGlobals());

describe("copyToClipboard", () => {
  it("writes the title and URL as plain text and as an escaped HTML link", async () => {
    await expect(copyToClipboard(false, "lines", "https://a.com/?q=1&r=2")).resolves.toBe(true);
    expect(await written()).toEqual({
      "text/plain": `${TITLE}\nhttps://a.com/?q=1&r=2`,
      "text/html": '<a href="https://a.com/?q=1&amp;r=2">A [weird] &quot;title&quot; &amp; &lt;stuff&gt;</a>',
    });
  });

  it.each([
    { useSelection: true, selected: "  picked text \n", first: "picked text" },
    { useSelection: true, selected: " \n ", first: TITLE },
    { useSelection: false, selected: "picked text", first: TITLE },
  ])("copies $first when useSelection is $useSelection and the selection is $selected", async (c) => {
    selection = c.selected;
    await copyToClipboard(c.useSelection, "lines", "https://a.com/");
    expect((await written())["text/plain"]).toBe(`${c.first}\nhttps://a.com/`);
  });

  it("writes a Markdown link as plain text only, escaping brackets and parentheses", async () => {
    selection = "line one\n  line [two]";
    await expect(copyToClipboard(true, "markdown", "https://en.wikipedia.org/wiki/Foo_(bar)")).resolves.toBe(true);
    expect(writeText).toHaveBeenCalledWith("[line one line \\[two\\]](https://en.wikipedia.org/wiki/Foo_%28bar%29)");
    expect(write).not.toHaveBeenCalled();
  });

  it("falls back to plain text when ClipboardItem is missing", async () => {
    vi.stubGlobal("ClipboardItem", undefined);
    await copyToClipboard(false, "lines", "https://a.com/");
    expect(writeText).toHaveBeenCalledWith(`${TITLE}\nhttps://a.com/`);
    expect(write).not.toHaveBeenCalled();
  });

  it("rejects when the clipboard write fails, so the copy is not reported as done", async () => {
    write.mockRejectedValue(new Error("Document is not focused"));
    await expect(copyToClipboard(false, "lines", "https://a.com/")).rejects.toThrow("Document is not focused");
  });
});
