// "lines" is the title or selection and the URL on two lines; "markdown" is [title](url).
export type Format = "lines" | "markdown";

// Runs inside the page via scripting.executeScript: it is serialised, so it
// must not reference anything from this module. Chrome resolves executeScript
// with a null result when this rejects, so success is signalled by returning true.
export const copyToClipboard = async (useSelection: boolean, format: Format, url: string) => {
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
