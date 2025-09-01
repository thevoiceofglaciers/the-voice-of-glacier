"use client";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";

export default function CompareSlider({
  beforeImage,
  afterImage,
  beforeLabel = "Before",
  afterLabel = "After",
  heading = "Image Comparison",
}) {
  const containerRef = useRef(null);
  const [dividerX, setDividerX] = useState(0.5);
  const [dragging, setDragging] = useState(false);

  const updateSliderPosition = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (clientX - rect.left) / rect.width;
    setDividerX(Math.max(0, Math.min(1, x)));
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    updateSliderPosition(e.clientX);
  };

  const handleTouchMove = (e) => {
    if (!dragging) return;
    updateSliderPosition(e.touches[0].clientX);
  };

  useEffect(() => {
    const handleMouseUp = () => setDragging(false);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleMouseUp);
    };
  }, [dragging]);

  return (
    <div className="w-full">
      {/* Heading */}

      {/* Slider Container with aspect ratio */}
      <div
        ref={containerRef}
        onMouseDown={(e) => {
          setDragging(true);
          updateSliderPosition(e.clientX);
        }}
        onTouchStart={(e) => {
          setDragging(true);
          updateSliderPosition(e.touches[0].clientX);
        }}
        className="relative w-full aspect-[16/10] overflow-hidden rounded-xl shadow-md select-none touch-none"
        style={{ userSelect: "none" }}
      >
        {/* After Image */}
        <Image
          src={afterImage}
          alt="After"
          fill
          className="object-cover absolute inset-0 z-0 select-none"
          draggable={false}
        />

        {/* Before Image with clipping */}
        <div
          className="absolute inset-0 z-10"
          style={{
            clipPath: `inset(0 ${100 - dividerX * 100}% 0 0)`,
            WebkitClipPath: `inset(0 ${100 - dividerX * 100}% 0 0)`,
          }}
        >
          <Image
            src={beforeImage}
            alt="Before"
            fill
            className="object-cover select-none"
            draggable={false}
          />
        </div>

        {/* Bottom Labels */}
        <div className="absolute bottom-3 left-3 z-30 bg-white bg-opacity-80 px-3 py-1 text-sm rounded-md font-medium shadow text-glacier-dark">
          {beforeLabel}
        </div>
        <div className="absolute bottom-3 right-3 z-30 bg-white bg-opacity-80 px-3 py-1 text-sm rounded-md font-medium shadow text-glacier-dark">
          {afterLabel}
        </div>

        {/* Slider handle */}
        <div
          className="absolute top-0 h-full border-l-2 border-glacier-primary bg-glacier-primary z-20"
          style={{ left: `${dividerX * 100}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -left-3 bg-white border border-glacier-dark rounded-full w-6 h-6 flex items-center justify-center cursor-col-resize select-none">
            <div className="w-1 h-4 bg-glacier-dark rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
