import { notFound } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import GlacierDialogueSessionTwo from "@/components/glacierDialogueArticle";
import { glacierDialogues } from "@/data/dialogues";

export default function PodcastArticle({ params }) {
  const article = glacierDialogues.find(
    (item) => item.slug === params.slug
  );

  if (!article) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <GlacierDialogueSessionTwo content={article} />
      <Footer />
    </>
  );
}