import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import GlacierDialogueArticle from "@/components/glacierDialogueArticle";
import { getGlacierDialogueBySlug, getGlacierDialogues } from "@/lib/wp";

export async function generateStaticParams() {
  const { upcoming, past } = await getGlacierDialogues();
  return [...upcoming, ...past].map((item) => ({ slug: item.slug }));
}

// Dynamic Metadata for Social Sharing (Facebook/LinkedIn/Twitter)
export async function generateMetadata({ params }) {
  const { slug } = params;
  const { isEnabled: preview } = draftMode();
  const article = await getGlacierDialogueBySlug(slug, { preview });

  if (!article) return { title: "Story Not Found | TVGF" };

  const description =
    article.speaker || "Read this powerful story from The Voice Of Glaciers";
  const image = article.image || "https://thevoiceofglaciers.org/default-share.jpg";

  return {
    title: `${article.title} | The Voice Of Glaciers`,
    description,
    openGraph: {
      title: article.title,
      description,
      url: `https://thevoiceofglaciers.org/glacierDialgoues/${slug}`,
      siteName: "The Voice Of Glaciers",
      images: [{ url: image, width: 1200, height: 630 }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description,
      images: [image],
    },
  };
}

export default async function PodcastArticle({ params }) {
  const { slug } = params;
  const { isEnabled: preview } = draftMode();

  const article = await getGlacierDialogueBySlug(slug, { preview });

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
