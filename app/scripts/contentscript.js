import browser from "./browser";
import { copySelection, copyTitle } from "./ext";
import { Operation } from "./models";

const handleOperation = op => {
    const url = location.href;
    switch (op) {
        case Operation.TITLE:
            copyTitle(document.title, url);
            break;
        case Operation.SELECTION:
            copySelection(url);
            break;
        default:
            // do nothing
    }
}

browser.runtime.onMessage.addListener(request => {
    handleOperation(request.op);
});