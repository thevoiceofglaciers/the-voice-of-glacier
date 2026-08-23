/**
 * Renders WordPress core blocks (quote, gallery, list, paragraph, group, columns,
 * etc.) using WordPress's own server-rendered HTML rather than reimplementing
 * each one as a React component. Their markup/classnames are stable, so we just
 * restyle them in globals via the .tvgf-wp-block wrapper (see
 * src/styles/glacierDialogueBlocks.css).
 */
export default function FallbackHtml({ block, isOpenerQuote }) {
  if (!block?.renderedHtml) return null;

  const className = isOpenerQuote ? "tvgf-wp-block tvgf-quote-opener" : "tvgf-wp-block";

  return <div className={className} dangerouslySetInnerHTML={{ __html: block.renderedHtml }} />;
}
