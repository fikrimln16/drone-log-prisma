import MissionPage from "@/components/missions/mission-page";

export default async function Page({
  params,
}: {
  params: Promise<{ mission: string }>;
}) {
  const { mission } = await params;

  return <MissionPage mission={mission} />;
}
