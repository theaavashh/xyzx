import sanitizeHtml from 'sanitize-html';

/**
 * Allowlist for CMS / catalog rich text (product copy, content pages).
 *
 * Everything else — scripts, event handlers, iframes, style attributes,
 * javascript: URLs — is stripped, so stored copy can never execute in a
 * visitor's browser. Keep this list in sync with the tags the storefront
 * actually renders.
 */
const RICH_TEXT_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    'p', 'br', 'hr', 'strong', 'b', 'em', 'i', 'u', 's', 'small', 'sub', 'sup',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'a', 'img', 'blockquote', 'pre', 'code',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'span', 'div', 'section', 'figure', 'figcaption',
  ],
  allowedAttributes: {
    a: ['href', 'title', 'target', 'rel'],
    img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
    '*': ['class'],
  },
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  allowedSchemesAppliedToAttributes: ['href', 'src'],
  transformTags: {
    // Any link that survives gets a safe rel, so target="_blank" cannot be
    // used for reverse tabnabbing.
    a: (tagName, attribs) => ({
      tagName,
      attribs: attribs.href
        ? { ...attribs, rel: 'noopener noreferrer' }
        : attribs,
    }),
  },
};

/**
 * Sanitizes a rich-text field. Non-string values (undefined, null) pass through
 * untouched so this can be dropped straight into update payloads.
 */
export function sanitizeRichText<T>(value: T): T {
  if (typeof value !== 'string') return value;
  return sanitizeHtml(value, RICH_TEXT_OPTIONS) as unknown as T;
}

/** Sanitizes the given rich-text fields in place and returns the same object. */
export function sanitizeRichTextFields<T extends Record<string, any>>(
  data: T,
  fields: readonly string[],
): T {
  for (const field of fields) {
    if (field in data) {
      (data as Record<string, any>)[field] = sanitizeRichText(data[field]);
    }
  }
  return data;
}
