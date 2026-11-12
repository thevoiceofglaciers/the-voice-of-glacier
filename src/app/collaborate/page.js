import CollaborateClient from "./CollaborateClient";
import { getPageContent } from "@/lib/wp";
import collaborateSchema from "@schemas/pages/collaborate.json";

export const revalidate = 3600;

export default async function CollaboratePage() {
  const content = await getPageContent(collaborateSchema);
  return <CollaborateClient content={content} />;
}
