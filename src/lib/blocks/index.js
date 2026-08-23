import ContextStrip from "./contextStrip";
import SpeakerBio from "./speakerBio";
import StatTiles from "./statTiles";
import Callout from "./callout";
import Comparison from "./comparison";
import FallbackHtml from "./fallbackHtml";

// Only our custom Gutenberg blocks need a dedicated React component. Every
// other block (core/quote, core/gallery, core/list, core/paragraph, etc.)
// falls through to FallbackHtml, which renders WordPress's own server-side
// block HTML — see fallbackHtml.js for why that's the deliberate choice.
const registry = {
  "tvgf/context-strip": ContextStrip,
  "tvgf/speaker-bio": SpeakerBio,
  "tvgf/stat-tiles": StatTiles,
  "tvgf/callout": Callout,
  "tvgf/comparison": Comparison,
};

export function renderBlocks(blocks = []) {
  let seenQuote = false;
  const output = [];
  let i = 0;

  while (i < blocks.length) {
    const block = blocks[i];

    // Consecutive speaker-bio blocks (a session's panel) render together as
    // one grid, matching the original per-article "panelist-row" layout,
    // instead of each stacking full-width one after another.
    if (block.name === "tvgf/speaker-bio") {
      const group = [];
      while (i < blocks.length && blocks[i].name === "tvgf/speaker-bio") {
        group.push(blocks[i]);
        i++;
      }
      output.push(
        <div className="tvgf-panel-grid" key={"panel" + i}>
          {group.map((b, idx) => (
            <SpeakerBio key={"speaker" + idx} attributes={b.attributes || {}} />
          ))}
        </div>
      );
      continue;
    }

    const Component = registry[block.name];
    if (Component) {
      output.push(<Component key={block.name + i} attributes={block.attributes || {}} />);
      i++;
      continue;
    }

    // The article's first quote reads as its opening statement, so it gets a
    // more prominent style than the supporting pull-quotes later on.
    const isOpenerQuote = block.name === "core/quote" && !seenQuote;
    if (isOpenerQuote) seenQuote = true;

    output.push(<FallbackHtml key={"fallback" + i} block={block} isOpenerQuote={isOpenerQuote} />);
    i++;
  }

  return output;
}
