// Runs inside the page via scripting.executeScript: it is serialised, so it
// must not reference anything from this module. Chrome resolves executeScript
// with a null result when this rejects, so success is signalled by returning true.
export const copyToClipboard = async (useSelection: boolean, url: string) => {
  const selection = useSelection ? (getSelection()?.toString().trim() ?? "") : "";
  const text = selection || document.title;
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
