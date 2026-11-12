// Helpers for the schema-driven content in wordpress/mu-plugins/tvgf-core/schemas.
// Server-side only (imported by src/lib/wp.js) except <Accent>/<Html>, which
// are plain render helpers safe to use in client components.

function schemaFields(schema) {
  if (schema.fields) return schema.fields;
  return (schema.sections || []).flatMap((section) => section.fields);
}

/** { key: default } for every field in a page/settings schema. */
export function schemaDefaults(schema) {
  return Object.fromEntries(
    schemaFields(schema)
      .filter((field) => "default" in field)
      .map((field) => [field.key, field.default])
  );
}

/**
 * Saved WordPress values win key by key, but only for keys the schema knows
 * and only when they were actually saved — a field added to the schema after
 * a page was last saved in WordPress keeps showing its default. An editor
 * clearing a field saves "" (or []), which is respected: that hides it.
 */
export function mergeContent(defaults, saved) {
  if (!saved || typeof saved !== "object") return defaults;
  const merged = { ...defaults };
  for (const key of Object.keys(defaults)) {
    if (key in saved && saved[key] !== null && saved[key] !== undefined) {
      merged[key] = saved[key];
    }
  }
  return merged;
}

export function parseJson(value) {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

/**
 * Headings can mark an accent word with *asterisks* ("Gaps We *Bridge*"),
 * rendered in the brand colour — the only formatting headings need, without
 * letting editors put arbitrary HTML into them.
 */
export function Accent({ text, className = "text-glacier-primary italic" }) {
  if (!text) return null;
  return String(text)
    .split(/(\*[^*]+\*)/g)
    .map((part, i) =>
      part.startsWith("*") && part.endsWith("*") && part.length > 2 ? (
        <span key={i} className={className}>
          {part.slice(1, -1)}
        </span>
      ) : (
        part
      )
    );
}

/** "Line one\nLine two" -> Line one<br/>Line two, for multi-line headings. */
export function Lines({ text }) {
  if (!text) return null;
  const lines = String(text).split("\n");
  return lines.map((line, i) => (
    <span key={i}>
      {line}
      {i < lines.length - 1 && <br />}
    </span>
  ));
}

/**
 * Rich-text fields (type "html" in the schema). WordPress runs these through
 * wp_kses_post on save, and the defaults are our own copy, so rendering them
 * as HTML is safe.
 */
export function Html({ as: Tag = "div", html, ...props }) {
  if (!html) return null;
  return <Tag {...props} dangerouslySetInnerHTML={{ __html: html }} />;
}
