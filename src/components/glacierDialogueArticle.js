import BackButton from "./backButton";
import ShareButtons from "./shareButtons";
import { renderBlocks } from "@/lib/blocks";
import { formatDialogueDate } from "@/lib/wp";
import "@/styles/glacierDialogueBlocks.css";

export default function GlacierDialogueArticle({ content }) {
  const { title, date, speaker, topics = [], blocks = [] } = content;

  return (
    <div className="bg-glacier-light text-glacier-dark font-cabin relative">
      <div className="max-w-6xl mx-auto px-6 pt-8">
        <BackButton />
      </div>

      <div className="max-w-4xl mx-auto px-6">
        {/* Hero — derived from post metadata, not a CMS block */}
        <header className="text-center py-12 space-y-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-glacier-primary">
            Glacier Dialogues {date ? `· ${formatDialogueDate(date)}` : ""}
          </p>
          <h1 className="font-nohemi text-3xl md:text-5xl text-glacier-dark">{title}</h1>
          {speaker && (
            <p className="text-glacier-dark/70 text-lg">{speaker}</p>
          )}
          {topics.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              {topics.map((topic) => (
                <span
                  key={topic}
                  className="text-xs px-3 py-1 rounded-full bg-glacier-primary/10 text-glacier-primary font-semibold uppercase tracking-wide"
                >
                  {topic}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Article body — rendered from WordPress Gutenberg blocks */}
        <div className="tvgf-dialogue-body">{renderBlocks(blocks)}</div>

        <div className="max-w-4xl mx-auto pb-10">
          <ShareButtons title={title || "Glacier Dialogue"} />
        </div>
      </div>
    </div>
  );
}
