import { CopyMessage } from "./models";
import browser from "./browser";

const copyToClipboard = async data => await navigator.clipboard.writeText(data);

browser.runtime.onMessage.addListener(request => {
    const { message } = request;
    const text = new CopyMessage(message.url, message.title).build();
    copyToClipboard(text);
});