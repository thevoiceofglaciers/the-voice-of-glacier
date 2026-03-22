"use client";

import { useRouter } from "next/navigation";
import { IoArrowBack } from "react-icons/io5";

export default function GlacierDialogueSessionTwo({ content }) {
  const router = useRouter();

  return (
    <div className="bg-glacier-glacier-primary text-glacier-dark font-cabin relative">

      {/* Inject page specific CSS */}
      {content.css && (
        <style dangerouslySetInnerHTML={{ __html: content.css }} />
      )}

      {/* Back button */}
      <div className="max-w-6xl mx-auto px-6 pt-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition"
        >
          <IoArrowBack />
          Back
        </button>
      </div>

      {/* Article Content */}
      <div
        className="glacier-dialogue-container"
        dangerouslySetInnerHTML={{ __html: content.html }}
      />
    </div>
  );
}