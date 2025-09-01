"use client";

export default function VideoCard({ videoSrc, heading, description }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-glacier-soft">
      <video
        src={videoSrc}
        controls
        className="w-full h-64 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-nohemi mb-2 text-glacier-primary">{heading}</h3>
        <p className="text-sm font-cabin text-glacier-dark">{description}</p>
      </div>
    </div>
  );
}
