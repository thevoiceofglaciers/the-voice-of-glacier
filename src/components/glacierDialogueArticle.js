import { Video } from "lucide-react";
import BackButton from "./backButton";
import ShareButtons from "./shareButtons";
import { renderBlocks } from "@/lib/blocks";
import { formatDialogueDate } from "@/lib/wp";
import "@/styles/glacierDialogueBlocks.css";

const HERO_PATTERN =
  "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22><circle cx=%22100%22 cy=%22100%22 r=%2280%22 fill=%22none%22 stroke=%22%232A787C%22 stroke-width=%221%22 opacity=%220.15%22/><circle cx=%22100%22 cy=%22100%22 r=%2250%22 fill=%22none%22 stroke=%22%232A787C%22 stroke-width=%221%22 opacity=%220.10%22/></svg>')";

export default function GlacierDialogueArticle({ content }) {
  const { title, date, speaker, subtitle, sessionNumber, videoLink, topics = [], blocks = [] } = content;

  const eyebrowParts = [
    "Glacier Dialogues",
    sessionNumber ? `Session ${sessionNumber}` : null,
    date ? formatDialogueDate(date) : null,
  ].filter(Boolean);

  return (
    <div className="bg-glacier-light text-glacier-dark font-cabin relative">
      <div className="max-w-6xl mx-auto px-6 pt-8">
        <BackButton />
      </div>

      {/* Hero — derived from post metadata, not a CMS block */}
      <header className="relative overflow-hidden bg-gradient-to-br from-[#042A33] to-[#0d4a55] text-white py-16 px-6">
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{ backgroundImage: HERO_PATTERN, backgroundSize: "600px", backgroundRepeat: "repeat" }}
        />
        <div className="relative max-w-3xl mx-auto text-center space-y-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-glacier-soft/80">
            {eyebrowParts.join(" · ")}
          </p>
          <h1 className="font-nohemi text-3xl md:text-5xl">{title}</h1>
          {subtitle && <p className="max-w-2xl mx-auto text-white/75 text-base md:text-lg">{subtitle}</p>}
          {speaker && <p className="text-white/70 text-lg">{speaker}</p>}
          {topics.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              {topics.map((topic) => (
                <span
                  key={topic}
                  className="text-xs px-3 py-1 rounded-full bg-white/10 border border-white/20 text-glacier-soft font-semibold uppercase tracking-wide"
                >
                  {topic}
                </span>
              ))}
            </div>
          )}
          {videoLink && (
            <div className="pt-4">
              <a
                href={videoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-glacier-primary text-white text-sm font-bold hover:bg-glacier-accent transition-colors"
              >
                <Video size={16} />
                Watch Video
              </a>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6">
        {/* Article body — rendered from WordPress Gutenberg blocks */}
        <div className="tvgf-dialogue-body">{renderBlocks(blocks)}</div>

        <div className="max-w-4xl mx-auto pb-10">
          <ShareButtons title={title || "Glacier Dialogue"} />
        </div>
      </div>
    </div>
  );
}
