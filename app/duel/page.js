// app/duel/page.js
import DuelLobby from "@/app/_components/DuelLobby";

export const metadata = {
  title: "1v1 Duel",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <DuelLobby />;
}
