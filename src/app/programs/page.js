import ProgramsClient from "./ProgramsClient";
import { getPageContent } from "@/lib/wp";
import programsSchema from "@schemas/pages/programs.json";

export const revalidate = 3600;

export default async function ProgramsPage() {
  const content = await getPageContent(programsSchema);
  return <ProgramsClient content={content} />;
}
