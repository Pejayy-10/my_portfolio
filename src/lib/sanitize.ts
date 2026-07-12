/**
 * sanitize.ts
 * Strips HTML tags and trims whitespace from user input before saving to DB.
 * Prevents stored XSS attacks via the admin EditableText interface.
 */

const HTML_TAG_REGEX = /<[^>]*>/g;
const SCRIPT_EVENT_REGEX = /on\w+\s*=/gi;
const JAVASCRIPT_PROTO_REGEX = /javascript:/gi;

export function sanitize(input: string): string {
  if (!input || typeof input !== "string") return "";

  return input
    .replace(HTML_TAG_REGEX, "")           // Strip all HTML tags
    .replace(SCRIPT_EVENT_REGEX, "")       // Strip inline event handlers (onclick=, etc.)
    .replace(JAVASCRIPT_PROTO_REGEX, "")   // Strip javascript: protocol
    .trim();
}

export function sanitizeArray(items: string[]): string[] {
  return items.map(sanitize).filter(Boolean);
}
