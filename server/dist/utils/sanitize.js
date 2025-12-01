import { JSDOM } from 'jsdom';
const ALLOWED_TAGS = [
    'p', 'br', 'strong', 'em', 'u', 's', 'code', 'pre',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'blockquote', 'hr', 'a',
    'span', 'div', 'mark', 'sub', 'sup',
];
const ALLOWED_ATTRIBUTES = {
    a: ['href', 'target', 'rel'],
    code: ['class'],
    pre: ['class'],
    span: ['class', 'data-type', 'data-checked'],
    li: ['data-type', 'data-checked'],
    ul: ['data-type'],
};
export const sanitizeHtml = (html) => {
    if (!html)
        return '';
    const dom = new JSDOM(html);
    const doc = dom.window.document;
    const { Node: DOMNode } = dom.window;
    const sanitizeNode = (node) => {
        if (node.nodeType === 3)
            return; // Text node
        if (node.nodeType === 1) {
            const element = node;
            const tagName = element.tagName.toLowerCase();
            if (!ALLOWED_TAGS.includes(tagName)) {
                const parent = element.parentNode;
                while (element.firstChild) {
                    parent?.insertBefore(element.firstChild, element);
                }
                parent?.removeChild(element);
                return;
            }
            const allowedAttrs = ALLOWED_ATTRIBUTES[tagName] || [];
            const attrsToRemove = [];
            for (const attr of element.attributes) {
                if (!allowedAttrs.includes(attr.name)) {
                    attrsToRemove.push(attr.name);
                }
            }
            attrsToRemove.forEach((attr) => element.removeAttribute(attr));
            if (tagName === 'a') {
                const href = element.getAttribute('href');
                if (href && !href.startsWith('http://') && !href.startsWith('https://') && !href.startsWith('mailto:')) {
                    element.setAttribute('href', '#');
                }
                element.setAttribute('rel', 'noopener noreferrer');
            }
        }
        const children = Array.from(node.childNodes);
        children.forEach(sanitizeNode);
    };
    sanitizeNode(doc.body);
    return doc.body.innerHTML;
};
//# sourceMappingURL=sanitize.js.map