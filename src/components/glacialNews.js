"use client";

import { useEffect, useState } from "react";

export default function NewsFeed() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/news`);
        const data = await res.json();
        setNews(data.articles || data); // depends on your API shape
      } catch (err) {
        console.error("Error fetching news:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, []);

  if (loading) {
    return (
        <div className="flex gap-5 justify-center items-center py-20">
            <p className="text-center text-gray-500">Loading News.</p>
            <div className="h-10 w-10 border-4 border-glacier-dark border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Latest News</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {news.map((article, idx) => (
          <div
            key={idx}
            className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-lg transition"
          >
            {article.urlToImage && (
              <img
                src={article.urlToImage}
                alt={article.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h2 className="font-semibold text-lg mb-2">{article.title}</h2>
              <p className="text-sm text-gray-600 mb-3">
                {article.description || "No description available."}
              </p>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-blue-600 hover:underline text-sm font-medium"
              >
                Read more →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
