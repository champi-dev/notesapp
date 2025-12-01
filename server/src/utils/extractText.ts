import { JSDOM } from 'jsdom';

export const extractPlainText = (html: string): string => {
  if (!html || html.trim() === '') return '';

  const dom = new JSDOM(`<!DOCTYPE html><html><body>${html}</body></html>`);
  const body = dom.window.document.body;

  if (!body) return '';

  const text = body.textContent || '';

  return text
    .replace(/\s+/g, ' ')
    .trim();
};
