import StrategyClient from "./StrategyClient";
import { getPageContent } from "@/lib/wp";
import strategySchema from "@schemas/pages/our-strategy.json";

export const revalidate = 3600;

export default async function StrategyPage() {
  const content = await getPageContent(strategySchema);
  return <StrategyClient content={content} />;
}
