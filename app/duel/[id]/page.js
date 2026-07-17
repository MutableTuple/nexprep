// app/duel/[id]/page.js
import DuelRoom from "@/app/_components/DuelRoom";
export default async function Page({ params }) {
  const { id } = await params;
  return <DuelRoom duelId={id} />;
}
