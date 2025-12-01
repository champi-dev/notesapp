import { JSDOM } from 'jsdom';
export const extractPlainText = (html) => {
    if (!html)
        return '';
    const dom = new JSDOM(html);
    const text = dom.window.document.body.textContent || '';
    return text
        .replace(/\s+/g, ' ')
        .trim();
};
//# sourceMappingURL=extractText.js.map