import { notFound } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import GlacierDialogueArticle from "@/components/glacierDialogueArticle";
import { glacierDialogues } from "@/data/dialogues";
import { podcasts } from "@/data/podcasts";

// Dynamic Metadata for Social Sharing (Facebook/LinkedIn/Twitter)
export async function generateMetadata({ params }) {
  const { slug } = params;
  
  // Find article info from both data sources to ensure metadata is complete
  const article = glacierDialogues.find((item) => item.slug === slug);
  const podcastInfo = podcasts.find((item) => item.slug === slug);

  if (!article) return { title: "Story Not Found | TVGF" };

  // Use values from podcasts data if they exist, otherwise fallback
  const title = podcastInfo?.title || "Glacier Dialogue";
  const rawDescription = podcastInfo?.content || "Read this powerful story from The Voice Of Glaciers";
  const description = typeof rawDescription === 'string' ? rawDescription.substring(0, 160) : "Read this powerful story from The Voice Of Glaciers";
  const image = podcastInfo?.image || "https://thevoiceofglaciers.org/default-share.jpg";

  return {
    title: `${title} | The Voice Of Glaciers`,
    description: description,
    openGraph: {
      title: title,
      description: description,
      url: `https://thevoiceofglaciers.org/glacierDialgoues/${slug}`,
      siteName: "The Voice Of Glaciers",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [image],
    },
  };
}


export default function PodcastArticle({ params }) {
  const { slug } = params;

  const article = glacierDialogues.find(
    (item) => item.slug === slug
  );

  if (!article) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <GlacierDialogueArticle content={article} />
      <Footer />
    </>
  );
}