"use client";

import { useEffect, useRef, useState } from "react";
import { X, Play } from "lucide-react";
import { parseVideoUrl } from "@/lib/video";

// Body HTML comes from the WordPress editor (trusted editors only, same as
// the Glacier Dialogue core-block fallback) — these descendant styles stand
// in for a typography plugin.
const PROSE =
  "text-base font-cabin text-glacier-dark [&_p]:mb-4 [&_a]:text-glacier-primary [&_a]:underline " +
  "[&_strong]:font-bold [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:mb-1 " +
  "[&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mb-2 " +
  "[&_img]:rounded-lg [&_img]:my-4 [&_figure]:my-4";

/**
 * One /media feed entry. Image posts open a modal on click; video posts
 * play inline (YouTube/Vimeo load their iframe only once clicked), with the
 * full text still reachable through "Show More".
 */
export default function MediaPostCard({ post }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const video = parseVideoUrl(post.videoUrl);
  const isImagePost = !video;

  return (
    <>
      <div
        className={`bg-white rounded-xl shadow-md overflow-hidden border border-glacier-soft transition ${
          isImagePost ? "cursor-pointer hover:shadow-lg" : ""
        }`}
        onClick={isImagePost ? () => setIsModalOpen(true) : undefined}
      >
        <CardMedia post={post} video={video} />
        <div className="p-4">
          <h3 className="text-lg font-nohemi mb-2 text-glacier-primary">{post.title}</h3>
          {post.excerpt && <p className="text-sm font-cabin text-glacier-dark">{post.excerpt}</p>}

          {post.hasMore && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(true);
              }}
              className="mt-2 text-sm text-glacier-primary underline hover:text-glacier-dark"
            >
              Show More
            </button>
          )}
        </div>
      </div>

      {isModalOpen && <PostModal post={post} showImage={isImagePost} onClose={() => setIsModalOpen(false)} />}
    </>
  );
}

function CardMedia({ post, video }) {
  const [playing, setPlaying] = useState(false);

  if (!video) {
    if (!post.imageUrl) return null;
    return <img src={post.imageUrl} alt={post.imageAlt} loading="lazy" className="w-full h-64 object-cover" />;
  }

  if (video.kind === "file") {
    return (
      <video
        src={video.src}
        poster={post.imageUrl || undefined}
        controls
        preload="metadata"
        className="w-full h-64 object-cover bg-black"
      />
    );
  }

  if (playing) {
    return (
      <iframe
        src={video.embedUrl}
        title={post.title}
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
        className="w-full h-64 border-0"
      />
    );
  }

  const thumbnail = post.imageUrl || video.thumbnailUrl;
  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Play video: ${post.title}`}
      className="group relative block w-full h-64 bg-glacier-dark"
    >
      {thumbnail && <img src={thumbnail} alt="" loading="lazy" className="w-full h-full object-cover" />}
      <span className="absolute inset-0 flex items-center justify-center bg-black/25 group-hover:bg-black/40 transition">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-glacier-primary shadow-lg">
          <Play size={28} className="ml-1" fill="currentColor" />
        </span>
      </span>
    </button>
  );
}

function PostModal({ post, showImage, onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-label={post.title}>
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-lg max-w-4xl w-full mx-4 z-10 p-6 max-h-[90vh] overflow-y-auto">
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          <X size={24} />
        </button>

        {showImage && post.imageUrl && (
          <img src={post.imageUrl} alt={post.imageAlt} className="w-full h-auto object-contain rounded-xl mb-4" />
        )}
        <h2 className="text-2xl font-nohemi text-glacier-primary mb-4 pr-8">{post.title}</h2>
        <div className={PROSE} dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
      </div>
    </div>
  );
}
