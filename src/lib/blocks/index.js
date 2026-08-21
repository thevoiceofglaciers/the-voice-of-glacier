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
  return blocks.map((block, index) => {
    const Component = registry[block.name];
    if (Component) {
      return <Component key={block.name + index} attributes={block.attributes || {}} />;
    }
    return <FallbackHtml key={"fallback" + index} block={block} />;
  });
}
