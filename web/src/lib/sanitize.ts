const ALLOWED_TAGS = new Set([
  'p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li', 'a', 'img', 'blockquote', 'pre', 'code', 'hr', 'table',
  'thead', 'tbody', 'tr', 'th', 'td', 'span', 'div', 'section', 'figure',
  'figcaption', 'sup', 'sub', 'small',
]);

function sanitizeServer(dirty: string): string {
  let clean = dirty
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, '')
    .replace(/<object[\s\S]*?>[\s\S]*?<\/object>/gi, '')
    .replace(/<embed[\s\S]*?>[\s\S]*?<\/embed>/gi, '')
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '')
    .replace(/on\w+\s*=\s*"[^"]*"/gi, '')
    .replace(/on\w+\s*=\s*'[^']*'/gi, '')
    .replace(/on\w+\s*=\s*[^\s>]+/gi, '')
    .replace(/javascript\s*:/gi, '')
    .replace(/data\s*:/gi, '')
    .replace(/vbscript\s*:/gi, '');

  clean = clean.replace(/<\/?([a-zA-Z]\w*)\b[^>]*>/g, (match: string, tag: string) => {
    if (ALLOWED_TAGS.has(tag.toLowerCase())) {
      return match;
    }
    return '';
  });

  return clean;
}

export async function sanitizeHtml(dirty: string): Promise<string> {
  if (typeof window !== 'undefined') {
    const dompurify = await import('dompurify');
    return dompurify.default.sanitize(dirty, {
      ALLOWED_TAGS: Array.from(ALLOWED_TAGS),
      ALLOW_DATA_ATTR: false,
    });
  }
  return sanitizeServer(dirty);
}
