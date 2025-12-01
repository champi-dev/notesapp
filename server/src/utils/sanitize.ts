import { JSDOM } from 'jsdom';

const ALLOWED_TAGS = [
  'p', 'br', 'strong', 'em', 'u', 's', 'code', 'pre',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li', 'blockquote', 'hr', 'a',
  'span', 'div', 'mark', 'sub', 'sup',
];

const ALLOWED_ATTRIBUTES: Record<string, string[]> = {
  a: ['href', 'target', 'rel'],
  code: ['class'],
  pre: ['class'],
  span: ['class', 'data-type', 'data-checked'],
  li: ['data-type', 'data-checked'],
  ul: ['data-type'],
};

export const sanitizeHtml = (html: string): string => {
  if (!html || typeof html !== 'string' || html.trim() === '') return '';

  try {
    // Wrap content in a body tag to ensure JSDOM creates a proper body
    const dom = new JSDOM(`<!DOCTYPE html><html><body>${html}</body></html>`);
    const doc = dom.window.document;

    if (!doc.body) return '';

    const { Node: DOMNode } = dom.window;

    const sanitizeNode = (node: typeof DOMNode.prototype): void => {
      if (node.nodeType === 3) return; // Text node

      if (node.nodeType === 1) {
        const element = node as Element;
        const tagName = element.tagName.toLowerCase();

        // Skip body/html tags - we only sanitize their children
        if (tagName === 'body' || tagName === 'html') {
          const children = Array.from(node.childNodes);
          children.forEach(sanitizeNode);
          return;
        }

        if (!ALLOWED_TAGS.includes(tagName)) {
          const parent = element.parentNode;
          while (element.firstChild) {
            parent?.insertBefore(element.firstChild, element);
          }
          parent?.removeChild(element);
          return;
        }

        const allowedAttrs = ALLOWED_ATTRIBUTES[tagName] || [];
        const attrsToRemove: string[] = [];

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
  } catch (error) {
    console.error('Error sanitizing HTML:', error);
    return '';
  }
};
