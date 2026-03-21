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



      {/* Article Content */}
      <div
        className="glacier-dialogue-container"
        dangerouslySetInnerHTML={{ __html: content.html }}
      />
    </div>
  );
}