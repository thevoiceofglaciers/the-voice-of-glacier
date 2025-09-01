"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function ImageCard({ imageSrc, heading, description }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Split description into words
  const words = description.split(" ");
  const shortDescription = words.slice(0, 10).join(" ");

  return (
    <>
      {/* Card */}
      <div
        className="bg-white rounded-xl shadow-md overflow-hidden border border-glacier-soft cursor-pointer hover:shadow-lg transition"
        onClick={() => setIsModalOpen(true)} // 🔥 Open modal on card click
      >
        <img src={imageSrc} alt={heading} className="w-full h-64 object-cover" />
        <div className="p-4">
          <h3 className="text-lg font-nohemi mb-2 text-glacier-primary">{heading}</h3>
          <p className="text-sm font-cabin text-glacier-dark">
            {words.length > 10 ? shortDescription + "..." : description}
          </p>

          {words.length > 10 && (
            <button
              onClick={(e) => {
                e.stopPropagation(); // ❌ Prevent card click from firing
                setIsModalOpen(true);
              }}
              className="mt-2 text-sm text-glacier-primary underline hover:text-glacier-dark"
            >
              Show More
            </button>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center z-50">
    {/* Background Overlay */}
    <div
      className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={() => setIsModalOpen(false)}
    ></div>

    {/* Modal Content */}
    <div className="relative bg-white rounded-2xl shadow-lg max-w-4xl w-full mx-4 z-10 p-6 max-h-[90vh] overflow-y-auto">
      {/* Close Button */}
      <button
        onClick={() => setIsModalOpen(false)}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
      >
        <X size={24} />
      </button>

      {/* Modal Body */}
      <img
        src={imageSrc}
        alt={heading}
        className="w-full h-auto object-contain rounded-xl mb-4"
      />
      <h2 className="text-2xl font-nohemi text-glacier-primary mb-2">{heading}</h2>
      <p className="text-base font-cabin text-glacier-dark">{description}</p>
    </div>
  </div>
)}

    </>
  );
}
