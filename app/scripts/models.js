export class CopyMessage {
    constructor(title, url) {
        this.title = title;
        this.url = url;
    }

    build() {
        return `${this.title}\n${this.url}`;
    }
}