import StoryClient from "./StoryClient";
import { getPageContent } from "@/lib/wp";
import storySchema from "@schemas/pages/story.json";

export const revalidate = 3600;

export default async function StoryPage() {
  const content = await getPageContent(storySchema);
  return <StoryClient content={content} />;
}
