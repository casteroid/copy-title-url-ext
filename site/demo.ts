// Bundled with the extension's own copy code, so the button writes exactly what the extension writes.
import { copyToClipboard } from "../app/scripts/copy";
import { removeTrackingParams } from "../app/scripts/url";

const byId = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

const button = byId<HTMLButtonElement>("simulate");
const status = byId("simulate-status");
const paste = byId<HTMLTextAreaElement>("paste");
const result = byId("result");
const rich = byId("result-rich");
const html = byId("result-html");
const markdown = byId("result-markdown");

const cleanUrl = removeTrackingParams(location.href);
byId("tracking").hidden = cleanUrl === location.href;

// Focusing the button would clear the selection in some browsers.
button.addEventListener("mousedown", (event) => event.preventDefault());
button.addEventListener("click", () => {
  copyToClipboard(true, cleanUrl).then(
    () => {
      status.textContent = "Copied. Now paste it below.";
    },
    () => {
      status.textContent = "The browser blocked the copy.";
    },
  );
});

paste.addEventListener("paste", (event) => {
  const data = event.clipboardData;
  if (!data) return;
  event.preventDefault();
  paste.value = data.getData("text/plain");

  const source = data.getData("text/html");
  const link = source ? new DOMParser().parseFromString(source, "text/html").querySelector("a[href]") : null;
  const href = link?.getAttribute("href") ?? "";
  const text = link?.textContent ?? "";
  // Only http(s) links are rendered: the clipboard may hold anything, javascript: URLs included.
  if (/^https?:/.test(href)) {
    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.textContent = text;
    rich.replaceChildren(anchor);
    markdown.textContent = `[${text}](${href})`;
  } else {
    rich.textContent = source ? "No link in the HTML." : "None. Firefox before 127 copies plain text only.";
    markdown.textContent = "—";
  }
  html.textContent = source || "—";
  result.hidden = false;
});
