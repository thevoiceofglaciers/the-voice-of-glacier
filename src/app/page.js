import HomeClient from "./HomeClient";
import { getPageContent } from "@/lib/wp";
import homeSchema from "@schemas/pages/home.json";

export const revalidate = 3600;

export default async function HomePage() {
  const content = await getPageContent(homeSchema);
  return <HomeClient content={content} />;
}
