const copyToClipboard = async data => await navigator.clipboard.writeText(data);

const buildText = (title, url) => `${title}\n${url}`;

export const copyTitle = (title, url) => {
    const text = buildText(title, url);
    copyToClipboard(text);
};

export const copySelection = url => {
    const selection = window.getSelection().toString().trim();
    const text = buildText(selection, url);
    copyToClipboard(text);
}