import browser from "./browser";
import { copySelection, copyTitle } from "./ext";
import { Operation } from "./models";

const handleOperation = (op, data) => {
    const { title, url } = data;
    switch (op) {
        case Operation.TITLE:
            copyTitle(title, url);
            break;
        case Operation.SELECTION:
            copySelection(url);
            break;
        default:
            // do nothing
    }
}

browser.runtime.onMessage.addListener(request => {
    const { op, data } = request;
    handleOperation(op, data);
});