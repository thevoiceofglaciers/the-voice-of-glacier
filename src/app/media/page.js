import MediaPostCard from "@/components/mediaPostCard";
import NewsFeed from "@/components/glacialNews";
import { getMediaPosts, getPageHero } from "@/lib/wp";
import { getGlacierNews } from "@/lib/news";

export const revalidate = 3600;

// Used until the "media" Page in WordPress has its Page Hero fields filled in
// (see wordpress/mu-plugins/tvgf-media.php), and whenever WordPress is down.
const DEFAULT_HERO = {
  headline: "Save glaciers, save our future.",
  videoUrl: "https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/AnuragMaloo.mp4",
  posterUrl: null,
};

export default async function MediaPage() {
  // All three fail closed ([] / null), so one outage never blanks the page.
  const [posts, hero, news] = await Promise.all([getMediaPosts(), getPageHero("media"), getGlacierNews()]);

  const headline = hero?.headline || DEFAULT_HERO.headline;
  const heroVideoUrl = hero?.videoUrl || DEFAULT_HERO.videoUrl;
  const heroPosterUrl = hero?.posterUrl || DEFAULT_HERO.posterUrl;

  return (
    <main className="w-full text-glacier-dark overflow-x-hidden font-cabin">

      {/* Hero Section */}
      <section className="relative h-[50vh] w-full overflow-hidden bg-glacier-dark">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster={heroPosterUrl || undefined}
          className="absolute w-full h-full object-cover"
          src={heroVideoUrl}
        />
        <div className="absolute inset-0 bg-glacier-dark bg-opacity-60 flex flex-col items-center justify-center text-white text-center p-6">
          <h1 className="text-4xl sm:text-5xl font-nohemi mb-6">{headline}</h1>
        </div>
      </section>

      {/* Our Content (Media Posts from WordPress) */}
      <section className="py-20 px-6 md:px-20 bg-glacier-light">
        {posts.length === 0 ? (
          <p className="text-center text-gray-500 py-20">No posts available yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <MediaPostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>

      {/* Glacier News Section */}
      <NewsFeed articles={news} />
    </main>
  );
}
