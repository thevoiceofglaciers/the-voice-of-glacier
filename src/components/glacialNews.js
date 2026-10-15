// Articles come from getGlacierNews() (src/lib/news.js) — WordPress News
// Links, or the raw feed if WordPress is down. Renders nothing when empty.
export default function NewsFeed({ articles = [] }) {
  if (articles.length === 0) return null;

  return (
    <section className="max-w-4xl mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold mb-6 text-center">Latest News</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {articles.map((article) => (
          <div
            key={article.url}
            className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-lg transition"
          >
            {article.imageUrl && (
              <img
                src={article.imageUrl}
                alt=""
                loading="lazy"
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              {article.source && (
                <p className="text-xs uppercase tracking-wide text-glacier-primary mb-1">{article.source}</p>
              )}
              <h3 className="font-semibold text-lg mb-2">{article.title}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-4">
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
    </section>
  );
}
