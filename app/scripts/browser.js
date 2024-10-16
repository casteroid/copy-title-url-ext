let keyword;
switch (process.env.VENDOR) {
    case 'chrome':
        keyword = 'chrome';
        break;
    default:
        keyword = 'browser';
        break;
}

export default globalThis[keyword];