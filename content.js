if (!browser) {
    var browser = chrome;
}

const buildText = (title, url) => `${title}\n${url}`;

const copy = async data => await navigator.clipboard.writeText(data);

browser.runtime.onMessage.addListener(request => {
    const { url, title } = request;
    const text = buildText(title, url);
    copy(text);
});