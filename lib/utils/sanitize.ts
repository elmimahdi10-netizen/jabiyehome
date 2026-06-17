// lib/utils/sanitize.ts
// Server-side HTML sanitiser for admin-authored blog content.
// Called once per post render (cached by ISR — not per-request overhead).
// Uses sanitize-html's explicit allowlist: script, iframe, form, object, embed,
// event handlers (onX attrs), javascript: hrefs are all stripped automatically.
import sanitizeHtml from "sanitize-html";

const ALLOWED_TAGS = [
  // Structure
  "h1", "h2", "h3", "h4", "h5", "h6",
  "p", "br", "hr", "div", "span", "section", "article",
  "blockquote", "pre", "code", "kbd", "samp",
  // Lists
  "ul", "ol", "li", "dl", "dt", "dd",
  // Inline
  "a", "strong", "b", "em", "i", "u", "s", "mark",
  "sub", "sup", "small", "abbr", "cite", "q", "time",
  // Media
  "img", "figure", "figcaption",
  // Table
  "table", "thead", "tbody", "tfoot", "tr", "th", "td", "caption",
];

const ALLOWED_ATTRIBUTES: sanitizeHtml.IOptions["allowedAttributes"] = {
  // Allow class + id on everything for Tailwind prose styling and anchor links
  "*": ["class", "id"],
  "a": ["href", "title", "target", "rel"],
  "img": ["src", "alt", "width", "height", "loading"],
  "td": ["colspan", "rowspan"],
  "th": ["colspan", "rowspan", "scope"],
  "blockquote": ["cite"],
  "time": ["datetime"],
  "abbr": ["title"],
};

export function sanitizeBlogContent(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTRIBUTES,
    // Block javascript:, data:, vbscript: in href/src
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesByTag: {
      img: ["http", "https", "data"], // data: URIs for base64 images are acceptable
    },
    // Force external links to open safely
    transformTags: {
      a: (tagName, attribs) => ({
        tagName,
        attribs: {
          ...attribs,
          // Ensure all external links have noopener noreferrer
          ...(attribs.href?.startsWith("http")
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {}),
        },
      }),
    },
  });
}
