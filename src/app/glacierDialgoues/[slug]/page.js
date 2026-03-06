import { notFound } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import GlacierDialogueArticle from "@/components/glacierDialogueArticle";
import { glacierDialogues } from "@/data/dialogues";

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