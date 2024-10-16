import puppeteer from "puppeteer";

let browser;

const EXTENSION_PATH = '../dist/chrome';
const EXTENSION_ID = 'copy-title-and-url@extension';

describe('ext', () => {

    beforeEach(async () => {
        browser = await puppeteer.launch({
            headless: false,
            args: [
                `--disable-extensions-except=${EXTENSION_PATH}`,
                `--load-extension=${EXTENSION_PATH}`
            ]
        });
        const workerTarget = await browser.waitForTarget(target => target.type() === 'service_worker');

        const worker = await workerTarget.worker();
    });

    it('copy title and url', async () => {
        const page = await browser.newPage();
        await page.goto('https://www.google.com');
        await page.waitForTimeout(1000);
        await page.click('body', { button: 'right' });

        // todo

        
        const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
        expect(clipboardText).toBe('Example Domain\nhttps://example.com/');
    });

});